"use client";

import Modal from "./ui/Modal";
import LoadingSpinner from "./ui/LoadingSpinner";
interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
}

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "삭제",
  cancelText = "취소",
  isLoading = false,
}: DeleteConfirmModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="md">
      <p className="text-gray-600 mb-6">
        {message}
        <br />
        <span className="text-sm text-gray-500">
          삭제된 항목은 복구할 수 없습니다.
        </span>
      </p>
      <div className="flex gap-3 justify-end">
        <button
          onClick={onClose}
          disabled={isLoading}
          className="px-4 py-2 border border-gray-300 rounded-lg text-black hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          {isLoading ? (
            <LoadingSpinner variant="spinner" size="sm" color="white" />
          ) : (
            cancelText
          )}
        </button>
        <button
          onClick={onConfirm}
          disabled={isLoading}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
        >
          {isLoading ? (
            <LoadingSpinner variant="spinner" size="sm" color="white" />
          ) : (
            confirmText
          )}
        </button>
      </div>
    </Modal>
  );
}
