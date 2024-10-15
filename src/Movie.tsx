import { useEffect, useState } from 'react';
import SearchIcon from './assets/search.svg';
import MovieCard, { MovieFeed } from './components/MovieCard';
import { paginateMovies } from './lib/utils/pagination';

interface Movie extends MovieFeed {}
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
  const [abortController, setAbortController] =
    useState<AbortController | null>(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState<number>(1);
  const limit = 16; // Movies per page
  const [paginatedMovies, setPaginatedMovies] = useState<Movie[]>([]);

  useEffect(() => {
    const { moviesOnCurrentPage } = paginateMovies(movies, currentPage, limit);
    setPaginatedMovies(moviesOnCurrentPage);
    console.log('Paginated Movies:', moviesOnCurrentPage);
  }, [movies, currentPage]);

  // Fetch movies progressively
  const searchMovies = async (title: string) => {
    if (abortController) {
      abortController.abort(); // Abort previous search
    }
  
    const newAbortController = new AbortController();
    setAbortController(newAbortController);
    setLoading(true);
    setSearchQuery(title);
  
    try {
      if (title.trim() === '') {
        setMovies([]);
        setLoading(false);
        return;
      }
  
      // Fetch the first page immediately
      const API_URL = `${apiUrl}${apiKey}&s=${title}&page=1`;
      const response = await fetch(API_URL, {
        signal: newAbortController.signal,
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch movies');
      }
  
      const data: ApiResponse = await response.json();
  
      if (data.Response === 'False') {
        setMovies([]);
        setLoading(false);
        return;
      }
  
      // Set the movies for the first page
      setMovies(data.Search);
      
      // Stop loading immediately after fetching the first page
      setLoading(false);
  
      // Fetch subsequent pages in the background
      await fetchAllPages(title, 2);
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        console.error('Error fetching movies:', error);
        setMovies([]);
        setLoading(false); // Ensure loading is also false on error
      }
    }
  };

  const fetchAllPages = async (title: string, page: number) => {
    const API_URL = `${apiUrl}${apiKey}&s=${title}&page=${page}`;
    const response = await fetch(API_URL);

    if (!response.ok) {
      console.error('Failed to fetch additional movies');
      return;
    }

    const data: ApiResponse = await response.json();

    if (data.Response === 'True') {
      setMovies((prevMovies) => {
        const newMovies = [...prevMovies, ...data.Search];
        return newMovies;
      });

      console.log('Total Results:', data.totalResults);
      console.log('Fetched Page:', page);

      if (
        data.Search.length > 0 &&
        page * limit < parseInt(data.totalResults)
      ) {
        await fetchAllPages(title, page + 1);
      } else {
        console.log('Fetched all pages.');
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setCurrentPage(1); // Reset to the first page when searching
      searchMovies(inputValue);
    }
  };

  const handleSearchClick = () => {
    setCurrentPage(1); // Reset to the first page when searching
    searchMovies(inputValue);
  };

  const handlePageChange = (direction: 'next' | 'prev') => {
    setCurrentPage((prevPage) => {
      if (direction === 'next') {
        return prevPage + 1;
      } else {
        return Math.max(prevPage - 1, 1);
      }
    });
  };

  return (
    <>
      <h1>MovieCity</h1>
      <div className='search'>
        <input
          type='text'
          placeholder='Search for a movie...'
          onChange={(e) => setInputValue(e.target.value.trim())}
          onKeyDown={handleKeyDown}
        />
        <img src={SearchIcon} alt='Search Icon' onClick={handleSearchClick} />
      </div>

      {searchQuery && (
        <div className='container'>
          {loading ? (
            <div className='empty'>
              <h3>Fetching all results...</h3>
            </div>
          ) : paginatedMovies.length > 0 ? (
            paginatedMovies.map((movie) => (
              <MovieCard key={movie.imdbID} movie={movie} />
            ))
          ) : (
            <h3 className='error'>No movies found</h3>
          )}
        </div>
      )}

      {movies.length > 0 &&
        (loading ? (
          <h3></h3>
        ) : (
          <div className='pagination'>
            <button
              onClick={() => handlePageChange('prev')}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span>Page {currentPage}</span>
            <button
              onClick={() => handlePageChange('next')}
              disabled={currentPage * limit >= movies.length}
            >
              Next
            </button>
          </div>
        ))}
    </>
  );
}

export default Movie;
