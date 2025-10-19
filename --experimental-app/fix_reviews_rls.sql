-- 기존 reviews RLS 정책 삭제
DROP POLICY IF EXISTS "Reviews: user can insert" ON public.reviews;
DROP POLICY IF EXISTS "Reviews: admin can do anything" ON public.reviews;

-- 새로운 INSERT 정책 생성 (더 명확하게)
CREATE POLICY "Reviews: user can insert" ON public.reviews 
FOR INSERT 
WITH CHECK (user_id = auth.uid());

-- 관리자 정책도 수정
CREATE POLICY "Reviews: admin can do anything" ON public.reviews 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.user_id = auth.uid() 
    AND p.role = 'admin'
  )
);
