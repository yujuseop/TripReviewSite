"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useMutation } from "@tanstack/react-query";
import { signupApi } from "@/lib/api/auth";

const signupSchema = z
  .object({
    email: z.string().email("유효한 이메일을 입력해주세요."),
    password: z.string().min(6, "비밀번호는 최소 6자리 이상이어야 합니다."),
    confirmPassword: z.string(),
    nickname: z.string().min(2, "닉네임은 최소 2자 이상이어야 합니다."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"], // 오타 수정 (Passwrod → Password)
    message: "비밀번호가 일치하지 않습니다.",
  });

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  });

  // react-query mutation
  const signupMutation = useMutation({
    mutationFn: signupApi,
    onSuccess: async (data, variables) => {
      // 회원가입 성공 시 자동 로그인
      const loginRes = await signIn("credentials", {
        redirect: false,
        email: variables.email,
        password: variables.password,
      });

      if (loginRes?.ok) {
        router.push("/");
      } else {
        alert(
          "회원가입은 되었으나 자동로그인 실패. 로그인 페이지로 이동합니다."
        );
        router.push("/login");
      }
    },
    onError: (error: any) => {
      alert(error.message || "회원가입 중 오류가 발생했습니다.");
    },
  });

  const onSubmit = (data: SignupFormValues) => {
    signupMutation.mutate({
      email: data.email,
      password: data.password,
      nickname: data.nickname,
    });
  };

  return (
    <main className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-md">
        <h1 className="text-2xl mb-6 text-center font-bold text-black">
          회원가입
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* 이메일 */}
          <div>
            <label className="block text-sm font-medium text-black">
              이메일
            </label>
            <input
              type="email"
              {...register("email")}
              className="w-full mt-1 rounded-lg border border-black p-2 text-black"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>
          {/* 비밀번호 */}
          <div>
            <label className="block text-sm font-medium text-black">
              비밀번호
            </label>
            <input
              type="password"
              {...register("password")}
              className="w-full mt-1 rounded-lg border border-black p-2 text-black"
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>
          {/* 비밀번호 확인 */}
          <div>
            <label className="block text-sm font-medium text-black">
              비밀번호 확인
            </label>
            <input
              type="password"
              {...register("confirmPassword")}
              className="w-full mt-1 rounded-lg border border-black p-2 text-black"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
          {/* 닉네임 */}
          <div>
            <label className="block text-sm font-medium text-black">
              닉네임
            </label>
            <input
              type="text"
              {...register("nickname")}
              className="w-full mt-1 rounded-lg border border-black p-2 text-black"
            />
            {errors.nickname && (
              <p className="text-red-500 text-sm">{errors.nickname.message}</p>
            )}
          </div>
          {/* 회원가입 버튼 */}
          <div>
            <button
              type="submit"
              disabled={signupMutation.isPending}
              className="w-full rounded-lg bg-blue-600 py-2 text-white hover:bg-blue-600"
            >
              {signupMutation.isPending ? "회원가입 중..." : "회원가입"}
            </button>
          </div>
        </form>
        {/* 로그인으로 이동 */}
        <p className="mt-4 text center text-sm text-gray-500 p-2">
          이미 회원이신가요?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            로그인
          </a>
        </p>
      </div>
    </main>
  );
}
