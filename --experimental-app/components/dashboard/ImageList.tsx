"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { Travel } from "@/types/travel";

interface ImageItem {
  url: string;
  createdAt: string;
}

interface ImageListProps {
  travels: Travel[];
}

export default function ImageList({ travels }: ImageListProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const images = useMemo(() => {
    const allImages: ImageItem[] = [];
    travels.forEach((travel) => {
      travel.reviews?.forEach((review) => {
        if (review.images && Array.isArray(review.images)) {
          review.images.forEach((imageUrl) => {
            if (typeof imageUrl === "string" && imageUrl.length > 0) {
              allImages.push({
                url: imageUrl,
                createdAt: review.created_at || new Date().toISOString(),
              });
            }
          });
        }
      });
    });

    return allImages.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [travels]);

  useEffect(() => {
    if (!isAutoPlaying || images.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [images.length, isAutoPlaying]);

  if (images.length === 0) {
    return (
      <div className="text-gray-400 flex items-center justify-center py-8 border rounded h-full">
        이미지가 없습니다
      </div>
    );
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
    setIsAutoPlaying(false);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  return (
    <div className="relative">
      {/* 이미지 슬라이더 */}
      <div className="relative h-[200px] overflow-hidden rounded-lg border md:h-[400px]">
        <div
          className="flex transition-transform duration-500 ease-in-out h-full"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
          }}
        >
          {images.map((image, index) => (
            <div
              key={image.url || index}
              className="min-w-full h-full relative cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => window.open(image.url, "_blank")}
            >
              <Image
                src={image.url}
                alt={`이미지 ${index + 1}`}
                fill
                className="object-contain"
                sizes="100vw"
              />
            </div>
          ))}
        </div>

        {/* 이전/다음 버튼 */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToPrev();
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors z-10"
              aria-label="이전 이미지"
            >
              ←
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors z-10"
              aria-label="다음 이미지"
            >
              →
            </button>
          </>
        )}
      </div>

      {/* 인디케이터 (하단 점들) */}
      {images.length > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex
                  ? "bg-blue-500 w-8"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`이미지 ${index + 1}로 이동`}
            />
          ))}
        </div>
      )}

      {/* 이미지 정보 (현재 이미지 번호) */}
      {images.length > 1 && (
        <div className="text-center text-sm text-gray-500 mt-2">
          {currentIndex + 1} / {images.length}
        </div>
      )}

      {/* 자동 재생 토글 */}
      {images.length > 1 && (
        <div className="text-center mt-2">
          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className="text-xs text-gray-500 hover:text-gray-700"
          >
            {isAutoPlaying ? "⏸ 일시정지" : "▶ 재생"}
          </button>
        </div>
      )}
    </div>
  );
}
