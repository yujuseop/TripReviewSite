# 🧳 TripView

여행 기록 및 리뷰를 관리할 수 있는 Next.js 기반 웹 애플리케이션입니다.

## ✨ 주요 기능

- 🔐 **사용자 인증**: Supabase Auth를 통한 회원가입/로그인
- 📅 **여행 캘린더**: React Calendar를 활용한 여행 일정 관리
- ✈️ **여행 기록**: 여행 제목, 기간, 설명, 공개/비공개 설정
- 📍 **목적지 관리**: 여행별 여러 목적지 추가 및 관리
- ⭐ **리뷰 시스템**: 5점 만점 평점 및 리뷰 작성
- 👤 **프로필 관리**: 사용자 닉네임, 역할(사용자/관리자) 관리
- 🎨 **반응형 UI**: Tailwind CSS를 활용한 모던한 디자인

## 🛠️ 기술 스택

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **UI Components**: React Calendar, js-toastify
- **Deployment**: Vercel

## 🚀 시작하기

### 1. 저장소 클론

```bash
git clone <repository-url>
cd TripReviewSite/--experimental-app
```

### 2. 의존성 설치

```bash
pnpm install
# 또는
npm install
```

### 3. 환경변수 설정

`.env.local` 파일을 생성하고 다음 환경변수를 설정하세요:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NEXT_PUBLIC_ADMIN_CODE=your_admin_code
```

### 4. Supabase 데이터베이스 설정

Supabase 대시보드에서 다음 SQL을 실행하여 테이블을 생성하세요:

#### Profiles 테이블

```sql
DROP TABLE IF EXISTS public.profiles CASCADE;
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nickname TEXT NOT NULL,
  profile_image TEXT,
  bio TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);

-- RLS 정책
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles: user can view" ON public.profiles FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Profiles: user can insert" ON public.profiles FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Profiles: user can update" ON public.profiles FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Profiles: user can delete" ON public.profiles FOR DELETE USING (user_id = auth.uid());
CREATE POLICY "Profiles: admin can do anything" ON public.profiles FOR ALL USING (
  (auth.jwt()->>'role')::text = 'admin' OR user_id = auth.uid()
);
```

#### Trip 테이블

```sql
DROP TABLE IF EXISTS public.trip CASCADE;
CREATE TABLE IF NOT EXISTS public.trip (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT UNIQUE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- user_id 자동 설정 트리거
CREATE OR REPLACE FUNCTION public.set_trip_user_id() RETURNS trigger AS $$
BEGIN
  NEW.user_id := auth.uid();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_trip_set_user_id
  BEFORE INSERT ON public.trip
  FOR EACH ROW
  EXECUTE FUNCTION public.set_trip_user_id();

-- RLS 정책
ALTER TABLE public.trip ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Trips: user can view their own or public trips" ON public.trip FOR SELECT USING (auth.uid() = user_id OR is_public = true);
CREATE POLICY "Trips: user can insert their own trips" ON public.trip FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Trips: user can update their own trips" ON public.trip FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Trips: user can delete their own trips" ON public.trip FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Trips: admin can do anything" ON public.trip FOR ALL USING (
  (auth.jwt()->>'role')::text = 'admin' OR auth.uid() = user_id OR is_public = true
);
```

#### Destinations 테이블

```sql
DROP TABLE IF EXISTS public.destinations CASCADE;
CREATE TABLE IF NOT EXISTS public.destinations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID REFERENCES public.trip(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  day INT CHECK (day > 0),
  order_num INT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS 정책
ALTER TABLE public.destinations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Destinations: user can view" ON public.destinations FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.trip t
    WHERE t.id = trip_id AND (t.user_id = auth.uid() OR t.is_public = true)
  )
);
CREATE POLICY "Destinations: user can insert" ON public.destinations FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.trip t
    WHERE t.id = trip_id AND t.user_id = auth.uid()
  )
);
CREATE POLICY "Destinations: user can update" ON public.destinations FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.trip t
    WHERE t.id = trip_id AND t.user_id = auth.uid()
  )
);
CREATE POLICY "Destinations: user can delete" ON public.destinations FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM public.trip t
    WHERE t.id = trip_id AND t.user_id = auth.uid()
  )
);
CREATE POLICY "Destinations: admin can do anything" ON public.destinations FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.user_id = auth.uid() AND p.role = 'admin'
  )
);
```

#### Reviews 테이블

```sql
DROP TABLE IF EXISTS public.reviews CASCADE;
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES public.trip(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS 정책
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reviews: user can view" ON public.reviews FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.trip t
    WHERE t.id = trip_id AND (t.user_id = auth.uid() OR t.is_public = true)
  )
);
CREATE POLICY "Reviews: user can insert" ON public.reviews FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Reviews: user can update" ON public.reviews FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Reviews: user can delete" ON public.reviews FOR DELETE USING (user_id = auth.uid());
CREATE POLICY "Reviews: admin can do anything" ON public.reviews FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.user_id = auth.uid() AND p.role = 'admin'
  )
);
```

### 5. 개발 서버 실행

```bash
pnpm dev
# 또는
npm run dev
```

[http://localhost:3000](http://localhost:3000)에서 애플리케이션을 확인할 수 있습니다.

## 📁 프로젝트 구조

```
--experimental-app/
├── app/
│   ├── dashboard/          # 대시보드 페이지
│   │   ├── page.tsx       # 서버 컴포넌트
│   │   ├── dashboardClient.tsx  # 클라이언트 컴포넌트
│   │   └── travelModal.tsx      # 여행 추가 모달
│   ├── login/             # 로그인 페이지
│   ├── signup/            # 회원가입 페이지
│   ├── profile/           # 프로필 페이지
│   └── globals.css        # 전역 스타일
├── components/
│   └── auth_buttons_supabase.tsx  # 인증 버튼 컴포넌트
├── lib/
│   ├── supabaseClient.ts  # 클라이언트 Supabase 설정
│   └── supabaseServer.ts  # 서버 Supabase 설정
├── providers/
│   ├── supabase_auth_provider.tsx  # 인증 컨텍스트
│   └── query_provider.tsx          # React Query 설정
└── types/                 # TypeScript 타입 정의
```

## 🔧 주요 해결 과정

### 1. Supabase 인증 설정

- `@supabase/auth-helpers-nextjs` → `@supabase/ssr`로 마이그레이션
- 서버/클라이언트 컴포넌트에서 일관된 세션 관리

### 2. 데이터베이스 스키마 설계

- RLS(Row Level Security) 정책으로 데이터 보안 강화
- PostgreSQL 트리거로 `user_id` 자동 설정
- 무한 재귀 방지를 위한 정책 최적화

### 3. TypeScript 타입 안정성

- `any` 타입 제거 및 구체적인 인터페이스 정의
- ESLint 규칙 준수

### 4. UI/UX 개선

- React Calendar 커스터마이징
- Toast 알림 시스템 구현
- 반응형 디자인 적용

## 🚀 배포

### Vercel 배포

1. Vercel 대시보드에서 환경변수 설정:

   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_ADMIN_CODE`

2. GitHub 저장소 연결 후 자동 배포

## 🐛 알려진 이슈

- Node.js 18 이하 버전에서 Supabase 경고 메시지 (Node.js 20+ 권장)
- 새로고침 시 여행 목록이 사라지는 문제 (캐싱 비활성화로 해결)

## 📝 라이선스

MIT License

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 문의

프로젝트에 대한 문의사항이 있으시면 이슈를 생성해주세요.

