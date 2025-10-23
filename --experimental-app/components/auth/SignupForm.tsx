"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSignup } from "@/hooks/useAuth";
import { FormField } from "@/components/forms/FormField";
import { FormButton } from "@/components/forms/FormButton";
import Link from "next/link";
import LoadingSpinner from "../ui/LoadingSpinner";

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

export default function SignupForm() {
  const { signup, isLoading } = useSignup();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid }, //이즈밸리드
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema), //모드온체인지
  });

  const onSubmit = async (data: SignupFormValues) => {
    await signup(data);
  };

  return (
    <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center text-black">
        회원가입
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          {...register("email")}
          label="이메일"
          type="text"
          placeholder="이메일을 입력해주세요"
          error={errors.email?.message}
          required
        />

        <FormField
          {...register("nickname")}
          label="닉네임"
          type="text"
          placeholder="닉네임을 입력해주세요"
          error={errors.nickname?.message}
          required
        />

        <FormField
          {...register("password")}
          label="비밀번호"
          type="password"
          placeholder="비밀번호를 입력해주세요"
          error={errors.password?.message}
          required
        />

        <FormField
          {...register("confirmPassword")}
          label="비밀번호 확인"
          type="password"
          placeholder="비밀번호를 다시 입력해주세요"
          error={errors.confirmPassword?.message}
          required
        />

        <FormField
          label="관리자 코드 (선택사항)"
          type="text"
          placeholder="관리자 코드를 입력해주세요"
          error={errors.adminCode?.message}
          {...register("adminCode")}
        />

        <FormButton
          type="submit"
          isLoading={isLoading || !isValid}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <LoadingSpinner variant="dots" size="sm" color="white" />
          ) : (
            "회원가입"
          )}
        </FormButton>
      </form>

      <div className="text-center text-sm text-gray-500 mt-4">
        이미 회원이신가요?{" "}
        <Link href="/login" className="text-blue-600 hover:underline">
          로그인
        </Link>
      </div>
    </div>
  );
}
