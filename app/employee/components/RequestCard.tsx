"use client";
import { Card, CardBody, User } from "@nextui-org/react";
import { timeAgo } from "@/lib/functions";
import { Buttons } from "./buttons";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { request } from "@/types";
import { Session } from "next-auth";
import { useEffect, useState } from "react";

export const RequestCard = ({
  session,
  request,
  userId,
  postId,
  getRequests,
}: {
  session: Session;
  request: request;
  userId: string;
  postId: string;
  getRequests: () => void;
}) => {
  const [comments, setComments] = useState<any>([]);

  const getComments = async (
    commenterId: string,
    commentRecipientId: string,
    postId: string
  ) => {
    const { data, error } = await supabase
      .from("comments")
      .select("*,commenter:commenterId(*)")
      .eq("commenterId", commenterId)
      .eq("commentRecipientId", commentRecipientId)
      .eq("postId", postId);

    if (error) {
      console.log(error);
      return;
    }
    setComments(data);
  };
  useEffect(() => {
    getComments(session?.user.id, request.requesterId, request.postId);
  }, [getRequests]);

  return (
    <>
      <Card
        shadow="none"
        className={`rounded-2xl border-2 ${comments.length  === 0 ? "order-first" : "order-last"}`}
      >
        <CardBody className="p-2 lg:p-4 flex flex-col md:flex-row items-center justify-between">
          <div className="space-y-2">
            <User
              description={
                <div>
                  <p>{timeAgo(request.created_at)}</p>
                  {/* {requester.rating && (
                <Rating disabled rating={requester.rating} />
              )} */}
                </div>
              }
              name={
                <Link
                  className="hover:underline"
                  href={`/user/profile/${request.requesterId}`}
                >
                  {`${request.requester.names} ${request.requester.lastname}`}
                </Link>
              }
              avatarProps={{
                src: request.requester.profileImage,
                name: `${request.requester.names} ${request.requester.lastname}`,
              }}
            />

            <div>
              <h4 className="text-default-500 text-sm ">
                {request.message ? "Descripción:" : "Sin descripción"}
              </h4>
              <p className="text-wrap">{request.message}</p>
            </div>
          </div>
          <Buttons
            comments={comments}
            session={session}
            request={request}
            requester={request.requester}
            phone={request.requester.phone}
            userId={userId}
            requesterId={request.requesterId}
          />
        </CardBody>
      </Card>
    </>
  );
};
