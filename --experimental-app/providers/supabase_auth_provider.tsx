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
    nickname: string
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
    // Get initial session
    supabaseClient.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });
    return { error: error?.message };
  };

  const signUp = async (email: string, password: string, nickname: string) => {
    const { data, error } = await supabaseClient.auth.signUp({
      email,
      password,
    });

    if (error) return { error: error.message };

    // Add profile after signup
    if (data.user) {
      const { error: profileError } = await supabaseClient
        .from("profiles")
        .insert({
          user_id: data.user.id,
          nickname,
        });

      if (profileError) return { error: profileError.message };
    }

    return {};
  };

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
