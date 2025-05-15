import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const limit = request.nextUrl.searchParams.get("limit");
  const query = request.nextUrl.searchParams.get("query") as string;
  if (!isNaN(parseInt(query))) {
    const { data: idResult, error: idError } = await supabase
      .from("users")
      .select(
        "id, created_at, names, lastname, email, phone, profileImage, isBanned, banFinishDate, banReason"
      )
      .eq("id", query);

    return NextResponse.json(idResult);
  }
  const { data, error } = await supabase
    .from("users")
    .select(
      "id,created_at, names, lastname, email,phone, profileImage,isBanned,banFinishDate,banReason"
    )
    .or(
      `names.ilike.%${query}%,email.ilike.%${query}%,lastname.ilike.%${query}%`
    );

 
  if (error) {
    console.log(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
