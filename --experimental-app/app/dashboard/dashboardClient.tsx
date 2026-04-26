"use client";

import dynamic from "next/dynamic";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import TravelModal from "../../components/dashboard/travelModal";
import ReviewDetailModal from "@/components/ReviewDetailModal";
import ReviewEditModal from "@/components/ReviewEditModal";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import { Travel, Profile } from "@/types";
import { useDashboard } from "@/hooks/useDashboard";
import TravelList from "@/components/dashboard/TravelList";
import ImageList from "@/components/dashboard/ImageList";
import TotalCostDisplay from "@/components/dashboard/TotalCostDisplay";

const TravelMap = dynamic(
  () => import("@/components/dashboard/TravelMap"),
  { ssr: false }
);

const FILTERS = ["전체", "맛집", "관광지", "평점순"] as const;

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
    filteredTravels,
    selectedReview,
    modals,
    deleteConfirm,
    isDeleting,
    isReviewUpdating,
    activeFilter,
    setActiveFilter,
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
    <div className="p-6">
      <h1 className="text-xl md:text-2xl font-bold mb-4">
        트래블 리뷰에 오신걸 환영합니다. {profile?.nickname}님 👋
      </h1>

      {/* 총 여행 경비 */}
      <TotalCostDisplay travels={travels} />

      {/* 캘린더와 이미지 목록 */}
      <div className="mb-6 flex flex-col md:flex-row gap-6">
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
          <div className="my-1 md:my-5">
            <button
              onClick={() => openModal("travelModal")}
              className="px-5 py-2 md:px-4 text-xs md:text-sm text-white bg-purple-500 rounded-lg cursor-pointer hover:bg-purple-300"
            >
              여행 추가하기 ✈️
            </button>
          </div>
        </div>

        <div className="flex-1">
          <h2 className="text-xl font-semibold mb-2">이미지 목록</h2>
          <ImageList travels={travels} />
        </div>
      </div>

      {/* 필터 탭 + 여행 목록 */}
      <div>
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <h2 className="text-xl font-semibold">내 여행 목록</h2>
          <div className="flex gap-1">
            {FILTERS.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  activeFilter === filter
                    ? "bg-purple-500 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {filteredTravels.length === 0 ? (
          <p className="text-sm text-gray-400 py-6 text-center">
            해당 필터에 맞는 여행이 없습니다.
          </p>
        ) : (
          <TravelList
            travels={filteredTravels}
            profile={profile}
            userId={userId}
            onReviewClick={handleReviewClick}
            onTravelDeleteClick={handleTravelDeleteClick}
            onReviewEditClick={handleReviewEditClick}
          />
        )}
      </div>

      {/* 여행지 지도 (좌표가 있는 목적지만 표시) */}
      <TravelMap travels={travels} />

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
        message="정말로 여행을 삭제하시겠습니까?"
        isLoading={isDeleting}
      />
    </div>
  );
}
