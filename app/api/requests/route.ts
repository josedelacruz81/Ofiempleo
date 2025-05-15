import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { data, error } = await supabase.from("requests").select();

  if (error) {
    console.log(error);
    return NextResponse.json([] , {status: 500});
  }
  return NextResponse.json(data);
}
