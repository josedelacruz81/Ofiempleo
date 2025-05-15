"use client";
import { FeedbackModal } from "@/app/employee/components/FeedbackModal";
import { selectColor } from "@/lib/functions";
import { Button, useDisclosure } from "@nextui-org/react";
import { useState } from "react";
import { HiOutlineChat } from "react-icons/hi";

export const FeedBackButton = ({
  status,
  session,
  postId,
  requester,
  commentRecipientId,
  comments
}: {
  status: string;
  session: any;
  postId: string;
  requester: any;
  commentRecipientId: string;
  comments:any
}) => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  return (
    <>
      <Button
        className="grow"
        onPress={onOpen}
        color="primary"
        variant="flat"
      >
        Calificar y comentar <HiOutlineChat size={20} />
      </Button>{" "}
      <FeedbackModal
      
      comments={comments}
        session={session}
        postId={postId}
        requester={requester}
        commentRecipientId={commentRecipientId}
        onClose={onClose}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      />
    </>
  );
};
