import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import DashboardClient from "./dashboardClient";
import Link from "next/link";
import { Review } from "@/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DashboardPage() {
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

  const displayProfile = profile || {
    nickname:
      user.user_metadata?.nickname || user.email?.split("@")[0] || "사용자",
    email: user.email,
  };

  const { data: travels } = await supabase
    .from("trip")
    .select(
      `
      *,
      reviews (
        id,
        content,
        rating,
        created_at,
        user_id,
        images
      )
    `
    )
    .eq("user_id", user.id)
    .order("start_date", { ascending: false });

  const travelsWithImages = (travels || []).map((travel) => ({
    ...travel,
    reviews:
      (travel.reviews as Review[])?.map((review) => {
        let imageUrls: string[] = [];
        if (Array.isArray(review.images)) {
          imageUrls = review.images.filter(
            (url) => typeof url === "string" && url.length > 0
          );
        }

        return {
          ...review,
          images: imageUrls,
        };
      }) || [],
  }));

  return (
    <DashboardClient
      profile={displayProfile}
      initialTravels={travelsWithImages}
      userId={user.id}
    />
  );
}
