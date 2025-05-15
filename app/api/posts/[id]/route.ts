import { hourlyValidation } from "./../../../../lib/zodValidations";
import { conn } from "@/lib/pg";
import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { jobUpdateSchema, processZodError } from "@/lib/zodValidations";
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { data, error } = await supabase
      .from("posts")
      .select(
        `*,users (id,names,lastname,phone,rating,profileImage),profession (name)`
      )
      .eq("id", params.id)
      .single();

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json(error);
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session)
      return NextResponse.json(
        { message: "Debes estar autenticado" },
        { status: 401 }
      );
    const { id } = params;
    const data = await req.json();

    const { description, skills, typeWork } = jobUpdateSchema.parse(data);
    let hourly = 0;
    if (typeWork === "hourly") {
      hourly = hourlyValidation.parse(parseFloat(data.hourly));
    }
    const { error } = await supabase
      .from("posts")
      .update({ description, skills, typeWork, hourly })
      .eq("id", id)
      .eq("userId", session.user.id);
    if (error) {
      console.log(error);
      return NextResponse.json(
        { message: "Error al actualizar el post" },
        { status: 500 }
      );
    }
    revalidatePath("/", "page");
    return NextResponse.json({ message: "Post actualizado" });
  } catch (error) {
    console.log(error);
    const errors = processZodError(error);
    return NextResponse.json(errors, { status: 400 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session)
    return NextResponse.json(
      { message: "Debes estar autenticado" },
      { status: 401 }
    );

  const { id } = params;
  const { error } = await supabase
    .from("posts")
    .delete()
    .eq("id", id)
    .eq("userId", session.user.id);
  if (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Error al eliminar el post" },
      { status: 500 }
    );
  }
  revalidatePath("/", "page");
  return NextResponse.json({ message: "Post eliminado" });
}
