var mongoose = require('mongoose');

var wordsSchema = new mongoose.Schema({
  words: {type: [String], default: []}
});

mongoose.model('Words', wordsSchema);
