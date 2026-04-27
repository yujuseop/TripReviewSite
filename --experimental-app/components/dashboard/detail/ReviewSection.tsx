import Image from "next/image";
import { Review } from "@/types/travel";

interface ReviewSectionProps {
  reviews: Review[];
}

const MOOD_COLORS: Record<string, string> = {
  설렘: "bg-pink-100 text-pink-600",
  행복: "bg-yellow-100 text-yellow-600",
  평온: "bg-green-100 text-green-600",
  피곤: "bg-gray-100 text-gray-500",
  아쉬움: "bg-blue-100 text-blue-500",
  감동: "bg-purple-100 text-purple-600",
  스트레스: "bg-red-100 text-red-500",
};

export default function ReviewSection({ reviews }: ReviewSectionProps) {
  if (reviews.length === 0) {
    return <p className="text-sm text-gray-400 text-center py-4">작성된 리뷰가 없습니다.</p>;
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div key={review.id} className="border rounded-lg p-4 bg-gray-50 space-y-3">
          {/* 평점 + 한줄평 */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-sm font-semibold text-red-400">{review.rating}점</span>
            {review.one_line_summary && (
              <span className="text-sm text-gray-700 italic">"{review.one_line_summary}"</span>
            )}
          </div>

          {/* 무드 태그 */}
          {review.mood_tags && review.mood_tags.length > 0 && (
            <div className="flex gap-1 flex-wrap">
              {review.mood_tags.map((tag) => (
                <span
                  key={tag}
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    MOOD_COLORS[tag] ?? "bg-gray-100 text-gray-500"
                  }`}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* 리뷰 본문 */}
          <p className="text-sm text-gray-700 whitespace-pre-wrap">{review.content}</p>

          {/* 사진 */}
          {review.images && review.images.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {review.images.map((url, i) => {
                if (!url) return null;
                return (
                  <div key={i} className="relative w-20 h-20">
                    <Image
                      src={url}
                      alt={`리뷰 이미지 ${i + 1}`}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover rounded border cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => window.open(url, "_blank")}
                      onError={(e) => { e.currentTarget.style.display = "none"; }}
                      loading="lazy"
                    />
                  </div>
                );
              })}
            </div>
          )}

          <p className="text-xs text-gray-400">
            {new Date(review.created_at).toLocaleDateString("ko-KR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      ))}
    </div>
  );
}
