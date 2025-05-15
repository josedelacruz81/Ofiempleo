import { filterRequestsByStatus } from "@/lib/functions";
import { supabase } from "@/lib/supabase";
import { keys } from "@/types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const key = searchParams.get("key") as keys;

  let fromDate: string | null = null;
  let toDate = new Date().toISOString();

  if (key === keys.mensual) {
    fromDate = new Date(
      new Date().setMonth(new Date().getMonth() - 1)
    ).toISOString();
  } else if (key === keys.semanal) {
    fromDate = new Date(
      new Date().setDate(new Date().getDate() - 7)
    ).toISOString();
  }

  let query = supabase.from("requests").select("*,post:postId(id,profession(*))");

  if (fromDate) {
    query = query.gte("created_at", fromDate).lte("created_at", toDate);
  }
  const { data, error } = await query;

  if (!!error)
    return NextResponse.json({ message: error.message, status: 400 });
  const { aceptadas, pendientes, rechazadas } = filterRequestsByStatus(data);
  return NextResponse.json({ aceptadas, pendientes, rechazadas });
}
