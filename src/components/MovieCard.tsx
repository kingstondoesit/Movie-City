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
  return (
    <div className='movie'>
      <div>
        <p>{movie.Year}</p>
      </div>

      <div>
        <a
          href={`https://www.imdb.com/title/${movie.imdbID}`}
          target='_blank'
          rel='noopener noreferrer'
        >
          <img
            src={
              movie.Poster !== 'N/A'
                ? movie.Poster
                : 'https://via.placeholder.com/400'
            }
            alt='Movie Poster'
          />
        </a>
      </div>

      <div>
        <span>{movie.Type === 'series' ? `Tv Show` : `${movie.Type}`}</span>
        <h3>
          <a
            href={`https://www.imdb.com/title/${movie.imdbID}`}
            target='_blank'
            rel='noopener noreferrer'
          >
            {`${movie.Title}` + ` (${movie.Year})`}
          </a>
        </h3>
      </div>
    </div>
  );
}

export default MovieCard;