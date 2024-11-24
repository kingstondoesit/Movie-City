import React, { useState, useEffect } from 'react';

// Define Moviecardprops and movie interface
export interface MovieFeed {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
}

interface MovieCardProps {
  movie: MovieFeed;
}

function MovieCard({ movie }: MovieCardProps) {
  const placeholderImage = 'https://via.placeholder.com/400';
  const [isImageError, setIsImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Fallback image handler
  const handleImageError = (
    event: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    event.currentTarget.src = placeholderImage;
    setIsImageError(true); // Marks the image as failed
  };

  // Set image as loaded once it's successfully fetched
  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <div className="movie">
      <div>
        <p>{movie.Year}</p>
      </div>

      <div>
        <a
          href={`https://www.imdb.com/title/${movie.imdbID}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src={movie.Poster !== 'N/A' ? movie.Poster : placeholderImage}
            alt={isImageError ? `${movie.Title} Poster failed to load` : `${movie.Title} Poster`}
            onError={handleImageError}
            onLoad={handleImageLoad}
            style={{
              visibility: imageLoaded ? 'visible' : 'hidden', // Hide the alt text until the image is loaded
            }}
          />
        </a>
      </div>

      <div>
        <span>{movie.Type === 'series' ? 'TV Show' : `${movie.Type}`}</span>
        <h3>
          <a
            href={`https://www.imdb.com/title/${movie.imdbID}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {`${movie.Title} (${movie.Year})`}
          </a>
        </h3>
      </div>
    </div>
  );
}

export default MovieCard;