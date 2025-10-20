import { AuthButtonsSupabase } from "@/components/auth_buttons_supabase";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-4xl font-bold mb-4 text-gray-800">
        ✈️ 여행 기록 서비스
      </h1>
      <p className="text-lg text-gray-600 mb-6">
        나만의 여행을 기록하고, 추억을 공유하세요.
      </p>
      <AuthButtonsSupabase />
    </main>
  );
}
