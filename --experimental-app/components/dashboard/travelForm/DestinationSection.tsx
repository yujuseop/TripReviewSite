"use client";

import { TravelFormState, TravelFormAction } from "@/types/travel";

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
  return (
    <div className="my-4 border-t pt-4">
      <h3 className="text-sm font-semibold mb-2">여행 목적지 추가</h3>
      <div className="space-y-2 mb-2">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="목적지 이름"
            value={state.destName}
            onChange={(e) =>
              dispatch({ type: "SET_DEST_NAME", payload: e.target.value })
            }
            className="border p-2 flex-1 rounded text-sm"
          />
          <select
            value={state.destDay}
            onChange={(e) =>
              dispatch({
                type: "SET_DEST_DAY",
                payload: Number(e.target.value),
              })
            }
            className="border p-2 rounded text-sm"
          >
            {[1, 2, 3, 4, 5, 6, 7].map((d) => (
              <option key={d} value={d}>
                {d}일차
              </option>
            ))}
          </select>
        </div>
        <input
          type="text"
          placeholder="세부사항 (선택사항)"
          value={state.destDesc}
          onChange={(e) =>
            dispatch({ type: "SET_DEST_DESC", payload: e.target.value })
          }
          className="border p-2 w-full rounded text-sm"
        />
        <div className="flex gap-2">
          <button
            type="button"
            onClick={addDestination}
            className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
          >
            + 목적지 추가
          </button>
        </div>
      </div>

      {/* 추가된 목적지 목록 */}
      {state.destinations.length > 0 && (
        <div className="space-y-1">
          {state.destinations.map((dest, index) => (
            <div
              key={index}
              className="flex justify-between items-center text-sm bg-gray-50 p-2 rounded"
            >
              <div>
                <span className="font-medium">
                  {dest.day}일차 - {dest.name}
                </span>
                {dest.description && (
                  <p className="text-xs text-black">{dest.description}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => removeDestination(index)}
                className="text-red-500 hover:text-red-700"
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
