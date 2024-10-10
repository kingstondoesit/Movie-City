import { useEffect, useState } from 'react';
import SearchIcon from './assets/search.svg';
import MovieCard from './MovieCard';

// Define the shape of the movie data
interface Movie {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
}

// Define the API response structure
interface ApiResponse {
  Search: Movie[];
  totalResults: string;
  Response: string;
}

export function Movie() {
  const apiKey: string = import.meta.env.VITE_APP_API_KEY;
  const apiUrl: string = import.meta.env.VITE_APP_API_URL;
   
  const [movies, setMovies] = useState<Movie[]>([]);

  const searchMovies = async (title: string) => {
    try {
      const API_URL = `${apiUrl}` + `${apiKey}&s=${title}`;
      const response = await fetch(API_URL);
      const data: ApiResponse = await response.json();

      if (data.Search) {
        setMovies(data.Search);
        console.log(data.Search);
      } else {
        console.log('No movies found');
      }
    } catch (error) {
      console.error('Error fetching movies:');
    }
  };

  useEffect(() => {
    searchMovies(''); 
  }, []);

  return (
    <>
      <h1>MovieCity</h1>
      <div className='search'>
        <input
          type='text'
          placeholder='Search for a movie...'
          onChange={(e) => searchMovies(e.target.value)}
        />
        <img src={SearchIcon} alt='Search Icon' />
      </div>

      <div className='container'>
        {movies.map((movie) => (
          <MovieCard key={movie.imdbID} movie1={movie} />
        ))}
      </div>
    </>
  );
}

export default Movie;
