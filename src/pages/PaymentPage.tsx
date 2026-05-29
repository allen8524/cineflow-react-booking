import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import BookingSummary from '../components/BookingSummary';
import { useBooking } from '../context/BookingContext';
import type { PaymentMethod } from '../types/cineflow';
import { formatCurrency, paymentMethodLabel } from '../utils/format';

const paymentMethods: PaymentMethod[] = ['CARD', 'KAKAO_PAY', 'NAVER_PAY', 'TOSS', 'BANK_TRANSFER'];

const PaymentPage = () => {
  const navigate = useNavigate();
  const { draft, totalPeople, selectedSeatsTotal, setCustomer, setPaymentMethod, createBooking } = useBooking();
  const [name, setName] = useState(draft.customerName);
  const [phone, setPhone] = useState(draft.customerPhone);
  const [error, setError] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setError('예매자 이름과 연락처를 입력해 주세요.');
      return;
    }
    if (totalPeople <= 0 || draft.selectedSeats.length !== totalPeople) {
      setError('선택한 인원 수와 좌석 수가 일치해야 합니다.');
      return;
    }

    setCustomer(name.trim(), phone.trim());
    const booking = createBooking({ name: name.trim(), phone: phone.trim() });
    if (!booking) {
      setError('예매 정보를 생성할 수 없습니다. 빠른예매 화면에서 선택 정보를 확인해 주세요.');
      return;
    }

    navigate(`/complete?code=${booking.bookingCode}`);
  };

  return (
    <main className="booking-page cinema-page">
      <section className="cinema-page-hero booking-hero payment-hero">
        <div className="container">
          <div className="booking-hero__intro">
            <div>
              <h1>결제 정보 입력</h1>
              <p>선택한 영화, 상영 시간, 좌석 정보를 확인하고 결제 수단을 선택합니다.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="cinema-page-body">
        <div className="container">
          <ol className="booking-stepper">
            <li className="is-complete"><span>1</span><strong>영화/시간</strong></li>
            <li className="is-complete"><span>2</span><strong>인원/좌석</strong></li>
            <li className="is-active"><span>3</span><strong>결제</strong></li>
            <li><span>4</span><strong>완료</strong></li>
          </ol>

          <div className="booking-layout payment-layout">
            <form id="payment-form" className="booking-panel payment-form" onSubmit={handleSubmit}>
              <div className="panel-head"><h2>예매자 정보</h2></div>
              <div className="inline-field-grid form-grid">
                <label className="inline-field">
                  <span>이름</span>
                  <input value={name} onChange={(event) => setName(event.target.value)} placeholder="예매자 이름" />
                </label>
                <label className="inline-field">
                  <span>연락처</span>
                  <input value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="010-0000-0000" />
                </label>
              </div>

              <div className="payment-block">
                <h3>결제 수단</h3>
                <div className="method-grid payment-method-grid">
                  {paymentMethods.map((method) => (
                    <label className={`method-card ${draft.paymentMethod === method ? 'is-active' : ''}`} key={method}>
                      <input type="radio" name="paymentMethod" value={method} checked={draft.paymentMethod === method} onChange={() => setPaymentMethod(method)} />
                      <span>{paymentMethodLabel(method)}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="amount-total">
                <span>최종 결제 금액</span>
                <strong>{formatCurrency(selectedSeatsTotal)}</strong>
              </div>

              {error ? <p className="booking-feedback-banner">{error}</p> : null}

              <div className="hero-actions payment-actions">
                <Link to="/booking" className="hero-btn secondary">좌석 다시 선택</Link>
                <button type="submit" className="hero-btn primary">결제 완료</button>
              </div>
            </form>

            <BookingSummary showAction={false} />
          </div>
        </div>
      </section>
    </main>
  );
};

export default PaymentPage;
