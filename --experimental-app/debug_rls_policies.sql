-- 현재 RLS 정책 확인
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename IN ('destinations', 'reviews', 'trip', 'profiles')
ORDER BY tablename, policyname;
