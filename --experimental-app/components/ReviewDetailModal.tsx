import Modal from "./ui/Modal";
import { Review } from "@/types/travel";

interface ReviewDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  review: Review | null;
  canEdit: boolean;
  onEdit: () => void;
}

export default function ReviewDetailModal({
  isOpen,
  onClose,
  review,
  canEdit,
  onEdit,
}: ReviewDetailModalProps) {
  if (!review) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="리뷰 상세보기" size="lg">
      <div className="space-y-4">
        {/* 평점 */}
        <div>
          <label className="text-sm md:text-lg font-medium text-gray-700">
            평점
          </label>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-red-300 text-xs md:text-base">
              {review.rating}점
            </span>
          </div>
        </div>

        {/* 작성일 */}
        <div>
          <label className="text-sm md:text-lg font-medium text-gray-700">
            작성일
          </label>
          <p className="text-gray-600 text-xs md:text-sm mt-1">
            {new Date(review.created_at).toLocaleDateString("ko-KR", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>

        {/* 리뷰 내용 */}
        <div>
          <label className="text-sm md:text-lg font-medium text-gray-700">
            리뷰 내용
          </label>
          <div className="mt-1 p-3 bg-gray-50 rounded-lg">
            <p className="text-gray-800 text-xs md:text-base  whitespace-pre-wrap">
              {review.content}
            </p>
          </div>
        </div>
      </div>

      {/* 액션 버튼들 */}
      <div className="flex gap-3 justify-end mt-6">
        <button
          onClick={onClose}
          className="px-4 py-2 border text-xs md:text-sm border-gray-300 rounded-lg text-black hover:bg-gray-50 transition-colors"
        >
          닫기
        </button>
        {canEdit && (
          <button
            onClick={onEdit}
            className="px-4 py-2 text-xs md:text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            수정
          </button>
        )}
      </div>
    </Modal>
  );
}
