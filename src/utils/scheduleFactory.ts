import { screens } from '../data/movies';
import type { Movie, Schedule } from '../types/cineflow';

const DAILY_START_TIMES = [
  { hour: 10, minute: 20 },
  { hour: 14, minute: 10 },
  { hour: 19, minute: 30 }
];

const toLocalDateTimeString = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day}T${hour}:${minute}:00`;
};

const addMinutes = (date: Date, minutes: number) => {
  const nextDate = new Date(date);
  nextDate.setMinutes(nextDate.getMinutes() + minutes);
  return nextDate;
};

const createStartDate = (dayOffset: number, slotIndex: number) => {
  const now = new Date();
  const startTime = DAILY_START_TIMES[slotIndex % DAILY_START_TIMES.length];
  const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() + dayOffset, startTime.hour, startTime.minute, 0, 0);

  return date;
};

const resolveBasePrice = (screenType: string) => {
  if (screenType.includes('IMAX') || screenType.includes('4DX')) {
    return 22000;
  }

  if (screenType.includes('DOLBY')) {
    return 19000;
  }

  if (screenType.includes('LASER')) {
    return 18000;
  }

  return 15000;
};

const resolveAvailableSeats = (movieIndex: number, slotIndex: number) => {
  const calculatedSeats = 112 - movieIndex * 5 - slotIndex * 13;
  return Math.max(24, Math.min(110, calculatedSeats));
};

export const createSchedulesForMovies = (movies: Movie[]): Schedule[] => {
  let scheduleId = 1;

  return movies
    .filter((movie) => movie.status === 'NOW_SHOWING' && movie.bookingOpen)
    .slice(0, 12)
    .flatMap((movie, movieIndex) => {
      const slotCount = movieIndex < 6 ? 3 : 2;

      return Array.from({ length: slotCount }, (_, slotIndex) => {
        const screen = screens[(movieIndex + slotIndex) % screens.length];
        const dayOffset = 1 + movieIndex + slotIndex;
        const startDate = createStartDate(dayOffset, slotIndex);
        const runningTime = movie.runningTime > 0 ? movie.runningTime : 120;
        const endDate = addMinutes(startDate, runningTime);
        const currentScheduleId = scheduleId;
        scheduleId += 1;

        return {
          id: currentScheduleId,
          movieId: movie.id,
          screenId: screen.id,
          startTime: toLocalDateTimeString(startDate),
          endTime: toLocalDateTimeString(endDate),
          price: resolveBasePrice(screen.screenType),
          availableSeats: resolveAvailableSeats(movieIndex, slotIndex),
          active: true
        };
      });
    });
};
