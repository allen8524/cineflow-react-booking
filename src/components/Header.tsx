import { Link, NavLink } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';

const navLinkClass = ({ isActive }: { isActive: boolean }) => `btn btn-default lv1${isActive ? ' active' : ''}`;

const Header = () => {
  const { isLoggedIn, loginUserName, logout } = useBooking();

  return (
    <header className="ht-header full-width-hd cinema-header storefront-header">
      <div className="storefront-header__utility">
        <div className="container">
          <div className="storefront-header__utility-inner">
            <p className="storefront-header__utility-copy">영화 탐색부터 예매 완료까지 한 흐름으로 이어지는 CineFlow 시네마 서비스</p>
            <div className="storefront-header__utility-links">
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <nav id="mainNav" className="navbar navbar-default navbar-custom storefront-navbar">
          <div className="navbar-header logo storefront-brand-shell">
            <Link to="/" className="cinema-brand-mark storefront-brand" aria-label="CineFlow 홈">
              <img className="logo" src="/images/logo-header.png" alt="CineFlow" width="190" height="54" />
            </Link>
          </div>

          <div className="collapse navbar-collapse storefront-navbar__collapse" id="bs-example-navbar-collapse-1">
            <div className="storefront-navbar__content">
              <ul className="nav navbar-nav flex-child-menu menu-left storefront-primary-nav">
                <li><NavLink to="/movies" className={navLinkClass}>영화</NavLink></li>
                <li><NavLink to="/booking" className={navLinkClass}>빠른예매</NavLink></li>
                <li><NavLink to="/history" className={navLinkClass}>예매내역</NavLink></li>
                <li><NavLink to="/support" className={navLinkClass}>고객센터</NavLink></li>
                <li><NavLink to="/admin" className={navLinkClass}>관리자</NavLink></li>
              </ul>

              <ul className="nav navbar-nav flex-child-menu menu-right">
                {isLoggedIn ? (
                  <li>
                    <button type="button" className="auth-inline-button menu-link" onClick={logout}>{loginUserName} 로그아웃</button>
                  </li>
                ) : (
                  <li><NavLink to="/login" className="menu-cta">로그인</NavLink></li>
                )}
              </ul>
            </div>
          </div>
        </nav>
      </div>


    </header>
  );
};

export default Header;
