"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseClient } from "@/lib/supabaseClient";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import TravelModal from "./travelModal";
import ReviewDetailModal from "@/components/ReviewDetailModal";
import ReviewEditModal from "@/components/ReviewEditModal";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import { useModalState } from "@/hooks/useModalState";
import { useDelete } from "@/hooks/useDelete";
import { useReviewEdit } from "@/hooks/useReviewEdit";
import Link from "next/link";
import { Travel, Review, Profile } from "@/types";
import SpinnerDemo from "@/components/ui/SpinnerDemo";

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
  const [selectedTravel, setSelectedTravel] = useState<Travel | null>(null);

  const {
    modals,
    deleteConfirm,
    openModal,
    closeModal,
    openDeleteConfirm,
    closeDeleteConfirm,
  } = useModalState();
  const { deleteTravel, isLoading } = useDelete();
  const { updateReview, isLoading: isReviewUpdating } = useReviewEdit();
  const router = useRouter();

  const handleTravelAdded = (newTravel: Travel) => {
    setTravels([newTravel, ...travels]);
  };

  const handleReviewClick = (review: Review) => {
    setSelectedReview(review);
    openModal("reviewDetailModal");
  };

  const handleTravelDeleteClick = (travel: Travel) => {
    setSelectedTravel(travel);
    openDeleteConfirm("travel", travel.id);
  };

  const handleTravelDeleteConfirm = async () => {
    if (!selectedTravel) return;

    const result = await deleteTravel(selectedTravel.id);

    if (result.success) {
      setTravels((prevTravels) =>
        prevTravels.filter((travel) => travel.id !== selectedTravel.id)
      );
      setSelectedTravel(null);
      closeDeleteConfirm();
    }
  };

  const handleReviewEditClick = (review: Review) => {
    setSelectedReview(review);
    openModal("reviewEditModal");
  };

  const handleReviewSave = async (
    reviewId: string,
    content: string,
    rating: number
  ) => {
    const result = await updateReview(reviewId, content, rating);

    if (result.success) {
      setTravels((prevTravels) =>
        prevTravels.map((travel) => ({
          ...travel,
          reviews:
            travel.reviews?.map((review) =>
              review.id === reviewId
                ? {
                    ...review,
                    content,
                    rating,
                  }
                : review
            ) || [],
        }))
      );
    }
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
          className="px-3 py-1 text-sm border rounded-lg hover:bg-gray-500"
        >
          프로필
        </Link>
        <button
          onClick={handleSignOut}
          className="px-3 py-1 text-sm border rounded-lg cursor-pointer hover:bg-gray-500"
        >
          로그아웃
        </button>
      </div>

      {/* 여행 추가 버튼 */}
      <div className="mb-6">
        <button
          onClick={() => openModal("travelModal")}
          className="px-4 py-2  text-white bg-purple-500 rounded-lg cursor-pointer hover:bg-purple-300"
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
            <span className="font-medium">
              {date.toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })}
            </span>
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
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">
                      {new Date(
                        travel.start_date + "T00:00:00"
                      ).toLocaleDateString("ko-KR")}
                      {travel.end_date !== travel.start_date &&
                        ` - ${new Date(
                          travel.end_date + "T00:00:00"
                        ).toLocaleDateString("ko-KR")}`}
                    </span>
                    {/* 여행 삭제 버튼 - 작성자 또는 관리자만 표시 */}
                    {(profile?.role === "admin" ||
                      travel.user_id === userId) && (
                      <button
                        onClick={() => handleTravelDeleteClick(travel)}
                        className="text-red-500 hover:text-red-700 text-sm px-2 py-1 rounded hover:bg-red-50 transition-colors"
                        title="여행 삭제"
                      >
                        🗑️
                      </button>
                    )}
                  </div>
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
                          </div>
                          {/* 수정 버튼 - 작성자 또는 관리자만 표시 */}
                          {(profile?.role === "admin" ||
                            review.user_id === userId) && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleReviewEditClick(review);
                              }}
                              className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-500 hover:text-blue-700 text-xs px-2 py-1 rounded hover:bg-blue-50"
                              title="리뷰 수정"
                            >
                              수정
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
        isOpen={modals.travelModal}
        onClose={() => closeModal("travelModal")}
        selectedDate={date || new Date()}
        userId={userId}
        onTravelAdded={handleTravelAdded}
      />

      {/* 리뷰 세부내용 모달 */}
      <ReviewDetailModal
        isOpen={modals.reviewDetailModal}
        onClose={() => closeModal("reviewDetailModal")}
        review={selectedReview}
        canEdit={
          selectedReview
            ? profile?.role === "admin" || selectedReview.user_id === userId
            : false
        }
        onEdit={() => {
          if (selectedReview) {
            handleReviewEditClick(selectedReview);
            closeModal("reviewDetailModal");
          }
        }}
      />

      {/* 리뷰 수정 모달 */}
      <ReviewEditModal
        isOpen={modals.reviewEditModal}
        onClose={() => closeModal("reviewEditModal")}
        review={selectedReview}
        onSave={handleReviewSave}
        isLoading={isReviewUpdating}
      />

      {/* 여행 삭제 확인 모달 */}
      <DeleteConfirmModal
        isOpen={deleteConfirm.isOpen}
        onClose={closeDeleteConfirm}
        onConfirm={handleTravelDeleteConfirm}
        title="여행 삭제 확인"
        message="정말로 이 여행을 삭제하시겠습니까?"
        isLoading={isLoading}
      />
    </div>
  );
}
