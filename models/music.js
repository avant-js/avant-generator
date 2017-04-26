const mongoose = require('mongoose');

const musicSchema = mongoose.Schema({
  title: {
    type: String
  },
  artist: {
    type: String
  },
  album: {
    type: String
  }
});

module.exports = mongoose.model('Music', musicSchema);