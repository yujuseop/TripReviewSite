// app/dashboard/DashboardClient.tsx
"use client";

import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function DashboardClient({ profile }: { profile: any }) {
  const [date, setDate] = useState<Date | null>(new Date());

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        안녕하세요, {profile?.nickname || profile?.email}님 👋
      </h1>

      {/* 여행 추가 버튼 */}
      <div className="mb-6">
        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
          여행 추가하기 ✈️
        </button>
      </div>

      {/* 캘린더 UI */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">여행 캘린더</h2>
        <Calendar
          value={date}
          onChange={(value) => setDate(value as Date | null)}
        />
        {date && (
          <p className="mt-4 text-gray-600">
            선택한 날짜:{" "}
            <span className="font-medium">{date.toLocaleDateString()}</span>
          </p>
        )}
      </div>

      {/* 내 여행 목록 */}
      <div>
        <h2 className="text-xl font-semibold mb-2">내 여행 목록</h2>
        <p className="text-gray-500">
          아직 여행이 없습니다. 새로운 여행을 추가해보세요!
        </p>
      </div>
    </div>
  );
}
