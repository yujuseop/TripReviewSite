"use client";

import { useAuth } from "@/providers/supabase_auth_provider";
import { useEffect, useState } from "react";
import { supabaseClient } from "@/lib/supabaseClient";

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const [nickname, setNickname] = useState<string>("");
  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileLoading(true);
      supabaseClient
        .from("profiles")
        .select("nickname")
        .eq("user_id", user.id)
        .single()
        .then(({ data, error }) => {
          if (!error && data) {
            setNickname(data.nickname || "");
          }
          setProfileLoading(false);
        });
    }
  }, [user]);

  if (loading || profileLoading) {
    return <div className="max-w-2xl mx-auto p-6">Loading...</div>;
  }

  if (!user) {
    return <div className="max-w-2xl mx-auto p-6">로그인이 필요합니다.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">프로필</h1>
      <div className="space-y-4">
        <div>
          <p className="text-gray-600">이메일</p>
          <p className="font-medium">{user.email}</p>
        </div>

        <div>
          <p className="text-gray-600">닉네임</p>
          <p className="font-medium">{nickname || "닉네임 없음"}</p>
        </div>
      </div>
    </div>
  );
}
