"use client";

import { TravelFormAction } from "@/types/travel";

interface LocationInputProps {
  location: string;
  dispatch: React.Dispatch<TravelFormAction>;
}

export default function LocationInput({
  location,
  dispatch,
}: LocationInputProps) {
  return (
    <input
      type="text"
      placeholder="여행지 입력"
      value={location}
      onChange={(e) =>
        dispatch({ type: "SET_LOCATION", payload: e.target.value })
      }
      className="border p-2 w-full my-1 md:my-2 rounded text-xs md:text-sm"
    />
  );
}
