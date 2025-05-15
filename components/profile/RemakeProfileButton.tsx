"use client";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FiEdit3 } from "react-icons/fi";
import { useToast } from "../shadCn/useToast";
import { supabase } from "@/lib/supabase";

export const RemakeProfileButton = ({ postId }: { postId: string }) => {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const handleEdit = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/posts/${postId}`, {
        method: "DELETE",
      });


      if(!res.ok) {
        toast({
          title: "Error",
          description: "No se pudo rehacer el perfil",
          className: "bg-red-400 text-white",
        });
        return;
      };
      router.refresh();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      isLoading={isLoading}
      onPress={handleEdit}
      variant="flat"
      color="warning"
      endContent={<FiEdit3 />}
    >
      Rehacer
    </Button>
  );
};
