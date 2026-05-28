# CineFlow 영화 예매 웹 애플리케이션

CineFlow는 영화 탐색, 빠른 예매, 좌석 선택, 결제, 예매내역 확인까지 한 흐름으로 이용할 수 있는 영화 예매 웹 애플리케이션입니다.

## 실행 방법

```bash
npm install
npm run dev
```

브라우저에서 개발 서버 주소를 열면 실행됩니다.

## 빌드 방법

```bash
npm run build
npm run preview
```

## 주요 기능

- 영화 목록 및 상세 정보 확인
- 상영중/상영예정 작품 구분
- 예매율, 평점, 등급, 개봉일 표시
- 지점 및 상영관 정보 확인
- 빠른예매 흐름
- 인원 선택
- 좌석 선택
- 좌석 타입별 가격 차등
- 결제 수단 선택
- 예매 완료 티켓 화면
- 예매내역 조회 및 취소
- 고객센터와 FAQ
- 관리자 대시보드, 영화/시간표/예매 조회
- 잘못된 경로 접근 시 오류 페이지 제공

## 기술 구성

- React
- TypeScript
- Vite
- React Router DOM
- Context API
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
  types/       타입 정의
  utils/       포맷팅 유틸 함수
```

## 테스트 계정

```text
ID: admin
PW: 1234
```
