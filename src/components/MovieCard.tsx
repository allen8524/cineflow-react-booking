import { Link } from 'react-router-dom';
import type { Movie } from '../types/cineflow';
import { formatDate } from '../utils/format';

interface MovieCardProps {
  movie: Movie;
  rank?: number;
  variant?: 'home' | 'catalog' | 'upcoming';
}

const getAgeClass = (ageRating: string) => {
  const normalizedAgeRating = ageRating.trim().toLowerCase();

  if (!normalizedAgeRating || normalizedAgeRating.includes('미정')) {
    return '';
  }

  if (normalizedAgeRating === 'all' || normalizedAgeRating.includes('전체')) {
    return 'age-all all';
  }

  if (normalizedAgeRating.includes('12')) {
    return 'age-12';
  }

  if (normalizedAgeRating.includes('15')) {
    return 'age-15';
  }

  if (
    normalizedAgeRating.includes('18') ||
    normalizedAgeRating.includes('19') ||
    normalizedAgeRating.includes('청소년')
  ) {
    return 'age-19';
  }

  const safeAgeClass = normalizedAgeRating.replace(/[^a-z0-9-]/g, '');
  return safeAgeClass ? `age-${safeAgeClass}` : '';
};

const MovieCard = ({ movie, rank, variant = 'catalog' }: MovieCardProps) => {
  const stateLabel = movie.status === 'NOW_SHOWING' ? '상영중' : '상영예정';
  const ageClass = getAgeClass(movie.ageRating);
  const statusClass = movie.status === 'NOW_SHOWING' ? 'status-now' : 'status-upcoming upcoming';
  const popularityText = (movie.popularity ?? movie.bookingRate).toFixed(1);

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
    ? 'home-upcoming-card__meta movie-meta-list movie-meta-panel'
    : variant === 'home'
      ? 'home-showcase-card__meta movie-meta-list movie-meta-panel'
      : 'catalog-card__meta movie-meta-mini movie-meta-list movie-meta-panel';
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
          <li className="movie-meta-item movie-meta-item--popularity" title="TMDB에서 제공하는 popularity 값입니다.">
            <span>TMDB 인기</span>
            <strong>{popularityText}</strong>
          </li>
          <li className="movie-meta-item">
            <span>평점</span>
            <strong>{movie.score.toFixed(1)}/10</strong>
          </li>
          <li className="movie-meta-item movie-meta-item--date">
            <span>개봉일</span>
            <strong>{formatDate(movie.releaseDate)}</strong>
          </li>
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
