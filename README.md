# CineFlow 영화 예매 웹 애플리케이션

CineFlow는 영화 탐색, 빠른 예매, 좌석 선택, 결제, 예매내역 확인, 관리자 예매 관리를 한 흐름으로 이용할 수 있는 영화 예매 웹 애플리케이션입니다.

## 실행 방법

```bash
npm install
npm run dev
```

브라우저에서 개발 서버 주소를 열면 실행됩니다.

## 빌드 및 점검 방법

```bash
npm run lint
npm run build
npm run preview
```

의존성이 변경된 경우 `npm install`을 먼저 실행해야 합니다.

## 주요 기능

- 영화 목록 및 상세 정보 확인
- 영화명, 장르, 줄거리, 등급, 상영 상태 기반 검색
- 상영중/상영예정 작품 구분
- 인기도, 평점, 등급, 개봉일 표시
- TMDB 상세 정보 연동 및 기본 영화 데이터 fallback
- 지점 및 상영관 정보 확인
- 빠른예매 흐름
- 인원 선택
- 좌석 선택
- 좌석 타입별 가격 차등
- 예매 완료 좌석 중복 선택 방지
- 시간표별 실제 예매석/잔여석 계산
- 결제 수단 선택
- 결제 완료 후 예매 선택값 초기화
- 예매 완료 티켓 화면
- 예매내역 조회 및 취소
- 예매별 취소 사유 관리
- 고객센터와 FAQ
- 관리자 대시보드, 영화/시간표/예매 조회
- 관리자 예매 취소 처리
- 잘못된 경로 접근 시 오류 페이지 제공

## 기술 구성

- React
- TypeScript
- Vite
- React Router DOM
- Context API
- LocalStorage
- TMDB API
- ESLint
- CSS

## 화면 구성

- `/` 홈
- `/movies` 영화 목록
- `/movies/:id` 영화 상세
- `/booking` 빠른예매 및 좌석 선택
- `/payment` 결제
- `/complete` 예매 완료
- `/history` 예매내역
- `/support` 고객센터
- `/admin` 관리자 대시보드
- `/login` 로그인
- `*` 오류 페이지

## 주요 폴더 구조

```text
src/
  components/  재사용 UI 컴포넌트
  context/     예매 흐름 공유 상태
  data/        영화, 상영관, 좌석, 예매 샘플 정보
  pages/       화면 페이지
  services/    외부 API 연동
  types/       타입 정의
  utils/       포맷팅 유틸 함수
```

## 테스트 계정

```text
일반 회원
ID: user
PW: 1234

관리자
ID: admin
PW: 1234
```

## 참고 사항

이 프로젝트의 로그인, 회원가입, 예매 데이터는 프론트엔드 데모용으로 LocalStorage에 저장됩니다. 실제 운영 환경에서는 서버 API, 데이터베이스, 인증/인가 로직을 별도로 구성해야 합니다.
