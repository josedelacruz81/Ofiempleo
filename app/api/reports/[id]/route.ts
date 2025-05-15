import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const searchParams = req.nextUrl.searchParams;
  const reportedBy = searchParams.get("reportedBy");

  const { data, error } = await supabase
    .from("reports")
    .select()
    .eq("reportedId", params.id);
  if (error) {
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
  return NextResponse.json(data);
}

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const data = await req.json();

  const { data: reportFinded, error: reportFindedError } = await supabase
    .from("reports")
    .select()
    .eq("reportedId", params.id)
    .eq("reportedBy", data.reportedBy);
  if(reportFindedError){
    console.log(reportFindedError);
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
  if (reportFinded?.length > 0) {
    return NextResponse.json(
      { message: "Ya has reportado a este usuario" },
      { status: 500 }
    );
  }
  const { error } = await supabase.from("reports").insert({
    reportedId: params.id,
    reason: data.reason,
    reportedBy: data.reportedBy,
  });

  if (error) {
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
  return NextResponse.json({ message: "El usuario ha sido reportado correctamente" });
}
