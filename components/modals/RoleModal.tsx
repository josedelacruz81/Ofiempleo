"use client";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Avatar,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { useEffect, useState } from "react";

import { useRole } from "@/context/RoleContext";
import { ADMIN, EMPLOYEE, EMPLOYER } from "@/types";
import { useRouter } from "next/navigation";

export const RoleModal = ({ session }: { session: any }) => {
  const [error, setError] = useState("");
  const { role, changeToEmployee, changeToEmployer, loading } = useRole();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const router = useRouter();
  const [roleSelection, setRoleSelection] = useState(new Set([]));

  const onOpenChange = () => {
    setIsOpenModal(!isOpenModal);
  };
  // const getRole = async (userId: string | undefined) => {
  //   try {
  //     if (!userId) {
  //       return setError("No se ha podido obtener el rol");
  //     }

  //     const { data, error } = await supabase
  //       .from("users")
  //       .select("role")
  //       .eq("id", userId)
  //       .single();

  //     if (error) return console.log(error);

  //     return;
  //   } catch (error) {
  //     console.log(error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  useEffect(() => {
    if (!session) return;
    if (loading) return;
    if(role === ADMIN) return;
    if (role === EMPLOYEE || role === EMPLOYER) {
      setIsOpenModal(false);
    } else {
      setIsOpenModal(true);
    }
  }, [session, role, loading]);

  const handleSubmitProfile = async () => {
    try {
      if (roleSelection.size === 0) return setError("Debes seleccionar un rol");
      //@ts-ignore
      const selection = roleSelection.entries().next().value[0] as string;

      switch (selection) {
        case EMPLOYEE:
          await changeToEmployee();
          await router.push("/employee");
          onOpenChange();
          break;
        case EMPLOYER:
          await changeToEmployer();
          onOpenChange();
          break;
        default:
      }
      // await changeRole(selection === EMPLOYEE);
      // onOpenChange();
    } catch (error) {
      console.log(error);
    }
  };

  const options = [
    {
      key: "employee",
      label: "Quieres ser contratado",
    },
    {
      key: "employer",
      label: "Quieres contratar",
    },
  ];

  return (
    <Modal
      disableAnimation
      isKeyboardDismissDisabled
      hideCloseButton
      isDismissable={false}
      isOpen={isOpenModal}
      backdrop="blur"
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Elegir tipo de usuario
            </ModalHeader>
            <ModalBody className="space-y-5">
              {session && (
                <Avatar
                  // @ts-ignore
                  src={session?.user.image}
                  // @ts-ignore
                  name={session?.user.name}
                  className="w-28 h-28 mx-auto"
                />
              )}
              <p className="text-sm text-default-500">Si eliges un rol, puedes cambiarlo posteriormente en el menú del perfil</p>
              <div className="flex flex-col">
                <Select
                  selectedKeys={roleSelection}
                  // @ts-ignore
                  onSelectionChange={setRoleSelection}
                  color="primary"
                  label="Selecciona el rol"
                  className="max-full"
                >
                  {options.map((roleSelection) => (
                    <SelectItem key={roleSelection.key}>
                      {roleSelection.label}
                    </SelectItem>
                  ))}
                </Select>
                {error && (
                  <p className="text-red-500 text-start mt-2 text-xs">
                    {error}
                  </p>
                )}
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onPress={handleSubmitProfile}>
                Aceptar
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
