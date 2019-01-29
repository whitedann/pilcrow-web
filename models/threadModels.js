const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const sortEntries = function(a, b){
  // negative if a before b
  //0 no change
  // positive a after
  return b.createdAt - a.createdAt;
}

const EntrySchema = new mongoose.Schema({
  entry: String,
  parentID: String,
  createdAt: {type: Date, default: Date.now},
});

const ThreadSchema = new mongoose.Schema({
      createdAt: {type: Date, default: Date.now},
      entries: [EntrySchema],
      entryCount: {type: Number, default: 0},
      checkedOut: {type: Boolean, default: false}
});

ThreadSchema.statics.findRandomIncompleteThread = function(callback){
  Thread.findOne({entryCount : 0}).exec(function(err, thread) {
    if(err){
      return next(err);
    }
    return callback(null, thread);
  });
}

//sorts the entries in order each time one is added.
ThreadSchema.pre("save", function(next){
  this.entries.sort(sortEntries);
  next();
})

const Thread = mongoose.model("Thread", ThreadSchema);
const Entry = mongoose.model("Entry", EntrySchema);

module.exports.Thread = Thread;
module.exports.Entry = Entry;
module.exports.EntrySchema = EntrySchema;
