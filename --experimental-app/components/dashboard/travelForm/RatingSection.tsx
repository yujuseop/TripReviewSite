"use client";

import { TravelFormAction } from "@/types/travel";

interface RatingSectionProps {
  rating: number;
  dispatch: React.Dispatch<TravelFormAction>;
}

export default function RatingSection({
  rating,
  dispatch,
}: RatingSectionProps) {
  return (
    <div className="my-2">
      <label className="block text-sm font-medium mb-1">평점</label>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => dispatch({ type: "SET_RATING", payload: star })}
            className="text-2xl"
          >
            {star <= rating ? "⭐" : "☆"}
          </button>
        ))}
      </div>
    </div>
  );
}
