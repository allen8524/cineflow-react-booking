import { Link } from 'react-router-dom';

const ErrorPage = () => {
  return (
    <main className="cinema-page booking-page">
      <section className="cinema-page-hero booking-hero">
        <div className="container">
          <span className="section-chip">404</span>
          <h1>접속할 수 없는 URL입니다.</h1>
          <p>요청한 페이지를 찾을 수 없습니다. 홈 또는 빠른예매 화면으로 이동해 주세요.</p>
          <div className="hero-actions">
            <Link to="/" className="hero-btn primary">Home으로 이동</Link>
            <Link to="/booking" className="hero-btn secondary">좌석 예매</Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ErrorPage;
