const express = require('express');
const router = express.Router();
const request = require('request');
const Thread = require("../models/threadModels").Thread;
const Entry = require("../models/threadModels").Entry;
const User = require("../models/user").User;
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
router.get('/open.json', mid.loggedIn, function(req, res, next) {
  Thread.find({entriesLeft: {$gt : 0}}, null, {sort: {createdAt: -1}}, function(err, threads){
    if(err) return next(err);
    res.json(threads);
  });
});

// GET /threads/closed.json
//Route that returns json of all closed threads.
router.get('/closed.json', mid.loggedIn, function(req, res, next) {
  Thread.find({entriesLeft: {$lt : 1}}, null, {sort: {createdAt: -1}}, function(err, threads){
    if(err) return next(err);
    res.json(threads);
  });
});

// POST /threads
// Route for creating a new thread.
router.post('/', mid.loggedIn, function(req, res, next) {
  const thread = new Thread(req.body);
  const firstEntry = new Entry();
  firstEntry.entry = req.body.content;
  firstEntry.createdBy = req.session.username;

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
  const id = req.params.tID;
  Thread.findById(id, function(error, thread) {
    if(error) return next(error);
    else {
      res.render('singleThread', {
        title: id,
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
  entry.parentID = req.params.tID;

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
  req.thread.save(function(err, thread){
    if(err) return next(err);
    //TODO: Fix this redirect (not working)
    res.send({redirect: '/'})
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
