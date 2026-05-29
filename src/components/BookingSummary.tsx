import { Link } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import { formatCurrency, formatDateTime } from '../utils/format';

interface BookingSummaryProps {
  showAction?: boolean;
}

const BookingSummary = ({ showAction = true }: BookingSummaryProps) => {
  const {
    draft,
    selectedMovie,
    selectedSchedule,
    selectedScreen,
    selectedTheater,
    selectedSeatsTotal,
    totalPeople
  } = useBooking();
  const selectedSeatCount = draft.selectedSeats.length;
  const canMoveToPayment = totalPeople > 0 && selectedSeatCount === totalPeople;

  return (
    <aside className="booking-summary seat-summary-panel">
      <div className="screening-summary-title">
        <h2>예매 요약</h2>
      </div>
      <div className="summary-movie-group summary-poster-row">
        {selectedMovie ? <img src={selectedMovie.posterUrl} alt={`${selectedMovie.title} 포스터`} /> : null}
        <div className="summary-text">
          <strong>{selectedMovie?.title ?? '영화 미선택'}</strong>
          <span>{selectedMovie?.genre ?? '영화와 상영시간을 선택하세요.'}</span>
        </div>
      </div>
      <div className="screening-summary-grid summary-grid-compact">
        <div className="summary-info-block">
          <span>상영</span>
          <strong>{selectedSchedule ? formatDateTime(selectedSchedule.startTime) : '-'}</strong>
        </div>
        <div className="summary-info-block">
          <span>극장</span>
          <strong>{selectedTheater?.name ?? '-'} {selectedScreen?.name ?? ''}</strong>
        </div>
        <div className="summary-info-block">
          <span>인원</span>
          <strong>성인 {draft.peopleCounts.adult} · 청소년 {draft.peopleCounts.teen} · 우대 {draft.peopleCounts.senior}</strong>
        </div>
        <div className="summary-info-block">
          <span>좌석</span>
          <strong>{selectedSeatCount > 0 ? draft.selectedSeats.join(', ') : '선택 없음'}</strong>
        </div>
      </div>
      <div className="summary-progress-note">
        <strong>선택 좌석 {selectedSeatCount} / {totalPeople}</strong>
        {!canMoveToPayment ? <span>인원 수와 좌석 수가 일치하면 결제 단계로 이동할 수 있습니다.</span> : null}
      </div>
      <div className="amount-total summary-total">
        <span>결제금액</span>
        <strong>{formatCurrency(selectedSeatsTotal)}</strong>
      </div>
      {showAction ? (
        canMoveToPayment ? (
          <Link to="/payment" className="hero-btn primary summary-submit">
            결제 단계로 이동
          </Link>
        ) : (
          <button type="button" className="hero-btn primary summary-submit" disabled>
            결제 단계로 이동
          </button>
        )
      ) : null}
    </aside>
  );
};

export default BookingSummary;
