"use client";

import { TravelFormAction } from "@/types/travel";

interface ReviewSectionProps {
  reviewContent: string;
  dispatch: React.Dispatch<TravelFormAction>;
}

export default function ReviewSection({
  reviewContent,
  dispatch,
}: ReviewSectionProps) {
  return (
    <textarea
      placeholder="리뷰 작성"
      value={reviewContent}
      onChange={(e) =>
        dispatch({ type: "SET_REVIEW_CONTENT", payload: e.target.value })
      }
      className="border p-2 w-full my-2 rounded"
      rows={3}
    />
  );
}
