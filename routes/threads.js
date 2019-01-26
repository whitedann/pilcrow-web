const express = require('express');
const router = express.Router();
const request = require('request');
const Thread = require("../models/threadModels").Thread;
const Entry = require("../models/threadModels").Entry;
const User = require("../models/user");
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
router.get('/', function(req, res, next) {
  Thread.find({}, null, {sort: {createdAt: -1}}, function(err, threads){
    if(err) return next(err);
    return res.render('threads', {title: "Threads"})
  });
});

// GET /threads/all.json
//Route that returns json of all threads in DB
router.get('/all.json', function(req, res, next) {
  Thread.find({}, null, {sort: {createdAt: -1}}, function(err, threads){
    if(err) return next(err);
    res.json(threads);
  });
});

router.get('/open.json', function(req, res, next) {
  Thread.find({entryCount: {$lt : 11}}, function(err, threads){
    if(err) return next(err);
    res.json(threads);
  });
});

// POST /threads
// Route for creating a thread.
router.post('/', function(req, res, next) {
  const thread = new Thread(req.body);
  const firstEntry = new Entry();
  firstEntry.entry = "NULL";
  thread.entries.push(firstEntry);
  thread.save(function(err, question) {
    if(err) return next(err);
    res.status(201);
    res.json(thread);
  });
});

// GET /threads
// Route for displaying a single thread. Requires logged in status.
router.get('/:tID', function(req, res) {
  const id = req.params.tID;
  Thread.findById(id, function(error, thread) {
    if(error) return next(error);
    else {
      let entries = thread.entries;
      let mergedString = [];
      entries.forEach(function(element){
        mergedString.push(element.entry);
      });
      mergedString = mergedString.reverse();
      mergedString = mergedString.join(" ");
      res.render('test', {title: id, completeString: mergedString});
    }
  });
});

router.get('/:tID/data.json', function(req, res) {
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
  entry.entry = req.body.entry;

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
  req.thread.save(function(err, thread){
    if(err) return next(err);
    res.status(201);
    res.redirect(req.params.tID);
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

// PUT /threads/:tID/:sID
// Route for editing a word added to a thread.
router.put('/:tID/:sID', function(req, res) {
  req.entry.update(req.body, function(err, result) {
    if(err) return next(err);
    res.json(result);
  })
});

// POST /threads/:tID/:sID/vote-up
// POST /threads/:tID/:sID/vote-down
router.post('/:tID/:sID/vote-:dir', function(req, res, next) {
    if(req.params.dir.search(/^(up|down)$/) === -1) {
      const e = new Error("Not Found");
      e.status = 400;
      next(e);
    } else {
      req.vote = req.params.dir;
      next();
    }
  }, function(req, res) {
    req.entry.vote(req.vote, function(err, thread) {
      if(err) return next(err);
      res.json(thread);
    });
});


module.exports = router;
