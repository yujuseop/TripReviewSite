-- profiles INSERT 정책 수정
DROP POLICY IF EXISTS "Profiles: user can insert" ON public.profiles;

-- 새로운 INSERT 정책 (user_id 명시 허용)
CREATE POLICY "Profiles: user can insert" ON public.profiles
FOR INSERT
WITH CHECK (
  user_id = auth.uid() OR 
  (user_id IS NOT NULL AND user_id = auth.uid())
);

-- 또는 더 간단하게 (임시)
-- DROP POLICY IF EXISTS "Profiles: user can insert" ON public.profiles;
-- CREATE POLICY "Profiles: user can insert" ON public.profiles
-- FOR INSERT WITH CHECK (true);
