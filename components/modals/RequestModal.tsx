"use client";

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
  useDisclosure,
} from "@nextui-org/react";
import { useToast } from "../shadCn/useToast";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";
import { PENDING } from "@/types";

export const RequestModal = ({
  session,
  postId,
  ownerId,
  setPostStatus,
}: {
  session: Session;
  postId: number | string;
  ownerId: string | number;
  setPostStatus: any;
}) => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault(); // Evitamos que el formulario se envíe por defecto
    try {
      setLoading(true);
      const formData = new FormData(e.target as HTMLFormElement);
      const message = formData.get("message") as string;
      const res = await fetch(`/api/requests/${session?.user.id}`, {
        method: "POST",
        body: JSON.stringify({ postId, ownerId, message }),
      });
      const data = await res.json();

      if (!res.ok) {
        toast({
          title: "Error",
          description: data.message,
          className: "bg-red-500 text-white",
        });
        return;
      }
      toast({
        title: "Éxito",
        description: data.message,
        className: "bg-green-500 text-white",
      });
      setPostStatus(PENDING);
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "No se pudo registrar la visita por un error interno",
        className: "bg-red-500 text-white",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        onPress={onOpen}
        variant="flat"
        color="secondary"
        className="w-full"
      >
        Solicitar servicio
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent as="form" onSubmit={handleRequest}>
          <ModalHeader>
            <div>
              <h3 className="text-2xl font-bold">Solicitar servicio</h3>
              <p className="text-default-500 text-xs font-normal">
                Te recomendamos que escribas una descripción de lo que
                necesitas, para que el prestador pueda entender mejor tu
                solicitud
              </p>
            </div>
          </ModalHeader>
          <ModalBody>
            <Textarea
              required
              name="message"
              placeholder="Escribe una descripción de lo que quieres que realice"
            />
          </ModalBody>
          <ModalFooter>
            <Button
              fullWidth
              isLoading={loading}
              type="submit"
              color="secondary"
            >
              Enviar solicitud
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
