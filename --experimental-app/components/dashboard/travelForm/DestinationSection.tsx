"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { TravelFormState, TravelFormAction } from "@/types/travel";

const KakaoMapPicker = dynamic(() => import("./KakaoMapPicker"), {
  ssr: false,
  loading: () => (
    <div className="h-40 flex items-center justify-center text-xs text-gray-400 border rounded-lg mt-2">
      지도 불러오는 중...
    </div>
  ),
});

const CATEGORIES = ["관광지", "맛집", "카페", "숙소", "액티비티", "쇼핑", "기타"];

interface DestinationSectionProps {
  state: TravelFormState;
  dispatch: React.Dispatch<TravelFormAction>;
  addDestination: () => void;
  removeDestination: (index: number) => void;
}

export default function DestinationSection({
  state,
  dispatch,
  addDestination,
  removeDestination,
}: DestinationSectionProps) {
  const [showMap, setShowMap] = useState(false);

  const handleAddDestination = () => {
    addDestination();
    setShowMap(false);
  };

  const handleLocationSelect = (lat: number, lng: number, placeName: string) => {
    dispatch({ type: "SET_DEST_LAT", payload: lat });
    dispatch({ type: "SET_DEST_LNG", payload: lng });
    dispatch({ type: "SET_DEST_PLACE_NAME", payload: placeName });
  };

  const handleClearLocation = () => {
    dispatch({ type: "SET_DEST_LAT", payload: null });
    dispatch({ type: "SET_DEST_LNG", payload: null });
    dispatch({ type: "SET_DEST_PLACE_NAME", payload: "" });
  };

  return (
    <div className="my-4 border-t pt-4">
      <h3 className="text-sm md:text-base font-semibold mb-3">여행 목적지 추가</h3>

      <div className="space-y-2 mb-3">
        {/* 이름 + 일차 */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="목적지 이름"
            value={state.destName}
            onChange={(e) =>
              dispatch({ type: "SET_DEST_NAME", payload: e.target.value })
            }
            className="border p-2 flex-1 rounded text-xs md:text-sm focus:outline-none focus:ring-1 focus:ring-purple-400"
          />
          <select
            value={state.destDay}
            onChange={(e) =>
              dispatch({ type: "SET_DEST_DAY", payload: Number(e.target.value) })
            }
            className="border p-2 rounded text-xs md:text-sm focus:outline-none"
          >
            {[1, 2, 3, 4, 5, 6, 7].map((d) => (
              <option key={d} value={d}>
                {d}일차
              </option>
            ))}
          </select>
        </div>

        {/* 카테고리 + 비용 */}
        <div className="flex gap-2">
          <select
            value={state.destCategory}
            onChange={(e) =>
              dispatch({ type: "SET_DEST_CATEGORY", payload: e.target.value })
            }
            className="border p-2 rounded text-xs md:text-sm focus:outline-none flex-1"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <div className="relative flex-1">
            <input
              type="number"
              placeholder="비용"
              min={0}
              value={state.destCost === 0 ? "" : state.destCost}
              onChange={(e) =>
                dispatch({
                  type: "SET_DEST_COST",
                  payload: Number(e.target.value) || 0,
                })
              }
              className="border p-2 w-full rounded text-xs md:text-sm focus:outline-none focus:ring-1 focus:ring-purple-400 pr-6"
            />
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400">
              원
            </span>
          </div>
        </div>

        {/* 세부사항 */}
        <input
          type="text"
          placeholder="세부사항 (선택사항)"
          value={state.destDesc}
          onChange={(e) =>
            dispatch({ type: "SET_DEST_DESC", payload: e.target.value })
          }
          className="border p-2 w-full rounded text-xs md:text-sm focus:outline-none focus:ring-1 focus:ring-purple-400"
        />

        {/* 지도 토글 버튼 */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setShowMap((prev) => !prev)}
            className={`px-3 py-1 text-xs rounded border transition-colors ${
              showMap
                ? "bg-yellow-400 border-yellow-400 text-gray-900"
                : "bg-white border-gray-300 text-gray-600 hover:border-yellow-400"
            }`}
          >
            🗺 {showMap ? "지도 닫기" : "지도에서 위치 선택"}
          </button>

          {/* 선택된 위치 표시 */}
          {state.destLat && state.destLng && (
            <div className="flex items-center gap-1 text-xs text-green-700 bg-green-50 border border-green-200 rounded px-2 py-1">
              <span>📍 {state.destPlaceName || `${state.destLat.toFixed(4)}, ${state.destLng.toFixed(4)}`}</span>
              <button
                type="button"
                onClick={handleClearLocation}
                className="text-green-400 hover:text-red-500 ml-1"
              >
                ✕
              </button>
            </div>
          )}
        </div>

        {/* 카카오맵 */}
        {showMap && (
          <KakaoMapPicker
            onSelect={handleLocationSelect}
            initialLat={state.destLat}
            initialLng={state.destLng}
          />
        )}

        <button
          type="button"
          onClick={handleAddDestination}
          className="px-3 py-1 text-xs md:text-sm bg-gray-100 rounded hover:bg-gray-200 border border-gray-300"
        >
          + 목적지 추가
        </button>
      </div>

      {/* 추가된 목적지 목록 */}
      {state.destinations.length > 0 && (
        <div className="space-y-1">
          {state.destinations.map((dest, index) => (
            <div
              key={index}
              className="flex justify-between items-center text-xs bg-gray-50 p-2 rounded border"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-gray-800">
                    {dest.day}일차 — {dest.name}
                  </span>
                  <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs">
                    {dest.category}
                  </span>
                  {dest.cost > 0 && (
                    <span className="text-gray-500">
                      {dest.cost.toLocaleString("ko-KR")}원
                    </span>
                  )}
                  {dest.lat && dest.lng && (
                    <span className="text-blue-400">📍</span>
                  )}
                </div>
                {dest.description && (
                  <p className="text-gray-400 mt-0.5 truncate">{dest.description}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => removeDestination(index)}
                className="ml-2 text-red-400 hover:text-red-600 shrink-0"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
