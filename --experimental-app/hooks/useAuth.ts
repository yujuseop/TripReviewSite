import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseClient } from "@/lib/supabaseClient";
import { toast } from "js-toastify";

interface LoginData {
  email: string;
  password: string;
}

interface SignupData {
  email: string;
  password: string;
  nickname: string;
  adminCode?: string;
}

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const login = async (data: LoginData) => {
    setIsLoading(true);
    try {
      const { error } = await supabaseClient.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        toast(`로그인 실패: ${error.message}`, { type: "error" });
        return { success: false, error: error.message };
      }

      toast("로그인 성공!", { type: "success" });
      router.push("/dashboard");
      return { success: true };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "로그인 중 오류가 발생했습니다.";
      toast(`로그인 실패: ${errorMessage}`, { type: "error" });
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading };
};

export const useSignup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const signup = async (data: SignupData) => {
    setIsLoading(true);
    try {
      const { data: signupData, error } = await supabaseClient.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            nickname: data.nickname,
            role:
              data.adminCode &&
              data.adminCode === process.env.NEXT_PUBLIC_ADMIN_CODE
                ? "admin"
                : "user",
          },
        },
      });

      if (error) {
        toast(`회원가입 실패: ${error.message}`, { type: "error" });
        return { success: false, error: error.message };
      }

      toast("회원가입이 완료되었습니다! 로그인해주세요.", {
        type: "success",
      });

      router.push("/login");
      return { success: true };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "회원가입 중 오류가 발생했습니다.";
      toast(`회원가입 실패: ${errorMessage}`, { type: "error" });
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  return { signup, isLoading };
};
