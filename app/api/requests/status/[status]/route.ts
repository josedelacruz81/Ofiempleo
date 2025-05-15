import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { status: string } }
) {
  const { data, error } = await supabase
    .from("requests")
    .select(
      `
      *,
      posts(*,profession(*)),
      user:ownerId(id,names,lastname,profileImage,rating,phone)
      `
    )
    .eq("status", params.status);
  if (error) {
    console.log(error);
    return NextResponse.json([], { status: 500 });
  }
 
  return NextResponse.json(data);
}
