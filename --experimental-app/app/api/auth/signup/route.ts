import { supabaseServer } from "@/lib/supabaseServer";

export async function POST(req: Request) {
  try {
    const { email, password, nickname } = await req.json();

    if (!email || !password || !nickname) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseServer.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (error) {
      console.error("supabase createUser error:", error);
      return Response.json({ error: error.message }, { status: 400 });
    }

    if (data.user) {
      const { error: profileError } = await supabaseServer
        .from("profiles")
        .insert({
          user_id: data.user.id,
          nickname,
        });

      if (profileError) {
        console.error("insertProfile error:", profileError);
        return Response.json({ error: profileError.message }, { status: 400 });
      }
    }

    return Response.json({ user: data.user });
  } catch (err) {
    console.error("Signup error:", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
