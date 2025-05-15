import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { ADMIN } from "@/types";
export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const page = parseInt(searchParams.get("page") as string);
  // const start = parseInt(searchParams.get("_start") as string);
  // const end = parseInt(searchParams.get("_end") as string);
  const { data, error, count } = await supabase
    .from("users")
    .select(
      "id,created_at, names, lastname, email,phone, profileImage,isBanned,banFinishDate,banReason",
      { count: "exact" }
    )
    .range(page - 1 * 10, (page + 1) * 10 - 1)
    .order("names", { ascending: true });
  if (error) {
    console.log(error);
    return NextResponse.json({ status: 500, message: error.message });
  }
  return NextResponse.json({
    count: count,
    result: data,
  });
}

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (session?.user.role !== ADMIN) {
    return NextResponse.json(
      { message: "No tienes permisos para realizar esta acción" },
      { status: 401 }
    );
  }
  const params = req.nextUrl.searchParams;
  const id = params.get("userId");
  const { error } = await supabase
    .from("users")
    .update({
      isBanned: false,
      banFinishDate: null,
      banReason: null,
    })
    .eq("id", id);
  if (error)
    return NextResponse.json({ message: error.message }, { status: 500 });

  return NextResponse.json({ message: "Usuario desbaneado correctamente" });
}
export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (session?.user.role !== ADMIN) {
    return NextResponse.json(
      { message: "No tienes permisos para realizar esta acción" },
      { status: 401 }
    );
  }
  const params = req.nextUrl.searchParams;
  const id = params.get("userId");
  const data = await req.json();
  let banFinishDate = null;
  switch (data.punishment) {
    case "short":
      banFinishDate = new Date();
      banFinishDate.setDate(banFinishDate.getDate() + 2);
      break;
    case "medium":
      banFinishDate = new Date();
      banFinishDate.setDate(banFinishDate.getDate() + 7);
      break;
    case "long":
      banFinishDate = new Date();
      banFinishDate.setDate(banFinishDate.getDate() + 30);
      break;
    case "permanent":
      break;
    default:
      return NextResponse.json(
        { message: "Tipo de baneo no válido" },
        { status: 400 }
      );
  }
  if (data.reason === "")
    return NextResponse.json(
      { message: "Debes ingresar una razón" },
      { status: 400 }
    );
  const { error } = await supabase
    .from("users")
    .update({
      isBanned: true,
      banFinishDate: banFinishDate && banFinishDate.toISOString(),
      banReason: data.reason,
    })
    .eq("id", id);

  if (error)
    return NextResponse.json({ message: error.message }, { status: 500 });
  const { error: deletePostError } = await supabase
    .from("posts")
    .delete()
    .eq("userId", id);
  if (deletePostError) {
    return NextResponse.json(
      { message: deletePostError.message },
      { status: 500 }
    );
  }
  return NextResponse.json({ message: "Usuario baneado correctamente" });
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (session?.user.role !== ADMIN) {
    return NextResponse.json(
      { message: "No tienes permisos para realizar esta acción" },
      { status: 401 }
    );
  }
  const params = req.nextUrl.searchParams;
  const id = params.get("userId");
  const { error } = await supabase.from("users").delete().eq("id", id);

  if (error)
    return NextResponse.json({ message: error.message }, { status: 500 });

  return NextResponse.json({ message: "Usuario eliminado correctamente" });
}
