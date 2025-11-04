"use client";

import Image from "next/image";
import { TravelFormState, TravelFormAction } from "@/types/travel";

interface ImageSectionProps {
  state: TravelFormState;
  dispatch: React.Dispatch<TravelFormAction>;
}

export default function ImageSection({ state, dispatch }: ImageSectionProps) {
  return (
    <div className="my-4 border-t pt-4">
      <h3 className="text-sm font-semibold mb-2">이미지 추가 (선택사항)</h3>
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => {
          const files = e.target.files;
          if (files && files.length > 0) {
            dispatch({
              type: "SET_IMAGES",
              payload: Array.from(files),
            });
          }
        }}
        className="border p-2 w-full rounded text-sm"
      />

      {/* 이미지 미리보기 */}
      {state.imagePreviewUrls.length > 0 && (
        <div className="mt-3 grid grid-cols-3 gap-2">
          {state.imagePreviewUrls.map((previewUrl, index) => (
            <div key={index} className="relative group">
              <Image
                src={previewUrl}
                alt={`미리보기 ${index + 1}`}
                width={200}
                height={96}
                className="w-full h-24 object-cover rounded border"
                unoptimized
              />
              <button
                type="button"
                onClick={() =>
                  dispatch({ type: "REMOVE_IMAGE", payload: index })
                }
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                title="이미지 제거"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
