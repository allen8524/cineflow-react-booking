import { movies as fallbackMovies } from '../data/movies';
import type { Movie } from '../types/cineflow';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';
const TMDB_ACCESS_TOKEN = import.meta.env.VITE_TMDB_ACCESS_TOKEN;
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;

interface TmdbGenre {
  id: number;
  name: string;
}

interface TmdbReleaseDate {
  certification: string;
}

interface TmdbReleaseDateRegion {
  iso_3166_1: string;
  release_dates: TmdbReleaseDate[];
}

interface TmdbMovieDetail {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  genres?: TmdbGenre[];
  runtime: number | null;
  vote_average: number;
  popularity: number;
  release_dates?: {
    results: TmdbReleaseDateRegion[];
  };
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

const POSTER_PLACEHOLDER =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="500" height="750" viewBox="0 0 500 750"%3E%3Crect width="500" height="750" fill="%231f2937"/%3E%3Ctext x="250" y="375" fill="%23f9fafb" font-family="Arial, sans-serif" font-size="36" text-anchor="middle"%3ENo Poster%3C/text%3E%3C/svg%3E';

const BACKDROP_PLACEHOLDER =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720"%3E%3Crect width="1280" height="720" fill="%23111827"/%3E%3Ctext x="640" y="360" fill="%23f9fafb" font-family="Arial, sans-serif" font-size="52" text-anchor="middle"%3ENo Backdrop%3C/text%3E%3C/svg%3E';

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

const fetchTmdbMovieDetail = async (movieId: number) => {
  try {
    return await requestTmdb<TmdbMovieDetail>(`/movie/${movieId}`, { append_to_response: 'release_dates' });
  } catch {
    return null;
  }
};

const createAgeRating = (detail: TmdbMovieDetail | null, fallbackAgeRating: string) => {
  const krReleaseDates = detail?.release_dates?.results.find((region) => region.iso_3166_1 === 'KR')?.release_dates;
  const certification = krReleaseDates?.map((releaseDate) => releaseDate.certification.trim()).find(Boolean);

  if (!certification) {
    return fallbackAgeRating;
  }

  return certification.toLowerCase() === 'all' ? 'ALL' : certification;
};

const createGenreLabel = (detail: TmdbMovieDetail | null, fallbackGenre: string) => {
  const genreLabel = detail?.genres?.map((genre) => genre.name).filter(Boolean).join(' · ');
  return genreLabel || fallbackGenre;
};

const mapTmdbMovie = (fallbackMovie: Movie, detail: TmdbMovieDetail | null): Movie => {
  if (!detail) {
    return fallbackMovie;
  }

  const title = detail.title || detail.original_title || fallbackMovie.title;
  const description = detail.overview || fallbackMovie.description;

  return {
    ...fallbackMovie,
    tmdbId: detail.id,
    title,
    shortDescription: createShortDescription(description, title),
    description,
    genre: createGenreLabel(detail, fallbackMovie.genre),
    ageRating: createAgeRating(detail, fallbackMovie.ageRating),
    runningTime: detail.runtime ?? fallbackMovie.runningTime,
    posterUrl: createImageUrl(detail.poster_path, 'w500', fallbackMovie.posterUrl || POSTER_PLACEHOLDER),
    backdropUrl: createImageUrl(detail.backdrop_path, 'original', fallbackMovie.backdropUrl ?? BACKDROP_PLACEHOLDER),
    bookingRate: detail.popularity ?? fallbackMovie.bookingRate,
    popularity: detail.popularity ?? fallbackMovie.popularity ?? fallbackMovie.bookingRate,
    score: detail.vote_average ?? fallbackMovie.score,
    releaseDate: detail.release_date || fallbackMovie.releaseDate
  };
};

export const fetchMoviesFromTmdb = async (): Promise<Movie[] | null> => {
  if (!hasTmdbCredentials) {
    return null;
  }

  const movieDetails = await Promise.all(fallbackMovies.map((movie) => fetchTmdbMovieDetail(movie.tmdbId)));

  if (!movieDetails.some(Boolean)) {
    return null;
  }

  return fallbackMovies.map((movie, index) => mapTmdbMovie(movie, movieDetails[index]));
};
