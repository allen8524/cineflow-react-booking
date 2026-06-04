import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHero from '../components/PageHero';
import { useBooking } from '../context/BookingContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, register } = useBooking();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [id, setId] = useState('user');
  const [passcode, setPasscode] = useState('1234');
  const [name, setName] = useState('일반회원');
  const [phone, setPhone] = useState('010-1111-2222');
  const [error, setError] = useState('');

  const handleLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = login(id, passcode);

    if (!result.ok) {
      setError(result.message ?? '로그인에 실패했습니다.');
      return;
    }

    navigate(result.user?.role === 'ADMIN' ? '/admin' : '/booking');
  };

  const handleRegister = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = register({ id, passcode, name, phone });

    if (!result.ok) {
      setError(result.message ?? '회원가입에 실패했습니다.');
      return;
    }

    navigate('/booking');
  };

  const switchMode = (nextMode: typeof mode) => {
    setMode(nextMode);
    setError('');
  };

  return (
    <main className="auth-page booking-page cinema-page">
      <PageHero
        className="booking-hero login-hero"
        title={mode === 'login' ? '로그인' : '회원가입'}
        description="회원은 예매 서비스를 이용할 수 있고, 관리자 계정은 관리자 페이지에 접근할 수 있습니다."
        actions={(
          <div className="auth-mode-tabs">
            <button type="button" className={mode === 'login' ? 'is-active' : ''} onClick={() => switchMode('login')}>로그인</button>
            <button type="button" className={mode === 'register' ? 'is-active' : ''} onClick={() => switchMode('register')}>회원가입</button>
          </div>
        )}
      />
      <section className="cinema-page-body">
        <div className="container auth-page-container">
          <form className="booking-panel auth-form" onSubmit={mode === 'login' ? handleLogin : handleRegister}>
            <div className="panel-head"><h2>{mode === 'login' ? '계정 확인' : '새 회원 등록'}</h2></div>
            <div className="demo-account-note">
              <strong>테스트 계정</strong>
              <span>일반 user / 1234 · 관리자 admin / 1234</span>
            </div>
            <label className="inline-field"><span>아이디</span><input value={id} onChange={(event) => setId(event.target.value)} /></label>
            <label className="inline-field"><span>비밀번호</span><input type="password" value={passcode} onChange={(event) => setPasscode(event.target.value)} /></label>
            {mode === 'register' ? (
              <>
                <label className="inline-field"><span>이름</span><input value={name} onChange={(event) => setName(event.target.value)} /></label>
                <label className="inline-field"><span>연락처</span><input value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="010-0000-0000" /></label>
              </>
            ) : null}
            {error ? <p className="booking-feedback-banner">{error}</p> : null}
            <button type="submit" className="hero-btn primary auth-submit">{mode === 'login' ? '로그인' : '회원가입'}</button>
          </form>
        </div>
      </section>
    </main>
  );
};

export default LoginPage;
