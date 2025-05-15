import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function GET() {
  const {data, error } = await supabase.from("jobRequests").select(`*, user:userId(id,names,lastname,profileImage)`).order("created_at", { ascending: false });
  if(error) {
    console.log(error);
    return NextResponse.json([], { status: 500 });
  }
  revalidatePath("/admin/requests","page");
  return NextResponse.json(data);
}
