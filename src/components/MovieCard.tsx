import { Link } from 'react-router-dom';
import type { Movie } from '../types/cineflow';
import { formatDate } from '../utils/format';

interface MovieCardProps {
  movie: Movie;
  rank?: number;
  variant?: 'home' | 'catalog';
}

const MovieCard = ({ movie, rank, variant = 'catalog' }: MovieCardProps) => {
  const stateLabel = movie.status === 'NOW_SHOWING' ? '상영중' : '상영예정';
  const cardClass = variant === 'home' ? 'home-showcase-card' : 'catalog-card cinema-movie-card';
  const posterClass = variant === 'home' ? 'home-showcase-card__poster' : 'catalog-card__poster poster-wrap';
  const bodyClass = variant === 'home' ? 'home-showcase-card__body' : 'catalog-card__body movie-card-body';
  const headClass = variant === 'home' ? 'home-showcase-card__head movie-card-head' : 'catalog-card__head movie-card-head';
  const metaClass = variant === 'home' ? 'home-showcase-card__meta' : 'catalog-card__meta movie-meta-mini';
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
          <li>예매율 {movie.bookingRate}%</li>
          <li>평점 {movie.score.toFixed(1)}</li>
          <li>{formatDate(movie.releaseDate)}</li>
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
