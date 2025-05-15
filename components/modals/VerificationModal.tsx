"use client";
import { useState } from "react";
import {
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  Button,
  ModalContent,
  useDisclosure,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { LuAlertTriangle } from "react-icons/lu";
import dynamic from "next/dynamic";

export const VerificationModal = ({
  children,
  className,
  requestId,
  actionButtonLabel,
  alertMessage,
  action,
  ...rest
}: {
  children: React.ReactNode;
  actionButtonLabel?: string;
  className?: string;
  requestId?: string;
  action?: (param?: string) => void;
  alertMessage?: string | React.ReactNode;
  [key: string]: any;
}) => {
  const { onOpen, onOpenChange, onClose, isOpen } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);
  const { refresh } = useRouter();
  const handleDelete = async () => {
    try {
      setIsLoading(true);

      const { error } = await supabase
        .from("requests")
        .delete()
        .eq("id", requestId);
      if (error) {
        console.log(error);

        return;
      }
      refresh();
      onClose();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button className={className} onPress={onOpen} {...rest}>
        {children}
      </Button>
      <Modal onOpenChange={onOpenChange} isOpen={isOpen} backdrop="blur">
        <ModalContent>
          <ModalHeader className="flex flex-col items-center">
            <Button
              size="lg"
              className="text-xl"
              isIconOnly
              disabled
              color="danger"
              variant="flat"
            >
              <LuAlertTriangle />
            </Button>
            <h2>¿Estás seguro?</h2>
            {alertMessage}
          </ModalHeader>
          <ModalBody>
            <Button
              isLoading={isLoading}
              onPress={
                !!action
                  ? () => {
                      action();

                      onClose();
                    }
                  : handleDelete
              }
              color="danger"
            >
              {!!actionButtonLabel ? actionButtonLabel : "Aceptar"}
            </Button>
            <Button onPress={onClose} variant="bordered">
              Cancelar
            </Button>
          </ModalBody>
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
