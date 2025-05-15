import { supabase } from "@/lib/supabase";
import { ADMIN } from "@/types";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: {
      id: string;
    };
  }
) {
  const { data: userData, error } = await supabase
    .from("users")
    .select(
      "id,created_at, names, lastname, email,phone, profileImage,isBanned,banFinishDate,banReason,location,rating,description"
    )
    .eq("id", params.id);
  const { data: post, error: postError } = await supabase
    .from("posts")
    .select("*,   profession (*)")
    .eq("userId", params.id);
  const { data: requests, error: requestError } = await supabase
    .from("requests")
    .select(
      `
    
      ownerId,created_at,status,postId,id,message,
      owner:ownerId(id,names,lastname,profileImage,phone,rating)
    `
    )
    .eq("requesterId", params.id)
    .order("status", { ascending: true });
  const { data: reports, error: reportsError } = await supabase
    .from("reports")
    .select(
      "*,reported:reportedId(id,names,lastname, profileImage,rating,isBanned,banReason),reportedByUser:reportedBy(id,names,lastname, profileImage,rating,isBanned,banReason,email)"
    )
    .eq("reportedId", params.id);

  const { data: comments, error: commentsError } = await supabase
    .from("comments")
    .select("*,commenter:commenterId(id,names,lastname,profileImage,role)")
    .eq("commentRecipientId", params.id)
    .order("created_at", { ascending: false });

  if (error || postError || requestError || reportsError ||commentsError) {
    console.log(error, postError, requestError, reportsError,commentsError);
    return NextResponse.json(
      { message: "error al obtener los datos" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    user: userData[0],
    post: post[0],
    requests,
    reports,
    comments,
  });
}
