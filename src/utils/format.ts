import type { BookingStatus, PaymentMethod } from '../types/cineflow';

export const formatCurrency = (value: number): string => `${value.toLocaleString('ko-KR')}원`;

export const formatDateTime = (value: string): string => {
  const date = new Date(value);
  return new Intl.DateTimeFormat('ko-KR', {
    month: '2-digit',
    day: '2-digit',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

export const formatDate = (value: string): string => {
  const date = new Date(value);
  if (!value || Number.isNaN(date.getTime())) {
    return '미정';
  }

  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(date);
};

export const paymentMethodLabel = (method: PaymentMethod): string => {
  const labels: Record<PaymentMethod, string> = {
    CARD: '신용/체크카드',
    KAKAO_PAY: '카카오페이',
    NAVER_PAY: '네이버페이',
    TOSS: '토스페이',
    BANK_TRANSFER: '무통장입금'
  };

  return labels[method];
};

export const bookingStatusLabel = (status: BookingStatus): string => {
  const labels: Record<BookingStatus, string> = {
    BOOKED: '예매완료',
    USED: '관람완료',
    CANCELED: '취소완료'
  };

  return labels[status];
};

export const createBookingCode = (startTime: string): string => {
  const date = new Date(startTime);
  const datePart = new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })
    .format(date)
    .replace(/\D/g, '')
    .slice(0, 12);
  const randomPart = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `CF${datePart}-${randomPart}`;
};
