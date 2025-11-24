"use client";

import { supabaseClient } from "@/lib/supabaseClient";
import { toast } from "js-toastify";
import Modal from "@/components/ui/Modal";
import { Travel, TravelModalProps } from "@/types/travel";
import { useTravelForm } from "@/hooks/useTravelForm";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import LocationInput from "./travelForm/LocationInput";
import DestinationSection from "./travelForm/DestinationSection";
import ReviewSection from "./travelForm/ReviewSection";
import ImageSection from "./travelForm/ImageSection";
import RatingSection from "./travelForm/RatingSection";
import PublicToggle from "./travelForm/PublicToggle";

export default function TravelModal({
  isOpen,
  onClose,
  selectedDate,

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
        toast("정보를 확인할 수 없습니다. 다시 로그인해주세요.", {
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
        } else {
          createdTrip.destinations = insertedDestinations;
        }
      }

      let imageUrls: string[] = [];
      if (state.selectedImages.length > 0 && tripDataArr) {
        try {
          const uploadPromises = state.selectedImages.map(
            async (file, index) => {
              const fileExt = file.name.split(".").pop();
              const fileName = `${Date.now()}-${index}.${fileExt}`;
              const filePath = `${effectiveUserId}/${tripDataArr.id}/${fileName}`;

              const { data: uploadData, error: uploadError } =
                await supabaseClient.storage
                  .from("trip-images")
                  .upload(filePath, file, {
                    cacheControl: "3600",
                    upsert: false,
                  });

              if (uploadError) {
                throw uploadError;
              }

              const actualFilePath = uploadData?.path || filePath;

              const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
              const publicUrl = `${supabaseUrl}/storage/v1/object/public/trip-images/${actualFilePath}`;

              return publicUrl;
            }
          );

          imageUrls = await Promise.all(uploadPromises);
        } catch {
          toast(
            "이미지 업로드에 실패했습니다. 리뷰는 저장되지만 이미지는 포함되지 않습니다.",
            {
              type: "warning",
            }
          );
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
              images: imageUrls.length > 0 ? imageUrls : null,
            })
            .select("id, content, rating, created_at, user_id, images");

        if (reviewError) {
          toast("리뷰 저장에 실패했습니다: " + reviewError.message, {
            type: "error",
          });
        } else {
          createdTrip.reviews = Array.isArray(insertedReviews)
            ? insertedReviews
            : [insertedReviews];
        }
      }

      onTravelAdded(createdTrip);

      resetForm();
      onClose();
    } catch {
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
      className="overflow-y-auto relative"
    >
      <LocationInput location={state.location} dispatch={dispatch} />

      <DestinationSection
        state={state}
        dispatch={dispatch}
        addDestination={addDestination}
        removeDestination={removeDestination}
      />

      <ReviewSection reviewContent={state.reviewContent} dispatch={dispatch} />

      <ImageSection state={state} dispatch={dispatch} />

      <RatingSection rating={state.rating} dispatch={dispatch} />

      <PublicToggle isPublic={state.isPublic} dispatch={dispatch} />

      <div className="flex justify-end gap-2">
        <button
          onClick={() => {
            resetForm();
            onClose();
          }}
          className="px-3 py-1 md:px-4 md:py-2 text-xs md:text-sm border rounded hover:bg-gray-100"
          disabled={state.loading}
        >
          취소
        </button>
        <button
          onClick={handleSave}
          className="px-3 py-1 md:px-4 md:py-2 text-xs md:text-sm bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300"
          disabled={state.loading}
        >
          저장
        </button>
      </div>

      {/* 전체 화면 로딩 오버레이 */}
      {state.loading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50 rounded-lg">
          <div className="text-center">
            <LoadingSpinner
              variant="spinner"
              size="xl"
              color="gray"
              text="여행 정보를 저장하는 중"
            />
          </div>
        </div>
      )}
    </Modal>
  );
}
