import { useMemo, useState } from 'react';
import { createSeatsForSchedule } from '../data/seats';
import { useBooking } from '../context/BookingContext';
import { formatCurrency } from '../utils/format';

const parseSeatNames = (seatNames: string): string[] =>
  seatNames
    .split(',')
    .map((seatName) => seatName.trim())
    .filter(Boolean);

const SeatMap = () => {
  const { selectedSchedule, draft, bookings, toggleSeat } = useBooking();
  const [message, setMessage] = useState('');

  const bookedSeatCodes = useMemo(() => {
    if (!selectedSchedule) {
      return [];
    }

    return bookings
      .filter((booking) => {
        if (booking.status !== 'BOOKED') {
          return false;
        }

        if (booking.scheduleId) {
          return booking.scheduleId === selectedSchedule.id;
        }

        return booking.startTime === selectedSchedule.startTime && booking.endTime === selectedSchedule.endTime;
      })
      .flatMap((booking) => parseSeatNames(booking.seatNames));
  }, [bookings, selectedSchedule]);

  const seats = useMemo(
    () => (selectedSchedule ? createSeatsForSchedule(selectedSchedule.id, bookedSeatCodes, selectedSchedule.price) : []),
    [bookedSeatCodes, selectedSchedule]
  );

  const groupedSeats = useMemo(() => {
    return seats.reduce<Record<string, typeof seats>>((acc, seat) => {
      acc[seat.row] = acc[seat.row] ? [...acc[seat.row], seat] : [seat];
      return acc;
    }, {});
  }, [seats]);

  if (!selectedSchedule) {
    return <p className="empty-message panel-description">상영 시간을 먼저 선택해 주세요.</p>;
  }

  const handleToggle = (seatCode: string) => {
    const result = toggleSeat(seatCode);
    setMessage(result.ok ? '' : result.message ?? '좌석을 선택할 수 없습니다.');
  };

  return (
    <section className="booking-panel seat-select-panel">
      <div className="panel-head">
        <h2>좌석 선택</h2>
        <p className="seat-panel-meta">선택한 인원 수와 좌석 수가 일치해야 결제로 이동할 수 있습니다.</p>
      </div>
      <div className="seat-legend">
        <span className="legend-item"><i className="seat-sample available" /><strong>일반</strong></span>
        <span className="legend-item"><i className="seat-sample premium" /><strong>프리미엄</strong></span>
        <span className="legend-item"><i className="seat-sample couple" /><strong>커플석</strong></span>
        <span className="legend-item"><i className="seat-sample selected" /><strong>선택</strong></span>
        <span className="legend-item"><i className="seat-sample reserved" /><strong>예매완료</strong></span>
      </div>
      <div className="screen-badge">SCREEN</div>
      <div className="seat-map-scroll">
        <div className="seat-map" aria-label="좌석 선택 영역">
          {Object.entries(groupedSeats).map(([row, rowSeats]) => (
            <div className="seat-row" key={row}>
              <span className="row-label">{row}</span>
              {rowSeats.slice(0, 4).map((seat) => {
                const selected = draft.selectedSeats.includes(seat.code);
                return (
                  <button
                    type="button"
                    className={`seat ${seat.type.toLowerCase()} ${seat.reserved ? 'reserved' : ''} ${selected ? 'selected' : ''}`}
                    disabled={seat.reserved}
                    onClick={() => handleToggle(seat.code)}
                    key={seat.code}
                    title={`${seat.code} ${formatCurrency(seat.price)}`}
                  >
                    {seat.code}
                  </button>
                );
              })}
              <span className="seat-aisle" />
              {rowSeats.slice(4, 8).map((seat) => {
                const selected = draft.selectedSeats.includes(seat.code);
                return (
                  <button
                    type="button"
                    className={`seat ${seat.type.toLowerCase()} ${seat.reserved ? 'reserved' : ''} ${selected ? 'selected' : ''}`}
                    disabled={seat.reserved}
                    onClick={() => handleToggle(seat.code)}
                    key={seat.code}
                    title={`${seat.code} ${formatCurrency(seat.price)}`}
                  >
                    {seat.code}
                  </button>
                );
              })}
              <span className="seat-aisle" />
              {rowSeats.slice(8).map((seat) => {
                const selected = draft.selectedSeats.includes(seat.code);
                return (
                  <button
                    type="button"
                    className={`seat ${seat.type.toLowerCase()} ${seat.reserved ? 'reserved' : ''} ${selected ? 'selected' : ''}`}
                    disabled={seat.reserved}
                    onClick={() => handleToggle(seat.code)}
                    key={seat.code}
                    title={`${seat.code} ${formatCurrency(seat.price)}`}
                  >
                    {seat.code}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      {message ? <p className="booking-feedback-banner">{message}</p> : null}
    </section>
  );
};

export default SeatMap;
