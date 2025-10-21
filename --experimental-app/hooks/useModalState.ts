"use client";

import { useState } from "react";

interface ModalState {
  travelModal: boolean;
  reviewDetailModal: boolean;
  travelDeleteModal: boolean;
  reviewDeleteModal: boolean;
  reviewEditModal: boolean;
}

interface DeleteConfirmState {
  isOpen: boolean;
  type: "travel" | "review" | null;
  itemId: string;
  travelId?: string;
}

export const useModalState = () => {
  const [modals, setModals] = useState<ModalState>({
    travelModal: false,
    reviewDetailModal: false,
    travelDeleteModal: false,
    reviewDeleteModal: false,
    reviewEditModal: false,
  });

  const [deleteConfirm, setDeleteConfirm] = useState<DeleteConfirmState>({
    isOpen: false,
    type: null,
    itemId: "",
    travelId: "",
  });

  const openModal = (modalName: keyof ModalState) => {
    setModals((prev) => ({ ...prev, [modalName]: true }));
  };

  const closeModal = (modalName: keyof ModalState) => {
    setModals((prev) => ({ ...prev, [modalName]: false }));
  };

  const openDeleteConfirm = (
    type: "travel" | "review",
    itemId: string,
    travelId?: string
  ) => {
    setDeleteConfirm({
      isOpen: true,
      type,
      itemId,
      travelId,
    });
  };

  const closeDeleteConfirm = () => {
    setDeleteConfirm({
      isOpen: false,
      type: null,
      itemId: "",
      travelId: "",
    });
  };

  const closeAllModals = () => {
    setModals({
      travelModal: false,
      reviewDetailModal: false,
      travelDeleteModal: false,
      reviewDeleteModal: false,
      reviewEditModal: false,
    });
    closeDeleteConfirm();
  };

  return {
    modals,
    deleteConfirm,
    openModal,
    closeModal,
    openDeleteConfirm,
    closeDeleteConfirm,
    closeAllModals,
  };
};
