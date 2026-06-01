import type { Seat, SeatType } from '../types/cineflow';
import { schedules } from './movies';

const reservedSeatMap: Record<number, string[]> = {
  1: ['A1', 'A2', 'A3', 'A4', 'A5', 'E7', 'E8', 'F6', 'G7', 'G8'],
  2: ['A1', 'A2', 'B1', 'B2', 'C3', 'D4'],
  3: ['C4', 'A1', 'A2', 'A3', 'B4', 'D6'],
  4: ['A1', 'A2', 'A3', 'A4', 'B1', 'C1'],
  5: ['H10', 'H11', 'H12', 'A1', 'A2', 'B2'],
  6: ['A1', 'B1', 'C1', 'D1', 'E1', 'F1'],
  7: ['A1', 'A2', 'B3', 'C5', 'D7', 'F5', 'F6'],
  8: ['A1', 'A2', 'A3', 'B4', 'C5'],
  9: ['A1', 'B1', 'C1', 'D1'],
  10: ['A2', 'B2', 'C2', 'D2'],
  11: [],
  12: ['A1', 'A2', 'A3']
};

export const getInitialReservedSeatCodes = (scheduleId: number): string[] => reservedSeatMap[scheduleId] ?? [];

export const resolveSeatType = (row: string, number: number): SeatType => {
  if (row === 'A' && number >= 5 && number <= 8) {
    return 'PREMIUM';
  }

  if (row === 'J' && number >= 4 && number <= 9) {
    return 'COUPLE';
  }

  return 'STANDARD';
};

export const resolveSeatPrice = (schedulePrice: number, seatType: SeatType): number => {
  if (seatType === 'PREMIUM') {
    return schedulePrice + 3000;
  }

  if (seatType === 'COUPLE') {
    return schedulePrice + 5000;
  }

  return schedulePrice;
};

export const createSeatsForSchedule = (scheduleId: number, reservedSeatCodes: string[] = []): Seat[] => {
  const schedule = schedules.find((item) => item.id === scheduleId);
  const price = schedule?.price ?? 15000;
  const reservedCodes = new Set([...getInitialReservedSeatCodes(scheduleId), ...reservedSeatCodes]);
  const rows = Array.from({ length: 10 }, (_, index) => String.fromCharCode(65 + index));

  return rows.flatMap((row) =>
    Array.from({ length: 12 }, (_, index) => {
      const number = index + 1;
      const code = `${row}${number}`;
      const type = resolveSeatType(row, number);

      return {
        code,
        row,
        number,
        type,
        reserved: reservedCodes.has(code),
        held: false,
        price: resolveSeatPrice(price, type)
      };
    })
  );
};
