import { Link, useNavigate, useParams } from 'react-router-dom';
import ScheduleCard from '../components/ScheduleCard';
import { useBooking } from '../context/BookingContext';
import { schedules } from '../data/movies';
import { formatCurrency, formatDate } from '../utils/format';

const MovieDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { draft, movies, setMovie, setSchedule } = useBooking();
  const movie = movies.find((item) => item.id === Number(id));

  if (!movie) {
    return (
      <main className="cinema-page storefront-detail-page">
        <section className="cinema-page-hero movie-detail-top">
          <div className="container">
            <h1>영화를 찾을 수 없습니다</h1>
            <p>잘못된 영화 번호입니다.</p>
            <div className="hero-actions detail-actions"><Link to="/movies" className="hero-btn primary">영화 목록으로 이동</Link></div>
          </div>
        </section>
      </main>
    );
  }

  const movieSchedules = schedules.filter((schedule) => schedule.movieId === movie.id);

  const handleBooking = () => {
    setMovie(movie.id);
    if (movieSchedules[0]) setSchedule(movieSchedules[0].id);
    navigate('/booking');
  };

  const handleScheduleSelect = (scheduleId: number) => {
    setMovie(movie.id);
    setSchedule(scheduleId);
    navigate('/booking');
  };

  return (
    <main className="storefront-detail-page cinema-page">
      <section className="cinema-page-hero movie-detail-top">
        <img className="movie-detail-top__backdrop" src={movie.backdropUrl ?? movie.posterUrl} alt="" aria-hidden="true" />
        <div className="container">
          <div className="detail-hero-shell">
            <div className="detail-poster-card detail-poster-col">
              <img src={movie.posterUrl} alt={`${movie.title} 포스터`} />
            </div>
            <div className="detail-copy-panel">
              <p className="hero-kicker">{movie.status === 'NOW_SHOWING' ? '현재 상영중' : '개봉 예정'}</p>
              <h1>{movie.title}</h1>
              <p className="detail-tagline">{movie.shortDescription}</p>
              <p className="detail-copy">{movie.description}</p>
              <div className="detail-score-grid">
                <div className="score-item"><span>예매율</span><strong>{movie.bookingRate}%</strong></div>
                <div className="score-item"><span>평점</span><strong>{movie.score.toFixed(1)}</strong></div>
                <div className="score-item"><span>러닝타임</span><strong>{movie.runningTime}분</strong></div>
              </div>
              <ul className="hero-meta detail-meta-list">
                <li>{movie.genre}</li>
                <li>{movie.ageRating}세 이상 관람가</li>
                <li>개봉 {formatDate(movie.releaseDate)}</li>
              </ul>
              <div className="hero-actions detail-actions detail-actions--inline">
                <button type="button" className="hero-btn primary" disabled={!movie.bookingOpen} onClick={handleBooking}>
                  {movie.bookingOpen ? '예매하기' : '상영예정'}
                </button>
                <Link to="/movies" className="hero-btn secondary">다른 영화 보기</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="detail-body cinema-page-body">
        <div className="container">
          <div className="detail-block detail-block--story">
            <div className="detail-section-header">
              <h2>상영 시간표</h2>
              <p>원하는 상영 시간을 선택하면 좌석 선택 단계로 이어집니다.</p>
            </div>
            {movieSchedules.length > 0 ? (
              <ul className="timeslot-list detail-schedule-list">
                {movieSchedules.map((schedule) => (
                  <ScheduleCard schedule={schedule} selected={draft.scheduleId === schedule.id} onSelect={handleScheduleSelect} key={schedule.id} />
                ))}
              </ul>
            ) : (
              <p className="panel-description">등록된 상영 시간이 없습니다.</p>
            )}
            <p className="panel-description">기본 일반석 가격은 {movieSchedules[0] ? formatCurrency(movieSchedules[0].price) : '-'}이며 좌석 타입에 따라 금액이 달라집니다.</p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default MovieDetailPage;
