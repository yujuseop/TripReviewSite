"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabaseClient } from "@/lib/supabaseClient";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (
    email: string,
    password: string,
    nickname: string,
    adminCode?: string
  ) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function SupabaseAuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    //초기 세션 가져오기
    supabaseClient.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    //인증 상태 변경 감지
    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // 로그인
  const signIn = async (email: string, password: string) => {
    const { error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });
    return { error: error?.message };
  };

  // 회원가입
  const signUp = async (
    email: string,
    password: string,
    nickname: string,
    adminCode?: string
  ) => {
    // 👉 관리자 코드가 일치하면 admin, 아니면 일반 user
    const role =
      adminCode && adminCode === process.env.NEXT_PUBLIC_ADMIN_CODE
        ? "admin"
        : "user";

    const { data, error } = await supabaseClient.auth.signUp({
      email,
      password,
      options: {
        data: {
          nickname,
          role,
        },
      },
    });
    if (error) return { error: error.message };

    if (data.user) {
      //프로필 테이블에 닉네임 + 역할 저장
      const { error: profileError } = await supabaseClient
        .from("profiles")
        .insert({
          user_id: data.user.id,
          nickname,
          role,
        });

      if (profileError) return { error: profileError.message };
    }

    return {};
  };

  // 로그아웃
  const signOut = async () => {
    await supabaseClient.auth.signOut();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within a SupabaseAuthProvider");
  }
  return context;
};
