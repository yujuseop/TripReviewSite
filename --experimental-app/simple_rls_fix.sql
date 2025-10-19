-- 가장 간단한 RLS 정책으로 수정

-- destinations INSERT 정책 (매우 간단하게)
DROP POLICY IF EXISTS "Destinations: user can insert" ON public.destinations;
CREATE POLICY "Destinations: user can insert" ON public.destinations 
FOR INSERT 
WITH CHECK (true); -- 임시로 모든 INSERT 허용

-- reviews INSERT 정책 (매우 간단하게)  
DROP POLICY IF EXISTS "Reviews: user can insert" ON public.reviews;
CREATE POLICY "Reviews: user can insert" ON public.reviews 
FOR INSERT 
WITH CHECK (true); -- 임시로 모든 INSERT 허용

-- 관리자 정책은 그대로 유지
