import { auth } from "@/auth";
import { supabase } from "@/lib/supabase";
import { ADMIN } from "@/types";
import { NextResponse } from "next/server";

export const GET = auth(async function GET(req) {
  console.log(req.auth);
  const { data, error } = await supabase
    .from("posts")
    .select(
      `
      *,
      users (names,lastname, location,profileImage),
      profession (*)
      
      `
    )
    .order("created_at", { ascending: false })
    .order("created_at", { ascending: false });
  if (!!error)
    return NextResponse.json({ message: error.message, status: 400 });
  return NextResponse.json(data);
});

export const PATCH = auth(async function PATCH(req) {
  if (!req.auth)
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  if(req.auth.user.role !== ADMIN) 
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const data = await req.json();

  const { error } = await supabase
    .from("posts")
    .update({ status: data.status })
    .eq("id", data.postId);

  if (!!error) {
    console.log(error);
    return NextResponse.json({ message: error.message, status: 400 });
  }
  return NextResponse.json({ message: "Post aprobado correctamente" });
});
