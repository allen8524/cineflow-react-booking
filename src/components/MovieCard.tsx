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
  const normalizedAgeRating = movie.ageRating.trim().toLowerCase();
  const ageClass = (() => {
    if (normalizedAgeRating === 'all' || normalizedAgeRating.includes('전체')) {
      return 'age-all all';
    }

    if (normalizedAgeRating.includes('12')) {
      return 'age-12';
    }

    if (normalizedAgeRating.includes('15')) {
      return 'age-15';
    }

    if (normalizedAgeRating.includes('19') || normalizedAgeRating.includes('청소년')) {
      return 'age-19';
    }

    return `age-${normalizedAgeRating.replace(/[^a-z0-9-]/g, '')}`;
  })();
  const statusClass = movie.status === 'NOW_SHOWING' ? 'status-now' : 'status-upcoming upcoming';

  const cardClass = variant === 'upcoming'
    ? 'home-upcoming-card'
    : variant === 'home'
      ? 'home-showcase-card'
      : 'catalog-card cinema-movie-card';
  const posterClass = variant === 'upcoming'
    ? 'home-upcoming-card__poster'
    : variant === 'home'
      ? 'home-showcase-card__poster'
      : 'catalog-card__poster poster-wrap';
  const bodyClass = variant === 'upcoming'
    ? 'home-upcoming-card__body'
    : variant === 'home'
      ? 'home-showcase-card__body'
      : 'catalog-card__body movie-card-body';
  const headClass = variant === 'upcoming'
    ? 'home-upcoming-card__head movie-card-head'
    : variant === 'home'
      ? 'home-showcase-card__head movie-card-head'
      : 'catalog-card__head movie-card-head';
  const metaClass = variant === 'upcoming'
    ? 'home-upcoming-card__meta movie-meta-list'
    : variant === 'home'
      ? 'home-showcase-card__meta movie-meta-list'
      : 'catalog-card__meta movie-meta-mini movie-meta-list';
  const actionsClass = variant === 'upcoming'
    ? 'home-upcoming-card__actions'
    : variant === 'home'
      ? 'home-showcase-card__actions'
      : 'catalog-card__actions movie-card-actions';

  return (
    <article className={cardClass}>
      <Link to={`/movies/${movie.id}`} className={posterClass} aria-label={`${movie.title} 상세 보기`}>
        {rank ? <span className="rank-badge">{rank}</span> : null}
        <img src={movie.posterUrl} alt={`${movie.title} 포스터`} />
        <span className={`status-badge ${statusClass}`}>{stateLabel}</span>
      </Link>
      <div className={bodyClass}>
        <div className={headClass}>
          <h3><Link to={`/movies/${movie.id}`}>{movie.title}</Link></h3>
          <span className={`age-badge ${ageClass}`}>{movie.ageRating}</span>
        </div>
        <ul className={metaClass}>
          <li className="movie-meta-chip">예매율 {movie.bookingRate}%</li>
          <li className="movie-meta-chip">평점 {movie.score.toFixed(1)}</li>
          <li className="movie-meta-chip">{formatDate(movie.releaseDate)}</li>
        </ul>
        <p className="movie-card-summary">{movie.shortDescription}</p>
        <div className={actionsClass}>
          {movie.bookingOpen ? <Link to={`/booking?movieId=${movie.id}`} className="book-btn">예매하기</Link> : <span className="book-btn disabled" aria-disabled="true">준비 중</span>}
          <Link to={`/movies/${movie.id}`} className="detail-link">상세보기</Link>
        </div>
      </div>
    </article>
  );
};

export default MovieCard;
