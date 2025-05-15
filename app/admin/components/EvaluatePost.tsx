"use client";

import { useToast } from "@/components/shadCn/useToast";
import { ACEPTED, REJECTED } from "@/types";
import { Button } from "@nextui-org/react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

export const EvaluatePost = () => {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const handleApprove = async () => {
    setIsApproving(true);
    const res = await fetch(`/api/admin/posts/postsRequests`, {
      method: "PATCH",
      body: JSON.stringify({ status: ACEPTED, postId: params.id }),
    });
    const data = await res.json();
    toast({
      title: "Post aprobado",
      description: data.message,
      className: "bg-success text-white",
    });

    router.back();
    setIsApproving(false);
  };

  const handleReject = async () => {
    setIsRejecting(true);
    const res = await fetch(`/api/admin/posts/postsRequests`, {
      method: "PATCH",
      body: JSON.stringify({ status: REJECTED, postId: params.id }),
    });
    const data = await res.json();
    toast({
      title: "Post rechazado",
      description: data.message,
      className: "bg-danger text-white",
    });
    router.back();
    setIsRejecting(false);
  };

  return (
    <div className="grid md:grid-cols-2 gap-2 w-full">
      <Button isLoading={isRejecting} onPress={handleReject} color="danger" variant="light">
        Rechazar
      </Button>
      <Button isLoading={isApproving} onPress={handleApprove} color="success" variant="flat">
        Aprobar
      </Button>
    </div>
  );
};
