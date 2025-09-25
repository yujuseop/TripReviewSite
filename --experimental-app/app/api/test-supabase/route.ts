import { supabaseServer } from "@/lib/supabaseServer";

export async function GET() {
  try {
    const { data, error } = await supabaseServer.auth.admin.listUsers({
      perPage: 1,
    });
    if (error)
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
      });
    return new Response(
      JSON.stringify({ ok: true, sampleUserCount: data.users.length }),
      { status: 200 }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
    });
  }
}
