import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import { BookingProvider } from './context/BookingContext';
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

const App = () => {
  return (
    <BrowserRouter>
      <BookingProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/movies" element={<MovieListPage />} />
            <Route path="/movies/:id" element={<MovieDetailPage />} />
            <Route path="/booking" element={<BookingPage />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/complete" element={<CompletePage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/booking/history" element={<HistoryPage />} />
            <Route path="/support" element={<SupportPage />} />
            <Route path="/admin" element={<AdminPage />} />
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
