"use client";

import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import TravelModal from "../../components/dashboard/travelModal";
import ReviewDetailModal from "@/components/ReviewDetailModal";
import ReviewEditModal from "@/components/ReviewEditModal";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import Link from "next/link";
import { Travel, Profile } from "@/types";
import { useDashboard } from "@/hooks/useDashboard";
import TravelList from "@/components/dashboard/TravelList";
import ImageList from "@/components/dashboard/ImageList";

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
  const {
    date,
    setDate,
    travels,
    selectedReview,
    modals,
    deleteConfirm,
    isDeleting,
    isReviewUpdating,
    handleSignOut,
    handleTravelAdded,
    handleReviewClick,
    handleTravelDeleteClick,
    handleTravelDeleteConfirm,
    handleReviewEditClick,
    handleReviewSave,
    openModal,
    closeModal,
    closeDeleteConfirm,
  } = useDashboard({ profile, initialTravels, userId });

  return (
    <div className="p-6 ">
      <h1 className="text-xl md:text-2xl font-bold mb-4 ">
        안녕하세요, {profile?.nickname}님 👋
      </h1>
      <div className="mb-4 flex gap-3 ">
        <Link
          href="/profile"
          className="px-3 py-2 md:py-1 text-xs md:text-sm border rounded-lg hover:bg-gray-500"
        >
          프로필
        </Link>
        <button
          onClick={handleSignOut}
          className="px-3 py-2 md:py-1 text-xs border md:text-sm rounded-lg cursor-pointer hover:bg-gray-500"
        >
          로그아웃
        </button>
      </div>

      {/* 여행 추가 버튼 */}
      <div className="my-5 mx-1">
        <button
          onClick={() => openModal("travelModal")}
          className="px-5 py-2 md:px-6  text-xs md:text-sm text-white bg-purple-500 rounded-lg cursor-pointer hover:bg-purple-300"
        >
          여행 추가하기 ✈️
        </button>
      </div>

      {/* 캘린더와 이미지 목록 */}
      <div className="mb-6 flex flex-col md:flex-row gap-6 ">
        {/* 캘린더 UI */}
        <div className="flex-1">
          <h2 className="text-lg md:text-xl font-semibold mb-2">여행 캘린더</h2>
          <Calendar
            value={date}
            onChange={(value) => setDate(value as Date | null)}
            locale="ko-KR"
          />
          {date && (
            <p className="mt-4 text-xs md:text-sm text-gray-600">
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

        {/* 이미지 목록 */}
        <div className="flex-1">
          <h2 className="text-xl font-semibold mb-2">이미지 목록</h2>
          <ImageList travels={travels} />
        </div>
      </div>

      {/* 내 여행 목록 */}
      <div>
        <h2 className="text-xl font-semibold mb-2">내 여행 목록</h2>
        <TravelList
          travels={travels}
          profile={profile}
          userId={userId}
          onReviewClick={handleReviewClick}
          onTravelDeleteClick={handleTravelDeleteClick}
          onReviewEditClick={handleReviewEditClick}
        />
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
        isLoading={isDeleting}
      />
    </div>
  );
}
