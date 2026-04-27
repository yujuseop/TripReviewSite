import { Destination } from "@/types/travel";

interface TimelineSectionProps {
  destinations: Destination[];
}

const CATEGORY_COLORS: Record<string, string> = {
  관광지: "bg-blue-100 text-blue-700",
  맛집: "bg-orange-100 text-orange-700",
  카페: "bg-yellow-100 text-yellow-700",
  숙소: "bg-green-100 text-green-700",
  액티비티: "bg-purple-100 text-purple-700",
  쇼핑: "bg-pink-100 text-pink-700",
  기타: "bg-gray-100 text-gray-600",
};

export default function TimelineSection({ destinations }: TimelineSectionProps) {
  const grouped = destinations.reduce<Record<number, Destination[]>>((acc, dest) => {
    const day = dest.day ?? 1;
    if (!acc[day]) acc[day] = [];
    acc[day].push(dest);
    return acc;
  }, {});

  const sortedDays = Object.keys(grouped)
    .map(Number)
    .sort((a, b) => a - b);

  if (sortedDays.length === 0) {
    return <p className="text-sm text-gray-400 text-center py-4">등록된 목적지가 없습니다.</p>;
  }

  return (
    <div className="space-y-4">
      {sortedDays.map((day) => (
        <div key={day}>
          <h4 className="text-xs font-bold text-purple-600 uppercase tracking-wide mb-2">
            {day}일차
          </h4>
          <div className="space-y-2 pl-3 border-l-2 border-purple-100">
            {grouped[day]
              .sort((a, b) => (a.order_num ?? 0) - (b.order_num ?? 0))
              .map((dest) => (
                <div key={dest.id} className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-gray-800 text-sm">{dest.name}</span>
                    {dest.category && (
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          CATEGORY_COLORS[dest.category] ?? CATEGORY_COLORS["기타"]
                        }`}
                      >
                        {dest.category}
                      </span>
                    )}
                    {dest.cost != null && dest.cost > 0 && (
                      <span className="text-xs text-gray-500 ml-auto">
                        {dest.cost.toLocaleString("ko-KR")}원
                      </span>
                    )}
                  </div>
                  {dest.description && (
                    <p className="text-xs text-gray-400 mt-1">{dest.description}</p>
                  )}
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
