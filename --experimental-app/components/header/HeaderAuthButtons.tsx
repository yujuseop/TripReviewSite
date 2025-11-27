"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/providers/supabase_auth_provider";

export default function HeaderAuthButtons() {
  const { user, signOut, loading } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
  };

  if (loading) {
    return null;
  }

  return (
    <div className="flex items-center gap-3">
      {user ? (
        <>
          <Link
            href="/profile"
            className="px-3 py-2 text-sm text-white border border-gray-500 rounded-lg hover:bg-gray-600 transition-colors"
          >
            프로필
          </Link>
          <button
            onClick={handleSignOut}
            className="px-3 py-2 text-sm text-white border border-gray-500 rounded-lg hover:bg-gray-600 transition-colors"
          >
            로그아웃
          </button>
        </>
      ) : (
        <Link
          href="/login"
          className="px-3 py-2 text-sm text-white border border-gray-500 rounded-lg hover:bg-gray-600 transition-colors"
        >
          로그인
        </Link>
      )}
    </div>
  );
}

