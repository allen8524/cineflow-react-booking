import { Link, useSearchParams } from 'react-router-dom';
import PageHero from '../components/PageHero';
import StatusBadge from '../components/StatusBadge';
import { useBooking } from '../context/BookingContext';
import { formatCurrency, formatDateTime, paymentMethodLabel } from '../utils/format';

const CompletePage = () => {
  const [searchParams] = useSearchParams();
  const { bookings, resetDraft } = useBooking();
  const bookingCode = searchParams.get('code');
  const booking = bookings.find((item) => item.bookingCode === bookingCode);

  if (!booking) {
    return (
      <main className="booking-page cinema-page">
        <PageHero
          className="booking-hero complete-hero"
          title="완료된 예매가 없습니다."
          actions={<Link to="/booking" className="hero-btn primary">예매하러 가기</Link>}
        />
      </main>
    );
  }

  return (
    <main className="booking-page cinema-page">
      <PageHero
        className="booking-hero complete-hero"
        title="예매가 완료되었습니다."
        description="예매번호와 관람 정보를 확인하세요."
        actions={(
          <>
            <Link to="/history" className="hero-btn primary" onClick={resetDraft}>예매내역 보기</Link>
            <Link to="/" className="hero-btn secondary">메인으로 이동</Link>
          </>
        )}
      />

      <section className="cinema-page-body">
        <div className="container">
          <article className="booking-panel complete-success-hero">
            <div className="complete-success-head">
              <div>
                <span className="success-state-badge">예매 완료</span>
                <h2>{booking.movieTitle}</h2>
                <p>예매번호와 관람 정보를 아래에서 확인하세요.</p>
              </div>
              <StatusBadge status={booking.status} />
            </div>

            <div className="ticket-frame complete-ticket-frame">
              <img src={booking.posterUrl} alt={`${booking.movieTitle} 포스터`} />
              <div className="ticket-info complete-ticket-info">
                <div className="ticket-code-card">
                  <span>예매번호</span>
                  <strong>{booking.bookingCode}</strong>
                </div>
                <div className="screening-summary-grid complete-ticket-grid">
                  <div className="summary-info-block"><span>상영</span><strong>{formatDateTime(booking.startTime)}</strong></div>
                  <div className="summary-info-block"><span>극장</span><strong>{booking.theaterName} {booking.screenName} {booking.screenType}</strong></div>
                  <div className="summary-info-block"><span>좌석</span><strong>{booking.seatNames}</strong></div>
                  <div className="summary-info-block"><span>결제</span><strong>{paymentMethodLabel(booking.paymentMethod)} · {formatCurrency(booking.totalPrice)}</strong></div>
                </div>
              </div>
            </div>

            <div className="hero-actions complete-actions">
              <Link to="/history" className="hero-btn primary" onClick={resetDraft}>예매내역 보기</Link>
              <Link to="/movies" className="hero-btn secondary">다른 영화 보기</Link>
              <Link to="/booking" className="hero-btn secondary">다시 예매하기</Link>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
};

export default CompletePage;
