import type { Schedule } from '../types/cineflow';
import { screens, theaters } from '../data/movies';
import { formatCurrency, formatDateTime } from '../utils/format';

interface ScheduleCardProps {
  schedule: Schedule;
  selected: boolean;
  onSelect: (scheduleId: number) => void;
}

const ScheduleCard = ({ schedule, selected, onSelect }: ScheduleCardProps) => {
  const screen = screens.find((item) => item.id === schedule.screenId);
  const theater = theaters.find((item) => item.id === screen?.theaterId);

  return (
    <li className={selected ? 'is-selected' : ''}>
      <button type="button" onClick={() => onSelect(schedule.id)}>
        <span className="time-primary">
          <span>{formatDateTime(schedule.startTime)}</span>
          <strong>{theater?.name} {screen?.name}</strong>
        </span>
        {selected ? <span className="timeslot-selected-mark">선택됨</span> : null}
        <span className="time-meta">{screen?.screenType} · 잔여 {schedule.availableSeats}석 · {formatCurrency(schedule.price)}</span>
      </button>
    </li>
  );
};

export default ScheduleCard;
