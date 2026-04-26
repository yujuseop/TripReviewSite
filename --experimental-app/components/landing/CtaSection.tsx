"use client";

import Link from "next/link";
import { useAuth } from "@/providers/supabase_auth_provider";

export default function CtaSection() {
  const { user, loading } = useAuth();

  const href = user ? "/dashboard" : "/login";

  return (
    <section className="py-28 px-4 bg-gray-900 text-center">
      <p className="text-sm tracking-[0.3em] uppercase text-gray-500 mb-4">
        Start for free
      </p>
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
        지금 바로 시작하세요
      </h2>
      <p className="text-gray-400 mb-12 text-base">
        무료로 가입하고 나만의 여행 기록을 시작해보세요.
      </p>
      {!loading && (
        <Link
          href={href}
          className="px-6 py-3 bg-white text-gray-900 rounded-lg shadow hover:bg-gray-100 transition"
        >
          {user ? "내 여행 보러가기" : "시작하기"}
        </Link>
      )}
    </section>
  );
}
