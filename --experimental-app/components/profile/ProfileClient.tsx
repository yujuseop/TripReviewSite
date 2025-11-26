"use client";

import Link from "next/link";
import { Profile } from "@/types";

interface ProfileClientProps {
  profile: Profile;
}

export default function ProfileClient({ profile }: ProfileClientProps) {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">프로필</h1>
      <div className="space-y-4">
        <div>
          <p className="text-gray-600">이메일</p>
          <p className="font-medium">{profile.email || "이메일 없음"}</p>
        </div>

        <div>
          <p className="text-gray-600">닉네임</p>
          <p className="font-medium">{profile.nickname || "닉네임 없음"}</p>
        </div>

        {profile.role && (
          <div>
            <p className="text-gray-600">역할</p>
            <p className="font-medium">
              {profile.role === "admin" ? "관리자" : "사용자"}
            </p>
          </div>
        )}
      </div>
      <div>
        <Link
          href="/dashboard"
          className="mt-6 inline-block px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          대시보드로 돌아가기
        </Link>
      </div>
    </div>
  );
}
