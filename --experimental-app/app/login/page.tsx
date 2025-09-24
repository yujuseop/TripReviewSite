"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const loginSchema = z.object({
  email: z.string().email("유효한 이메일을 입력해주세요."),
  password: z.string().min(6, "비밀번호는 최소 6자리 이상이어야 합니다."),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginFormValues) => {
    setLoading(true);
    const res = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
    });

    setLoading(false);

    if (res?.ok) {
      router.push("/");
    } else {
      alert("로그인에 실패하였습니다.");
    }
  };

  return (
    <main className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-black">
          로그인
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
              className="w-full mt-1 rounded-lg border border-gray-300 p-2 text-black"
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
              className="w-full mt-1 rounded-lg border border-gray-300 p-2 text-black"
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>
          {/* 로그인 버튼 */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 py-2 text-white hover:bg-blue-600"
          >
            {loading ? "로그인 중 ..." : "로그인"}
          </button>
        </form>
        {/* 회원가입으로 이동 */}
        <p className="text-center text-sm text-gray-500 p-2">
          아직 회원이 아니신가요? <a href="/signup">회원가입</a>
        </p>
      </div>
    </main>
  );
}
