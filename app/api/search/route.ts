import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const searchQuery = await req.nextUrl.searchParams.get("query");
  let { data, error } = await supabase.rpc("search_multiple_tables", {
    search_term: searchQuery,
  });
  if (error) {
    console.error(error);
    return NextResponse.json({ error }, { status: 500 });
  } else {

    return NextResponse.json(data);
  }
}
