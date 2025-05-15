import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { data: user, error: userError } = await supabase
    .from("users")
    .select(
      "id,names,lastname,profileImage,email,phone,role,location, description,rating"
    )
    .eq("id", params.id)
    .single();
  if (userError)
    return NextResponse.json({ error: "Error fetching user" }, { status: 500 });

  const { data: post, error: postError } = await supabase
    .from("posts")
    .select("*,profession(id,name)")
    .eq("userId", params.id)
    .single();

  const { data: comments, error: commentsError } = await supabase
    .from("comments")
    .select("*,commenter:commenterId(id,names,lastname,profileImage,role)")
    .eq("commentRecipientId", params.id)
    .order("created_at", { ascending: false });

  if (userError || postError) {
    //@ts-ignore
    if (postError.code === "PGRST116") {
      return NextResponse.json({
        user,
        post: null,
        comments: commentsError ? [] : comments,
      });
    }
    return NextResponse.json({ error: "Error fetching data" }, { status: 500 });
  }

  return NextResponse.json({
    user,
    post,
    comments: commentsError ? [] : comments,
  });
}

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const body = await req.json();

  const { data, error } = await supabase
    .from("users")
    .update(body)
    .eq("id", params.id);
  if (error) return NextResponse.json({ error: "Error updating user" });
  return NextResponse.json({ data });
}
//@ts-ignore
export const PUT = auth(async function PUT(
  req,
  { params }: { params: { id: string } }
) {
  if (req.auth?.user.id !== params.id) {
    return NextResponse.json(
      { error: "No puedes editar este usuario" },
      { status: 401 }
    );
  }
  const body = await req.json();

  const { data: userFinded, error: userError } = await supabase
    .from("users")
    .select("id,location,description")
    .eq("id", params.id)
    .single();
  if (userError)
    return NextResponse.json(
      { message: "Error fetching user" },
      { status: 500 }
    );
  if (
    userFinded.description === body.description &&
    userFinded.location === body.location
  ) {
    return NextResponse.json({ message: "No hay cambios" }, { status: 400 });
  }
  const { data, error } = await supabase
    .from("users")
    .update({ ...body })
    .eq("id", params.id);

  if (error) return NextResponse.json({ error: "Error creating user" });
  return NextResponse.json(
    { message: "Tus datos han sido actualizados correctamente" },
    {
      status: 200,
    }
  );
});

// export async function PUT(
//   req: Request,
//   { params }: { params: { id: string } }
// ) {
//   const body = await req.json();

//   const { data: userFinded, error: userError } = await supabase
//     .from("users")
//     .select("id,location,description")
//     .eq("id", params.id)
//     .single();
//   if (userError) return NextResponse.json({ message: "Error fetching user" },{status:500});
//   if(userFinded.description === body.description && userFinded.location === body.location){
//     return NextResponse.json({ message: "No hay cambios" },{status:400});
//   }
//   const { data, error } = await supabase
//     .from("users")
//     .update({ ...body }).eq("id", params.id);

//   if (error) return NextResponse.json({ error: "Error creating user" });
//   return NextResponse.json(
//     { message: "Tus datos han sido actualizados correctamente" },
//     {
//       status: 200,
//     }
//   );
// }
