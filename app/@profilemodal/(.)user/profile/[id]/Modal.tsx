"use client";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { Button } from "@nextui-org/button";
import { IoIosClose } from "react-icons/io";
import { Modal, ModalBody, ModalContent } from "@nextui-org/react";
export default function ProfileModal({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const router = useRouter();

  const onDismiss = () => {
    router.back();
  };

  return createPortal(
    <Modal
      backdrop="blur"
      scrollBehavior="inside"
      size="lg"
      isOpen={true}
      closeButton={
        <Button
          onPress={onDismiss}
          variant="light"
          size="sm"
          isIconOnly
          radius="full"
          className=" mr-5 "
        >
          <IoIosClose />
        </Button>
      }
      className={`${className}`}
    >
      <ModalContent>
        <ModalBody className="py-4">{children}</ModalBody>
      </ModalContent>
    </Modal>,
    document.getElementById("modal-root")!
  );
}
