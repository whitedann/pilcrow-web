const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const sortEntries = function(a, b){
  //0 no change
  // positive a after
  return b.createdAt - a.createdAt;
}

const VoteSchema = new mongoose.Schema({
  // 1 == upvote, -1 == downvote, 0 == no vote yet
  value: {type: Number, default: 0},
  userID: {type: String, default: -1}
});

const EntrySchema = new mongoose.Schema({
  entry: String,
  parentID: String,
  createdBy: String,
  createdByID: String,
  createdAt: {type: Date, default: Date.now},
  votes: [VoteSchema],
  upvotes: {type: Number, default: 0},
  downvotes: {type: Number, default: 0}
});

const ThreadSchema = new mongoose.Schema({
  title: String,
  entries: [EntrySchema],
  entryCount: {type: Number, default: 0},
  maxEntries: {type: Number, default: 0},
  entriesLeft: {type: Number, default: 0},
  maxChars: {type: Number, default: 0},
  createdAt: {type: Date, default: Date.now},
  status: {type: String, default: "IDLE"},
  lastUpdated: {type: Date, default: Date.now}
});

ThreadSchema.statics.findRandomIncompleteThread = function(callback){
  //Finds a random record that matches entriesLeft > 0 (i.e. open thread)
  Thread.aggregate([
    {$match:
      {"entriesLeft": { $gt : 0}, "lastUpdated": { $lt: (new Date() )}}
    },
    {$sample: {size : 1}}
  ]).exec(function(err, thread) {
    if(err){
      return next(err);
    }
    return callback(null, thread);
  });
}

//sorts the entries in order each time one is added.
ThreadSchema.pre("save", function(next){
  this.entries.sort(sortEntries);
  this.lastUpdated = new Date();
  next();
})

const Thread = mongoose.model("Thread", ThreadSchema);
const Entry = mongoose.model("Entry", EntrySchema);
const Vote = mongoose.model("Vote", VoteSchema);

module.exports.Thread = Thread;
module.exports.Entry = Entry;
module.exports.Vote = Vote;
module.exports.EntrySchema = EntrySchema
