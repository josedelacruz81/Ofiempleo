import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { data, error } = await supabase.from("posts").select("id");
  const { data:users,error:usersError} =await supabase.from("users").select("id");

  if (error || usersError) {
    return NextResponse.json({
      message: error?.message || usersError?.message,
      status: 400,
    });
  } 
  return NextResponse.json({
    employees: data?.length,
    employers: users?.length - data?.length,
  });
}
