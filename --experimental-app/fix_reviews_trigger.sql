-- reviews 테이블에 user_id 자동 설정 트리거 생성
CREATE OR REPLACE FUNCTION public.set_reviews_user_id()
RETURNS trigger AS $$
BEGIN
  NEW.user_id := auth.uid();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 트리거 생성
DROP TRIGGER IF EXISTS trg_reviews_set_user_id ON public.reviews;
CREATE TRIGGER trg_reviews_set_user_id
  BEFORE INSERT ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.set_reviews_user_id();
