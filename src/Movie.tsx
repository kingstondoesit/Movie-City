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
  const [searchQuery, setSearchQuery] = useState<string>('');

  const searchMovies = async (title: string) => {
    setSearchQuery(title);

    try {
      if (title.trim() === '') {
        setMovies([]);
        return;
      }

      const API_URL = `${apiUrl}${apiKey}&s=${title}`;
      const response = await fetch(API_URL);
      const data: ApiResponse = await response.json();

      if (data.Search) {
        setMovies(data.Search);
        console.log(data.Search);
      } else {
        console.log('No movies found');
      }
    } catch (error) {
      console.error('Error fetching movies:', error);
      setMovies([]);
    }
  };

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

      {searchQuery && (
        <div className='container'>
          {movies.length > 0 ? (
            movies.map((movie) => (
              <MovieCard key={movie.imdbID} movie1={movie} />
            ))
          ) : (
            <h3 className='error'>Oops, something went wrong !!!</h3>
          )}
        </div>
      )}
    </>
  );
}

export default Movie;
