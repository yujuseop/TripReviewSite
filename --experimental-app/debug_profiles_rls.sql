-- 현재 profiles RLS 정책 확인
SELECT 
  schemaname, 
  tablename, 
  policyname, 
  permissive, 
  roles, 
  cmd, 
  qual, 
  with_check
FROM pg_policies 
WHERE tablename = 'profiles'
ORDER BY policyname;

-- 현재 사용자 ID 확인
SELECT auth.uid() as current_user_id;

-- profiles 테이블의 모든 데이터 확인 (관리자 권한으로)
SELECT * FROM public.profiles ORDER BY created_at DESC LIMIT 5;
