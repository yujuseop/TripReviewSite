# TripReviewSite — 프로젝트 문서 인덱스

여행 기록 및 리뷰 플랫폼. 사용자가 여행을 추가하고 목적지와 리뷰를 기록할 수 있는 풀스택 웹 애플리케이션.

## 문서 목록

### 기술 / 구조

| 파일 | 내용 |
|------|------|
| [기술스택.md](./기술스택.md) | 프레임워크, 라이브러리, 지도 SDK, 환경변수 전체 정리 |
| [백엔드.md](./백엔드.md) | Supabase DB 스키마(4개 테이블 + 고도화 컬럼), 인증, Storage, 데이터 작업 목록 |

### 기능별

| 파일 | 내용 |
|------|------|
| [랜딩페이지.md](./랜딩페이지.md) | HeroSlider(이미지 슬라이드), FeatureSection(기능 소개), CtaSection(CTA + 인증 상태 분기) |
| [대시보드.md](./대시보드.md) | 데이터 패칭 구조, 필터(맛집/관광지/평점순), TotalCostDisplay, 모달 목록, 레이아웃 |
| [여행폼.md](./여행폼.md) | TravelFormState 전체 필드, 액션 목록, ReviewSection(무드태그/한줄평), DestinationSection(카테고리/비용/지도), DB 저장 흐름 |
| [지도.md](./지도.md) | TravelMap(react-leaflet 시각화), KakaoMapPicker(장소 검색/위치 선택), 좌표 데이터 전체 흐름 |

## 빠른 참조

| 찾는 것 | 파일 |
|---------|------|
| 기술 스택 / 패키지 버전 | `기술스택.md` |
| DB 테이블 구조 | `백엔드.md` |
| 랜딩 페이지 컴포넌트 | `랜딩페이지.md` |
| 대시보드 필터 / 경비 표시 | `대시보드.md` |
| 여행 폼 상태 / 액션 | `여행폼.md` |
| 카카오맵 설정 / 지도 시각화 | `지도.md` |

## 프로젝트 개요

```
Next.js 15 (App Router) + TypeScript
Supabase (Auth + PostgreSQL + Storage)
Tailwind CSS v4
react-leaflet (여행지 시각화)
카카오맵 SDK (위치 검색)
Vercel 배포
```

**라우트:**
- `/` — 랜딩 페이지 (슬라이드 + 소개 + CTA)
- `/login`, `/signup` — 인증
- `/dashboard` — 여행 목록 + 캘린더 + 지도 (인증 필요)
- `/profile` — 사용자 프로필 (인증 필요)
