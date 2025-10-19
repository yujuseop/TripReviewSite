-- 모든 RLS 정책 삭제 후 재생성

-- 1. destinations 테이블 정책 수정
DROP POLICY IF EXISTS "Destinations: user can insert" ON public.destinations;
DROP POLICY IF EXISTS "Destinations: admin can do anything" ON public.destinations;

-- destinations INSERT 정책 (더 간단하게)
CREATE POLICY "Destinations: user can insert" ON public.destinations 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.trip t 
    WHERE t.id = trip_id 
    AND t.user_id = auth.uid()
  )
);

-- destinations 관리자 정책
CREATE POLICY "Destinations: admin can do anything" ON public.destinations 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.user_id = auth.uid() 
    AND p.role = 'admin'
  )
);

-- 2. reviews 테이블 정책 수정
DROP POLICY IF EXISTS "Reviews: user can insert" ON public.reviews;
DROP POLICY IF EXISTS "Reviews: admin can do anything" ON public.reviews;

-- reviews INSERT 정책 (더 간단하게)
CREATE POLICY "Reviews: user can insert" ON public.reviews 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.trip t 
    WHERE t.id = trip_id 
    AND t.user_id = auth.uid()
  )
);

-- reviews 관리자 정책
CREATE POLICY "Reviews: admin can do anything" ON public.reviews 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.user_id = auth.uid() 
    AND p.role = 'admin'
  )
);

-- 3. trip 테이블 정책도 확인
DROP POLICY IF EXISTS "Trips: user can insert their own trips" ON public.trip;
CREATE POLICY "Trips: user can insert their own trips" ON public.trip 
FOR INSERT 
WITH CHECK (user_id = auth.uid());
