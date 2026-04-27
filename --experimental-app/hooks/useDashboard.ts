"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { supabaseClient } from "@/lib/supabaseClient";
import { useModalState } from "@/hooks/useModalState";
import { useDelete } from "@/hooks/useDelete";
import { useReviewEdit } from "@/hooks/useReviewEdit";
import { Travel, Review, Profile } from "@/types";

type FilterType = "전체" | "맛집" | "관광지" | "평점순";

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
  const [activeFilter, setActiveFilter] = useState<FilterType>("전체");

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

  const filteredTravels = useMemo(() => {
    if (activeFilter === "맛집" || activeFilter === "관광지") {
      return travels.filter((t) =>
        t.destinations?.some((d) => d.category === activeFilter)
      );
    }
    if (activeFilter === "평점순") {
      return [...travels].sort((a, b) => {
        const avgRating = (t: Travel) =>
          t.reviews?.length
            ? t.reviews.reduce((s, r) => s + r.rating, 0) / t.reviews.length
            : 0;
        return avgRating(b) - avgRating(a);
      });
    }
    return travels;
  }, [travels, activeFilter]);

  const handleTravelAdded = (newTravel: Travel) => {
    setTravels([newTravel, ...travels]);
  };

  const handleReviewClick = (review: Review) => {
    setSelectedReview(review);
    openModal("reviewDetailModal");
  };

  const handleTravelClick = (travel: Travel) => {
    setSelectedTravel(travel);
    openModal("travelDetailModal");
  };

  const handleTravelEditOpen = (travel: Travel) => {
    setSelectedTravel(travel);
    openModal("travelEditModal");
  };

  const handleTravelUpdated = (updated: Travel) => {
    setTravels((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    setSelectedTravel(updated);
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
              r.id === reviewId ? { ...r, content, rating } : r
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
    filteredTravels,
    setTravels,
    selectedReview,
    selectedTravel,
    activeFilter,
    setActiveFilter,

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
    handleTravelClick,
    handleTravelEditOpen,
    handleTravelUpdated,
    handleReviewClick,
    handleTravelDeleteClick,
    handleTravelDeleteConfirm,
    handleReviewEditClick,
    handleReviewSave,
  };
}
