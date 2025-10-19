-- reviews 테이블 정책 수정

-- 기존 INSERT 정책 삭제
DROP POLICY IF EXISTS "Reviews: user can insert" ON public.reviews;

-- 새로운 INSERT 정책 (trip 테이블과의 관계 확인)
CREATE POLICY "Reviews: user can insert"
  ON public.reviews
  FOR INSERT
  WITH CHECK (
    user_id = auth.uid() 
    AND EXISTS (
      SELECT 1 FROM public.trip t 
      WHERE t.id = trip_id 
      AND t.user_id = auth.uid()
    )
  );

-- 또는 더 간단한 버전 (trip 소유권만 확인)
-- DROP POLICY IF EXISTS "Reviews: user can insert" ON public.reviews;
-- CREATE POLICY "Reviews: user can insert"
--   ON public.reviews
--   FOR INSERT
--   WITH CHECK (
--     EXISTS (
--       SELECT 1 FROM public.trip t 
--       WHERE t.id = trip_id 
--       AND t.user_id = auth.uid()
--     )
--   );
