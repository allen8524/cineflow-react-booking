import { movies as fallbackMovies } from '../data/movies';
import type { Movie, MovieStatus } from '../types/cineflow';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';
const TMDB_ACCESS_TOKEN = import.meta.env.VITE_TMDB_ACCESS_TOKEN;
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;

interface TmdbMovie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  genre_ids: number[];
  vote_average: number;
  popularity: number;
}

interface TmdbMovieListResponse {
  results: TmdbMovie[];
}

interface TmdbGenre {
  id: number;
  name: string;
}

interface TmdbGenreResponse {
  genres: TmdbGenre[];
}

const hasTmdbCredentials = Boolean(TMDB_ACCESS_TOKEN || TMDB_API_KEY);

const buildTmdbUrl = (path: string, params: Record<string, string> = {}) => {
  const url = new URL(`${TMDB_BASE_URL}${path}`);

  url.searchParams.set('language', 'ko-KR');
  Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));

  if (!TMDB_ACCESS_TOKEN && TMDB_API_KEY) {
    url.searchParams.set('api_key', TMDB_API_KEY);
  }

  return url;
};

const requestTmdb = async <T>(path: string, params?: Record<string, string>): Promise<T> => {
  const response = await fetch(buildTmdbUrl(path, params), {
    headers: TMDB_ACCESS_TOKEN
      ? {
          Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
          accept: 'application/json'
        }
      : {
          accept: 'application/json'
        }
  });

  if (!response.ok) {
    throw new Error(`TMDB API 요청 실패: ${response.status}`);
  }

  return response.json() as Promise<T>;
};

const createImageUrl = (path: string | null, size: 'w500' | 'original', fallbackUrl: string) => {
  if (!path) {
    return fallbackUrl;
  }

  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
};

const createShortDescription = (overview: string, title: string) => {
  const text = overview || `${title} 영화 정보입니다.`;
  return text.length > 70 ? `${text.slice(0, 70)}...` : text;
};

const createBookingRate = (popularity: number, index: number) => {
  const normalized = popularity > 0 ? Math.min(39.9, Math.max(5, popularity / 20)) : 35 - index * 3;
  return Number(normalized.toFixed(1));
};

const mapTmdbMovie = (
  movie: TmdbMovie,
  index: number,
  status: MovieStatus,
  genreMap: Map<number, string>
): Movie => {
  const fallbackMovie = fallbackMovies[index % fallbackMovies.length];
  const title = movie.title || movie.original_title || fallbackMovie.title;
  const genre = movie.genre_ids.map((genreId) => genreMap.get(genreId)).filter(Boolean).join(' · ') || fallbackMovie.genre;

  return {
    id: index + 1,
    tmdbId: movie.id,
    title,
    shortDescription: createShortDescription(movie.overview, title),
    description: movie.overview || fallbackMovie.description,
    genre,
    ageRating: fallbackMovie.ageRating,
    runningTime: fallbackMovie.runningTime,
    posterUrl: createImageUrl(movie.poster_path, 'w500', fallbackMovie.posterUrl),
    backdropUrl: createImageUrl(movie.backdrop_path, 'original', fallbackMovie.backdropUrl ?? fallbackMovie.posterUrl),
    bookingRate: createBookingRate(movie.popularity, index),
    score: movie.vote_average || fallbackMovie.score,
    releaseDate: movie.release_date || fallbackMovie.releaseDate,
    status,
    bookingOpen: status === 'NOW_SHOWING'
  };
};

export const fetchMoviesFromTmdb = async (): Promise<Movie[] | null> => {
  if (!hasTmdbCredentials) {
    return null;
  }

  const [genreResponse, nowPlayingResponse, upcomingResponse] = await Promise.all([
    requestTmdb<TmdbGenreResponse>('/genre/movie/list'),
    requestTmdb<TmdbMovieListResponse>('/movie/now_playing', { region: 'KR', page: '1' }),
    requestTmdb<TmdbMovieListResponse>('/movie/upcoming', { region: 'KR', page: '1' })
  ]);

  const genreMap = new Map(genreResponse.genres.map((genre) => [genre.id, genre.name]));
  const nowPlaying = nowPlayingResponse.results.slice(0, 4);
  const nowPlayingIds = new Set(nowPlaying.map((movie) => movie.id));
  const upcoming = upcomingResponse.results.filter((movie) => !nowPlayingIds.has(movie.id)).slice(0, 3);

  const movies = [
    ...nowPlaying.map((movie, index) => mapTmdbMovie(movie, index, 'NOW_SHOWING', genreMap)),
    ...upcoming.map((movie, index) => mapTmdbMovie(movie, nowPlaying.length + index, 'COMING_SOON', genreMap))
  ];

  return movies.length > 0 ? movies : null;
};
