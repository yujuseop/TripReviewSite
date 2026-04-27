"use client";

import { useState } from "react";
import { supabaseClient } from "@/lib/supabaseClient";
import { toast } from "js-toastify";
import Modal from "@/components/ui/Modal";
import DestinationSection from "./travelForm/DestinationSection";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useTravelForm } from "@/hooks/useTravelForm";
import { Travel, Destination } from "@/types/travel";

interface TravelEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  travel: Travel | null;
  onUpdated: (updated: Travel) => void;
}

export default function TravelEditModal({
  isOpen,
  onClose,
  travel,
  onUpdated,
}: TravelEditModalProps) {
  const [title, setTitle] = useState(travel?.title ?? "");
  const [existingDests, setExistingDests] = useState<Destination[]>(
    travel?.destinations ?? []
  );
  const [removedDestIds, setRemovedDestIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const { state, dispatch, addDestination, removeDestination, resetForm } =
    useTravelForm();

  if (!travel) return null;

  const handleRemoveExisting = (id: string) => {
    setExistingDests((prev) => prev.filter((d) => d.id !== id));
    setRemovedDestIds((prev) => [...prev, id]);
  };

  const handleClose = () => {
    resetForm();
    setTitle(travel.title);
    setExistingDests(travel.destinations ?? []);
    setRemovedDestIds([]);
    onClose();
  };

  const handleSave = async () => {
    if (!title.trim()) {
      toast("여행 제목을 입력해주세요!", { type: "error" });
      return;
    }

    setLoading(true);
    try {
      // 1. 제목 수정
      if (title.trim() !== travel.title) {
        const { error } = await supabaseClient
          .from("trip")
          .update({ title: title.trim() })
          .eq("id", travel.id);
        if (error) throw new Error("제목 수정 실패: " + error.message);
      }

      // 2. 삭제된 목적지 DB 반영
      if (removedDestIds.length > 0) {
        const { error } = await supabaseClient
          .from("destinations")
          .delete()
          .in("id", removedDestIds);
        if (error) throw new Error("목적지 삭제 실패: " + error.message);
      }

      // 3. 새 목적지 INSERT
      let insertedDests: Destination[] = [];
      if (state.destinations.length > 0) {
        const toInsert = state.destinations.map((dest, i) => ({
          trip_id: travel.id,
          name: dest.name,
          description: dest.description || null,
          day: dest.day,
          order_num: existingDests.length + i + 1,
          category: dest.category || null,
          cost: dest.cost > 0 ? dest.cost : null,
          lat: dest.lat ?? null,
          lng: dest.lng ?? null,
        }));

        const { data, error } = await supabaseClient
          .from("destinations")
          .insert(toInsert)
          .select();
        if (error) throw new Error("목적지 추가 실패: " + error.message);
        insertedDests = data ?? [];
      }

      const updated: Travel = {
        ...travel,
        title: title.trim(),
        destinations: [...existingDests, ...insertedDests],
      };

      onUpdated(updated);
      resetForm();
      setRemovedDestIds([]);
      toast("여행이 수정되었습니다.", { type: "success" });
      onClose();
    } catch (err) {
      toast(err instanceof Error ? err.message : "수정 중 오류가 발생했습니다.", {
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="여행 수정" size="2xl">
      <div className="space-y-4 relative">
        {/* 여행 제목 */}
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-1">
            여행 제목
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border p-2 w-full rounded text-sm focus:outline-none focus:ring-1 focus:ring-purple-400"
          />
        </div>

        {/* 기존 목적지 */}
        {existingDests.length > 0 && (
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-2">
              등록된 목적지
            </label>
            <div className="space-y-1">
              {existingDests
                .sort((a, b) => (a.day ?? 0) - (b.day ?? 0) || (a.order_num ?? 0) - (b.order_num ?? 0))
                .map((dest) => (
                  <div
                    key={dest.id}
                    className="flex justify-between items-center text-xs bg-gray-50 p-2 rounded border"
                  >
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-gray-800">
                        {dest.day}일차 — {dest.name}
                      </span>
                      {dest.category && (
                        <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs">
                          {dest.category}
                        </span>
                      )}
                      {dest.cost != null && dest.cost > 0 && (
                        <span className="text-gray-500">
                          {dest.cost.toLocaleString("ko-KR")}원
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveExisting(dest.id)}
                      className="ml-2 text-red-400 hover:text-red-600 shrink-0"
                    >
                      ✕
                    </button>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* 새 목적지 추가 */}
        <DestinationSection
          state={state}
          dispatch={dispatch}
          addDestination={addDestination}
          removeDestination={removeDestination}
        />

        {/* 액션 버튼 */}
        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={handleClose}
            disabled={loading}
            className="px-4 py-2 text-sm border rounded hover:bg-gray-100 disabled:opacity-50"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 text-sm bg-purple-500 text-white rounded hover:bg-purple-600 disabled:bg-gray-300"
          >
            저장
          </button>
        </div>

        {loading && (
          <div className="absolute inset-0 bg-white/75 flex items-center justify-center z-50 rounded-lg">
            <LoadingSpinner variant="spinner" size="xl" color="gray" text="저장 중" />
          </div>
        )}
      </div>
    </Modal>
  );
}
