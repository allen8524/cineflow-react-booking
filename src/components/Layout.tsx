import { Link, Outlet } from 'react-router-dom';
import Header from './Header';

const Layout = () => {
  return (
    <>
      <Header />
      <Outlet />
      <footer className="ht-footer full-width-ft cinema-footer storefront-footer">
        <div className="container">
          <div className="storefront-footer__grid">
            <div className="storefront-footer__brand">
              <Link to="/" className="storefront-footer__logo">
                <img className="logo" src="/images/logo1.png" alt="CineFlow" />
              </Link>
              <p className="storefront-footer__headline">CineFlow CINEMA</p>
              <p>서울 강남구 시네마로 100, 4층</p>
              <p>대표번호 1544-0000</p>
              <p>help@cineflow.co.kr</p>
            </div>

            <div className="storefront-footer__menu">
              <h4>예매 서비스</h4>
              <ul>
                <li><Link to="/movies">영화</Link></li>
                <li><Link to="/booking">빠른예매</Link></li>
                <li><Link to="/history">예매내역</Link></li>
                <li><Link to="/support">고객센터</Link></li>
              </ul>
            </div>

            <div className="storefront-footer__menu">
              <h4>이용 안내</h4>
              <ul>
                <li><Link to="/support#faq">자주 묻는 질문</Link></li>
                <li><Link to="/support#cancel-policy">취소 · 환불 안내</Link></li>
                <li><Link to="/support#inquiry">1:1 문의</Link></li>
                <li><Link to="/support#group">단체 · 대관 문의</Link></li>
              </ul>
            </div>

            <div className="storefront-footer__menu">
              <h4>바로가기</h4>
              <ul>
                <li><Link to="/booking">빠른예매</Link></li>
                <li><Link to="/movies">현재 상영작</Link></li>
                <li><Link to="/admin">관리자 대시보드</Link></li>
                <li><Link to="/support">고객지원</Link></li>
              </ul>
            </div>
          </div>

          <div className="storefront-footer__bottom">
            <p>© 2026 CineFlow. All rights reserved.</p>
            <Link to="/">맨 위로</Link>
          </div>

          <div className="cinema-footer-attribution">
            <p>영화 탐색부터 좌석 예매, 결제, 예매내역 확인까지 CineFlow에서 편리하게 이용하세요.</p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Layout;
