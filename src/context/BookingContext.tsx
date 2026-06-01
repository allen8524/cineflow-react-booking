import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { initialBookings } from '../data/bookings';
import { movies as fallbackMovies, schedules, screens, theaters } from '../data/movies';
import { createSeatsForSchedule } from '../data/seats';
import { fetchMoviesFromTmdb } from '../services/tmdb';
import type { Booking, BookingDraft, Movie, PaymentMethod, PersonCounts, UserAccount } from '../types/cineflow';
import { createBookingCode } from '../utils/format';

interface BookingContextValue {
  draft: BookingDraft;
  bookings: Booking[];
  movies: Movie[];
  isMovieApiLoading: boolean;
  movieApiError: string | null;
  isLoggedIn: boolean;
  isAdmin: boolean;
  loginUserName: string;
  currentUser: UserAccount | null;
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
  login: (id: string, passcode: string) => { ok: boolean; message?: string; user?: UserAccount };
  register: (account: Omit<UserAccount, 'role' | 'createdAt'>) => { ok: boolean; message?: string; user?: UserAccount };
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
  customerName: '',
  customerPhone: '',
  paymentMethod: 'CARD'
};

const defaultAccounts: UserAccount[] = [
  {
    id: 'admin',
    passcode: '1234',
    name: '관리자',
    phone: '010-0000-0000',
    role: 'ADMIN',
    createdAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'user',
    passcode: '1234',
    name: '일반회원',
    phone: '010-1111-2222',
    role: 'USER',
    createdAt: '2026-01-01T00:00:00.000Z'
  }
];

const BookingContext = createContext<BookingContextValue | null>(null);

const parseSeatNames = (seatNames: string): string[] =>
  seatNames
    .split(',')
    .map((seatName) => seatName.trim())
    .filter(Boolean);

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

const readAccountsFromStorage = (): UserAccount[] => {
  const stored = window.localStorage.getItem('cineflow-accounts');
  if (!stored) {
    return defaultAccounts;
  }

  try {
    const parsedAccounts = JSON.parse(stored) as UserAccount[];
    const hasAdmin = parsedAccounts.some((account) => account.id === 'admin');
    return hasAdmin ? parsedAccounts : [...defaultAccounts, ...parsedAccounts];
  } catch {
    return defaultAccounts;
  }
};

const readCurrentUserFromStorage = (accounts: UserAccount[]) => {
  const currentUserId = window.localStorage.getItem('cineflow-current-user-id');
  return accounts.find((account) => account.id === currentUserId) ?? null;
};

export const BookingProvider = ({ children }: { children: ReactNode }) => {
  const [draft, setDraft] = useState<BookingDraft>(readDraftFromStorage);
  const [bookings, setBookings] = useState<Booking[]>(readBookingsFromStorage);
  const [movies, setMovies] = useState<Movie[]>(fallbackMovies);
  const [accounts, setAccounts] = useState<UserAccount[]>(readAccountsFromStorage);
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => readCurrentUserFromStorage(readAccountsFromStorage()));
  const [isMovieApiLoading, setIsMovieApiLoading] = useState(true);
  const [movieApiError, setMovieApiError] = useState<string | null>(null);

  const isLoggedIn = Boolean(currentUser);
  const isAdmin = currentUser?.role === 'ADMIN';
  const loginUserName = currentUser?.name ?? '';

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

  const getBookedSeatCodesForSchedule = useCallback((scheduleId: number): string[] => {
    const schedule = schedules.find((item) => item.id === scheduleId);

    return bookings
      .filter((booking) => {
        if (booking.status !== 'BOOKED') {
          return false;
        }

        if (booking.scheduleId) {
          return booking.scheduleId === scheduleId;
        }

        return schedule ? booking.startTime === schedule.startTime && booking.endTime === schedule.endTime : false;
      })
      .flatMap((booking) => parseSeatNames(booking.seatNames));
  }, [bookings]);

  const selectedSeatsTotal = useMemo(() => {
    if (!selectedSchedule) {
      return 0;
    }

    const seats = createSeatsForSchedule(selectedSchedule.id, getBookedSeatCodesForSchedule(selectedSchedule.id));
    return draft.selectedSeats.reduce((sum, seatCode) => {
      const seat = seats.find((item) => item.code === seatCode);
      return sum + (seat?.price ?? selectedSchedule.price);
    }, 0);
  }, [draft.selectedSeats, getBookedSeatCodesForSchedule, selectedSchedule]);

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
    window.localStorage.setItem('cineflow-accounts', JSON.stringify(accounts));
  }, [accounts]);

  useEffect(() => {
    if (currentUser) {
      window.localStorage.setItem('cineflow-current-user-id', currentUser.id);
      setCustomer(currentUser.name, currentUser.phone);
    } else {
      window.localStorage.removeItem('cineflow-current-user-id');
    }
  }, [currentUser]);

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

    const bookedSeatCodes = getBookedSeatCodesForSchedule(selectedSchedule.id);
    const seats = createSeatsForSchedule(selectedSchedule.id, bookedSeatCodes);
    const seat = seats.find((item) => item.code === seatCode);
    if (!seat || seat.reserved) {
      return { ok: false, message: '이미 예매되었거나 선택할 수 없는 좌석입니다.' };
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
    if (!currentUser) {
      return null;
    }

    if (!selectedMovie || !selectedSchedule || !selectedScreen || !selectedTheater) {
      return null;
    }

    if (draft.selectedSeats.length !== totalPeople || totalPeople <= 0) {
      return null;
    }

    const bookedSeatCodes = new Set(getBookedSeatCodesForSchedule(selectedSchedule.id));
    if (draft.selectedSeats.some((seatCode) => bookedSeatCodes.has(seatCode))) {
      return null;
    }

    const booking: Booking = {
      id: Date.now(),
      bookingCode: createBookingCode(selectedSchedule.startTime),
      scheduleId: selectedSchedule.id,
      customerName: customerOverride?.name ?? currentUser.name,
      customerPhone: customerOverride?.phone ?? currentUser.phone,
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

  const login = (id: string, passcode: string) => {
    const user = accounts.find((account) => account.id === id.trim() && account.passcode === passcode);

    if (!user) {
      return { ok: false, message: '아이디 또는 비밀번호를 확인해 주세요.' };
    }

    setCurrentUser(user);
    return { ok: true, user };
  };

  const register = (account: Omit<UserAccount, 'role' | 'createdAt'>) => {
    const nextId = account.id.trim();

    if (!nextId || !account.passcode.trim() || !account.name.trim() || !account.phone.trim()) {
      return { ok: false, message: '회원가입 정보를 모두 입력해 주세요.' };
    }

    if (accounts.some((user) => user.id === nextId)) {
      return { ok: false, message: '이미 사용 중인 아이디입니다.' };
    }

    const user: UserAccount = {
      ...account,
      id: nextId,
      name: account.name.trim(),
      phone: account.phone.trim(),
      role: 'USER',
      createdAt: new Date().toISOString()
    };

    setAccounts((prev) => [user, ...prev]);
    setCurrentUser(user);
    return { ok: true, user };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const resetDraft = () => {
    setDraft((prev) => ({ ...initialDraft, movieId: prev.movieId, scheduleId: prev.scheduleId }));
  };

  const value: BookingContextValue = {
    draft,
    bookings,
    movies,
    isMovieApiLoading,
    movieApiError,
    isLoggedIn,
    isAdmin,
    loginUserName,
    currentUser,
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
    register,
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
