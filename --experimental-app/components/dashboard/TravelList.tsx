"use client";

import React from "react";
import { Travel, Profile, Review } from "@/types";
import Image from "next/image";

interface TravelListProps {
  travels: Travel[];
  profile: Profile;
  userId: string;
  onReviewClick: (review: Review) => void;
  onTravelDeleteClick: (travel: Travel) => void;
  onReviewEditClick: (review: Review) => void;
}

export default function TravelList({
  travels,
  profile,
  userId,
  onReviewClick,
  onTravelDeleteClick,
  onReviewEditClick,
}: TravelListProps) {
  if (travels.length === 0) {
    return (
      <p className="text-gray-500">
        아직 여행이 없습니다. 새로운 여행을 추가해보세요!
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {travels.map((travel) => (
        <div
          key={travel.id}
          className="border rounded-lg p-4 bg-white shadow-sm"
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-base font-semibold text-black md:text-lg">
              {travel.title}
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-xs md:text-sm text-gray-500">
                {new Date(travel.start_date + "T00:00:00").toLocaleDateString(
                  "ko-KR"
                )}
                {travel.end_date !== travel.start_date &&
                  ` - ${new Date(
                    travel.end_date + "T00:00:00"
                  ).toLocaleDateString("ko-KR")}`}
              </span>
              {(profile?.role === "admin" || travel.user_id === userId) && (
                <button
                  onClick={() => onTravelDeleteClick(travel)}
                  className="text-red-500 hover:text-red-700 text-xs md:text-sm px-2 py-1 rounded hover:bg-red-50 transition-colors"
                  title="여행 삭제"
                >
                  🗑️ 제거
                </button>
              )}
            </div>
          </div>

          {travel.destinations && travel.destinations.length > 0 && (
            <div className="mb-3">
              <h4 className="text-xs md:text-sm font-semibold text-gray-700 mb-2">
                📍 여행 목적지
              </h4>
              <div className="space-y-1">
                {travel.destinations
                  .sort(
                    (a, b) =>
                      (a.day || 0) - (b.day || 0) ||
                      (a.order_num || 0) - (b.order_num || 0)
                  )
                  .map((dest) => (
                    <div key={dest.id} className="text-sm pl-2">
                      <span className="font-medium text-gray-800">
                        {dest.day && `${dest.day}일차 - `}
                        {dest.name}
                      </span>
                      {dest.description && (
                        <p className="text-gray-600 text-xs md:text-sm ml-2">
                          {dest.description}
                        </p>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}

          {travel.reviews && travel.reviews.length > 0 && (
            <div className="mb-2 space-y-2">
              {travel.reviews.map((review) => (
                <div
                  key={review.id}
                  className="border-l-2 border-blue-400 pl-3 relative group cursor-pointer hover:bg-gray-50 rounded-r-lg transition-colors"
                  onClick={() => onReviewClick(review)}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-500 text-xs md:text-base">
                        {Array.from({ length: review.rating }, (_, i) => (
                          <span key={i}>⭐</span>
                        ))}
                      </span>
                    </div>
                    {(profile?.role === "admin" ||
                      review.user_id === userId) && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onReviewEditClick(review);
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-500 hover:text-blue-700 text-xs px-2 py-1 rounded hover:bg-blue-50"
                        title="리뷰 수정"
                      >
                        수정
                      </button>
                    )}
                  </div>
                  <p className="text-gray-700 text-xs md:text-sm line-clamp-2">
                    {review.content}
                  </p>
                  {/* 리뷰 이미지 표시 */}
                  {review.images && review.images.length > 0 && (
                    <div className="mt-2 flex gap-2 flex-wrap">
                      {review.images.map((imageUrl, imgIndex) => {
                        if (typeof imageUrl !== "string" || !imageUrl) {
                          return null;
                        }

                        return (
                          <div key={imgIndex} className="relative w-20 h-20">
                            <Image
                              src={imageUrl}
                              alt={`리뷰 이미지 ${imgIndex + 1}`}
                              width={80}
                              height={80}
                              className="w-full h-full object-cover rounded border cursor-pointer hover:opacity-80 transition-opacity"
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(imageUrl, "_blank");
                              }}
                              onError={(e) => {
                                const imgElement = e.currentTarget;
                                imgElement.style.display = "none";
                              }}
                              loading="lazy"
                            />
                          </div>
                        );
                      })}
                    </div>
                  )}
                  <div className="text-xs text-gray-400 mt-1">자세히 보기</div>
                </div>
              ))}
            </div>
          )}

          {!travel.is_public && (
            <span className="inline-block px-2 py-1 text-xs md:text-sm bg-gray-200 rounded">
              🔒 비공개
            </span>
          )}
          {travel.is_public && (
            <span className="inline-block px-2 py-1 text-xs md:text-sm bg-green-100 text-green-700 rounded">
              🌍 공개
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
