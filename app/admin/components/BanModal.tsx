"use client";
import { useToast } from "@/components/shadCn/useToast";
import { capitalizeFirstLetter } from "@/lib/functions";
import { userInterface } from "@/types";
import {
  Button,
  cn,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Radio,
  RadioGroup,
  RadioProps,
  Textarea,
  User,
} from "@nextui-org/react";
import { useState } from "react";

export const BanModal = ({
  selectedUser,
  onClose,
  onOpenChange,
  isOpen,
}: {
  selectedUser: userInterface | any;
  onClose: () => void;
  onOpenChange: () => void;
  isOpen: boolean;
}) => {
  const { toast } = useToast();
  const [selectedOption, setSelectedOption] = useState("short");
  const [isLoading, setIsLoading] = useState(false);
  const [reason, setReason] = useState("");
  const handleBan = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setIsLoading(true);
      const res = await fetch(`/api/admin/users?userId=${selectedUser.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          punishment: selectedOption,
          reason,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        toast({
          title: "Error",
          description: data.message,
          className: "border border-warning bg-yellow-50 text-warning",
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "Usuario baneado",
        description: data.message,
        className: "border border-success bg-green-50 text-success",
        variant: "destructive",
      });
      window.location.reload();
      onClose();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnban = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const res = await fetch(`/api/admin/users?userId=${selectedUser.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (!res.ok) {
        toast({
          title: "Error",
          description: data.message,
          className: "border border-warning bg-yellow-50 text-warning",
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "Usuario desbaneado",
        description: data.message,
        className: "border border-success bg-green-50 text-success",
        variant: "destructive",
      });
      window.location.reload();
      onClose();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!selectedUser) return null;

  return (
    <>
      <Modal backdrop="blur" onClose={onClose} isOpen={isOpen}>
        <ModalContent>
          <form
            onSubmit={(e) => {
              if (selectedUser.isBanned) {
                handleUnban(e);
              } else {
                handleBan(e);
              }
            }}
          >
            <ModalHeader className="flex items-center justify-center">
              <h3 className="text-center">
                Selecciona el tiempo de penalización
              </h3>
            </ModalHeader>
            <ModalBody className="flex flex-col ">
              {selectedUser.isBanned ? (
                <>
                  {!!selectedUser.banFinishDate ? (
                    <p className="text-default-500 text-sm text-center ">
                      El usuario ha sido penalizado con un baneo hasta la fecha:
                      {new Date(
                        selectedUser.banFinishDate
                      ).toLocaleDateString()}
                    </p>
                  ) : (
                    <p className="text-default-500 text-sm text-center ">
                      El usuario ha sido penalizado de manera permanente
                    </p>
                  )}
                  <Textarea
                    value={selectedUser.banReason || ""}
                    label="Razón"
                    disabled
                  />
                </>
              ) : (
                <>
                  <p className="text-default-500 text-sm text-center ">
                    Durante el tiempo de penalización el usuario no podrá
                    acceder a la plataforma.
                  </p>

                  <div className="flex items-center justify-center">
                    {selectedUser && (
                      <User
                        name={capitalizeFirstLetter(selectedUser.names)}
                        avatarProps={{
                          src: selectedUser.profileImage,
                          alt: selectedUser.names,
                        }}
                        description={capitalizeFirstLetter(
                          selectedUser.lastname
                        )}
                      ></User>
                    )}
                  </div>
                  <RadioGroup
                    value={selectedOption}
                    onValueChange={setSelectedOption}
                    className=" flex flex-col items-center"
                  >
                    <CustomRadio description="Falta leve" value="short">
                      2 días
                    </CustomRadio>
                    <CustomRadio description="falta moderada" value="medium">
                      7 días
                    </CustomRadio>
                    <CustomRadio description="falta grave" value="long">
                      30 días
                    </CustomRadio>
                    <CustomRadio
                      description="falta muy grave"
                      value="permanent"
                    >
                      Permanente
                    </CustomRadio>
                  </RadioGroup>
                  <Textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    label="Razón"
                    placeholder={`Escribe la razón por la cual vas a banear a ${capitalizeFirstLetter(
                      selectedUser.names
                    )}`}
                  />
                </>
              )}
            </ModalBody>
            <ModalFooter>
              {!selectedUser.isBanned ? (
                <>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Cancelar
                  </Button>
                  <Button isLoading={isLoading} type="submit" color="success">
                    Aceptar
                  </Button>
                </>
              ) : (
                <Button
                  isLoading={isLoading}
                  fullWidth
                  type="submit"
                  color="primary"
                >
                  Remover ban
                </Button>
              )}
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};

export const CustomRadio = (props: RadioProps) => {
  const { children, ...otherProps } = props;

  return (
    <Radio
      {...otherProps}
      classNames={{
        base: cn(
          "inline-flex m-0 bg-content1 hover:bg-content2 items-center justify-between",
          "flex-row-reverse min-w-[300px] cursor-pointer rounded-lg gap-4 p-2 border-2 border-transparent",
          "data-[selected=true]:border-primary"
        ),
      }}
    >
      {children}
    </Radio>
  );
};
