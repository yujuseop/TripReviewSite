// app/dashboard/page.tsx (Server Component)
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import DashboardClient from "./dashboardClient";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          cookieStore.set(name, value, options);
        },
        remove(name: string, options: any) {
          cookieStore.set(name, "", options);
        },
      },
    }
  );

  // 현재 로그인한 유저 가져오기
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  console.log("Dashboard - User:", user);
  console.log("Dashboard - Error:", userError);

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

  // 프로필 가져오기
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, email, role, nickname")
    .eq("user_id", user.id)
    .single();

  console.log("Dashboard - Profile:", profile);
  console.log("Dashboard - Profile Error:", profileError);

  return <DashboardClient profile={profile} />;
}
