import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const data = await req.json();
  
  const {data:reportFinded,error:reportFindedError} = await supabase.from("reports").select().eq("reportedId", params.id).eq("reportedBy", data.reportedBy);
  

  const { error } = await supabase.from("reports").insert({
    reportedId: params.id,
    reason: data.reason,
    reportedBy: data.reportedBy,
  });

  if(error) {
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
  revalidatePath("/admin/reports","page");
  return NextResponse.json({ message: "ok" });
}
