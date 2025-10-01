// app/dashboard/page.tsx
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import DashboardClient from "./dashboardClient";

export default async function DashboardPage() {
  const cookieStore = await cookies();

  // Supabase SSR 클라이언트 생성
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        },
      },
    }
  );

  //  현재 로그인한 유저
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  console.log("Dashboard - User:", user);
  console.log("Dashboard - User Error:", userError);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-lg mb-4">로그인 후 접근 가능합니다.</p>
        <a href="/login" className="text-blue-600 hover:underline">
          로그인 페이지로 이동
        </a>
      </div>
    );
  }

  //  프로필 조회
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  console.log("Dashboard - Profile:", profile);
  console.log("Dashboard - Profile Error:", profileError);

  //  fallback 프로필
  const displayProfile = profile || {
    nickname: user.email?.split("@")[0] || "사용자",
    email: user.email,
  };

  return <DashboardClient profile={displayProfile} />;
}
