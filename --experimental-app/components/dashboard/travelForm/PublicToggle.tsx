"use client";

import { TravelFormAction } from "@/types/travel";

interface PublicToggleProps {
  isPublic: boolean;
  dispatch: React.Dispatch<TravelFormAction>;
}

export default function PublicToggle({
  isPublic,
  dispatch,
}: PublicToggleProps) {
  return (
    <label className="flex items-center gap-2 my-2 text-sm md:text-lg">
      <input
        type="checkbox"
        checked={isPublic}
        onChange={(e) =>
          dispatch({ type: "SET_IS_PUBLIC", payload: e.target.checked })
        }
      />
      공개 여행으로 설정
    </label>
  );
}
