import { FormEvent, useMemo, useState } from 'react';
import PageHero from '../components/PageHero';
import StatusBadge from '../components/StatusBadge';
import { useBooking } from '../context/BookingContext';
import { screens, theaters } from '../data/movies';
import { bookingStatusLabel, formatCurrency, formatDateTime } from '../utils/format';

const ADMIN_MOVIES_PER_PAGE = 12;

const parseSeatNames = (seatNames: string): string[] =>
  seatNames
    .split(',')
    .map((seatName) => seatName.trim())
    .filter(Boolean);

const AdminPage = () => {
  const { bookings, movies, schedules, cancelBooking } = useBooking();
  const [tab, setTab] = useState<'dashboard' | 'movies' | 'schedules' | 'bookings'>('dashboard');
  const [moviePage, setMoviePage] = useState(1);
  const [adminCancelReasons, setAdminCancelReasons] = useState<Record<string, string>>({});

  const getBookedSeatCount = (scheduleId: number) => {
    const schedule = schedules.find((item) => item.id === scheduleId);

    return bookings
      .filter((booking) => {
        if (booking.status !== 'BOOKED') {
          return false;
        }

        if (booking.scheduleId) {
          return booking.scheduleId === scheduleId;
        }

        return schedule ? booking.startTime === schedule.startTime && booking.endTime === schedule.endTime : false;
      })
      .reduce((sum, booking) => sum + parseSeatNames(booking.seatNames).length, 0);
  };

  const getRemainingSeats = (scheduleId: number) => {
    const schedule = schedules.find((item) => item.id === scheduleId);
    if (!schedule) {
      return 0;
    }

    return Math.max(0, schedule.availableSeats - getBookedSeatCount(scheduleId));
  };

  const metrics = useMemo(() => {
    const booked = bookings.filter((booking) => booking.status === 'BOOKED');
    const revenue = booked.reduce((sum, booking) => sum + booking.totalPrice, 0);
    return [
      { label: '전체 영화', value: `${movies.length}개`, description: '상영중/상영예정 포함' },
      { label: '상영 시간표', value: `${schedules.length}개`, description: '동적 생성 시간표 기준' },
      { label: '예매 완료', value: `${booked.length}건`, description: '취소 제외 예매 건수' },
      { label: '예상 매출', value: formatCurrency(revenue), description: '취소 제외 예매 금액 기준' }
    ];
  }, [bookings, movies.length, schedules.length]);

  const movieTotalPages = Math.max(1, Math.ceil(movies.length / ADMIN_MOVIES_PER_PAGE));
  const currentMoviePage = Math.min(moviePage, movieTotalPages);
  const pagedMovies = movies.slice(
    (currentMoviePage - 1) * ADMIN_MOVIES_PER_PAGE,
    currentMoviePage * ADMIN_MOVIES_PER_PAGE
  );

  const handleAdminCancelReasonChange = (bookingCode: string, reason: string) => {
    setAdminCancelReasons((prev) => ({ ...prev, [bookingCode]: reason }));
  };

  const handleAdminCancel = (event: FormEvent<HTMLFormElement>, bookingCode: string) => {
    event.preventDefault();
    cancelBooking(bookingCode, adminCancelReasons[bookingCode] || '관리자 취소');
    setAdminCancelReasons((prev) => ({ ...prev, [bookingCode]: '' }));
  };

  return (
    <main className="admin-page cinema-page">
      <PageHero
        className="admin-hero"
        title="관리자 대시보드"
        description="영화, 시간표, 예매 현황을 한곳에서 확인할 수 있습니다."
      />

      <section className="admin-body cinema-page-body">
        <div className="container">
          <nav className="admin-subnav" aria-label="관리자 메뉴">
            <button className={tab === 'dashboard' ? 'is-active' : ''} onClick={() => setTab('dashboard')} type="button">대시보드</button>
            <button className={tab === 'movies' ? 'is-active' : ''} onClick={() => setTab('movies')} type="button">영화 관리</button>
            <button className={tab === 'schedules' ? 'is-active' : ''} onClick={() => setTab('schedules')} type="button">시간표 관리</button>
            <button className={tab === 'bookings' ? 'is-active' : ''} onClick={() => setTab('bookings')} type="button">예매 관리</button>
          </nav>

          {tab === 'dashboard' ? (
            <div className="admin-stat-grid admin-stat-grid--dashboard">
              {metrics.map((metric) => (
                <article className="admin-stat-card" key={metric.label}>
                  <span className="stat-label">{metric.label}</span>
                  <strong className="stat-value">{metric.value}</strong>
                  <p className="stat-caption">{metric.description}</p>
                </article>
              ))}
            </div>
          ) : null}

          {tab === 'movies' ? (
            <section className="admin-section admin-movie-section">
              <div className="panel-head admin-section-head">
                <div>
                  <h2>영화 관리</h2>
                  <p>TMDB API에서 가져온 영화 데이터를 기준으로 표시합니다.</p>
                </div>
                <span>{movies.length}개 중 {(currentMoviePage - 1) * ADMIN_MOVIES_PER_PAGE + 1}-{Math.min(currentMoviePage * ADMIN_MOVIES_PER_PAGE, movies.length)}개</span>
              </div>
              <div className="admin-table-wrap admin-table-wrap--compact">
                <table className="admin-table admin-table--compact">
                  <thead>
                    <tr>
                      <th>영화명</th>
                      <th>장르</th>
                      <th>등급</th>
                      <th>인기도</th>
                      <th>상태</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pagedMovies.map((movie) => (
                      <tr key={movie.id}>
                        <td><span className="admin-table-ellipsis" title={movie.title}>{movie.title}</span></td>
                        <td><span className="admin-table-ellipsis" title={movie.genre}>{movie.genre}</span></td>
                        <td>{movie.ageRating}</td>
                        <td>{(movie.popularity ?? movie.bookingRate).toFixed(1)}</td>
                        <td>{movie.status === 'NOW_SHOWING' ? '상영중' : '상영예정'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {movieTotalPages > 1 ? (
                <nav className="admin-pagination" aria-label="관리자 영화 목록 페이지">
                  <button type="button" disabled={currentMoviePage === 1} onClick={() => setMoviePage((value) => Math.max(1, value - 1))}>이전</button>
                  {Array.from({ length: movieTotalPages }, (_, index) => index + 1).map((pageNumber) => (
                    <button
                      type="button"
                      className={currentMoviePage === pageNumber ? 'is-active' : ''}
                      onClick={() => setMoviePage(pageNumber)}
                      key={pageNumber}
                    >
                      {pageNumber}
                    </button>
                  ))}
                  <button type="button" disabled={currentMoviePage === movieTotalPages} onClick={() => setMoviePage((value) => Math.min(movieTotalPages, value + 1))}>다음</button>
                </nav>
              ) : null}
            </section>
          ) : null}

          {tab === 'schedules' ? (
            <section className="admin-section">
              <div className="panel-head"><h2>시간표 관리</h2></div>
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>영화</th>
                      <th>극장</th>
                      <th>상영관</th>
                      <th>시작 시간</th>
                      <th>예매석</th>
                      <th>잔여석</th>
                      <th>가격</th>
                    </tr>
                  </thead>
                  <tbody>
                    {schedules.map((schedule) => {
                      const movie = movies.find((item) => item.id === schedule.movieId);
                      const screen = screens.find((item) => item.id === schedule.screenId);
                      const theater = theaters.find((item) => item.id === screen?.theaterId);
                      const bookedSeatCount = getBookedSeatCount(schedule.id);
                      const remainingSeats = getRemainingSeats(schedule.id);

                      return (
                        <tr key={schedule.id}>
                          <td>{movie?.title}</td>
                          <td>{theater?.name}</td>
                          <td>{screen?.name} {screen?.screenType}</td>
                          <td>{formatDateTime(schedule.startTime)}</td>
                          <td>{bookedSeatCount}석</td>
                          <td>{remainingSeats}석</td>
                          <td>{formatCurrency(schedule.price)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          ) : null}

          {tab === 'bookings' ? (
            <section className="admin-section">
              <div className="panel-head"><h2>예매 관리</h2></div>
              <div className="admin-table-wrap">
                <table className="admin-table admin-table--bookings">
                  <thead>
                    <tr>
                      <th>예매번호</th>
                      <th>영화</th>
                      <th>예매자</th>
                      <th>좌석</th>
                      <th>금액</th>
                      <th>상태</th>
                      <th>관리</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking) => (
                      <tr key={booking.id}>
                        <td><span className="admin-table-ellipsis" title={booking.bookingCode}>{booking.bookingCode}</span></td>
                        <td>{booking.movieTitle}</td>
                        <td>{booking.customerName}</td>
                        <td>{booking.seatNames}</td>
                        <td>{formatCurrency(booking.totalPrice)}</td>
                        <td>
                          <StatusBadge status={booking.status} />
                          <span className="sr-only">{bookingStatusLabel(booking.status)}</span>
                        </td>
                        <td>
                          {booking.status === 'BOOKED' ? (
                            <form className="admin-booking-cancel-form" onSubmit={(event) => handleAdminCancel(event, booking.bookingCode)}>
                              <input
                                value={adminCancelReasons[booking.bookingCode] ?? ''}
                                onChange={(event) => handleAdminCancelReasonChange(booking.bookingCode, event.target.value)}
                                placeholder="취소 사유"
                              />
                              <button type="submit" className="hero-btn secondary">취소</button>
                            </form>
                          ) : (
                            <span className="panel-description">{booking.cancelReason ?? bookingStatusLabel(booking.status)}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ) : null}
        </div>
      </section>
    </main>
  );
};

export default AdminPage;
