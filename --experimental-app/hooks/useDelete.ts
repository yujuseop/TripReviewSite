"use client";

import { useState } from "react";
import { supabaseClient } from "@/lib/supabaseClient";
import { toast } from "js-toastify";
import { Travel, Review } from "@/types";

export const useDelete = () => {
  const [isLoading, setIsLoading] = useState(false);

  const deleteReview = async (reviewId: string, travelId: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabaseClient
        .from("reviews")
        .delete()
        .eq("id", reviewId);

      if (error) {
        console.error("리뷰 삭제 실패:", error);
        toast("리뷰 삭제에 실패했습니다: " + error.message, {
          type: "error",
        });
        return { success: false, error };
      }

      toast("리뷰가 삭제되었습니다.", {
        type: "success",
      });

      return { success: true };
    } catch (err) {
      console.error("리뷰 삭제 중 오류:", err);
      toast("리뷰 삭제 중 오류가 발생했습니다.", {
        type: "error",
      });
      return { success: false, error: err };
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTravel = async (travelId: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabaseClient
        .from("trip")
        .delete()
        .eq("id", travelId);

      if (error) {
        console.error("여행 삭제 실패:", error);
        toast("여행 삭제에 실패했습니다: " + error.message, {
          type: "error",
        });
        return { success: false, error };
      }

      toast("여행이 삭제되었습니다.", {
        type: "success",
      });

      return { success: true };
    } catch (err) {
      console.error("여행 삭제 중 오류:", err);
      toast("여행 삭제 중 오류가 발생했습니다.", {
        type: "error",
      });
      return { success: false, error: err };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    deleteReview,
    deleteTravel,
    isLoading,
  };
};
