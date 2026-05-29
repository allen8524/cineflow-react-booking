import { Link } from 'react-router-dom';
import MovieCard from '../components/MovieCard';
import { useBooking } from '../context/BookingContext';
import { movies, schedules, screens, theaters } from '../data/movies';
import { formatDate } from '../utils/format';

const HomePage = () => {
  const { bookings } = useBooking();
  const heroMovie = movies.find((movie) => movie.status === 'NOW_SHOWING') ?? movies[0];
  const featuredMovie = movies.find((movie) => movie.bookingOpen) ?? movies[0];
  const nowShowing = movies.filter((movie) => movie.status === 'NOW_SHOWING').slice(0, 3);
  const upcoming = movies.filter((movie) => movie.status === 'COMING_SOON').slice(0, 4);
  const activeBookings = bookings.filter((booking) => booking.status === 'BOOKED').length;

  return (
    <main className="storefront-home">
      <section className="storefront-hero-section">
        <div className="container">
          <div className="slick-hero storefront-hero-slider">
            <div className="hero-slide storefront-hero-card">
              <img className="storefront-hero-card__backdrop" src={heroMovie.backdropUrl ?? heroMovie.posterUrl} alt="" aria-hidden="true" />
              <div className="hero-overlay" />
              <div className="hero-content-wrap">
                <div className="hero-copy-area">
                  <p className="hero-kicker">현재 상영중</p>
                  <h1>{heroMovie.title}</h1>
                  <p className="hero-copy">{heroMovie.description}</p>
                  <ul className="hero-meta">
                    <li>개봉 {formatDate(heroMovie.releaseDate)}</li>
                    <li>{heroMovie.genre}</li>
                    <li>{heroMovie.runningTime}분</li>
                    <li>{heroMovie.ageRating}세 이상 관람가</li>
                  </ul>
                  <div className="hero-actions">
                    <Link to={`/booking?movieId=${heroMovie.id}`} className="hero-btn primary">예매하기</Link>
                    <Link to={`/movies/${heroMovie.id}`} className="hero-btn secondary">상세보기</Link>
                  </div>
                </div>
                <div className="hero-poster storefront-hero-poster">
                  <img src={heroMovie.posterUrl} alt={`${heroMovie.title} 포스터`} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="home-section">
        <div className="container">
          <div className="home-section__header">
            <div>
              <h2>지금 주목할 현재 상영작</h2>
              <p>인기 상영작과 예매 가능한 시간표를 한눈에 확인하세요.</p>
            </div>
          </div>
          <div className="home-showcase-layout">
            <div className="home-showcase-grid">
              {nowShowing.map((movie, index) => <MovieCard movie={movie} rank={index + 1} variant="home" key={movie.id} />)}
            </div>
            <aside className="home-rank-board">
              <div className="home-rank-board__head">
                <h3>예매 현황</h3>
                <span>실시간 서비스 요약</span>
              </div>
              <ul className="home-rank-board__list">
                <li><Link to="/admin"><strong>{movies.length}</strong><span>등록 영화</span><em>현재 등록된 영화</em></Link></li>
                <li><Link to="/booking"><strong>{schedules.length}</strong><span>상영 시간표</span><em>운영 중인 시간표</em></Link></li>
                <li><Link to="/movies"><strong>{theaters.length}</strong><span>운영 지점</span><em>예매 가능 지점</em></Link></li>
                <li><Link to="/history"><strong>{activeBookings}</strong><span>예매 완료 건</span><em>저장된 예매 내역</em></Link></li>
              </ul>
            </aside>
          </div>
        </div>
      </section>

      <section className="home-section">
        <div className="container">
          <div className="home-section__header">
            <div>
              <h2>개봉 예정작</h2>
              <p>곧 만날 수 있는 기대작을 미리 확인하고 관람 계획을 세워보세요.</p>
            </div>
          </div>
          <div className="home-upcoming-grid">
            {upcoming.map((movie) => <MovieCard movie={movie} variant="upcoming" key={movie.id} />)}
          </div>
        </div>
      </section>

      <section className="home-promo-section">
        <div className="container">
          <div className="home-guide-panel">
            <div className="home-guide-intro">
              <h2>영화 선택부터 좌석 예매까지 한 번에</h2>
              <p>영화, 예매, 결제, 예매내역을 빠르게 확인하고 관람 준비를 편리하게 마무리할 수 있습니다.</p>
              <div className="home-guide-actions">
                <Link to="/booking" className="hero-btn primary">예매 흐름 확인</Link>
                <Link to="/admin" className="hero-btn secondary">관리자 보기</Link>
              </div>
            </div>
            <div className="home-guide-list">
              <Link to="/movies" className="home-guide-card"><span className="home-guide-card__number">01</span><div><strong>영화 목록/상세</strong><p>원하는 작품과 상영 정보를 빠르게 확인</p></div><em>보기</em></Link>
              <Link to="/booking" className="home-guide-card"><span className="home-guide-card__number">02</span><div><strong>빠른예매/좌석 선택</strong><p>영화, 극장, 시간, 인원, 좌석을 차례로 선택</p></div><em>시작</em></Link>
              <Link to="/history" className="home-guide-card"><span className="home-guide-card__number">03</span><div><strong>예매내역/취소</strong><p>예매번호로 관람 일정 확인 및 취소 접수</p></div><em>조회</em></Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
