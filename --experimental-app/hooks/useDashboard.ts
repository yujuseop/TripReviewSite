"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseClient } from "@/lib/supabaseClient";
import { useModalState } from "@/hooks/useModalState";
import { useDelete } from "@/hooks/useDelete";
import { useReviewEdit } from "@/hooks/useReviewEdit";
import { Travel, Review, Profile } from "@/types";

interface UseDashboardParams {
  profile: Profile;
  initialTravels: Travel[];
  userId: string;
}

export function useDashboard({
  profile,
  initialTravels,
  userId,
}: UseDashboardParams) {
  const [date, setDate] = useState<Date | null>(new Date());
  const [travels, setTravels] = useState<Travel[]>(initialTravels);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [selectedTravel, setSelectedTravel] = useState<Travel | null>(null);

  const router = useRouter();
  const {
    modals,
    deleteConfirm,
    openModal,
    closeModal,
    openDeleteConfirm,
    closeDeleteConfirm,
  } = useModalState();
  const { deleteTravel, isLoading } = useDelete();
  const { updateReview, isLoading: isReviewUpdating } = useReviewEdit();

  const handleTravelAdded = (newTravel: Travel) => {
    setTravels([newTravel, ...travels]);
  };

  const handleReviewClick = (review: Review) => {
    setSelectedReview(review);
    openModal("reviewDetailModal");
  };

  const handleTravelDeleteClick = (travel: Travel) => {
    setSelectedTravel(travel);
    openDeleteConfirm("travel", travel.id);
  };

  const handleTravelDeleteConfirm = async () => {
    if (!selectedTravel) return;
    const result = await deleteTravel(selectedTravel.id);
    if (result.success) {
      setTravels((prevTravels) =>
        prevTravels.filter((t) => t.id !== selectedTravel.id)
      );
      setSelectedTravel(null);
      closeDeleteConfirm();
    }
  };

  const handleReviewEditClick = (review: Review) => {
    setSelectedReview(review);
    openModal("reviewEditModal");
  };

  const handleReviewSave = async (
    reviewId: string,
    content: string,
    rating: number
  ) => {
    const result = await updateReview(reviewId, content, rating);
    if (result.success) {
      setTravels((prevTravels) =>
        prevTravels.map((travel) => ({
          ...travel,
          reviews:
            travel.reviews?.map((r) =>
              r.id === reviewId
                ? {
                    ...r,
                    content,
                    rating,
                  }
                : r
            ) || [],
        }))
      );
    }
  };

  const handleSignOut = async () => {
    await supabaseClient.auth.signOut();
    router.push("/login");
  };

  return {
    profile,
    userId,
    date,
    setDate,
    travels,
    setTravels,
    selectedReview,
    selectedTravel,

    modals,
    deleteConfirm,
    isDeleting: isLoading,
    isReviewUpdating,

    openModal,
    closeModal,
    openDeleteConfirm,
    closeDeleteConfirm,

    handleSignOut,
    handleTravelAdded,
    handleReviewClick,
    handleTravelDeleteClick,
    handleTravelDeleteConfirm,
    handleReviewEditClick,
    handleReviewSave,
  };
}
