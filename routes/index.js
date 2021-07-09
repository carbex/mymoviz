var express = require('express');
var router = express.Router();
var request = require('sync-request');
const Movie = require('../models/movies');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/new-movies', async (req, res, next) => {
  var result = await request('GET', "https://api.themoviedb.org/3/discover/movie?api_key=91e03cde1dd1b5804fd7cf373ca7ffc7&language=fr-FR&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_watch_monetization_types=flatrate")
  result = await JSON.parse(result.body)
  for(let i=0; i<result.results.length; i++ ) {
    result.results[i].poster_path = "https://image.tmdb.org/t/p/w500" + result.results[i].poster_path
  }
  res.json(result)
})

router.post('/wishlist-movie', async (req, res, next) => {
  
  const newMovie = new Movie({
    movieName: req.body.movieName,
    movieImg: req.body.movieImg
  });
  await newMovie.save()

})

router.delete('/wishlist-movie/:movieName', async (req, res, next) => {
  await Movie.deleteOne({ movieName: req.params.movieName })
})

router.get('/wishlist-movie', async (req, res, next) => {
  var movie = await Movie.find()
  res.json(movie)
})

module.exports = router;
