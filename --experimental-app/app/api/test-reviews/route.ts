// app/api/test-reviews/route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET() {
  const { data, error } = await supabase.from("reviews").select("*").limit(10);
  return NextResponse.json({ data, error });
}
