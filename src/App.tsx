import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import ScrollToTop from './components/ScrollToTop';
import { BookingProvider, useBooking } from './context/BookingContext';
import AdminPage from './pages/AdminPage';
import BookingPage from './pages/BookingPage';
import CompletePage from './pages/CompletePage';
import ErrorPage from './pages/ErrorPage';
import HistoryPage from './pages/HistoryPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import MovieDetailPage from './pages/MovieDetailPage';
import MovieListPage from './pages/MovieListPage';
import PaymentPage from './pages/PaymentPage';
import SupportPage from './pages/SupportPage';

const MemberRoute = ({ children }: { children: JSX.Element }) => {
  const { isLoggedIn } = useBooking();
  return isLoggedIn ? children : <Navigate to="/login" replace />;
};

const AdminRoute = ({ children }: { children: JSX.Element }) => {
  const { isAdmin } = useBooking();
  return isAdmin ? children : <Navigate to="/" replace />;
};

const App = () => {
  return (
    <BrowserRouter>
      <BookingProvider>
        <ScrollToTop />
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/movies" element={<MovieListPage />} />
            <Route path="/movies/:id" element={<MovieDetailPage />} />
            <Route path="/booking" element={<MemberRoute><BookingPage /></MemberRoute>} />
            <Route path="/payment" element={<MemberRoute><PaymentPage /></MemberRoute>} />
            <Route path="/complete" element={<MemberRoute><CompletePage /></MemberRoute>} />
            <Route path="/history" element={<MemberRoute><HistoryPage /></MemberRoute>} />
            <Route path="/booking/history" element={<MemberRoute><HistoryPage /></MemberRoute>} />
            <Route path="/support" element={<SupportPage />} />
            <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/index.html" element={<Navigate to="/" replace />} />
            <Route path="*" element={<ErrorPage />} />
          </Route>
        </Routes>
      </BookingProvider>
    </BrowserRouter>
  );
};

export default App;
