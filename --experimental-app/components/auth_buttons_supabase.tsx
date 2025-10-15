"use client";

import { useAuth } from "@/providers/supabase_auth_provider";
import { useRouter } from "next/navigation";

export function AuthButtonsSupabase() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  if (loading) {
    return <div className="px-6 py-3">Loading...</div>;
  }

  if (user) {
    return (
      <div className="flex gap-4">
        <button className="px-6 py-3 bg-gray-800 text-white rounded-lg shadow hover:bg-gray-900 transition">
          <a href="/dashboard">대시보드로 이동</a>
        </button>
        <button
          onClick={async () => {
            await signOut();
            router.push("/");
          }}
          className="px-6 py-3 bg-gray-800 text-white rounded-lg shadow hover:bg-gray-900 transition "
        >
          로그아웃
        </button>
      </div>
    );
  }

  return (
    <div className="flex gap-4">
      <a
        href="/login"
        className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
      >
        로그인
      </a>
      <a
        href="/signup"
        className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg shadow hover:bg-gray-300 transition"
      >
        회원가입
      </a>
    </div>
  );
}
