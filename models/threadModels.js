const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const sortEntries = function(a, b){
  //0 no change
  // positive a after
  return b.createdAt - a.createdAt;
}

const EntrySchema = new mongoose.Schema({
  entry: String,
  parentID: String,
  createdBy: String,
  createdAt: {type: Date, default: Date.now},
});

const ThreadSchema = new mongoose.Schema({
  title: String,
  entries: [EntrySchema],
  entryCount: {type: Number, default: 0},
  maxEntries: {type: Number, default: 0},
  entriesLeft: {type: Number, default: 0},
  maxChars: {type: Number, default: 0},
  createdAt: {type: Date, default: Date.now},
});

ThreadSchema.statics.findRandomIncompleteThread = function(callback){
  //Not yet working. Finds first thread that satisfies request,
  //but it is not random
  Thread.findOne({entriesLeft : { $gt : 0 }}).exec(function(err, thread) {
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
module.exports.EntrySchema = EntrySchema
