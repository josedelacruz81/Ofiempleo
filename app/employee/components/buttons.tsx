"use client";
import { useToast } from "@/components/shadCn/useToast";
import { supabase } from "@/lib/supabase";
import { ACEPTED, PENDING, REJECTED } from "@/types";
import {
  Button,
  Link,
  useDisclosure,
} from "@nextui-org/react";
import { useState } from "react";
import { FeedbackModal } from "./FeedbackModal";
import {  HiOutlineTrash } from "react-icons/hi";
import { VerificationModal } from "@/components/modals/VerificationModal";
import { capitalizeFirstLetter } from "@/lib/functions";
import { FaWhatsapp } from "react-icons/fa6";
import { IoCheckmarkCircleSharp } from "react-icons/io5";

export const Buttons = ({
  comments,
  request,
  session,
  userId,
  requesterId,
  requester,
  phone,
}: {
  comments?: any;
  request: any;
  session: any;
  userId: string;
  requesterId: string;
  requester: any;
  phone?: string;
}) => {
  const [statusState, setStatusState] = useState(request.status);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const { toast } = useToast();

  const verifyRequest = async () => {
    const { data, error: checkError } = await supabase
      .from("requests")
      .select("status")
      .eq("requesterId", requesterId)
      .eq("ownerId", userId)
      .eq("status", ACEPTED);
    if (checkError) {
      console.error(checkError);
      return false;
    }
    if (data.length > 0) {
      toast({
        title: "Alerta",
        description: "Ya has respondido a esta solicitud",
        className: "bg-yellow-400 text-white",
      });
      return false;
    }
    return true;
  };

  const handleAccept = async () => {
    if (!(await verifyRequest())) return;

    const { error } = await supabase
      .from("requests")
      .update({ status: ACEPTED })
      .eq("requesterId", requesterId)
      .eq("ownerId", userId);

    if (error) return console.error(error);
    setStatusState(ACEPTED);
    toast({
      description: "Solicitud aceptada",
      className: "bg-green-400 text-white",
    });
    return;
  };

  const handleReject = async () => {
    const { error } = await supabase
      .from("requests")
      .update({ status: REJECTED })
      .eq("requesterId", requesterId)
      .eq("ownerId", userId);

    if (error) return console.error(error);
    setStatusState(REJECTED);
    toast({
      description: "Solicitud rechazada",
      className: "bg-red-400 text-white",
    });
    return;
  };

  const handleDeleteRequest = async () => {
    const { error } = await supabase
      .from("requests")
      .delete()
      .eq("id", request.id)
      .eq("ownerId", session.user.id);
    if (error) {
      console.log(error);
      toast({
        description: "Error al eliminar la solicitud",
        className: "bg-red-400 text-white",
      });
    }
    toast({
      description: "Solicitud eliminada",
      className: "bg-green-400 text-white",
    });
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-2 md:gap-4 items-center">
        {statusState === PENDING && (
          <>
            <Button onPress={handleReject} color="danger" variant="light">
              Rechazar
            </Button>
            <Button onPress={handleAccept} color="success" variant="ghost">
              Aceptar
            </Button>
          </>
        )}
        {statusState === ACEPTED && (
          <div className="flex flex-col gap-2">
            <Button
              color="success"
              variant="light"
              as={Link}
              isExternal
              href={`https://wa.me/+593${phone}`}
              className="text-sm "
              endContent={
                <FaWhatsapp size={20} />
              }
            >
              +593{phone}
            </Button>
            {comments.length > 0 ? (
              <div className="flex items-center gap-2">
                <p className="text-default-500 text-sm">
                  Gracias por enviar tu comentario
                </p>
                <IoCheckmarkCircleSharp size={25} className="text-success" />
              </div>
            ) : (
              <Button variant="ghost" color="warning" onPress={onOpen}>
                Calificar
              </Button>
            )}
          </div>
        )}
        {statusState === REJECTED && (
          <VerificationModal
            color="danger"
            variant="light"
            endContent={<HiOutlineTrash />}
            alertMessage={
              <p className="font-normal text-sm text-default-500 text-center">
                Si eliminas la solicitud,{" "}
                <span className="font-semibold">
                  {capitalizeFirstLetter(requester.names)}{" "}
                </span>
                podrá solicitar nuevamente tu servicio.
              </p>
            }
            action={handleDeleteRequest}
            actionButtonLabel="Eliminar"
          >
            Rechazado
          </VerificationModal>
        )}
      </div>
      <FeedbackModal
        isEmployee
        comments={comments}
        commentRecipientId={requesterId}
        postId={request.postId}
        session={session}
        requester={requester}
        onClose={onClose}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      />
    </>
  );
};
