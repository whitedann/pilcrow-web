const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Thread = require("../models/threadModels").Thread;
const mid = require('../middleware');

router.get('/', function(req, res){
  return res.render('index', {title: 'Home'});
});

router.get('/test', function(req, res) {
  return res.render('test', {title: 'Test'});
});

// GET /write
// Routes to random thread
router.get('/write', function(req, res, next) {
  Thread.aggregate([{$sample: {size: 1}}], function(error, thread){
    if(error) return next(error);
    else {
      //.aggregate returns an array of size 1, so we have to select it
      // with indexing so that we can access its members, like _id.
      const thr = thread[0];
      res.redirect("/threads/" + thr._id);
    }
  });
});

router.get('/profile', mid.loggedIn, function(req, res, next) {
  if(!req.session.userId) {
    const err = new Error('You must login to view this page.');
    //403 error code: forbidden
    err.status = 403;
    return next(err);
  }
  User.findById(req.session.userId)
      .exec(function(error, user) {
        if(error) {
          return next(error);
        } else {
          return res.render('profile', {title: 'Profile', name: user.username});
        }
      });
});

// GET /login
// Routes to the login page.
router.get('/login', mid.loggedOut, function(req, res, next) {
  return res.render('login', {title: 'Login In'});
});

// POST /login
// Submit login to login page.
router.post('/login', function(req, res, next) {
  if(req.body.email && req.body.password){
    User.authenticate(req.body.email, req.body.password, function(error, user) {
      if (error || !user){
        const err = new Error("Incorrect email or password");
        err.status = 401;
        return next(err);
      } else {
        //creates a new session
        req.session.userId = user._id;
        req.session.username = user.username;
        return res.redirect('/profile');
      }
    });
  } else {
    const err = new Error("Both fields are required.");
    err.status = 401;
    return next(err);
  }
});

// GET /logout
// Route to log the user out
router.get('/logout', function(req, res, next) {
  if(req.session){
    req.session.destroy(function(err){
      if(err){
        return next(err);
      }else{
        return res.redirect('/');
      }
    });
  }
});

// GET /register
// Routes to registration form.
router.get('/register', mid.loggedOut, function(req, res, next){
  res.render('register', {title: 'Sign Up'});
});

//POST /register
// Submit form to create new user
router.post('/register', function(req, res, next){
  //Check that all fields filled in.
  if(req.body.email &&
    req.body.password &&
    req.body.confirmPassword &&
    req.body.username){
    //Check that passwords match.
    if(req.body.password !== req.body.confirmPassword){
        const err = new Error("Passwords do not match");
        err.status = 400;
        return next(err);
    }

    //Create a new object that we want to insert into DB.
    const userData = {
      email: req.body.email,
      username: req.body.username,
      password: req.body.password
    }

    User.create(userData, function(error, user) {
      if(error){
        return next(error);
      } else {
        req.session.userId = user._id;
        req.session.username = user.username;
        return res.redirect('/profile');
      }
    });

  } else {
      const err = new Error("All fields required");
      //400 is a bad request
      err.status = 400;
      return next(err);
    }
});

module.exports = router;
