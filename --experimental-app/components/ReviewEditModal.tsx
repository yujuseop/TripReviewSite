"use client";

import { useState, useEffect } from "react";
import Modal from "./ui/Modal";
import { Review } from "@/types";
import { toast } from "js-toastify";
import LoadingSpinner from "./ui/LoadingSpinner";

interface ReviewEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  review: Review | null;
  onSave: (reviewId: string, content: string, rating: number) => Promise<void>;
  isLoading?: boolean;
}

export default function ReviewEditModal({
  isOpen,
  onClose,
  review,
  onSave,
  isLoading = false,
}: ReviewEditModalProps) {
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(5);

  useEffect(() => {
    if (review) {
      setContent(review.content || "");
      setRating(review.rating || 5);
    }
  }, [review]);

  const handleSave = async () => {
    if (!review || !content.trim()) {
      toast("리뷰 내용을 입력해주세요!", { type: "error" });
      return;
    }

    if (rating < 1 || rating > 5) {
      toast("평점을 선택해주세요!", { type: "error" });
      return;
    }

    try {
      await onSave(review.id, content.trim(), rating);
      onClose();
    } catch (error) {
      console.error("리뷰 수정 실패:", error);
    }
  };

  const handleClose = () => {
    if (review) {
      setContent(review.content || "");
      setRating(review.rating || 5);
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="리뷰 수정" size="lg">
      <div className="space-y-1 md:space-y-4">
        {/* 평점 선택 */}
        <div>
          <label className="block text-sm md:text-lg font-medium mb-2">
            평점
          </label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((score) => (
              <button
                key={score}
                type="button"
                onClick={() => setRating(score)}
                className={`px-3 py-1 rounded border text-sm md:text-base transition-colors ${
                  score === rating
                    ? "bg-gray-500 text-white border-gray-500"
                    : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
                }`}
                disabled={isLoading}
              >
                {score}점
              </button>
            ))}
          </div>
        </div>

        {/* 리뷰 내용 */}
        <div>
          <label className="block text-sm md:text-lg font-medium mb-2">
            리뷰 내용
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="여행에 대한 리뷰를 작성해주세요."
            className="w-full p-3 border text-xs md:text-sm border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={4}
            disabled={isLoading}
          />
        </div>

        {/* 버튼 */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="px-3 py-1 md:px-4 md:py-2  border text-xs md:text-sm border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading || !content.trim()}
            className="px-3 py-1 md:px-4 md:py-2 text-xs md:text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              <LoadingSpinner variant="spinner" size="sm" color="white" />
            ) : (
              "수정"
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}
