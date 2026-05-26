"use client";

import { useChat } from "ai/react";
import { useEffect, useRef } from "react";
import { Travel } from "@/types";

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  travels: Travel[];
}

const QUICK_QUESTIONS = [
  "국내 여행지 추천해줘",
  "해외 여행지 추천해줘",
  "나에게 맞는 여행지 추천해줘",
  "가성비 좋은 여행지 알려줘",
];

export default function ChatModal({ isOpen, onClose, travels }: ChatModalProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const travelHistory = travels.map((t) => ({
    title: t.title,
    destination: t.destinations?.map((d) => d.name).join(", ") || "미정",
    start_date: t.start_date,
    end_date: t.end_date,
  }));

  const { messages, input, handleInputChange, handleSubmit, isLoading, setInput, error } = useChat({
    api: "/api/chat",
    body: { travelHistory },
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!isOpen) return null;

  const handleQuickQuestion = (question: string) => {
    setInput(question);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-end p-4 md:p-6 pointer-events-none">
      <div className="pointer-events-auto w-full max-w-sm md:max-w-md bg-white rounded-2xl shadow-2xl flex flex-col h-[600px] border border-gray-200">
        {/* 헤더 */}
        <div className="flex items-center justify-between px-4 py-3 bg-purple-500 rounded-t-2xl">
          <div className="flex items-center gap-2">
            <span className="text-white text-lg">✈️</span>
            <div>
              <p className="text-white font-semibold text-sm">여행 AI 어시스턴트</p>
              <p className="text-purple-200 text-xs">여행지 추천 전문</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-purple-200 transition-colors text-xl leading-none"
          >
            ✕
          </button>
        </div>

        {/* 메시지 목록 */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <p className="text-gray-400 text-sm">
                여행지 추천이 필요하신가요?<br />아래 질문을 눌러보세요!
              </p>
              <div className="flex flex-col gap-2 w-full">
                {QUICK_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => handleQuickQuestion(q)}
                    className="text-sm text-purple-600 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-xl px-3 py-2 transition-colors text-left"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {m.role === "assistant" && (
                <span className="mr-2 text-base self-end mb-1">✈️</span>
              )}
              <div
                className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm whitespace-pre-wrap leading-relaxed ${
                  m.role === "user"
                    ? "bg-purple-500 text-white rounded-br-sm"
                    : "bg-gray-100 text-gray-800 rounded-bl-sm"
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <span className="mr-2 text-base self-end mb-1">✈️</span>
              <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-3 py-2">
                <span className="flex gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0ms]" />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]" />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]" />
                </span>
              </div>
            </div>
          )}

          {error && (
            <div className="flex justify-start">
              <span className="mr-2 text-base self-end mb-1">✈️</span>
              <div className="bg-red-50 border border-red-200 text-red-600 rounded-2xl rounded-bl-sm px-3 py-2 text-sm">
                요청이 너무 많습니다. 잠시 후 다시 시도해주세요.
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* 입력창 */}
        <form
          onSubmit={handleSubmit}
          className="px-3 py-3 border-t border-gray-100 flex gap-2"
        >
          <input
            value={input}
            onChange={handleInputChange}
            placeholder="여행지를 물어보세요..."
            disabled={isLoading}
            className="flex-1 text-sm text-gray-900 border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-purple-400 disabled:bg-gray-50"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-purple-500 hover:bg-purple-600 disabled:bg-gray-200 text-white rounded-xl px-3 py-2 text-sm transition-colors"
          >
            전송
          </button>
        </form>
      </div>
    </div>
  );
}
