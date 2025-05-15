import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { data, error } = await supabase
    .from("users")
    .select("id", { count: "exact" });
  return NextResponse.json(data?.length);
}
