import { supabase } from "@/lib/supabase";
import { EMPLOYEE, EMPLOYER } from "@/types";
import { NextResponse } from "next/server";

export async function GET() {
  const { data:employees, error:employeesError } = await supabase
    .from("ratings")
    .select(`*,user:userId(id,names,lastname,profileImage)`)
    .limit(3)
    .eq("role",EMPLOYEE)
    .order("rating", { ascending: false });
  
    const { data:employers, error:employersError } = await supabase
    .from("ratings")
    .select(`*,user:userId(id,names,lastname,profileImage)`)
    .limit(3)
    .eq("role",EMPLOYER)
    .order("rating", { ascending: false });
  if (employeesError || employersError) {
    console.log(employeesError, employersError);
    return NextResponse.json(
      { message: "error al obtener los usuarios destacados" },
      { status: 500 }
    );
  }
  return NextResponse.json([...employees, ...employers]);
}
