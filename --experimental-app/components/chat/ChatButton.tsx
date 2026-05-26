"use client";

import { useState } from "react";
import { Travel } from "@/types";
import ChatModal from "./ChatModal";

interface ChatButtonProps {
  travels: Travel[];
}

export default function ChatButton({ travels }: ChatButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 h-12 px-4 bg-purple-500 hover:bg-purple-600 text-white rounded-full shadow-lg flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
        aria-label="AI 여행 추천 챗봇 열기"
      >
        <span className="text-xl">✈️</span>
        <span className="text-sm font-semibold">챗봇</span>
      </button>

      <ChatModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        travels={travels}
      />
    </>
  );
}
