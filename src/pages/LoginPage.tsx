import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useBooking();
  const [id, setId] = useState('admin');
  const [password, setPassword] = useState('1234');
  const [name, setName] = useState('김민서');
  const [error, setError] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (id !== 'admin' || password !== '1234') {
      setError('고정 로그인 정보는 admin / 1234 입니다.');
      return;
    }
    login(name);
    navigate('/booking');
  };

  return (
    <main className="cinema-page booking-page">
      <section className="cinema-page-hero booking-hero">
        <div className="container">
          <h1>로그인</h1>
          <p>관리자와 예매자 정보를 확인한 뒤 서비스를 이용할 수 있습니다. ID: admin, PW: 1234</p>
        </div>
      </section>
      <section className="cinema-page-body">
        <div className="container auth-page-container">
          <form className="booking-panel auth-form" onSubmit={handleSubmit}>
            <div className="panel-head"><h2>계정 확인</h2></div>
            <label className="inline-field"><span>아이디</span><input value={id} onChange={(event) => setId(event.target.value)} /></label>
            <label className="inline-field"><span>비밀번호</span><input type="password" value={password} onChange={(event) => setPassword(event.target.value)} /></label>
            <label className="inline-field"><span>예매자 이름</span><input value={name} onChange={(event) => setName(event.target.value)} /></label>
            {error ? <p className="booking-feedback-banner">{error}</p> : null}
            <button type="submit" className="hero-btn primary auth-submit">로그인</button>
          </form>
        </div>
      </section>
    </main>
  );
};

export default LoginPage;
