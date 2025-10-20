import Modal from "./ui/Modal";

interface Review {
  id: string;
  content: string;
  rating: number;
  created_at: string;
  user_id: string;
}

interface ReviewDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  review: Review | null;
  canDelete: boolean;
  onDelete: () => void;
}

export default function ReviewDetailModal({
  isOpen,
  onClose,
  review,
  canDelete,
  onDelete,
}: ReviewDetailModalProps) {
  if (!review) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="리뷰 상세보기" size="lg">
      <div className="space-y-4">
        {/* 평점 */}
        <div>
          <label className="text-sm font-medium text-gray-700">평점</label>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-yellow-500 text-xl">
              {Array.from({ length: review.rating }, (_, i) => (
                <span key={i}>⭐</span>
              ))}
            </span>
            <span className="text-gray-600 text-sm">({review.rating}/5)</span>
          </div>
        </div>

        {/* 작성일 */}
        <div>
          <label className="text-sm font-medium text-gray-700">작성일</label>
          <p className="text-gray-600 text-sm mt-1">
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
          <label className="text-sm font-medium text-gray-700">리뷰 내용</label>
          <div className="mt-1 p-3 bg-gray-50 rounded-lg">
            <p className="text-gray-800 whitespace-pre-wrap">
              {review.content}
            </p>
          </div>
        </div>
      </div>

      {/* 액션 버튼들 */}
      <div className="flex gap-3 justify-end mt-6">
        <button
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded-lg text-black hover:bg-gray-50 transition-colors"
        >
          닫기
        </button>
        {canDelete && (
          <button
            onClick={onDelete}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            삭제
          </button>
        )}
      </div>
    </Modal>
  );
}
