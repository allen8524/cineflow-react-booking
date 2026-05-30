import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { initialBookings } from '../data/bookings';
import { movies as fallbackMovies, schedules, screens, theaters } from '../data/movies';
import { createSeatsForSchedule } from '../data/seats';
import { fetchMoviesFromTmdb } from '../services/tmdb';
import type { Booking, BookingDraft, Movie, PaymentMethod, PersonCounts } from '../types/cineflow';
import { createBookingCode } from '../utils/format';

interface BookingContextValue {
  draft: BookingDraft;
  bookings: Booking[];
  movies: Movie[];
  isMovieApiLoading: boolean;
  movieApiError: string | null;
  isLoggedIn: boolean;
  loginUserName: string;
  totalPeople: number;
  selectedMovie: Movie | undefined;
  selectedSchedule: (typeof schedules)[number] | undefined;
  selectedScreen: (typeof screens)[number] | undefined;
  selectedTheater: (typeof theaters)[number] | undefined;
  selectedSeatsTotal: number;
  setMovie: (movieId: number) => void;
  setSchedule: (scheduleId: number) => void;
  setPeopleCount: (type: keyof PersonCounts, value: number) => void;
  toggleSeat: (seatCode: string) => { ok: boolean; message?: string };
  clearSeats: () => void;
  setCustomer: (name: string, phone: string) => void;
  setPaymentMethod: (method: PaymentMethod) => void;
  createBooking: (customerOverride?: { name: string; phone: string }) => Booking | null;
  cancelBooking: (bookingCode: string, reason: string) => void;
  login: (name: string) => void;
  logout: () => void;
  resetDraft: () => void;
}

const initialDraft: BookingDraft = {
  movieId: 1,
  scheduleId: 1,
  peopleCounts: {
    adult: 1,
    teen: 0,
    senior: 0
  },
  selectedSeats: [],
  customerName: '김민서',
  customerPhone: '010-1234-5678',
  paymentMethod: 'CARD'
};

const BookingContext = createContext<BookingContextValue | null>(null);

const readBookingsFromStorage = (): Booking[] => {
  const stored = window.localStorage.getItem('cineflow-bookings');
  if (!stored) {
    return initialBookings;
  }

  try {
    return JSON.parse(stored) as Booking[];
  } catch {
    return initialBookings;
  }
};

const readDraftFromStorage = (): BookingDraft => {
  const stored = window.localStorage.getItem('cineflow-draft');
  if (!stored) {
    return initialDraft;
  }

  try {
    return { ...initialDraft, ...(JSON.parse(stored) as BookingDraft) };
  } catch {
    return initialDraft;
  }
};

export const BookingProvider = ({ children }: { children: ReactNode }) => {
  const [draft, setDraft] = useState<BookingDraft>(readDraftFromStorage);
  const [bookings, setBookings] = useState<Booking[]>(readBookingsFromStorage);
  const [movies, setMovies] = useState<Movie[]>(fallbackMovies);
  const [isMovieApiLoading, setIsMovieApiLoading] = useState(true);
  const [movieApiError, setMovieApiError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(() => window.localStorage.getItem('cineflow-login') === 'true');
  const [loginUserName, setLoginUserName] = useState(() => window.localStorage.getItem('cineflow-user-name') ?? '김민서');

  const totalPeople = useMemo(
    () => draft.peopleCounts.adult + draft.peopleCounts.teen + draft.peopleCounts.senior,
    [draft.peopleCounts]
  );

  const selectedMovie = useMemo(() => movies.find((movie) => movie.id === draft.movieId), [draft.movieId, movies]);
  const selectedSchedule = useMemo(() => schedules.find((schedule) => schedule.id === draft.scheduleId), [draft.scheduleId]);
  const selectedScreen = useMemo(
    () => screens.find((screen) => screen.id === selectedSchedule?.screenId),
    [selectedSchedule]
  );
  const selectedTheater = useMemo(
    () => theaters.find((theater) => theater.id === selectedScreen?.theaterId),
    [selectedScreen]
  );

  const selectedSeatsTotal = useMemo(() => {
    if (!selectedSchedule) {
      return 0;
    }

    const seats = createSeatsForSchedule(selectedSchedule.id);
    return draft.selectedSeats.reduce((sum, seatCode) => {
      const seat = seats.find((item) => item.code === seatCode);
      return sum + (seat?.price ?? selectedSchedule.price);
    }, 0);
  }, [draft.selectedSeats, selectedSchedule]);

  useEffect(() => {
    let isMounted = true;

    const loadMovies = async () => {
      try {
        const apiMovies = await fetchMoviesFromTmdb();

        if (!isMounted) {
          return;
        }

        if (apiMovies) {
          setMovies(apiMovies);
          setMovieApiError(null);
        } else {
          setMovies(fallbackMovies);
          setMovieApiError('TMDB API 키가 없어 기본 영화 데이터를 표시합니다.');
        }
      } catch {
        if (isMounted) {
          setMovies(fallbackMovies);
          setMovieApiError('TMDB API 호출에 실패해 기본 영화 데이터를 표시합니다.');
        }
      } finally {
        if (isMounted) {
          setIsMovieApiLoading(false);
        }
      }
    };

    loadMovies();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    window.localStorage.setItem('cineflow-draft', JSON.stringify(draft));
  }, [draft]);

  useEffect(() => {
    window.localStorage.setItem('cineflow-bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    window.localStorage.setItem('cineflow-login', String(isLoggedIn));
    window.localStorage.setItem('cineflow-user-name', loginUserName);
  }, [isLoggedIn, loginUserName]);

  const setMovie = (movieId: number) => {
    const firstSchedule = schedules.find((schedule) => schedule.movieId === movieId);
    setDraft((prev) => ({
      ...prev,
      movieId,
      scheduleId: firstSchedule?.id ?? null,
      selectedSeats: []
    }));
  };

  const setSchedule = (scheduleId: number) => {
    const schedule = schedules.find((item) => item.id === scheduleId);
    setDraft((prev) => ({
      ...prev,
      movieId: schedule?.movieId ?? prev.movieId,
      scheduleId,
      selectedSeats: []
    }));
  };

  const setPeopleCount = (type: keyof PersonCounts, value: number) => {
    setDraft((prev) => {
      const nextCounts = {
        ...prev.peopleCounts,
        [type]: Math.max(0, value)
      };
      const nextTotal = nextCounts.adult + nextCounts.teen + nextCounts.senior;
      return {
        ...prev,
        peopleCounts: nextCounts,
        selectedSeats: prev.selectedSeats.slice(0, nextTotal)
      };
    });
  };

  const toggleSeat = (seatCode: string) => {
    if (totalPeople <= 0) {
      return { ok: false, message: '관람 인원을 먼저 선택해 주세요.' };
    }

    if (!selectedSchedule) {
      return { ok: false, message: '상영 시간을 먼저 선택해 주세요.' };
    }

    const seats = createSeatsForSchedule(selectedSchedule.id);
    const seat = seats.find((item) => item.code === seatCode);
    if (!seat || seat.reserved) {
      return { ok: false, message: '선택할 수 없는 좌석입니다.' };
    }

    if (draft.selectedSeats.includes(seatCode)) {
      setDraft((prev) => ({
        ...prev,
        selectedSeats: prev.selectedSeats.filter((item) => item !== seatCode)
      }));
      return { ok: true };
    }

    if (draft.selectedSeats.length >= totalPeople) {
      return { ok: false, message: '선택한 인원 수만큼만 좌석을 선택할 수 있습니다.' };
    }

    setDraft((prev) => ({
      ...prev,
      selectedSeats: [...prev.selectedSeats, seatCode].sort((left, right) => left.localeCompare(right, 'ko'))
    }));
    return { ok: true };
  };

  const clearSeats = () => {
    setDraft((prev) => ({ ...prev, selectedSeats: [] }));
  };

  const setCustomer = (name: string, phone: string) => {
    setDraft((prev) => ({ ...prev, customerName: name, customerPhone: phone }));
  };

  const setPaymentMethod = (method: PaymentMethod) => {
    setDraft((prev) => ({ ...prev, paymentMethod: method }));
  };

  const createBooking = (customerOverride?: { name: string; phone: string }) => {
    if (!selectedMovie || !selectedSchedule || !selectedScreen || !selectedTheater) {
      return null;
    }

    if (draft.selectedSeats.length !== totalPeople || totalPeople <= 0) {
      return null;
    }

    const booking: Booking = {
      id: Date.now(),
      bookingCode: createBookingCode(selectedSchedule.startTime),
      customerName: customerOverride?.name ?? draft.customerName,
      customerPhone: customerOverride?.phone ?? draft.customerPhone,
      movieTitle: selectedMovie.title,
      posterUrl: selectedMovie.posterUrl,
      ageRating: selectedMovie.ageRating,
      theaterName: selectedTheater.name,
      screenName: selectedScreen.name,
      screenType: selectedScreen.screenType,
      seatNames: draft.selectedSeats.join(', '),
      peopleCount: totalPeople,
      totalPrice: selectedSeatsTotal,
      startTime: selectedSchedule.startTime,
      endTime: selectedSchedule.endTime,
      status: 'BOOKED',
      paymentMethod: draft.paymentMethod,
      createdAt: new Date().toISOString()
    };

    setBookings((prev) => [booking, ...prev]);
    return booking;
  };

  const cancelBooking = (bookingCode: string, reason: string) => {
    setBookings((prev) =>
      prev.map((booking) =>
        booking.bookingCode === bookingCode
          ? { ...booking, status: 'CANCELED', cancelReason: reason || '사용자 요청' }
          : booking
      )
    );
  };

  const login = (name: string) => {
    setIsLoggedIn(true);
    setLoginUserName(name || '김민서');
    setCustomer(name || '김민서', draft.customerPhone);
  };

  const logout = () => {
    setIsLoggedIn(false);
  };

  const resetDraft = () => {
    setDraft(initialDraft);
  };

  const value: BookingContextValue = {
    draft,
    bookings,
    movies,
    isMovieApiLoading,
    movieApiError,
    isLoggedIn,
    loginUserName,
    totalPeople,
    selectedMovie,
    selectedSchedule,
    selectedScreen,
    selectedTheater,
    selectedSeatsTotal,
    setMovie,
    setSchedule,
    setPeopleCount,
    toggleSeat,
    clearSeats,
    setCustomer,
    setPaymentMethod,
    createBooking,
    cancelBooking,
    login,
    logout,
    resetDraft
  };

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used inside BookingProvider');
  }

  return context;
};
