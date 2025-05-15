import { supabase } from "@/lib/supabase";
import { ACEPTED, PENDING, REJECTED } from "@/types";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  const userId = params.userId;
  const { data: pendingRequests, error } = await supabase
    .from("requests")
    .select(
      `
    
  requesterId,created_at,status,postId,id,message,
  requester:requesterId(id,names,lastname,profileImage,phone,rating)
`
    )
    .eq("ownerId", userId)
    .eq("status", PENDING)
    .order("created_at", { ascending: false });

  const { data: acceptedRequests, error: acceptedError } = await supabase
    .from("requests")
    .select(
      `
    
  requesterId,created_at,status,postId,id,message,
  requester:requesterId(id,names,lastname,profileImage,phone,rating)
`
    )
    .eq("ownerId", userId)
    .eq("status", ACEPTED)
    .order("created_at", { ascending: false });

  const { data: rejectedRequests, error: rejectedError } = await supabase
    .from("requests")
    .select(
      `
    
  requesterId,created_at,status,postId,id,message,
  requester:requesterId(id,names,lastname,profileImage,phone,rating)
`
    )
    .eq("ownerId", userId)
    .eq("status", REJECTED)
    .order("created_at", { ascending: false });

  if (error || acceptedError || rejectedError) {
    console.error(error, acceptedError, rejectedError);
    return NextResponse.json(
      {
        data: {
          pendingRequests: [],
          acceptedRequests: [],
          rejectedRequests: [],
        },
        isEmpty: true,
      },
      {
        status: 404,
      }
    );
  }
  if (
    pendingRequests.length === 0 &&
    acceptedRequests.length === 0 &&
    rejectedRequests.length === 0
  ) {
    return NextResponse.json({
      data: {
        pendingRequests: [],
        acceptedRequests: [],
        rejectedRequests: [],
      },
      isEmpty: true,
    });
  }
  return NextResponse.json({
    data: { pendingRequests, acceptedRequests, rejectedRequests },
    isEmpty: false,
  });
}
