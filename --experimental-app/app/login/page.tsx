"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLogin } from "@/hooks/useAuth";
import { FormField } from "@/components/forms/FormField";
import { FormButton } from "@/components/forms/FormButton";
import Link from "next/link";

const loginSchema = z.object({
  email: z.string().email("유효한 이메일을 입력해주세요."),
  password: z.string().min(6, "비밀번호는 최소 6자리 이상이어야 합니다."),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login, isLoading } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    await login(data);
  };

  return (
    <main className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-black">
          로그인
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            label="이메일"
            type="email"
            placeholder="이메일을 입력해주세요"
            error={errors.email?.message}
            required
            {...register("email")}
          />

          <FormField
            label="비밀번호"
            type="password"
            placeholder="비밀번호를 입력해주세요"
            error={errors.password?.message}
            required
            {...register("password")}
          />

          <FormButton
            type="submit"
            isLoading={isLoading}
            disabled={isLoading}
            className="w-full"
          >
            로그인
          </FormButton>
        </form>

        <div className="text-center text-sm text-gray-500 mt-4">
          아직 회원이 아니신가요?{" "}
          <Link href="/signup" className="text-blue-600 hover:underline">
            회원가입
          </Link>
        </div>
      </div>
    </main>
  );
}
