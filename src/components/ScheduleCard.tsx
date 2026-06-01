import { useMemo } from 'react';
import type { Schedule } from '../types/cineflow';
import { screens, theaters } from '../data/movies';
import { useBooking } from '../context/BookingContext';
import { formatCurrency, formatDateTime } from '../utils/format';

interface ScheduleCardProps {
  schedule: Schedule;
  selected: boolean;
  onSelect: (scheduleId: number) => void;
}

const parseSeatNames = (seatNames: string): string[] =>
  seatNames
    .split(',')
    .map((seatName) => seatName.trim())
    .filter(Boolean);

const ScheduleCard = ({ schedule, selected, onSelect }: ScheduleCardProps) => {
  const { bookings } = useBooking();
  const screen = screens.find((item) => item.id === schedule.screenId);
  const theater = theaters.find((item) => item.id === screen?.theaterId);

  const remainingSeats = useMemo(() => {
    const bookedSeatCount = bookings
      .filter((booking) => {
        if (booking.status !== 'BOOKED') {
          return false;
        }

        if (booking.scheduleId) {
          return booking.scheduleId === schedule.id;
        }

        return booking.startTime === schedule.startTime && booking.endTime === schedule.endTime;
      })
      .reduce((sum, booking) => sum + parseSeatNames(booking.seatNames).length, 0);

    return Math.max(0, schedule.availableSeats - bookedSeatCount);
  }, [bookings, schedule]);

  return (
    <li className={`schedule-card ${selected ? 'is-selected' : ''}`}>
      <button type="button" onClick={() => onSelect(schedule.id)}>
        <span className="schedule-card__datetime">
          <strong>{formatDateTime(schedule.startTime)}</strong>
        </span>
        <span className="schedule-card__theater">{theater?.name} {screen?.name}</span>
        {selected ? <span className="schedule-card__selected">선택됨</span> : null}
        <span className="schedule-card__meta">{screen?.screenType} · 잔여 {remainingSeats}석 · {formatCurrency(schedule.price)}</span>
      </button>
    </li>
  );
};

export default ScheduleCard;
