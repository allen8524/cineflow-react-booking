import { useMemo, useState } from 'react';
import StatusBadge from '../components/StatusBadge';
import { useBooking } from '../context/BookingContext';
import { movies, schedules, screens, theaters } from '../data/movies';
import { bookingStatusLabel, formatCurrency, formatDateTime } from '../utils/format';

const AdminPage = () => {
  const { bookings } = useBooking();
  const [tab, setTab] = useState<'dashboard' | 'movies' | 'schedules' | 'bookings'>('dashboard');

  const metrics = useMemo(() => {
    const booked = bookings.filter((booking) => booking.status === 'BOOKED');
    const revenue = booked.reduce((sum, booking) => sum + booking.totalPrice, 0);
    return [
      { label: '전체 영화', value: `${movies.length}개`, description: '상영중/상영예정 포함' },
      { label: '상영 시간표', value: `${schedules.length}개`, description: '활성 시간표 기준' },
      { label: '예매 완료', value: `${booked.length}건`, description: '취소 제외 예매 건수' },
      { label: '예상 매출', value: formatCurrency(revenue), description: '취소 제외 예매 금액 기준' }
    ];
  }, [bookings]);

  return (
    <main className="admin-page cinema-page">
      <section className="cinema-page-hero admin-hero">
        <div className="container">
          <span className="section-chip">ADMIN</span>
          <h1>관리자 대시보드</h1>
          <p>영화, 시간표, 예매 현황을 한곳에서 확인할 수 있습니다.</p>
        </div>
      </section>

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
            <section className="admin-section">
              <div className="panel-head"><h2>영화 관리</h2></div>
              <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>영화명</th><th>장르</th><th>등급</th><th>예매율</th><th>상태</th></tr></thead><tbody>{movies.map((movie) => <tr key={movie.id}><td>{movie.title}</td><td>{movie.genre}</td><td>{movie.ageRating}</td><td>{movie.bookingRate}%</td><td>{movie.status === 'NOW_SHOWING' ? '상영중' : '상영예정'}</td></tr>)}</tbody></table></div>
            </section>
          ) : null}

          {tab === 'schedules' ? (
            <section className="admin-section">
              <div className="panel-head"><h2>시간표 관리</h2></div>
              <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>영화</th><th>극장</th><th>상영관</th><th>시작 시간</th><th>잔여석</th><th>가격</th></tr></thead><tbody>{schedules.map((schedule) => { const movie = movies.find((item) => item.id === schedule.movieId); const screen = screens.find((item) => item.id === schedule.screenId); const theater = theaters.find((item) => item.id === screen?.theaterId); return <tr key={schedule.id}><td>{movie?.title}</td><td>{theater?.name}</td><td>{screen?.name} {screen?.screenType}</td><td>{formatDateTime(schedule.startTime)}</td><td>{schedule.availableSeats}</td><td>{formatCurrency(schedule.price)}</td></tr>; })}</tbody></table></div>
            </section>
          ) : null}

          {tab === 'bookings' ? (
            <section className="admin-section">
              <div className="panel-head"><h2>예매 관리</h2></div>
              <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>예매번호</th><th>영화</th><th>예매자</th><th>좌석</th><th>금액</th><th>상태</th></tr></thead><tbody>{bookings.map((booking) => <tr key={booking.id}><td>{booking.bookingCode}</td><td>{booking.movieTitle}</td><td>{booking.customerName}</td><td>{booking.seatNames}</td><td>{formatCurrency(booking.totalPrice)}</td><td><StatusBadge status={booking.status} /> <span className="sr-only">{bookingStatusLabel(booking.status)}</span></td></tr>)}</tbody></table></div>
            </section>
          ) : null}
        </div>
      </section>
    </main>
  );
};

export default AdminPage;
