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
      <label className="block text-sm md:text-lg font-medium mb-1">평점</label>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((score) => (
          <button
            key={score}
            type="button"
            onClick={() => dispatch({ type: "SET_RATING", payload: score })}
            className={`px-3 py-1 rounded border text-sm md:text-base transition-colors ${
              score === rating
                ? "bg-gray-500 text-white border-gray-500"
                : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
            }`}
          >
            {score}점
          </button>
        ))}
      </div>
    </div>
  );
}
