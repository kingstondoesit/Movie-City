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

  const searchMovies = async (title: string, pages: number = 5) => {
    setSearchQuery(title);

    try {
      if (title.trim() === '') {
        setMovies([]);
        return;
      }

      let allMovies: Movie[] = [];
      for (let page = 1; page <= pages; page++) {
        const API_URL = `${apiUrl}${apiKey}&s=${title}&page=${page}`;
        const response = await fetch(API_URL);
        const data: ApiResponse = await response.json();

        if (data.Response === "False") {  
          console.log('No movies found!');  
          setMovies([]);  
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
          console.log('All results  returned!');  
          break; 
      }  
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
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && searchMovies(searchQuery)}
        />
        <img
          src={SearchIcon}
          alt='Search Icon'
          onClick={() => searchMovies(searchQuery)}
        />
      </div>

      {searchQuery && (
        <div className='container'>
          {movies.length > 0 ? (
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

// omdb api returns only 10 results per requet so use this query http://www.omdbapi.com/?i=tt3896198&apikey=dd5fe5ff&s=boys&page=3 for pagination

export default Movie;
