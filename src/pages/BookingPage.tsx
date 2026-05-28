import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import BookingSummary from '../components/BookingSummary';
import PersonCounter from '../components/PersonCounter';
import ScheduleCard from '../components/ScheduleCard';
import SeatMap from '../components/SeatMap';
import { useBooking } from '../context/BookingContext';
import { movies, schedules } from '../data/movies';

const BookingPage = () => {
  const [searchParams] = useSearchParams();
  const { draft, setMovie, setSchedule, setPeopleCount, clearSeats, selectedMovie } = useBooking();
  const movieSchedules = schedules.filter((schedule) => schedule.movieId === draft.movieId);

  useEffect(() => {
    const movieId = Number(searchParams.get('movieId'));
    if (movieId && movies.some((movie) => movie.id === movieId)) {
      setMovie(movieId);
    }
  }, []);

  return (
    <main className="booking-page cinema-page">
      <section className="cinema-page-hero booking-hero booking-hero--primary">
        <div className="container">
          <div className="booking-hero__intro">
            <div>
              <h1>빠른예매</h1>
              <p>영화와 상영 시간을 선택한 뒤 관람 인원과 좌석을 지정합니다.</p>
            </div>
            <div className="booking-hero__actions">
              <Link to="/movies" className="hero-btn secondary">영화 목록 보기</Link>
              <Link to="/history" className="hero-btn secondary">예매내역</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="cinema-page-body">
        <div className="container">
          <ol className="booking-stepper">
            <li className="is-active"><span>1</span><strong>영화/시간</strong></li>
            <li className="is-active"><span>2</span><strong>인원/좌석</strong></li>
            <li><span>3</span><strong>결제</strong></li>
            <li><span>4</span><strong>완료</strong></li>
          </ol>

          <div className="booking-seat-layout">
            <div className="booking-seat-main">
              <section className="booking-panel">
                <div className="panel-head">
                  <h2>1. 영화 선택</h2>
                  <span className="panel-step">Movie</span>
                </div>
                <ul className="selection-list movie-selection-list">
                  {movies.map((movie) => (
                    <li className={draft.movieId === movie.id ? 'is-selected' : ''} key={movie.id}>
                      <button type="button" onClick={() => setMovie(movie.id)}>
                        <strong>{movie.title}</strong>
                        <span>{movie.genre} · {movie.status === 'NOW_SHOWING' ? '상영중' : '상영예정'}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="booking-panel">
                <div className="panel-head">
                  <h2>2. 상영 시간 선택</h2>
                  <span className="panel-step">Schedule</span>
                </div>
                <ul className="timeslot-list">
                  {movieSchedules.map((schedule) => (
                    <ScheduleCard schedule={schedule} selected={draft.scheduleId === schedule.id} onSelect={setSchedule} key={schedule.id} />
                  ))}
                </ul>
                {selectedMovie && !selectedMovie.bookingOpen ? <p className="booking-feedback-banner">상영예정 영화는 예매 흐름 확인용으로만 제공됩니다.</p> : null}
              </section>

              <section className="booking-panel people-select-panel">
                <div className="panel-head">
                  <h2>3. 관람 인원</h2>
                  <button type="button" className="auth-inline-button" onClick={clearSeats}>좌석 초기화</button>
                </div>
                <ul className="people-picker-list">
                  <PersonCounter label="성인" value={draft.peopleCounts.adult} onChange={(value) => setPeopleCount('adult', value)} />
                  <PersonCounter label="청소년" value={draft.peopleCounts.teen} onChange={(value) => setPeopleCount('teen', value)} />
                  <PersonCounter label="우대" value={draft.peopleCounts.senior} onChange={(value) => setPeopleCount('senior', value)} />
                </ul>
                <p className="people-picker-note">인원을 줄이면 선택된 좌석도 인원 수에 맞게 자동 조정됩니다.</p>
              </section>

              <SeatMap />
            </div>

            <BookingSummary />
          </div>

          <div className="seat-summary-links">
            <Link to="/support#cancel-policy">예매 취소 규정 보기</Link>
            <Link to="/history">예매내역 조회</Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default BookingPage;
