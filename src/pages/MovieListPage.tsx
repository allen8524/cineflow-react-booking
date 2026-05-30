import { useMemo, useState } from 'react';
import MovieCard from '../components/MovieCard';
import PageHero from '../components/PageHero';
import { useBooking } from '../context/BookingContext';

const MOVIES_PER_PAGE = 12;

const MovieListPage = () => {
  const { movies, isMovieApiLoading, movieApiError } = useBooking();
  const [keyword, setKeyword] = useState('');
  const [status, setStatus] = useState<'ALL' | 'NOW_SHOWING' | 'COMING_SOON'>('ALL');
  const [sort, setSort] = useState<'popularity' | 'score' | 'release'>('popularity');
  const [page, setPage] = useState(1);

  const filteredMovies = useMemo(() => {
    return [...movies]
      .filter((movie) => status === 'ALL' || movie.status === status)
      .filter((movie) => movie.title.includes(keyword) || movie.genre.includes(keyword))
      .sort((a, b) => {
        if (sort === 'score') return b.score - a.score;
        if (sort === 'release') return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
        return (b.popularity ?? b.bookingRate) - (a.popularity ?? a.bookingRate);
      });
  }, [keyword, movies, status, sort]);

  const totalPages = Math.max(1, Math.ceil(filteredMovies.length / MOVIES_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const pagedMovies = filteredMovies.slice((currentPage - 1) * MOVIES_PER_PAGE, currentPage * MOVIES_PER_PAGE);

  const handleStatusChange = (nextStatus: typeof status) => {
    setStatus(nextStatus);
    setPage(1);
  };

  const handleSortChange = (nextSort: typeof sort) => {
    setSort(nextSort);
    setPage(1);
  };

  const handleKeywordChange = (nextKeyword: string) => {
    setKeyword(nextKeyword);
    setPage(1);
  };

  return (
    <main className="storefront-catalog-page cinema-page">
      <PageHero
        className="catalog-hero"
        title="영화 목록"
        description="상영중인 작품과 개봉 예정작을 검색하고 인기도, 평점, 개봉일 기준으로 살펴보세요."
      />

      <section className="cinema-page-body">
        <div className="container">
          {isMovieApiLoading ? <p className="panel-description">영화 API 데이터를 불러오는 중입니다.</p> : null}
          {movieApiError ? <p className="booking-feedback-banner">{movieApiError}</p> : null}

          <div className="movie-list-controls movie-toolbar">
            <div className="movie-tabs-filter movie-filter-group">
              <button type="button" className={`movie-filter-chip movie-filter-button ${status === 'ALL' ? 'is-active active' : ''}`} onClick={() => handleStatusChange('ALL')}>전체</button>
              <button type="button" className={`movie-filter-chip movie-filter-button ${status === 'NOW_SHOWING' ? 'is-active active' : ''}`} onClick={() => handleStatusChange('NOW_SHOWING')}>상영중</button>
              <button type="button" className={`movie-filter-chip movie-filter-button ${status === 'COMING_SOON' ? 'is-active active' : ''}`} onClick={() => handleStatusChange('COMING_SOON')}>상영예정</button>
            </div>
            <div className="movie-utility-controls movie-search-sort">
              <label className="movie-search-dummy">
                <span>검색</span>
                <input className="movie-search-input" value={keyword} onChange={(event) => handleKeywordChange(event.target.value)} placeholder="영화명 또는 장르 검색" />
              </label>
              <select className="movie-sort-select" value={sort} onChange={(event) => handleSortChange(event.target.value as typeof sort)} aria-label="정렬">
                <option value="popularity">인기도순</option>
                <option value="score">평점순</option>
                <option value="release">개봉일순</option>
              </select>
            </div>
          </div>

          <div className="cinema-movie-grid">
            {pagedMovies.map((movie, index) => (
              <MovieCard movie={movie} rank={(currentPage - 1) * MOVIES_PER_PAGE + index + 1} key={movie.id} />
            ))}
          </div>

          {totalPages > 1 ? (
            <nav className="movie-pagination" aria-label="영화 목록 페이지">
              <button type="button" disabled={currentPage === 1} onClick={() => setPage((value) => Math.max(1, value - 1))}>이전</button>
              {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                <button
                  type="button"
                  className={currentPage === pageNumber ? 'is-active' : ''}
                  onClick={() => setPage(pageNumber)}
                  key={pageNumber}
                >
                  {pageNumber}
                </button>
              ))}
              <button type="button" disabled={currentPage === totalPages} onClick={() => setPage((value) => Math.min(totalPages, value + 1))}>다음</button>
            </nav>
          ) : null}
        </div>
      </section>
    </main>
  );
};

export default MovieListPage;
