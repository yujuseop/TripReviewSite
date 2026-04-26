"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const slides = [
  { src: "/image/강원도.jpeg", label: "강원도 정동진" },
  { src: "/image/경기도 가평.jpeg", label: "경기도 가평" },
  { src: "/image/대구.jpeg", label: "대구 팔공산" },
  { src: "/image/롯데월드&타워.jpeg", label: "서울 롯데월드 & 타워" },
  { src: "/image/영월.jpeg", label: "영월 청령포" },
  { src: "/image/전라도 전주.jpeg", label: "전라도 전주" },
  { src: "/image/진해.jpeg", label: "진해 군항제" },
  { src: "/image/충청도.jpeg", label: "충청도 단양" },
  { src: "/image/해운대.jpeg", label: "부산 해운대" },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {slides.map((slide, i) => (
        <div
          key={slide.src}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            i === current ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={slide.src}
            alt={slide.label}
            fill
            className="object-cover"
            priority={i === 0}
          />
        </div>
      ))}

      <div className="absolute inset-0 bg-black/50" />

      <div className="relative z-10 text-center text-white px-4">
        <p className="text-sm md:text-base tracking-[0.3em] uppercase text-white/70 mb-4">
          Your Travel Journal
        </p>
        <h1 className="text-6xl md:text-8xl font-bold mb-6 drop-shadow-lg">
          TripView
        </h1>
        <p className="text-xl md:text-2xl mb-3 drop-shadow">
          나만의 여행을 기록하고, 추억을 공유하세요.
        </p>
        <p className="text-sm md:text-base text-white/70 mb-12">
          여행지 · 리뷰 · 사진까지 한 곳에서 관리하세요.
        </p>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === current ? "w-6 bg-white" : "w-2 bg-white/40"
            }`}
          />
        ))}
      </div>

      <div className="absolute bottom-8 right-8 z-10 text-white/60 text-sm">
        📍 {slides[current].label}
      </div>
    </section>
  );
}
