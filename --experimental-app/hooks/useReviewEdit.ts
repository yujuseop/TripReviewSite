"use client";

import { useState } from "react";
import { supabaseClient } from "@/lib/supabaseClient";
import { toast } from "js-toastify";

export const useReviewEdit = () => {
  const [isLoading, setIsLoading] = useState(false);

  const updateReview = async (
    reviewId: string,
    content: string,
    rating: number
  ) => {
    setIsLoading(true);
    try {
      const { error } = await supabaseClient
        .from("reviews")
        .update({
          content,
          rating,
        })
        .eq("id", reviewId);

      if (error) {
        console.error("리뷰 수정 실패:", error);
        toast("리뷰 수정에 실패했습니다: " + error.message, {
          type: "error",
        });
        return { success: false, error };
      }

      toast("리뷰가 수정되었습니다.", {
        type: "success",
      });

      return { success: true };
    } catch (err) {
      console.error("리뷰 수정 중 오류:", err);
      toast("리뷰 수정 중 오류가 발생했습니다.", {
        type: "error",
      });
      return { success: false, error: err };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    updateReview,
    isLoading,
  };
};
