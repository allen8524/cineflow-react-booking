import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import MovieCard from '../components/MovieCard';
import PageHero from '../components/PageHero';
import { movies } from '../data/movies';

const MovieListPage = () => {
  const [keyword, setKeyword] = useState('');
  const [status, setStatus] = useState<'ALL' | 'NOW_SHOWING' | 'COMING_SOON'>('ALL');
  const [sort, setSort] = useState<'booking' | 'score' | 'release'>('booking');

  const filteredMovies = useMemo(() => {
    return movies
      .filter((movie) => status === 'ALL' || movie.status === status)
      .filter((movie) => movie.title.includes(keyword) || movie.genre.includes(keyword))
      .sort((a, b) => {
        if (sort === 'score') return b.score - a.score;
        if (sort === 'release') return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
        return b.bookingRate - a.bookingRate;
      });
  }, [keyword, status, sort]);

  return (
    <main className="storefront-catalog-page cinema-page">
      <PageHero
        className="catalog-hero"
        title="영화 목록"
        description="상영중인 작품과 개봉 예정작을 검색하고 예매율, 평점, 개봉일 기준으로 살펴보세요."
        actions={(
          <>
            <Link to="/booking" className="hero-btn primary">빠른예매</Link>
            <Link to="/history" className="hero-btn secondary">예매내역</Link>
          </>
        )}
      />

      <section className="cinema-page-body">
        <div className="container">
          <div className="movie-list-controls movie-toolbar">
            <div className="movie-tabs-filter movie-filter-group">
              <button type="button" className={`movie-filter-chip movie-filter-button ${status === 'ALL' ? 'is-active active' : ''}`} onClick={() => setStatus('ALL')}>전체</button>
              <button type="button" className={`movie-filter-chip movie-filter-button ${status === 'NOW_SHOWING' ? 'is-active active' : ''}`} onClick={() => setStatus('NOW_SHOWING')}>상영중</button>
              <button type="button" className={`movie-filter-chip movie-filter-button ${status === 'COMING_SOON' ? 'is-active active' : ''}`} onClick={() => setStatus('COMING_SOON')}>상영예정</button>
            </div>
            <div className="movie-utility-controls movie-search-sort">
              <label className="movie-search-dummy">
                <span>검색</span>
                <input className="movie-search-input" value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder="영화명 또는 장르 검색" />
              </label>
              <select className="movie-sort-select" value={sort} onChange={(event) => setSort(event.target.value as typeof sort)} aria-label="정렬">
                <option value="booking">예매율순</option>
                <option value="score">평점순</option>
                <option value="release">개봉일순</option>
              </select>
            </div>
          </div>

          <div className="cinema-movie-grid">
            {filteredMovies.map((movie, index) => <MovieCard movie={movie} rank={index + 1} key={movie.id} />)}
          </div>
        </div>
      </section>
    </main>
  );
};

export default MovieListPage;
