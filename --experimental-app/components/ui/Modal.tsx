import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  showCloseButton?: boolean;
  className?: string;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  showCloseButton = true,
  className = "",
}: ModalProps) {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-2xl",
    "2xl": "max-w-4xl",
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div
        className={`bg-white rounded-xl w-full ${sizeClasses[size]} ${className} flex flex-col max-h-[90vh]`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        {(title || showCloseButton) && (
          <div className="flex justify-between items-start p-6 pb-4 border-b flex-shrink-0">
            {title && <h2 className="text-xl font-bold text-black">{title}</h2>}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
                aria-label="모달 닫기"
              >
                &times;
              </button>
            )}
          </div>
        )}

        {/* 내용 - 스크롤 가능 */}
        <div className="text-black overflow-y-auto flex-1 p-6">{children}</div>
      </div>
    </div>
  );
}
