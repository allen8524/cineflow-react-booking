import type { Movie, Screen, Theater } from '../types/cineflow';

export const movies: Movie[] = [
  {
    id: 1,
    tmdbId: 329,
    title: '쥬라기 공원',
    shortDescription: '공룡이 되살아난 테마파크에서 펼쳐지는 스티븐 스필버그의 모험 블록버스터.',
    description: '최첨단 유전공학으로 공룡을 복원한 외딴 섬의 테마파크. 정식 개장을 앞둔 검증 투어 도중 보안 시스템이 무너지며 방문객들은 살아 움직이는 공룡들 사이에서 탈출해야 한다.',
    genre: '모험 · SF',
    ageRating: '12',
    runningTime: 127,
    posterUrl: 'https://image.tmdb.org/t/p/w500/b1xCNnyrPebIc7EWNZIa6jhb1Ww.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/9i3plLl89DHMz7mahksDaAo7HIS.jpg',
    bookingRate: 31.2,
    score: 9.1,
    releaseDate: '1993-06-11',
    status: 'NOW_SHOWING',
    bookingOpen: true
  },
  {
    id: 2,
    tmdbId: 238,
    title: '대부',
    shortDescription: '코를레오네 패밀리의 권력과 가족, 배신을 그린 범죄 영화의 고전.',
    description: '뉴욕 마피아 가문 코를레오네 패밀리의 수장 비토와 전쟁 영웅으로 돌아온 막내아들 마이클. 가족을 둘러싼 폭력과 거래가 깊어질수록 마이클은 피하려 했던 세계의 중심으로 들어선다.',
    genre: '범죄 · 드라마',
    ageRating: '19',
    runningTime: 175,
    posterUrl: 'https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/tmU7GeKVybMWFButWEGl2M4GeiP.jpg',
    bookingRate: 24.8,
    score: 9.2,
    releaseDate: '1972-03-14',
    status: 'NOW_SHOWING',
    bookingOpen: true
  },
  {
    id: 3,
    tmdbId: 346364,
    title: '그것',
    shortDescription: '데리 마을의 아이들이 공포의 존재 페니와이즈에 맞서는 호러 드라마.',
    description: '아이들이 하나둘 사라지는 마을 데리. 루저 클럽이라 불리는 아이들은 각자의 두려움을 먹고 자라는 광대 페니와이즈의 실체를 마주하고, 함께 맞서기로 결심한다.',
    genre: '공포 · 드라마',
    ageRating: '15',
    runningTime: 135,
    posterUrl: 'https://image.tmdb.org/t/p/w500/9E2y5Q7WlCVNEhP5GiVTjhEhx1o.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/tcheoA2nPATCm2vvXw2hVQoaEFD.jpg',
    bookingRate: 19.7,
    score: 8.5,
    releaseDate: '2017-09-06',
    status: 'NOW_SHOWING',
    bookingOpen: true
  },
  {
    id: 4,
    tmdbId: 37724,
    title: '007 스카이폴',
    shortDescription: '본드의 과거와 MI6의 현재가 충돌하는 샘 멘데스 연출의 첩보 액션.',
    description: '작전 실패 이후 MI6가 공격받고 M의 과거가 조직 전체를 위협한다. 제임스 본드는 몸과 신뢰를 회복하며 정체를 드러낸 적과 마지막 대결을 준비한다.',
    genre: '액션 · 스릴러',
    ageRating: '15',
    runningTime: 143,
    posterUrl: 'https://image.tmdb.org/t/p/w500/d0IVecFQvsGdSbnMAHqiYsNYaJT.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/6uBlEXZCUHM15UNZqNig17VdN4m.jpg',
    bookingRate: 14.2,
    score: 8.2,
    releaseDate: '2012-10-24',
    status: 'NOW_SHOWING',
    bookingOpen: true
  },
  {
    id: 5,
    tmdbId: 157336,
    title: '인터스텔라',
    shortDescription: '인류의 미래를 위해 웜홀 너머로 향하는 우주 탐사와 가족의 이야기.',
    description: '황폐해진 지구에서 인류의 생존 가능성을 찾기 위해 전직 조종사 쿠퍼는 미지의 은하로 떠난다. 시간과 중력, 가족에 대한 약속이 거대한 선택의 무게가 된다.',
    genre: 'SF · 드라마',
    ageRating: '12',
    runningTime: 169,
    posterUrl: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg',
    bookingRate: 12.4,
    score: 9.0,
    releaseDate: '2014-11-05',
    status: 'COMING_SOON',
    bookingOpen: false
  },
  {
    id: 6,
    tmdbId: 27205,
    title: '인셉션',
    shortDescription: '꿈속에 침투해 생각을 훔치는 전문가가 불가능한 임무에 도전한다.',
    description: '타인의 꿈에 들어가 비밀을 빼내는 코브는 모든 것을 되돌릴 수 있는 마지막 기회를 얻는다. 이번 임무는 정보를 훔치는 것이 아니라 한 사람의 마음에 생각을 심는 것이다.',
    genre: '액션 · SF',
    ageRating: '12',
    runningTime: 148,
    posterUrl: 'https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/s3TBrRGB1iav7gFOCNx3H31MoES.jpg',
    bookingRate: 8.1,
    score: 8.9,
    releaseDate: '2010-07-15',
    status: 'COMING_SOON',
    bookingOpen: false
  },
  {
    id: 7,
    tmdbId: 155,
    title: '다크 나이트',
    shortDescription: '고담을 뒤흔드는 조커와 배트맨의 충돌을 그린 슈퍼히어로 범죄 드라마.',
    description: '범죄와 부패를 몰아내려는 배트맨, 고든, 하비 덴트 앞에 예측 불가능한 조커가 나타난다. 고담의 질서와 신념은 혼돈 속에서 가장 어려운 시험을 맞는다.',
    genre: '액션 · 범죄',
    ageRating: '15',
    runningTime: 152,
    posterUrl: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/hqkIcbrOHL86UncnHIsHVcVmzue.jpg',
    bookingRate: 7.5,
    score: 9.0,
    releaseDate: '2008-07-16',
    status: 'COMING_SOON',
    bookingOpen: false
  }
];

export const theaters: Theater[] = [
  { id: 1, name: 'CineFlow 강남', location: '서울특별시 강남구 테헤란로 410', region: '서울', description: '프리미엄 IMAX와 심야 상영이 강점인 대표 지점' },
  { id: 2, name: 'CineFlow 홍대', location: '서울특별시 마포구 양화로 176', region: '서울', description: '젊은 관객층이 많은 도심형 멀티플렉스' },
  { id: 3, name: 'CineFlow 잠실', location: '서울특별시 송파구 올림픽로 300', region: '서울', description: '돌비 사운드와 가족 관람 수요가 많은 복합관' }
];

export const screens: Screen[] = [
  { id: 1, theaterId: 1, name: '1관', screenType: 'IMAX', totalSeats: 120 },
  { id: 2, theaterId: 1, name: '2관', screenType: '2D', totalSeats: 120 },
  { id: 3, theaterId: 2, name: '3관', screenType: 'LASER', totalSeats: 120 },
  { id: 4, theaterId: 2, name: '5관', screenType: '2D', totalSeats: 120 },
  { id: 5, theaterId: 3, name: '6관', screenType: '4DX', totalSeats: 120 },
  { id: 6, theaterId: 3, name: '8관', screenType: 'DOLBY ATMOS', totalSeats: 120 }
];
