// app/dashboard/DashboardClient.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseClient } from "@/lib/supabaseClient";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import TravelModal from "./travelModal";
import ReviewDetailModal from "@/components/ReviewDetailModal";
import { useModal } from "@/hooks/useModal";
import { toast } from "js-toastify";
import Link from "next/link";

interface Review {
  id: string;
  content: string;
  rating: number;
  created_at: string;
  user_id: string;
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
  const [travels, setTravels] = useState<Travel[]>(initialTravels);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    reviewId: string;
    travelId: string;
  }>({
    isOpen: false,
    reviewId: "",
    travelId: "",
  });

  // 공용 모달 훅들
  const travelModal = useModal();
  const reviewDetailModal = useModal();
  const deleteConfirmModal = useModal();

  const router = useRouter();

  const handleTravelAdded = (newTravel: Travel) => {
    setTravels([newTravel, ...travels]);
  };

  const handleReviewClick = (review: Review) => {
    setSelectedReview(review);
    reviewDetailModal.open();
  };

  const handleReviewDeleteClick = (reviewId: string, travelId: string) => {
    setDeleteConfirm({
      isOpen: true,
      reviewId,
      travelId,
    });
    deleteConfirmModal.open();
  };

  const handleReviewDeleteConfirm = async () => {
    const { reviewId, travelId } = deleteConfirm;

    try {
      const { error } = await supabaseClient
        .from("reviews")
        .delete()
        .eq("id", reviewId);

      if (error) {
        console.error("리뷰 삭제 실패:", error);
        toast("리뷰 삭제에 실패했습니다: " + error.message, {
          type: "error",
        });
        return;
      }

      // UI에서 리뷰 제거
      setTravels((prevTravels) =>
        prevTravels.map((travel) =>
          travel.id === travelId
            ? {
                ...travel,
                reviews:
                  travel.reviews?.filter((review) => review.id !== reviewId) ||
                  [],
              }
            : travel
        )
      );

      toast("리뷰가 삭제되었습니다.", {
        type: "success",
      });
    } catch (err) {
      console.error("리뷰 삭제 중 오류:", err);
      toast("리뷰 삭제 중 오류가 발생했습니다.", {
        type: "error",
      });
    } finally {
      // 모달 닫기
      setDeleteConfirm({
        isOpen: false,
        reviewId: "",
        travelId: "",
      });
      deleteConfirmModal.close();
    }
  };

  const handleReviewDeleteCancel = () => {
    setDeleteConfirm({
      isOpen: false,
      reviewId: "",
      travelId: "",
    });
    deleteConfirmModal.close();
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
        <Link
          href="/profile"
          className="px-3 py-1 text-sm border rounded hover:bg-gray-500"
        >
          프로필
        </Link>
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
          onClick={travelModal.open}
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
                  <h3 className="text-lg font-semibold text-black">
                    {travel.title}
                  </h3>
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
                        className="border-l-2 border-blue-400 pl-3 relative group cursor-pointer hover:bg-gray-50 rounded-r-lg transition-colors"
                        onClick={() => handleReviewClick(review)}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-1">
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
                          {/* 삭제 버튼 - 작성자 또는 관리자만 표시 */}
                          {(profile?.role === "admin" ||
                            review.user_id === userId) && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation(); // 리뷰 클릭 이벤트 방지
                                handleReviewDeleteClick(review.id, travel.id);
                              }}
                              className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700 text-xs px-2 py-1 rounded hover:bg-red-50"
                              title="리뷰 삭제"
                            >
                              삭제
                            </button>
                          )}
                        </div>
                        <p className="text-gray-700 text-sm line-clamp-2">
                          {review.content}
                        </p>
                        <div className="text-xs text-gray-400 mt-1">
                          클릭하여 자세히 보기
                        </div>
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
      <TravelModal
        isOpen={travelModal.isOpen}
        onClose={travelModal.close}
        selectedDate={date || new Date()}
        userId={userId}
        onTravelAdded={handleTravelAdded}
      />

      {/* 리뷰 세부내용 모달 */}
      <ReviewDetailModal
        isOpen={reviewDetailModal.isOpen}
        onClose={reviewDetailModal.close}
        review={selectedReview}
        canDelete={
          selectedReview
            ? profile?.role === "admin" || selectedReview.user_id === userId
            : false
        }
        onDelete={() => {
          if (selectedReview) {
            handleReviewDeleteClick(selectedReview.id, selectedReview.id);
            reviewDetailModal.close();
          }
        }}
      />

      {/* 리뷰 삭제 확인 모달 */}
      {deleteConfirm.isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4 text-black">
              리뷰 삭제 확인
            </h3>
            <p className="text-gray-600 mb-6">
              정말로 이 리뷰를 삭제하시겠습니까?
              <br />
              <span className="text-sm text-gray-500">
                삭제된 리뷰는 복구할 수 없습니다.
              </span>
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={handleReviewDeleteCancel}
                className="px-4 py-2 border border-gray-300 rounded-lg text-black hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleReviewDeleteConfirm}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
