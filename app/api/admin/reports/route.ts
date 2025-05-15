import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { data, error } = await supabase
    .from("reports")
    .select(
      "*,reported:reportedId(id,names,lastname, profileImage,rating,isBanned,banReason,email),reportedByUser:reportedBy(id,names,lastname, profileImage,rating,isBanned,banReason,email)"
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.log(error);
    return NextResponse.json({ message: "GET reports failed" });
  }
  return NextResponse.json(data);
}
