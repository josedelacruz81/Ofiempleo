import { supabase } from "@/lib/supabase";
import { commentSchema, processZodError } from "@/lib/zodValidations";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      comment,
      postId,
      commenterId,
      commentRecipientId,
      rating,
      role,
    } = commentSchema.parse(body);
  
    const { data, error: commentFinded } = await supabase
      .from("comments")
      .select("id")
      .eq("postId", postId)
      .eq("commenterId", commenterId)
      .eq("commentRecipientId", commentRecipientId);

    if (!!data && data.length > 0) {
      const errorMessage = "Ya has comentado en este post";
      return NextResponse.json({ message: errorMessage }, { status: 400 });
    }

    const { error } = await supabase
      .from("comments")
      .insert({ comment, postId, commenterId, commentRecipientId,  role });
    if(error){
      console.log(error)
      return NextResponse.json(
        { message: "Error al enviar el comentario" },
        { status: 500 }
      );
    }
    const { data: ratingFinded, error: ratingFindedError } = await supabase
      .from("ratings")
      .select("*")
      .eq("userId", commentRecipientId)
      .eq("ratedBy", commenterId);

    if (ratingFindedError) {
      console.log(ratingFindedError);
      return NextResponse.json(
        { message: "Error al enviar el comentario" },
        { status: 500 }
      );
    }
    if (ratingFinded.length > 0) {
      const { error } = await supabase
        .from("ratings")
        .update({ rating })
        .eq("userId", commentRecipientId)
        .eq("ratedBy", commenterId);
      return NextResponse.json({ message: "Comentario enviado con éxito" });
    }
    const { error: ratingError } = await supabase.from("ratings").insert({
      rating: rating,
      userId: commentRecipientId,
      ratedBy: commenterId,
      role,
    });
    if (ratingError) {
      console.log(ratingError);
      return NextResponse.json(
        { message: "Error al enviar el comentario" },
        { status: 500 }
      );
    }
    return NextResponse.json({ message: "Comentario enviado con éxito" });
  } catch (error) {
    const errors = processZodError(error);
    console.log(errors);
    return NextResponse.json(errors, { status: 400 });
  }
}
