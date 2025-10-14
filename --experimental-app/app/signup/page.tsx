"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/supabase_auth_provider";
import { toast } from "js-toastify";

const signupSchema = z
  .object({
    email: z.string().email("유효한 이메일을 입력해주세요."),
    password: z.string().min(6, "비밀번호는 최소 6자리 이상이어야 합니다."),
    confirmPassword: z.string(),
    nickname: z.string().min(2, "닉네임은 최소 2자 이상이어야 합니다."),
    adminCode: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "비밀번호가 일치하지 않습니다.",
  });

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showAdminCode, setShowAdminCode] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormValues) => {
    setLoading(true);
    const cleanEmail = data.email.trim().toLowerCase();
    const cleanPassword = data.password.trim();
    const cleanNickname = data.nickname.trim();

    const { error } = await signUp(
      cleanEmail,
      cleanPassword,
      cleanNickname,
      data.adminCode?.trim()
    );
    console.log("email:", JSON.stringify(data.email));
    setLoading(false);

    if (!error) {
      toast("회원가입이 완료되었습니다! 이메일 인증 후 로그인해주세요.", {
        type: "success",
      });
      router.push("/login");
    } else {
      toast(`회원가입 실패: ${error}`, { type: "error" });
    }
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
          {/* 관리자 코드 */}
          <button
            type="button"
            onClick={() => setShowAdminCode(!showAdminCode)}
            className="text-sm text-blue-600 hover:underline"
          >
            {showAdminCode ? "관리자 코드 숨기기" : "관리자 코드 입력하기"}
          </button>
          {showAdminCode && (
            <div>
              <label className="block text-sm font-medium text-black">
                {" "}
                관리자코드
              </label>
              <input
                type="text"
                {...register("adminCode")}
                className="w-full mt-1 rounded-lg border border-black p-2 text-black"
              />
            </div>
          )}
          {/* 회원가입 버튼 */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 py-2 text-white hover:bg-blue-600"
            >
              {loading ? "회원가입 중..." : "회원가입"}
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
