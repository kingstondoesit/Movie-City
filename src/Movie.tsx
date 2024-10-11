import { useEffect, useState } from 'react';
import SearchIcon from './assets/search.svg';
import MovieCard, { MovieFeed } from './MovieCard';

// Define the shape of the movie data
interface Movie extends MovieFeed {}

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
  const [loading, setLoading] = useState<boolean>(false); 
  const [inputValue, setInputValue] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const searchMovies = async (title: string, pages: number = 5) => {
    setSearchQuery(title);
    setLoading(true); 

    try {
      if (title.trim() === '') {
        setMovies([]);
        setLoading(false); 
        return;
      }

      let allMovies: Movie[] = [];
      for (let page = 1; page <= pages; page++) {
        const API_URL = `${apiUrl}${apiKey}&s=${title}&page=${page}`;
        const response = await fetch(API_URL);
        const data: ApiResponse = await response.json();

        if (data.Response === 'False') {
          console.log('No movies found!');
          setMovies([]);
          setLoading(false); 
          return;
        }

        if (data.Search && data.Search.length > 0) {
          allMovies = allMovies.concat(data.Search);
          setMovies(allMovies);
          console.log(allMovies);
        }

        if (page === pages) {
          console.log('Page limit reached!');
          break;
        }

        if (data.Search.length < 10) {
          console.log('All results returned!');
          break;
        }
      }
      setLoading(false); 

    } catch (error) {
      console.error('Error fetching movies:', error);
      setMovies([]);
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setSearchQuery(inputValue);
      searchMovies(inputValue);
    }
  };

  const handleSearchClick = () => {
    setSearchQuery(inputValue);
    searchMovies(inputValue);
  };

  return (
    <>
      <h1>MovieCity</h1>
      <div className='search'>
        <input
          type='text'
          placeholder='Search for a movie...'
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <img src={SearchIcon} alt='Search Icon' onClick={handleSearchClick} />
      </div>

      {searchQuery && (
        <div className='container'>
          {loading ? (
            <div className='empty'><h2>Loading movies . . .</h2></div> 
          ) : movies.length > 0 ? (
            movies.map((movie) => (
              <MovieCard key={movie.imdbID} movie={movie} />
            ))
          ) : (
            <h3 className='error'>No movies found</h3> 
          )}
        </div>
      )}
    </>
  );
}

export default Movie;
