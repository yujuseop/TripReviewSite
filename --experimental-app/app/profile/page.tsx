import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import ProfileClient from "@/components/profile/ProfileClient";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ProfilePage() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach((cookie) => {
              cookieStore.set(cookie.name, cookie.value, cookie.options);
            });
          } catch (error) {
            console.error("Cookie setting error:", error);
          }
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-lg mb-4">로그인 후 접근 가능합니다.</p>
        <Link href="/login" className="text-blue-600 hover:underline">
          로그인 페이지로 이동
        </Link>
      </div>
    );
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  const displayProfile = {
    ...profile,
    nickname:
      profile?.nickname ||
      user.user_metadata?.nickname ||
      user.email?.split("@")[0] ||
      "사용자",
    email: user.email || "",
  };

  return <ProfileClient profile={displayProfile} />;
}
