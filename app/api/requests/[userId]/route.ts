import { supabase } from "@/lib/supabase";
import { PENDING } from "@/types";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  const userId = params.userId;

  const { data, error } = await supabase
    .from("requests")
    .select(
      `
    *,
    posts(*,profession(*)),
    user:ownerId(id,names,lastname,profileImage,rating,phone)
    `
    )
    .eq("requesterId", userId);

  const { data: comments, error: commentsError } = await supabase
    .from("comments")
    .select()
    .eq("commenterId", params.userId);

  if (error) {
    console.log(error);
    return NextResponse.json([]);
  }
  return NextResponse.json(data);
}

export async function POST(
  request: Request,
  { params }: { params: { userId: string } }
) {
  const { postId, message, ownerId } = await request.json();
  const userId = params.userId;
  if (!message) {
    return NextResponse.json(
      { message: "Debes escribir un mensaje" },
      {
        status: 400,
      }
    );
  }
  const { error } = await supabase.from("requests").insert({
    requesterId: userId,
    postId,
    ownerId,
    message,
    status: PENDING,
  });
  if (error) {
    console.log(error);
    return NextResponse.json(
      { message: "No se pudo enviar la solicitud" },
      {
        status: 400,
      }
    );
  }
  return NextResponse.json({ message: "Solicitud enviada correctamente" });
}
