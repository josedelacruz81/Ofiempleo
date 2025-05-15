"use client";
import { capitalizeFirstLetter, timeAgo } from "@/lib/functions";
import { jobRequest, PENDING } from "@/types";
import {
  Avatar,
  Button,
  Card,
  CardBody,
  useDisclosure,
} from "@nextui-org/react";
import { HiCheck, HiOutlineBan } from "react-icons/hi";
import { AcceptRequestModal } from "./AcceptRequestModal";
import { useState } from "react";
import { useToast } from "@/components/shadCn/useToast";
import { supabase } from "@/lib/supabase";

export const RequestsTable = ({ requests }: { requests: jobRequest[] }) => {
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);
  const [requestSelected, setRequestSelected] = useState<jobRequest | null>(
    null
  );
  const [requestsList, setRequestsList] = useState(requests);
  const { toast } = useToast();
  const handleOpen = (jobRequest: jobRequest) => {
    if (!jobRequest) {
      toast({
        title: "Error",
        description: "No se ha seleccionado ningún usuario",
        className: "border border-warning bg-yellow-50 text-warning",
      });
      return;
    }
    setRequestSelected(jobRequest);
    onOpen();
  };

  const handleDeleteRequest = async (jobRequest: jobRequest) => {
    setIsLoading(true);
    const { error } = await supabase
      .from("jobRequests")
      .delete()
      .eq("id", jobRequest.id);
    if (error) {
      toast({
        title: "Error",
        description: "Error al eliminar la solicitud",
        className: "border border-warning bg-yellow-50 text-warning",
      });
      setIsLoading(false);
      return;
    }
    toast({
      title: "Solicitud eliminada",
      description: "La solicitud ha sido eliminada exitosamente",
      className: "border border-success bg-green-50 text-success",
    });
    setRequestsList(requestsList.filter((req) => req.id !== jobRequest.id));
    setIsLoading(false);
  };

  return (
    <>
      {requestsList.map((jobRequest, i: number) => (
        <Card fullWidth key={i}>
          <CardBody className="grid grid-cols-5  p-5 items-center">
            <p className="text-sm font-bold col-span-2">{jobRequest.jobName}</p>
            <p className="text-sm">{timeAgo(jobRequest.created_at)}</p>
            <div className="text-sm flex items-center gap-2 col-span-2">
              <Avatar
                src={jobRequest.user.profileImage}
                name={`${jobRequest.user.names} ${jobRequest.user.lastname}`}
              />
              <p>
                {capitalizeFirstLetter(
                  `${jobRequest.user.names} ${jobRequest.user.lastname}`
                )}
              </p>
            </div>
            {/* <div className="flex gap-2 items-center justify-end">
              {jobRequest.status === PENDING ? (
                <>
                  <Button
                    onPress={() => handleOpen(jobRequest)}
                    isIconOnly
                    size="sm"
                    variant="light"
                    color="primary"
                  >
                    <HiCheck size={20} />
                  </Button>
                  <Button onPress={()=>handleDeleteRequest(jobRequest)} isLoading={isLoading} isIconOnly size="sm" variant="light" color="danger">
                    <HiOutlineBan size={20} />
                  </Button>
                </>
              ) : (
                <p>{jobRequest.status}</p>
              )}
            </div> */}
          </CardBody>
        </Card>
      ))}
      <AcceptRequestModal
        requestSelected={requestSelected}
        isOpen={isOpen}
        onClose={onClose}
        onOpenChange={onOpenChange}
      />
    </>
  );
};
