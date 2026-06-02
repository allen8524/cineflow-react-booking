export type MovieStatus = 'NOW_SHOWING' | 'COMING_SOON';
export type SeatType = 'STANDARD' | 'PREMIUM' | 'COUPLE';
export type BookingStatus = 'BOOKED' | 'USED' | 'CANCELED';
export type PaymentMethod = 'CARD' | 'KAKAO_PAY' | 'NAVER_PAY' | 'TOSS' | 'BANK_TRANSFER';
export type UserRole = 'USER' | 'ADMIN';

export interface Movie {
  id: number;
  tmdbId: number;
  title: string;
  shortDescription: string;
  description: string;
  genre: string;
  ageRating: string;
  runningTime: number;
  posterUrl: string;
  backdropUrl?: string;
  bookingRate: number;
  popularity?: number;
  score: number;
  releaseDate: string;
  status: MovieStatus;
  bookingOpen: boolean;
}

export interface Theater {
  id: number;
  name: string;
  location: string;
  region: string;
  description: string;
}

export interface Screen {
  id: number;
  theaterId: number;
  name: string;
  screenType: string;
  totalSeats: number;
}

export interface Schedule {
  id: number;
  movieId: number;
  screenId: number;
  startTime: string;
  endTime: string;
  price: number;
  availableSeats: number;
  active: boolean;
}

export interface Seat {
  code: string;
  row: string;
  number: number;
  type: SeatType;
  reserved: boolean;
  held: boolean;
  price: number;
}

export interface PersonCounts {
  adult: number;
  teen: number;
  senior: number;
}

export interface BookingDraft {
  movieId: number | null;
  scheduleId: number | null;
  peopleCounts: PersonCounts;
  selectedSeats: string[];
  customerName: string;
  customerPhone: string;
  paymentMethod: PaymentMethod;
}

export interface Booking {
  id: number;
  bookingCode: string;
  scheduleId?: number;
  customerName: string;
  customerPhone: string;
  movieTitle: string;
  posterUrl: string;
  ageRating: string;
  theaterName: string;
  screenName: string;
  screenType: string;
  seatNames: string;
  peopleCount: number;
  totalPrice: number;
  startTime: string;
  endTime: string;
  status: BookingStatus;
  paymentMethod: PaymentMethod;
  createdAt: string;
  cancelReason?: string;
}

export interface UserAccount {
  id: string;
  passcode: string;
  name: string;
  phone: string;
  role: UserRole;
  createdAt: string;
}
