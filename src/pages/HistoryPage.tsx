import { FormEvent, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero';
import StatusBadge from '../components/StatusBadge';
import { useBooking } from '../context/BookingContext';
import { bookingStatusLabel, formatCurrency, formatDateTime, paymentMethodLabel } from '../utils/format';

const HistoryPage = () => {
  const { bookings, cancelBooking } = useBooking();
  const [keyword, setKeyword] = useState('');
  const [status, setStatus] = useState<'ALL' | 'BOOKED' | 'USED' | 'CANCELED'>('ALL');
  const [cancelReason, setCancelReason] = useState('일정 변경');

  const filteredBookings = useMemo(() => {
    return bookings
      .filter((booking) => status === 'ALL' || booking.status === status)
      .filter((booking) => `${booking.bookingCode} ${booking.movieTitle} ${booking.customerName} ${booking.customerPhone}`.includes(keyword))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [bookings, keyword, status]);

  const handleCancel = (event: FormEvent<HTMLFormElement>, bookingCode: string) => {
    event.preventDefault();
    cancelBooking(bookingCode, cancelReason);
  };

  return (
    <main className="booking-page booking-history-page cinema-page">
      <PageHero
        className="booking-hero history-hero"
        title="예매내역 조회"
        description="예매번호, 영화명, 예매자 정보로 조회하고 예매 상태를 확인합니다."
        actions={(
          <>
            <Link to="/booking" className="hero-btn primary">빠른예매</Link>
            <Link to="/movies" className="hero-btn secondary">상영작 보기</Link>
          </>
        )}
      />

      <section className="cinema-page-body">
        <div className="container">
          <div className="booking-panel history-lookup-panel">
            <div className="history-lookup-form">
              <label className="history-search-field"><span>검색어</span><input value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder="예매번호, 영화명, 이름" /></label>
              <label className="history-status-field"><span>상태</span><select value={status} onChange={(event) => setStatus(event.target.value as typeof status)}><option value="ALL">전체</option><option value="BOOKED">예매완료</option><option value="USED">관람완료</option><option value="CANCELED">취소완료</option></select></label>
            </div>
          </div>

          <div className="history-list history-card-list">
            {filteredBookings.map((booking) => (
              <article className="history-booking-card" key={booking.id}>
                <img src={booking.posterUrl} alt={`${booking.movieTitle} 포스터`} />
                <div className="history-card-main">
                  <div className="history-card-top">
                    <div><span>{booking.bookingCode}</span><h3>{booking.movieTitle}</h3></div>
                    <StatusBadge status={booking.status} />
                  </div>
                  <p className="history-card-summary">
                    {booking.customerName} · {formatDateTime(booking.startTime)}
                  </p>
                  <ul className="history-info-grid">
                    <li><span>예매자</span><strong>{booking.customerName}</strong></li>
                    <li><span>상영</span><strong>{formatDateTime(booking.startTime)}</strong></li>
                    <li><span>극장</span><strong>{booking.theaterName} {booking.screenName}</strong></li>
                    <li><span>좌석</span><strong>{booking.seatNames}</strong></li>
                    <li><span>결제</span><strong>{paymentMethodLabel(booking.paymentMethod)} · {formatCurrency(booking.totalPrice)}</strong></li>
                    {booking.status === 'BOOKED' ? (
                      <li className="history-action-cell">
                        <form className="history-card-actions" onSubmit={(event) => handleCancel(event, booking.bookingCode)}>
                          <label className="history-cancel-reason-field">
                            <span>취소 사유</span>
                            <input
                              value={cancelReason}
                              onChange={(event) => setCancelReason(event.target.value)}
                              placeholder="예: 일정 변경"
                            />
                          </label>
                          <button type="submit" className="hero-btn secondary">예매 취소</button>
                        </form>
                      </li>
                    ) : null}
                  </ul>
                  {booking.status !== 'BOOKED' ? (
                    <p className="panel-description">현재 상태: {bookingStatusLabel(booking.status)} {booking.cancelReason ? `· ${booking.cancelReason}` : ''}</p>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default HistoryPage;
