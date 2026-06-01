import { movies as fallbackMovies } from '../data/movies';
import type { Movie, MovieStatus } from '../types/cineflow';

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

interface TmdbMovieSummary {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  popularity: number;
}

interface TmdbMovieListResponse {
  results: TmdbMovieSummary[];
}

interface TmdbMovieDetail extends TmdbMovieSummary {
  genres?: TmdbGenre[];
  runtime: number | null;
  release_dates?: {
    results: TmdbReleaseDateRegion[];
  };
}

const createSvgPlaceholder = (width: number, height: number, background: string, fontSize: number, text: string) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><rect width="${width}" height="${height}" fill="${background}"/><text x="${width / 2}" y="${height / 2}" fill="#f9fafb" font-family="Arial, sans-serif" font-size="${fontSize}" text-anchor="middle" dominant-baseline="middle">${text}</text></svg>`;

  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
};

const POSTER_PLACEHOLDER = createSvgPlaceholder(500, 750, '#1f2937', 34, '포스터 없음');
const BACKDROP_PLACEHOLDER = createSvgPlaceholder(1280, 720, '#111827', 52, '배경 이미지 없음');
const DEFAULT_MOVIE_TITLE = '제목 미정';
const DEFAULT_MOVIE_DESCRIPTION = '영화 정보가 아직 제공되지 않았습니다.';
const DEFAULT_GENRE_LABEL = '장르 정보 없음';

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
  const text = overview || `${title}의 ${DEFAULT_MOVIE_DESCRIPTION}`;
  return text.length > 70 ? `${text.slice(0, 70)}...` : text;
};

const createAgeRating = (detail: TmdbMovieDetail | null) => {
  const krReleaseDates = detail?.release_dates?.results.find((region) => region.iso_3166_1 === 'KR')?.release_dates;
  const certification = krReleaseDates?.map((releaseDate) => releaseDate.certification.trim()).find(Boolean);

  if (!certification) {
    return 'ALL';
  }

  return certification.toLowerCase() === 'all' ? 'ALL' : certification;
};

const createGenreLabel = (detail: TmdbMovieDetail | null) => {
  return detail?.genres?.map((genre) => genre.name).filter(Boolean).join(' · ') || DEFAULT_GENRE_LABEL;
};

const fetchTmdbMovieDetail = async (movieId: number) => {
  try {
    return await requestTmdb<TmdbMovieDetail>(`/movie/${movieId}`, { append_to_response: 'release_dates' });
  } catch {
    return null;
  }
};

const mapTmdbMovie = (
  summary: TmdbMovieSummary,
  detail: TmdbMovieDetail | null,
  id: number,
  status: MovieStatus
): Movie => {
  const source = detail ?? summary;
  const title = source.title || source.original_title || DEFAULT_MOVIE_TITLE;
  const description = source.overview || '';
  const popularity = source.popularity ?? 0;

  return {
    id,
    tmdbId: source.id,
    title,
    shortDescription: createShortDescription(description, title),
    description: description || `${title}의 ${DEFAULT_MOVIE_DESCRIPTION}`,
    genre: createGenreLabel(detail),
    ageRating: createAgeRating(detail),
    runningTime: detail?.runtime ?? 0,
    posterUrl: createImageUrl(source.poster_path, 'w500', POSTER_PLACEHOLDER),
    backdropUrl: createImageUrl(source.backdrop_path, 'original', BACKDROP_PLACEHOLDER),
    bookingRate: popularity,
    popularity,
    score: source.vote_average ?? 0,
    releaseDate: source.release_date || '',
    status,
    bookingOpen: status === 'NOW_SHOWING'
  };
};

const fetchMovieGroup = async (path: string, status: MovieStatus, limit: number) => {
  const response = await requestTmdb<TmdbMovieListResponse>(path, {
    page: '1',
    region: 'KR',
    watch_region: 'KR'
  });
  const summaries = response.results.filter((movie) => movie.poster_path || movie.backdrop_path).slice(0, limit);
  const details = await Promise.all(summaries.map((movie) => fetchTmdbMovieDetail(movie.id)));

  return summaries.map((summary, index) => ({
    summary,
    detail: details[index],
    status
  }));
};

export const fetchMoviesFromTmdb = async (): Promise<Movie[] | null> => {
  if (!hasTmdbCredentials) {
    return null;
  }

  const [nowShowing, upcoming] = await Promise.all([
    fetchMovieGroup('/movie/now_playing', 'NOW_SHOWING', 12),
    fetchMovieGroup('/movie/upcoming', 'COMING_SOON', 8)
  ]);

  const seenTmdbIds = new Set<number>();
  const apiMovies = [...nowShowing, ...upcoming].filter((movie) => {
    if (seenTmdbIds.has(movie.summary.id)) {
      return false;
    }

    seenTmdbIds.add(movie.summary.id);
    return true;
  });

  if (apiMovies.length === 0) {
    return null;
  }

  return apiMovies.map((movie, index) => mapTmdbMovie(movie.summary, movie.detail, index + 1, movie.status));
};

export const getFallbackMovies = () => fallbackMovies;
