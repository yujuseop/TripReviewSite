import Modal from "@/components/ui/Modal";
import TotalCostDisplay from "@/components/dashboard/TotalCostDisplay";
import TimelineSection from "./TimelineSection";
import ReviewSection from "./ReviewSection";
import { Travel } from "@/types/travel";

interface TravelDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  travel: Travel | null;
  onEditClick: () => void;
}

export default function TravelDetailModal({ isOpen, onClose, travel, onEditClick }: TravelDetailModalProps) {
  if (!travel) return null;

  const startDate = new Date(travel.start_date + "T00:00:00").toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const endDate = new Date(travel.end_date + "T00:00:00").toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const isSameDay = travel.start_date === travel.end_date;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={travel.title} size="xl">
      <div className="space-y-6">
        {/* 상단: 날짜 + 총 경비 + 수정 버튼 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm text-gray-500">
              {isSameDay ? startDate : `${startDate} - ${endDate}`}
            </p>
            <button
              onClick={onEditClick}
              className="px-3 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50 text-gray-600 transition-colors shrink-0"
            >
              수정
            </button>
          </div>
          <TotalCostDisplay travels={[travel]} />
        </div>

        {/* 중단: 타임라인 */}
        <div>
          <h3 className="text-sm font-bold text-gray-700 mb-3">📍 여행 타임라인</h3>
          <TimelineSection destinations={travel.destinations ?? []} />
        </div>

        {/* 하단: 리뷰 */}
        <div>
          <h3 className="text-sm font-bold text-gray-700 mb-3">💬 리뷰</h3>
          <ReviewSection reviews={travel.reviews ?? []} />
        </div>
      </div>
    </Modal>
  );
}
