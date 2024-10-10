import React from 'react';

// Define Movie interface
interface Movie {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
}

// Define prop type for MovieCard component
interface MovieCardProps {
  movie1: Movie;
}

function MovieCard({ movie1 }: MovieCardProps) {
  return (
    <div className='movie'>
      <div>
        <p>{movie1.Year}</p>
      </div>

      <div>
        <a
          href={`https://www.imdb.com/title/${movie1.imdbID}`}
          target='_blank'
          rel='noopener noreferrer'
        >
          <img
            src={
              movie1.Poster !== 'N/A'
                ? movie1.Poster
                : 'https://via.placeholder.com/400'
            }
            alt='Movie Poster'
          />
        </a>
      </div>

      <div>
        <span>{movie1.Type === 'series'? `Tv Show` : `${movie1.Type}`}</span>
        <h3>
          <a
            href={`https://www.imdb.com/title/${movie1.imdbID}`}
            target='_blank'
            rel='noopener noreferrer'
          >
            {`${movie1.Title}` + ` (${movie1.Year})`}
          </a>
        </h3>
      </div>
    </div>
  );
}

export default MovieCard;
