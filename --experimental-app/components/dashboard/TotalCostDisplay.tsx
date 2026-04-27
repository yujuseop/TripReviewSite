import { Travel } from "@/types/travel";

interface TotalCostDisplayProps {
  travels: Travel[];
}

export default function TotalCostDisplay({ travels }: TotalCostDisplayProps) {
  const totalCost = travels.reduce((sum, travel) => {
    return (
      sum +
      (travel.destinations?.reduce(
        (dSum, dest) => dSum + (dest.cost || 0),
        0,
      ) || 0)
    );
  }, 0);

  if (totalCost === 0) return null;

  return (
    <div className="border border-blue-100 rounded-xl px-5 py-4 mb-5 inline-flex items-center gap-4">
      <div>
        <p className="text-xs text-blue-500 font-medium">총 여행 경비</p>
        <p className="text-2xl font-bold text-blue-800">
          {totalCost.toLocaleString("ko-KR")}
          <span className="text-base font-normal ml-1">원</span>
        </p>
      </div>
    </div>
  );
}
