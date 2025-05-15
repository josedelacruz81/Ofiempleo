"use client";

import { capitalizeFirstLetter } from "@/lib/functions";
import { userInterface } from "@/types";
import {
  Avatar,
  Button,
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { HiOutlineBan } from "react-icons/hi";

export default function ConfirmDeleteModal({
  onClose,
  isOpenVerification,
  setIsOpenVerification,
  selectedUser,
  handleDeleteUser,
  isLoading,
}: {
  onClose: () => void;
  isOpenVerification: boolean;
  setIsOpenVerification: (arg0: boolean) => void;
  selectedUser: userInterface | any;
  handleDeleteUser: (userId: string) => void;
  isLoading: boolean;
}) {

  if(!selectedUser) return null;
  return (
    <Modal
      onClose={() => setIsOpenVerification(false)}
      backdrop="blur"
      isOpen={isOpenVerification}
    >
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
            <HiOutlineBan />
          </Button>
          <h2>¿Estás seguro?</h2>
          <div className="flex flex-col items-center justify-center my-3">
            <Avatar
              size="lg"
              name={selectedUser.names}
              src={selectedUser.profileImage}
            />
            <h3 className="text-default-900 text-lg font-medium">
              {capitalizeFirstLetter(`${selectedUser.names} ${selectedUser.lastname}`)}
            </h3>

          </div>
          <p className="text-default-500 text-sm font-normal text-center">
            Si eliminas este usuario, no podrás deshacer esta acción. y borrarás
            todos los datos del usuario ¿Estás seguro de que deseas continuar?
          </p>
        </ModalHeader>
        <ModalFooter className="flex flex-col gap-3">
          <Button
            onPress={() => {
              handleDeleteUser(selectedUser.id);
            }}
            isLoading={isLoading}
            color="danger"
          >
            Eliminar
          </Button>
          <Button onPress={onClose} variant="bordered">
            Cancelar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
