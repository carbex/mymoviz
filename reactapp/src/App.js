import React, {useState, useEffect} from 'react';
import './App.css';
import { 
  Container,
  Row,
  Button,
  Nav,
  NavItem,
  NavLink,
  Popover,
  PopoverHeader,
  PopoverBody,
  ListGroup,
  ListGroupItem

 } from 'reactstrap';

import Movie from './components/Movie'

function App() {

  const [moviesCount, setMoviesCount] = useState(0)
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [moviesWishList, setMoviesWishList] = useState([])
  const [moviesData, setMoviesData] = useState([])

  useEffect(() => {
    async function loadData() {
      var rawResponse = await fetch('/new-movies')
      var response = await rawResponse.json()
      setMoviesData(response.results)
    }
    loadData()
  }, [])

  useEffect(() => {
    async function loadData() {
      var rawResponse = await fetch('/wishlist-movie')
      var response = await rawResponse.json()
      setMoviesWishList(response)
      setMoviesCount(response.length)
    }
    loadData()
  }, [])
  
  const toggle = () => setPopoverOpen(!popoverOpen);

  // Fonctions

  var  handleClickAddMovie = async (movieName, movieImg) => {

    setMoviesWishList([...moviesWishList, {movieName: movieName, movieImg: movieImg}])
    setMoviesCount(moviesCount + 1)
 
    await fetch('/wishlist-movie', {
      method: 'POST',
      headers: {'Content-Type':'application/x-www-form-urlencoded'},
      body: `movieName=${movieName}&movieImg=${movieImg}`
    })
    
  }

  var handleClickDeleteMovie = async (movieName) => {
    setMoviesWishList(moviesWishList.filter((e) => (e.movieName != movieName)))
    setMoviesCount(moviesCount - 1)

    await fetch(`/wishlist-movie/${movieName}`, {
      method: 'DELETE'
    })

  }

  // Maps //

  let myWishList = moviesWishList.map(function(movie) {
    if(moviesWishList.length !== 0) {
      return <ListGroupItem key={movie.movieName} onClick={() => handleClickDeleteMovie(movie.movieName)} style={{cursor: 'pointer'}}><img src={movie.movieImg} alt={movie.movieName} width="50" height="30" /> {movie.movieName}</ListGroupItem>;
    }  
  })

  var movieList = moviesData.map((movie,i) => {

    let toSee = false
    moviesWishList.map((movieMyWishList) => {
      if(movieMyWishList.movieName === movie.title) {
        toSee = true 
      }
    })

    let img = movie.poster_path
    if(!movie.poster_path) {
      img = './generique.jpg'
    }

    return(<Movie toSee={toSee} handleClickDeleteMovieParent={handleClickDeleteMovie} handleClickAddMovieParent={handleClickAddMovie} key={i} movieName={movie.title} movieDesc={`${movie.overview.substring(0,80)}...`} movieImg={img} globalRating={movie.vote_average} globalCountRating={movie.vote_count} />)
  })

  return (
    <div style={{backgroundColor:"#232528"}}>
      <Container>
        <Nav>
          <span className="navbar-brand">
            <img src="./logo.png" width="30" height="30" className="d-inline-block align-top" alt="logo" />
          </span>
          <NavItem>
            <NavLink style={{color:'white'}}>Last Releases</NavLink>
          </NavItem>
          <NavItem>
            <NavLink>
              <Button id="Popover1" type="button">
                {moviesCount} films
              </Button>
              <Popover placement="bottom" isOpen={popoverOpen} target="Popover1" toggle={toggle}>
                <PopoverHeader>Whishlist</PopoverHeader>
                <PopoverBody>
                  <ListGroup>
                    {myWishList}
                  </ListGroup>
                </PopoverBody>
              </Popover>
            </NavLink>
          </NavItem>
        </Nav>
        <Row>
          {movieList}
        </Row>
      </Container>
    </div>
  );
}

export default App;
