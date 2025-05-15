"use client";

import { Button } from "@nextui-org/button";
import { ACEPTED, EMPLOYEE, EMPLOYER, PENDING, REJECTED } from "@/types";
import { FaWhatsapp } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRole } from "@/context/RoleContext";
import { RequestModal } from "../modals/RequestModal";
import { useToast } from "../shadCn/useToast";
import { useRouter } from "next/navigation";
export const ContactButton = ({
  children,
  status,
  visitedPost,
  phone,
  session,
  postId,
  postUserId,
  rating,
  ...rest
}: {
  phone: string;
  visitedPost: any;
  session: any;
  postId: string;
  postUserId: string;
  rating: number;
  status: string;
  children: React.ReactNode;
}) => {
  const { role } = useRole();
  const [postStatus, setPostStatus] = useState(status);


  const handleVisited = async () => {
    const { error } = await supabase
      .from("VisitedPosts")
      .insert({ userId: session?.user.id, postId, ownerId: postUserId });
  };

  if (role !== EMPLOYER) return null;
  return (
    <div className="w-full">
      {session.user.id.toString() !== postUserId.toString() ? (
        <>
          {!postStatus && (
            <RequestModal
              setPostStatus={setPostStatus}
              postId={postId}
              ownerId={postUserId}
              session={session}
            />
          )}
          {postStatus === PENDING && (
            <Button fullWidth className="mx-auto" variant="flat" disabled color="warning">
              La solicitud está pendiente de aprobación
            </Button>
          )}
          {postStatus === ACEPTED && (
            <Button
              className="flex items-center justify-center gap-2 w-full"
              variant="flat"
              color="success"
              onPress={() => {
                handleVisited();
                window.open(`https://wa.me/+593${phone}`, "_blank");
              }}
              target="_blank"
              {...rest}
            >
              {children}
              <FaWhatsapp size={17} />
            </Button>
          )}
          {postStatus === REJECTED && (
            <Button fullWidth className="mx-auto" disabled variant="flat" color="danger">
              La solicitud ha sido rechazada
            </Button>
          )}
        </>
      ) : (
        <p className="text-center">Este perfil es tuyo</p>
      )}
    </div>
  );
};
