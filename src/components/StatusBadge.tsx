import type { BookingStatus } from '../types/cineflow';
import { bookingStatusLabel } from '../utils/format';

const StatusBadge = ({ status }: { status: BookingStatus }) => {
  return <span className={`history-state-chip ${status.toLowerCase()}`}>{bookingStatusLabel(status)}</span>;
};

export default StatusBadge;
