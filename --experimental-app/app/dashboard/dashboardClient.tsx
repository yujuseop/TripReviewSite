// app/dashboard/DashboardClient.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseClient } from "@/lib/supabaseClient";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import TravelModal from "./travelModal";

interface Review {
  id: string;
  content: string;
  rating: number;
  created_at: string;
}

interface Destination {
  id: string;
  name: string;
  description: string | null;
  day: number | null;
  order_num: number | null;
  created_at: string;
}

interface Travel {
  id: string;
  title: string;
  start_date: string;
  end_date: string;
  description?: string;
  is_public: boolean;
  created_at: string;
  reviews?: Review[];
  destinations?: Destination[];
}

interface Profile {
  id?: string;
  nickname: string;
  email?: string;
  role?: string;
  profile_image?: string;
  bio?: string;
  created_at?: string;
  updated_at?: string;
}

interface DashboardClientProps {
  profile: Profile;
  initialTravels: Travel[];
  userId: string;
}

export default function DashboardClient({
  profile,
  initialTravels,
  userId,
}: DashboardClientProps) {
  const [date, setDate] = useState<Date | null>(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [travels, setTravels] = useState<Travel[]>(initialTravels);
  const router = useRouter();

  const handleTravelAdded = (newTravel: Travel) => {
    setTravels([newTravel, ...travels]);
  };

  const handleSignOut = async () => {
    await supabaseClient.auth.signOut();
    router.push("/login");
  };

  return (
    <div className="p-6 ">
      <h1 className="text-2xl font-bold mb-4 ">
        안녕하세요, {profile?.nickname}님 👋
      </h1>
      <div className="mb-4 flex gap-3 ">
        <a
          href="/profile"
          className="px-3 py-1 text-sm border rounded hover:bg-gray-500"
        >
          프로필
        </a>
        <button
          onClick={handleSignOut}
          className="px-3 py-1 text-sm border rounded hover:bg-gray-500"
        >
          로그아웃
        </button>
      </div>

      {/* 여행 추가 버튼 */}
      <div className="mb-6">
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          여행 추가하기 ✈️
        </button>
      </div>

      {/* 캘린더 UI */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">여행 캘린더</h2>
        <Calendar
          value={date}
          onChange={(value) => setDate(value as Date | null)}
          locale="ko-KR"
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
        {travels.length === 0 ? (
          <p className="text-gray-500">
            아직 여행이 없습니다. 새로운 여행을 추가해보세요!
          </p>
        ) : (
          <div className="space-y-4">
            {travels.map((travel) => (
              <div
                key={travel.id}
                className="border rounded-lg p-4 bg-white shadow-sm"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold">{travel.title}</h3>
                  <span className="text-sm text-gray-500">
                    {new Date(travel.start_date).toLocaleDateString("ko-KR")}
                    {travel.end_date !== travel.start_date &&
                      ` - ${new Date(travel.end_date).toLocaleDateString(
                        "ko-KR"
                      )}`}
                  </span>
                </div>

                {/* 목적지 목록 */}
                {travel.destinations && travel.destinations.length > 0 && (
                  <div className="mb-3">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">
                      📍 여행 목적지
                    </h4>
                    <div className="space-y-1">
                      {travel.destinations
                        .sort(
                          (a, b) =>
                            (a.day || 0) - (b.day || 0) ||
                            (a.order_num || 0) - (b.order_num || 0)
                        )
                        .map((dest) => (
                          <div key={dest.id} className="text-sm pl-2">
                            <span className="font-medium text-gray-800">
                              {dest.day && `${dest.day}일차 - `}
                              {dest.name}
                            </span>
                            {dest.description && (
                              <p className="text-gray-600 text-xs ml-2">
                                {dest.description}
                              </p>
                            )}
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* 리뷰 목록 */}
                {travel.reviews && travel.reviews.length > 0 && (
                  <div className="mb-2 space-y-2">
                    {travel.reviews.map((review) => (
                      <div
                        key={review.id}
                        className="border-l-2 border-blue-400 pl-3"
                      >
                        <div className="flex items-center gap-1 mb-1">
                          <span className="text-yellow-500">
                            {Array.from({ length: review.rating }, (_, i) => (
                              <span key={i}>⭐</span>
                            ))}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(review.created_at).toLocaleDateString(
                              "ko-KR"
                            )}
                          </span>
                        </div>
                        <p className="text-gray-700 text-sm">
                          {review.content}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {!travel.is_public && (
                  <span className="inline-block px-2 py-1 text-xs bg-gray-200 rounded">
                    🔒 비공개
                  </span>
                )}
                {travel.is_public && (
                  <span className="inline-block px-2 py-1 text-xs bg-green-100 text-green-700 rounded">
                    🌍 공개
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      {/* 여행 추가 모달 */}
      {isModalOpen && (
        <TravelModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          selectedDate={date || new Date()}
          userId={userId}
          onTravelAdded={handleTravelAdded}
        />
      )}
    </div>
  );
}
