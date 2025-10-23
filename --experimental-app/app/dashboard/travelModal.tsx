"use client";

import { supabaseClient } from "@/lib/supabaseClient";
import { toast } from "js-toastify";
import Modal from "@/components/ui/Modal";
import { Travel, TravelModalProps } from "@/types/travel";
import { useTravelForm } from "@/hooks/useTravelForm";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function TravelModal({
  isOpen,
  onClose,
  selectedDate,
  userId,
  onTravelAdded,
}: TravelModalProps) {
  const { state, dispatch, addDestination, removeDestination, resetForm } =
    useTravelForm();

  const handleSave = async () => {
    if (!state.location.trim()) {
      toast("여행지를 입력해주세요!", { type: "error" });
      return;
    }

    dispatch({ type: "SET_LOADING", payload: true });

    try {
      const {
        data: { user: sessionUser },
        error: userErr,
      } = await supabaseClient.auth.getUser();

      if (userErr) {
        console.error("세션 조회 에러:", userErr);
        toast("세션을 확인할 수 없습니다. 다시 로그인해주세요.", {
          type: "error",
        });
        dispatch({ type: "SET_LOADING", payload: false });
        return;
      }

      if (!sessionUser) {
        toast("로그인이 필요합니다.", { type: "error" });
        dispatch({ type: "SET_LOADING", payload: false });
        return;
      }

      if (sessionUser.id !== userId) {
        console.warn(
          "Warning: session user id and passed userId mismatch",
          sessionUser.id,
          userId
        );
      }

      const effectiveUserId = sessionUser.id;

      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
      const day = String(selectedDate.getDate()).padStart(2, "0");
      const startDateStr = `${year}-${month}-${day}`;
      const endDateStr = startDateStr;

      const { data: tripDataArr, error: tripError } = await supabaseClient
        .from("trip")
        .insert([
          {
            user_id: effectiveUserId,
            title: state.location.trim(),
            start_date: startDateStr,
            end_date: endDateStr,
            is_public: state.isPublic,
            description: state.reviewContent.trim() || null,
          },
        ])
        .select()
        .single();

      if (tripError) {
        console.error("여행 저장 실패:", tripError);
        toast("여행 저장에 실패했습니다: " + tripError.message, {
          type: "error",
        });
        dispatch({ type: "SET_LOADING", payload: false });
        return;
      }

      const createdTrip: Travel = {
        ...tripDataArr,
        destinations: [],
        reviews: [],
      };

      if (tripDataArr && state.destinations.length > 0) {
        const destinationsToInsert = state.destinations.map((dest, index) => ({
          trip_id: tripDataArr.id,
          name: dest.name,
          description: dest.description || null,
          day: dest.day,
          order_num: index + 1,
        }));

        const { data: insertedDestinations, error: destError } =
          await supabaseClient
            .from("destinations")
            .insert(destinationsToInsert)
            .select();

        if (destError) {
          console.error("목적지 저장 실패:", destError);
        } else {
          createdTrip.destinations = insertedDestinations;
        }
      }

      if (tripDataArr && state.reviewContent.trim()) {
        const { data: insertedReviews, error: reviewError } =
          await supabaseClient
            .from("reviews")
            .insert({
              trip_id: tripDataArr.id,
              user_id: effectiveUserId,
              content: state.reviewContent.trim(),
              rating: state.rating,
            })
            .select("id, content, rating, created_at, user_id");

        if (reviewError) {
          console.error("리뷰 저장 실패:", reviewError);
          toast("리뷰 저장에 실패했습니다: " + reviewError.message, {
            type: "error",
          });
        } else {
          console.log("리뷰 저장 성공:", insertedReviews);
          createdTrip.reviews = Array.isArray(insertedReviews)
            ? insertedReviews
            : [insertedReviews];
        }
      }

      onTravelAdded(createdTrip);

      resetForm();
      onClose();
    } catch (err: unknown) {
      console.error("에러:", err);
      toast("여행 저장 중 오류가 발생했습니다.", { type: "error" });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        resetForm();
        onClose();
      }}
      title={`${selectedDate.toLocaleDateString()} 여행지 추가`}
      size="2xl"
      className="overflow-y-auto"
    >
      <input
        type="text"
        placeholder="여행지 입력"
        value={state.location}
        onChange={(e) =>
          dispatch({ type: "SET_LOCATION", payload: e.target.value })
        }
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
            placeholder="설명 (선택사항)"
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

      <textarea
        placeholder="리뷰 작성"
        value={state.reviewContent}
        onChange={(e) =>
          dispatch({ type: "SET_REVIEW_CONTENT", payload: e.target.value })
        }
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
              onClick={() => dispatch({ type: "SET_RATING", payload: star })}
              className="text-2xl"
            >
              {star <= state.rating ? "⭐" : "☆"}
            </button>
          ))}
        </div>
      </div>

      <label className="flex items-center gap-2 my-2">
        <input
          type="checkbox"
          checked={state.isPublic}
          onChange={(e) =>
            dispatch({ type: "SET_IS_PUBLIC", payload: e.target.checked })
          }
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
          disabled={state.loading}
        >
          {state.loading ? (
            <LoadingSpinner variant="dots" size="sm" color="white" />
          ) : (
            "취소"
          )}
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300"
          disabled={state.loading}
        >
          {state.loading ? (
            <LoadingSpinner variant="dots" size="sm" color="white" />
          ) : (
            "저장"
          )}
        </button>
      </div>
    </Modal>
  );
}
