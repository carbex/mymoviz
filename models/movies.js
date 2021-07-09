const mongoose = require('mongoose');

const movieSchema = mongoose.Schema({
  movieName: { type: String, required: true },
  movieImg: { type: String, required: true }
});

module.exports = mongoose.model('movies', movieSchema);