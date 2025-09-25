import { supabaseClient } from "../../../../lib/supabaseClient";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return Response.json(
        { error: "Missing email or password" },
        { status: 400 }
      );
    }

    // 1. 로그인 시도
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return Response.json({ error: error.message }, { status: 401 });
    }

    // 2. profiles 정보 가져오기
    const { data: profile, error: profileError } = await supabaseClient
      .from("profiles")
      .select("nickname")
      .eq("user_id", data.user?.id)
      .single();

    if (profileError) {
      return Response.json({ error: profileError.message }, { status: 400 });
    }

    return Response.json({
      user: {
        id: data.user?.id,
        email: data.user?.email,
        nickname: profile?.nickname,
      },
      session: data.session, // access_token, refresh_token 포함
    });
  } catch (err) {
    console.error("Login error:", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
