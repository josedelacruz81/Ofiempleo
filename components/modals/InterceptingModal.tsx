"use client";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { Button } from "@nextui-org/button";
import { Modal, ModalContent } from "@nextui-org/react";
import { HiMiniXMark } from "react-icons/hi2";
export default function InterceptingModal({
  children,
  className,
  size,
  ...rest
}: {
  children: React.ReactNode;
  className?: string;
  size?:
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "2xl"
    | "xs"
    | "3xl"
    | "4xl"
    | "5xl"
    | "full"
    | undefined;
  [key: string]: any;
}) {
  const router = useRouter();

  const onDismiss = () => {
    router.back();
  };

  return createPortal(
    <Modal
      backdrop="blur"
      onClose={onDismiss}
      scrollBehavior="inside"
      size={size ? size : "lg"}
      isOpen={true}
      
      className={`${className} scrollCard`}
      {...rest}
    >
      <ModalContent>{children}</ModalContent>
    </Modal>,
    document.getElementById("modal-root")!
  );
}
