import { Link, useNavigate, useParams } from 'react-router-dom';
import ScheduleCard from '../components/ScheduleCard';
import { useBooking } from '../context/BookingContext';
import { movies, schedules } from '../data/movies';
import { formatCurrency, formatDate } from '../utils/format';

const MovieDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const movie = movies.find((item) => item.id === Number(id));
  const { draft, setMovie, setSchedule } = useBooking();


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
              <div className="hero-actions detail-actions">
                <button type="button" className="hero-btn primary" disabled={!movie.bookingOpen} onClick={handleBooking}>
                  {movie.bookingOpen ? '예매하기' : '상영예정'}
                </button>
                <Link to="/movies" className="hero-btn secondary">다른 영화 보기</Link>
              </div>
            </div>
            <aside className="detail-booking-sticky detail-hero-booking">
              <span>예매 안내</span>
              <h3>{movie.bookingOpen ? '상영시간표 선택 가능' : '상영시간표 준비 중'}</h3>
              <p>{movie.bookingOpen ? '원하는 시간을 선택한 후 좌석 단계로 이동하세요.' : '개봉 일정이 확정되면 예매 버튼이 활성화됩니다.'}</p>
              <button type="button" className="book-btn" onClick={handleBooking} disabled={!movie.bookingOpen}>빠른예매</button>
            </aside>
          </div>
        </div>
      </section>

      <section className="detail-body cinema-page-body">
        <div className="container">
          <div className="detail-block detail-block--story">
            <div className="detail-section-header">
              <span className="section-chip">SCHEDULE</span>
              <h2>상영 시간표</h2>
              <p>원하는 상영 시간을 선택하면 좌석 선택 단계로 이어집니다.</p>
            </div>
            {movieSchedules.length > 0 ? (
              <ul className="timeslot-list detail-schedule-list">
                {movieSchedules.map((schedule) => (
                  <ScheduleCard schedule={schedule} selected={draft.scheduleId === schedule.id} onSelect={setSchedule} key={schedule.id} />
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
