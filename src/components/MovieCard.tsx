import { Link } from 'react-router-dom';
import type { Movie } from '../types/cineflow';
import { formatDate } from '../utils/format';

interface MovieCardProps {
  movie: Movie;
  rank?: number;
  variant?: 'home' | 'catalog' | 'upcoming';
}

const MovieCard = ({ movie, rank, variant = 'catalog' }: MovieCardProps) => {
  const stateLabel = movie.status === 'NOW_SHOWING' ? '상영중' : '상영예정';

  if (variant === 'upcoming') {
    return (
      <article className="home-upcoming-card">
        <Link to={`/movies/${movie.id}`} className="home-upcoming-card__poster" aria-label={`${movie.title} 상세 보기`}>
          <img src={movie.posterUrl} alt={`${movie.title} 포스터`} />
          <span className="status-badge upcoming">{stateLabel}</span>
        </Link>
        <div className="home-upcoming-card__body">
          <h3><Link to={`/movies/${movie.id}`}>{movie.title}</Link></h3>
          <ul className="home-upcoming-card__meta movie-meta-list">
            <li className="movie-meta-chip">{movie.genre}</li>
            <li className="movie-meta-chip">{movie.runningTime}분</li>
          </ul>
          <p>{movie.shortDescription}</p>
        </div>
      </article>
    );
  }

  const cardClass = variant === 'home' ? 'home-showcase-card' : 'catalog-card cinema-movie-card';
  const posterClass = variant === 'home' ? 'home-showcase-card__poster' : 'catalog-card__poster poster-wrap';
  const bodyClass = variant === 'home' ? 'home-showcase-card__body' : 'catalog-card__body movie-card-body';
  const headClass = variant === 'home' ? 'home-showcase-card__head movie-card-head' : 'catalog-card__head movie-card-head';
  const metaClass = variant === 'home' ? 'home-showcase-card__meta movie-meta-list' : 'catalog-card__meta movie-meta-mini movie-meta-list';
  const actionsClass = variant === 'home' ? 'home-showcase-card__actions' : 'catalog-card__actions movie-card-actions';

  return (
    <article className={cardClass}>
      <Link to={`/movies/${movie.id}`} className={posterClass} aria-label={`${movie.title} 상세 보기`}>
        {rank ? <span className="rank-badge">{rank}</span> : null}
        <img src={movie.posterUrl} alt={`${movie.title} 포스터`} />
        <span className={`status-badge ${movie.status === 'COMING_SOON' ? 'upcoming' : ''}`}>{stateLabel}</span>
      </Link>
      <div className={bodyClass}>
        <div className={headClass}>
          <h3><Link to={`/movies/${movie.id}`}>{movie.title}</Link></h3>
          <span className={`age-badge age-${movie.ageRating}`}>{movie.ageRating}</span>
        </div>
        <ul className={metaClass}>
          <li className="movie-meta-chip">예매율 {movie.bookingRate}%</li>
          <li className="movie-meta-chip">평점 {movie.score.toFixed(1)}</li>
          <li className="movie-meta-chip">{formatDate(movie.releaseDate)}</li>
        </ul>
        <p className="movie-card-summary">{movie.shortDescription}</p>
        <div className={actionsClass}>
          {movie.bookingOpen ? <Link to={`/booking?movieId=${movie.id}`} className="book-btn">예매하기</Link> : <span className="book-btn disabled">준비 중</span>}
          <Link to={`/movies/${movie.id}`} className="detail-link">상세보기</Link>
        </div>
      </div>
    </article>
  );
};

export default MovieCard;
