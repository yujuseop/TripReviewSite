"use client";

import { useState } from "react";
import { supabaseClient } from "@/lib/supabaseClient"; // optional: supabase 타입 정의가 있으면 경로 맞춰 사용
import { toast } from "js-toastify";

interface Travel {
  id: string;
  title: string;
  start_date: string;
  end_date: string;
  description?: string;
  is_public: boolean;
  created_at: string;
  destinations?: Array<{
    id: string;
    name: string;
    description: string | null;
    day: number | null;
    order_num: number | null;
    created_at: string;
  }>;
  reviews?: Array<{
    id: string;
    content: string;
    rating: number;
    created_at: string;
  }>;
}

interface TravelModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date;
  userId: string; // 서버에서 내려준 userId (dashboard/page.tsx)
  onTravelAdded: (travel: Travel) => void;
}

export default function TravelModal({
  isOpen,
  onClose,
  selectedDate,
  userId,
  onTravelAdded,
}: TravelModalProps) {
  const supabase = supabaseClient;
  const [location, setLocation] = useState("");
  const [reviewContent, setReviewContent] = useState("");
  const [rating, setRating] = useState(5);
  const [isPublic, setIsPublic] = useState(true);
  const [loading, setLoading] = useState(false);

  // 목적지 관리
  const [destinations, setDestinations] = useState<
    { name: string; description: string; day: number }[]
  >([]);
  const [destName, setDestName] = useState("");
  const [destDesc, setDestDesc] = useState("");
  const [destDay, setDestDay] = useState(1);

  const addDestination = () => {
    if (!destName.trim()) return;
    setDestinations([
      ...destinations,
      { name: destName.trim(), description: destDesc.trim(), day: destDay },
    ]);
    setDestName("");
    setDestDesc("");
    setDestDay(1);
  };

  const removeDestination = (index: number) => {
    setDestinations(destinations.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setLocation("");
    setReviewContent("");
    setRating(5);
    setIsPublic(true);
    setDestinations([]);
    setDestName("");
    setDestDesc("");
    setDestDay(1);
  };

  const handleSave = async () => {
    if (!location.trim()) {
      toast("여행지를 입력해주세요!", { type: "error" });
      return;
    }

    setLoading(true);

    try {
      // 세션 확인 (안정성 체크) — 서버에서 내려준 userId가 있더라도 세션이 유효한지 확인
      const {
        data: { user: sessionUser },
        error: userErr,
      } = await supabase.auth.getUser();

      if (userErr) {
        console.error("세션 조회 에러:", userErr);
        toast("세션을 확인할 수 없습니다. 다시 로그인해주세요.", {
          type: "error",
        });
        setLoading(false);
        return;
      }

      if (!sessionUser) {
        toast("로그인이 필요합니다.", { type: "error" });
        setLoading(false);
        return;
      }

      // 서버에서 내려준 userId와 세션 user id가 일치하는지 확인 (안전성)
      if (sessionUser.id !== userId) {
        // 일치하지 않으면 가능성: 서버에서 전달한 userId가 바뀌었거나 세션이 다름
        console.warn(
          "Warning: session user id and passed userId mismatch",
          sessionUser.id,
          userId
        );
        // 강제로 sessionUser.id를 사용하도록 변경 (더 안전)
      }

      const effectiveUserId = sessionUser.id;

      // 1) trip insert (user_id 명시)
      const startDateStr = selectedDate.toISOString().split("T")[0];
      const endDateStr = startDateStr;

      const { data: tripDataArr, error: tripError } = await supabase
        .from("trip")
        .insert([
          {
            user_id: effectiveUserId, // 명시적으로 넣음
            title: location.trim(),
            start_date: startDateStr,
            end_date: endDateStr,
            is_public: isPublic,
            description: reviewContent.trim() || null,
          },
        ])
        .select()
        .single();

      if (tripError) {
        console.error("여행 저장 실패:", tripError);
        // RLS 거부 에러 등 여기서 잡힘
        toast("여행 저장에 실패했습니다: " + tripError.message, {
          type: "error",
        });
        setLoading(false);
        return;
      }

      // 준비할 결과 객체
      const createdTrip: Travel = {
        ...tripDataArr,
        destinations: [],
        reviews: [],
      };

      // 2) 목적지 추가 (있다면)
      if (tripDataArr && destinations.length > 0) {
        const destinationsToInsert = destinations.map((dest, index) => ({
          trip_id: tripDataArr.id,
          name: dest.name,
          description: dest.description || null,
          day: dest.day,
          order_num: index + 1,
        }));

        const { data: insertedDestinations, error: destError } = await supabase
          .from("destinations")
          .insert(destinationsToInsert)
          .select();

        if (destError) {
          console.error("목적지 저장 실패:", destError);
          // 목적지 실패는 치명적이지 않으니 유저에게 알리되 진행
        } else {
          createdTrip.destinations = insertedDestinations;
        }
      }

      // 3) 리뷰 추가 (있다면)
      if (tripDataArr && reviewContent.trim()) {
        console.log("리뷰 저장 시도 - user_id:", effectiveUserId);
        console.log("리뷰 저장 시도 - trip_id:", tripDataArr.id);

        const { data: insertedReviews, error: reviewError } = await supabase
          .from("reviews")
          .insert({
            trip_id: tripDataArr.id,
            user_id: effectiveUserId,
            content: reviewContent.trim(),
            rating: rating,
          })
          .select();

        if (reviewError) {
          console.error("리뷰 저장 실패:", reviewError);
          toast("리뷰 저장에 실패했습니다: " + reviewError.message, {
            type: "error",
          });
        } else {
          console.log("리뷰 저장 성공:", insertedReviews);
          // insertedReviews may be an array or object depending on .insert usage; normalize to array
          createdTrip.reviews = Array.isArray(insertedReviews)
            ? insertedReviews
            : [insertedReviews];
        }
      }

      // 성공: 부모 컴포넌트에 DB에서 온 레코드(아이디 포함)로 전달
      onTravelAdded(createdTrip);

      // UI 정리
      resetForm();
      onClose();
    } catch (err: unknown) {
      console.error("에러:", err);
      toast("여행 저장 중 오류가 발생했습니다.", { type: "error" });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 text-black overflow-y-auto p-4 z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-2xl my-8">
        <h2 className="text-lg font-bold mb-3">
          {selectedDate.toLocaleDateString()} 여행지 추가
        </h2>

        <input
          type="text"
          placeholder="여행지 입력"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="border p-2 w-full my-2 rounded"
        />

        {/* 목적지 추가 섹션 */}
        <div className="my-4 border-t pt-4">
          <h3 className="text-sm font-semibold mb-2">📍 여행 목적지 추가</h3>
          <div className="space-y-2 mb-2">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="목적지 이름"
                value={destName}
                onChange={(e) => setDestName(e.target.value)}
                className="border p-2 flex-1 rounded text-sm"
              />
              <select
                value={destDay}
                onChange={(e) => setDestDay(Number(e.target.value))}
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
              placeholder="설명 (선택사항)"
              value={destDesc}
              onChange={(e) => setDestDesc(e.target.value)}
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
          {destinations.length > 0 && (
            <div className="space-y-1">
              {destinations.map((dest, index) => (
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

        <textarea
          placeholder="리뷰 작성 (선택사항)"
          value={reviewContent}
          onChange={(e) => setReviewContent(e.target.value)}
          className="border p-2 w-full my-2 rounded"
          rows={3}
        />

        <div className="my-2">
          <label className="block text-sm font-medium mb-1">평점</label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="text-2xl"
              >
                {star <= rating ? "⭐" : "☆"}
              </button>
            ))}
          </div>
        </div>

        <label className="flex items-center gap-2 my-2">
          <input
            type="checkbox"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
          />
          공개 여행으로 설정
        </label>

        <div className="flex justify-end gap-2">
          <button
            onClick={() => {
              resetForm();
              onClose();
            }}
            className="px-4 py-2 border rounded hover:bg-gray-100"
            disabled={loading}
          >
            취소
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300"
            disabled={loading}
          >
            {loading ? "저장 중..." : "저장"}
          </button>
        </div>
      </div>
    </div>
  );
}
