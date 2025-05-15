"use client";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Button,
} from "@nextui-org/react";
import { CvForm } from "./cvForm";
import { FaPlus } from "react-icons/fa6";
import { EMPLOYEE, EMPLOYER } from "@/types";
import { useRole } from "@/context/RoleContext";
export const PostModal = ({ responsive }: { responsive?: boolean }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { role } = useRole();
  
  return (
    <>
      {!responsive ? (
        <>
          <button
            className="hidden md:block"
            onClick={onOpen}
          >
            <p >Publicarme</p>
           
          </button>
        </>
      ) : (
        <>
          {role === EMPLOYEE && (
            <Button
              isIconOnly
              color="primary"
              radius="full"
              className="flex md:hidden fixed mr-5 mb-5 bottom-0 right-0  items-center justify-center"
              onClick={onOpen}
            >
              <FaPlus />
            </Button>
          )}
        </>
      )}

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <h2>aslpkdnjg</h2>
          {/* {(onClose) => (
            <>
              <ModalHeader className="">Postular</ModalHeader>
              <ModalBody>
                <CvForm onClose={onClose} />
              </ModalBody>
              <ModalFooter />
            </>
          )} */}
        </ModalContent>
      </Modal>
    </>
  );
};
