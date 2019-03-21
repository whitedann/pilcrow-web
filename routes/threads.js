const express = require('express');
const router = express.Router();
const request = require('request');
const Thread = require("../models/threadModels").Thread;
const Entry = require("../models/threadModels").Entry;
const User = require("../models/user").User;
const Vote = require("../models/threadModels").Vote;
const mid = require('../middleware');


// This is called whenever a tID parameter is found in the URL
router.param("tID", function(req, res, next, id) {
  Thread.findById(id, function(err, doc) {
    if(err) return next(err);
    if(!doc) {
      err = new Error("Not Found");
      err.status = 404;
      return next(err);
    }
    req.thread = doc;
    return next();
  });
});

// GET /threads
//Route for rendering threads page, requires logged in status.
router.get('/', mid.loggedIn, function(req, res, next) {
  Thread.find({}, null, {sort: {createdAt: -1}}, function(err, threads){
    if(err) return next(err);
    return res.render('threads', {title: "Threads"});
  });
});

// GET /threads/all.json
//Route that returns json of all threads in DB
router.get('/all.json', mid.loggedIn, function(req, res, next) {
  Thread.find({}, null, {sort: {createdAt: -1}}, function(err, threads){
    if(err) return next(err);
    res.json(threads);
  });
});

// GET /threads/open.json
//Route that returns json of all open threads.
router.get('/open', mid.loggedIn, function(req, res, next) {

  let page = parseInt(req.query.page) || 0;
  let limit = 10;

  Thread.find({
    entriesLeft: {$gt : 0},
    //seconds since last update
    lastUpdated: {$lt: new Date() - 60000}
  })
  .sort({'entries[0].createdAt': -1}).skip(page*limit).limit(limit)
  .exec(function(err, data){
    res.json(data);
  });
});

// GET /threads/closed.json
//Route that returns json of all closed threads.
router.get('/closed', mid.loggedIn, function(req, res, next) {

  let page = parseInt(req.query.page) || 0;
  let limit = 10;

  let threads = Thread.find({entriesLeft: {$lt : 1}}).sort({'entries[0].createdAt': -1}).skip(page*limit).limit(limit);
  threads.exec(function(err, data){
    res.json(data);
  });
});

// POST /threads
// Route for creating a new thread.
router.post('/', mid.loggedIn, function(req, res, next) {
  const thread = new Thread();
  const firstEntry = new Entry();
  firstEntry.entry = req.body.content;
  firstEntry.createdBy = req.session.username;
  firstEntry.createdByID = req.session.userId;
  firstEntry.parentID = thread._id;
  firstEntry.votes.push(new Vote());

  //Add Entry to user's contributions.
  User.findById(req.session.userId)
      .exec(function(error, user) {
        if(error) {
          return next(error);
        }
        else {
          user.contributions.push(firstEntry);
          user.contributionsCount++;
          user.save(function(err, user) {
            if(err) return next(err);
          });
        }
  });

  //When a new thread is created, it is initialized with a single empty entry
  //The purpose of this is to prevent there from there being a thread with 0 entries
  thread.entries.push(firstEntry);
  thread.maxEntries = req.body.maxEntries;
  thread.maxChars = req.body.maxChars;
  thread.entriesLeft = req.body.maxEntries;
  thread.entriesLeft--;
  thread.entryCount++;
  thread.title = req.body.title;


  thread.save(function(err, thread) {
    if(err) return next(err);
    res.status(201);
    res.send(thread);
  });

});

// GET /threads/:tID
// Route for displaying a single thread.
router.get('/:tID', mid.loggedIn, function(req, res) {

  const threadID = req.params.tID;
  const userID = req.session.userId;

  User.findById(userID).exec( function(error, user) {
    if(error) return next(error);
    let timeSinceLastContribution = new Date() - user.lastContributionTime;
    req.session.timeSinceLastContribution = (60000 - timeSinceLastContribution) / 1000;
    if(timeSinceLastContribution < 60000){
      res.render("tooSoon", {title: "Unable to Access", timeLeft: req.session.timeSinceLastContribution});
    }
    else {
      user.lastContributionTime = new Date();
      user.save( function(error, user) {
        if(error) return next(error);
        Thread.findById(threadID, function(error, thread) {
          if(error) return next(error);
          let timeSinceLastAccessed = new Date() - thread.lastUpdated;
          if(timeSinceLastAccessed < 60000){
            res.render("threadInUse", {title: "Unable to Access", timeLeft: ((60000 - timeSinceLastAccessed) / 1000)});
          }
          else {
            thread.lastUpdated = new Date();
            thread.save(function(error, thread){
              if(error) return next(error);
              else {
                res.render('singleThread', {title: threadID, id: threadID});
              }
            });
          }
        });
      });
    }
  });
});

// GET /thread/:tID/data.json
// Route to provide json of given thread.
router.get('/:tID/data.json', mid.loggedIn, function(req, res) {
  const id = req.params.tID;
  Thread.findById(id, function(error, thread) {
    if(error) return next(error);
    else {
      res.json(thread);
    }
  });
});

// POST /threads/:id
// Route for adding a string to a thread.
router.post('/:tID', mid.loggedIn, function(req, res, next) {
  //Create Entry
  let entry = new Entry();
  entry.entry = req.body.content;
  entry.createdBy = req.session.username;
  entry.createdByID = req.session.userId;
  entry.parentID = req.params.tID;

  //initialize votes array with dummmy vote
  entry.votes.push(new Vote());

  //Add Entry to user object.
  User.findById(req.session.userId)
      .exec(function(error, user) {
        if(error) {
          return next(error);
        }
        else {
          user.contributions.push(entry);
          user.contributionsCount++;
          user.save(function(err, user) {
            if(err) return next(err);
          });
        }
  });

  //Add Entry to the thread object.
  //Note that the thread object is a member of the request object.
  //Hence, req.thread.<item> See router.param() above.
  req.thread.entries.push(entry);
  req.thread.entryCount++;
  req.thread.entriesLeft--;
  req.thread.status = "IDLE";
  req.thread.save(function(err, thread){
    if(err) {
      return next(err);
    }
    res.status(201);
    res.send(thread);
  });
});

//Route for voting on an entry
router.post('/:tID/entries/:eID/:val', mid.loggedIn, function(req, res, next){

  let newVote = new Vote();
  newVote.value = req.params.val;
  newVote.userID = req.session.userId;

  //Update Thread with new vote.
  Thread.findById(req.params.tID)
    .exec(function(error, thread) {
      if(error) return next(error);
      else {
        thread.entries.forEach(function(entry){
          if(entry._id == req.params.eID){
            entry.votes.push(newVote);
          }
        });
        thread.save(function(err, thread){
          if(err) return next(err);
        });
      }
    });
});

// DELETE /threads/:tID
// Route for deleting a thread.
router.delete('/:tID', mid.loggedIn, function(req, res, next) {
  req.thread.remove(function(err, result){
    if(err) return next(error);
    res.status(201);
    res.json(result);
  });
});

module.exports = router;
