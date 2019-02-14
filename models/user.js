const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;
const EntrySchema = require("../models/threadModels").EntrySchema;

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  contributionsCount: {type: Number, default: 0},
  contributions: [EntrySchema]
});

UserSchema.statics.authenticate = function(email, password, callback) {
  User.findOne({email: email})
    .exec(function(error, user) {
      if(error) {
        return callback(error);
      } else if (!user) {
        const err = new Error("User not found.");
        err.status = 401;
        return callback(err);
    }
    // 3 params for bcrypt compare function:
    //password = string from the form
    //user.password = hashed password in database
    //callback function which returns error if something goes wrong or
    //result, a boolean for whether the passwords match
    bcrypt.compare(password, user.password, function(error, result){
      if(result === true){
        return callback(null, user);
      } else {
        return callback();
      }
    });
  });
}

//PRESAVE HOOK: hash password before saving to database
UserSchema.pre('save', function(next) {
  //this prvents the password from rehash every time user is updated.
  if(this.isModified('password')){
    var user = this;
    bcrypt.hash(user.password, 10, function(err, hash) {
      if(err){
        return next(err);
      }
      user.password = hash;
      next();
    });
  } else{
    next();
  }
});

const User = mongoose.model('User', UserSchema);
module.exports.User = User;
