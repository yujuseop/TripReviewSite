"use client";

import { TravelFormAction } from "@/types/travel";

const MOOD_TAGS = [
  "행복함",
  "여유로움",
  "설렘",
  "피곤함",
  "아쉬움",
  "활기참",
  "낭만적",
  "바쁨",
];

interface ReviewSectionProps {
  reviewContent: string;
  oneLineSummary: string;
  moodTags: string[];
  dispatch: React.Dispatch<TravelFormAction>;
}

export default function ReviewSection({
  reviewContent,
  oneLineSummary,
  moodTags,
  dispatch,
}: ReviewSectionProps) {
  return (
    <div className="my-4 border-t pt-4 space-y-3">
      <h3 className="text-sm md:text-base font-semibold">리뷰 작성</h3>

      <input
        type="text"
        placeholder="한 줄 평 (예: 최고의 여행이었다!)"
        value={oneLineSummary}
        onChange={(e) =>
          dispatch({ type: "SET_ONE_LINE_SUMMARY", payload: e.target.value })
        }
        className="border p-2 w-full rounded text-xs md:text-sm focus:outline-none focus:ring-1 focus:ring-purple-400"
      />

      <textarea
        placeholder="상세 리뷰를 작성해주세요. (선택사항)"
        value={reviewContent}
        onChange={(e) =>
          dispatch({ type: "SET_REVIEW_CONTENT", payload: e.target.value })
        }
        className="border p-2 w-full rounded text-xs md:text-sm focus:outline-none focus:ring-1 focus:ring-purple-400"
        rows={3}
      />

      <div>
        <p className="text-xs text-gray-500 mb-2">
          무드 태그 <span className="text-gray-400">(복수 선택 가능)</span>
        </p>
        <div className="flex flex-wrap gap-2">
          {MOOD_TAGS.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() =>
                dispatch({ type: "TOGGLE_MOOD_TAG", payload: tag })
              }
              className={`px-3 py-1 rounded-full text-xs border transition-colors ${
                moodTags.includes(tag)
                  ? "bg-purple-500 text-white border-purple-500"
                  : "bg-white text-gray-600 border-gray-300 hover:border-purple-400"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
