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

interface TmdbReleaseDate {
  certification: string;
}

interface TmdbReleaseDateRegion {
  iso_3166_1: string;
  release_dates: TmdbReleaseDate[];
}

interface TmdbMovieDetail {
  runtime: number | null;
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

const createAgeRating = (detail: TmdbMovieDetail | null) => {
  const krReleaseDates = detail?.release_dates?.results.find((region) => region.iso_3166_1 === 'KR')?.release_dates;
  const certification = krReleaseDates?.map((releaseDate) => releaseDate.certification.trim()).find(Boolean);

  if (!certification) {
    return '미정';
  }

  return certification.toLowerCase() === 'all' ? 'ALL' : certification;
};

const mapTmdbMovie = (
  movie: TmdbMovie,
  detail: TmdbMovieDetail | null,
  index: number,
  status: MovieStatus,
  genreMap: Map<number, string>
): Movie => {
  const title = movie.title || movie.original_title || '제목 미정';
  const genre = movie.genre_ids.map((genreId) => genreMap.get(genreId)).filter(Boolean).join(' · ') || '장르 미정';
  const description = movie.overview || `${title} 영화 정보입니다.`;

  return {
    id: index + 1,
    tmdbId: movie.id,
    title,
    shortDescription: createShortDescription(movie.overview, title),
    description,
    genre,
    ageRating: createAgeRating(detail),
    runningTime: detail?.runtime ?? 0,
    posterUrl: createImageUrl(movie.poster_path, 'w500', POSTER_PLACEHOLDER),
    backdropUrl: createImageUrl(movie.backdrop_path, 'original', BACKDROP_PLACEHOLDER),
    bookingRate: movie.popularity,
    popularity: movie.popularity,
    score: movie.vote_average,
    releaseDate: movie.release_date,
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
  const selectedMovies = [
    ...nowPlaying.map((movie, index) => ({ movie, index, status: 'NOW_SHOWING' as const })),
    ...upcoming.map((movie, index) => ({ movie, index: nowPlaying.length + index, status: 'COMING_SOON' as const }))
  ];

  const movieDetails = await Promise.all(selectedMovies.map(({ movie }) => fetchTmdbMovieDetail(movie.id)));
  const movies = selectedMovies.map(({ movie, index, status }, detailIndex) =>
    mapTmdbMovie(movie, movieDetails[detailIndex], index, status, genreMap)
  );

  return movies.length > 0 ? movies : null;
};
