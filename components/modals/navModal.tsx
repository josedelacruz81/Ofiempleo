"use client";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  User,
  Switch,
} from "@nextui-org/react";
import Link from "next/link";
import { HiMenu } from "react-icons/hi";
import { useRouter } from "next/navigation";
import { Link as UiLink } from "@nextui-org/react";
import { signOutAction } from "../actions/signOutAction";
import { useState } from "react";
import { useRole } from "@/context/RoleContext";
import { EMPLOYEE, EMPLOYER, jobInterface } from "@/types";
import { RoleSwitch } from "../littleComponents/RoleSwitch";
import { FilterDropdown } from "../dropdowns/FilterDropdown";
import { ProfileDropdown } from "../dropdowns/ProfileDropdown";
export const NavModal = ({
  session,
  jobs,
}: {
  session: any;
  jobs: jobInterface[];
}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { role, deleteRole } = useRole();
  const [isSelected, setIsSelected] = useState(role === EMPLOYER);
  const router = useRouter();

  return (
    <>
      <button onClick={onOpen}>
        <HiMenu size={24} />
      </button>

      <Modal
        hideCloseButton
        size="full"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1"></ModalHeader>
              <ModalBody
                as="ul"
                className="flex flex-col items-center justify-center "
              >
                {!session ? (
                  <>
                    <li>
                      <Link href="/">Inicio</Link>
                    </li>
                    <li className="">
                      <FilterDropdown jobs={jobs} />
                    </li>

                    <li>
                      <Link href="/about">
                        <p>Sobre nosotros</p>
                      </Link>
                    </li>

                    <li>
                      <Link href="/auth">
                        <p>Iniciar sesión</p>
                      </Link>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <ProfileDropdown placement="top" session={session} />
                    </li>
                    <li>
                      <Link href={role === EMPLOYEE ? "/employee" : "/"}>
                        Inicio
                      </Link>
                    </li>
                    {role !== EMPLOYEE && (
                      <li>
                        <FilterDropdown jobs={jobs} />
                      </li>
                    )}
                   
                    {role === EMPLOYER && (
                      <li>
                        <Link href="/employer/requests">
                          <p>Mis solicitudes </p>
                        </Link>
                      </li>
                    )}
                     <li>
                      <Link href="/about">
                        <p >Sobre nosotros</p>
                      </Link>
                    </li>
                  </>
                )}
              </ModalBody>
              <ModalFooter>
                <Button
                  className="w-full"
                  color="danger"
                  variant="light"
                  onPress={onClose}
                >
                  Cerrar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
