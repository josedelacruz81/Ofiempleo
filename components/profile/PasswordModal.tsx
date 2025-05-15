import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { useState } from "react";
import { HiLockClosed, HiOutlineLockClosed } from "react-icons/hi";
import { PasswordInput } from "../littleComponents/PasswordInput";
import { supabase } from "@/lib/supabase";
import { passwordSchema, processZodError } from "@/lib/zodValidations";
import { useToast } from "../shadCn/useToast";

interface PasswordDataInterface {
  oldPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

export const PasswordModal = ({ userId }: { userId: string }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onOpenChange,onClose } = useDisclosure();
  const { toast } = useToast();
  const [passwordData, setPasswordData] = useState<PasswordDataInterface>({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<PasswordDataInterface>({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const { oldPassword, newPassword, confirmPassword } =
        passwordSchema.parse(passwordData);
      const { data: userFinded, error } = await supabase
        .from("users")
        .select("password")
        .eq("id", userId)
        .single();
      if (error) {
        toast({
          title: "Error",
          description: "Error al buscar el usuario",
          variant: "destructive",
          className: "text-red-500 bg-red-100",
        });
        return;
      }
      if (userFinded.password !== oldPassword) {
        toast({
          title: "Error",
          description: "Contraseña incorrecta",
          variant: "destructive",
          className: "text-red-500 bg-red-100",
        });
        return;
      }
      if (newPassword !== confirmPassword) {
        toast({
          title: "Error",
          description: "Las contraseñas no coinciden",
          variant: "destructive",
          className: "text-red-500 bg-red-100",
        });
        return;
      }
      const { error: passwordUpdateError } = await supabase
        .from("users")
        .update({ password: newPassword })
        .eq("id", userId);
      if (passwordUpdateError) {
        toast({
          title: "Error",
          description: "Error al actualizar la contraseña",
          variant: "destructive",
          className: "text-red-500 bg-red-100",
        });
        return;
      }
      toast({
        title: "Éxito",
        description: "Contraseña actualizada",
        variant: "destructive",
        className: "text-green-500 bg-green-100",
      });
      onClose();
    } catch (error) {
      const errors = processZodError(error);
      setErrors(errors);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        className="border-2 border-[#e4eef6] rounded-xl text-primary text-sm"
        endContent={<HiOutlineLockClosed />}
        fullWidth
        onPress={onOpen}
        variant="bordered"
      >
        Cambiar contraseña
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex items-center gap-1 text-warning">
                <h3 className="font-medium">Cambiar contraseña</h3>
                <HiOutlineLockClosed size={20} />
              </ModalHeader>
              <ModalBody>
                <fieldset>
                  <PasswordInput
                    onChange={handleChange}
                    startContent={
                      <HiLockClosed className="text-default-400 text-2xl" />
                    }
                    name="oldPassword"
                    label="Contraseña actual"
                    placeholder="Ingrese su contraseña actual"
                    variant="faded"
                  />
                  {errors.oldPassword && (
                    <p className="text-red-500 text-xs">{errors.oldPassword}</p>
                  )}
                </fieldset>
                <hr />
                <fieldset>
                  <PasswordInput
                    onChange={handleChange}
                    name="newPassword"
                    placeholder="Nueva contraseña"
                    variant="faded"
                  />
                  {errors.newPassword && (
                    <p className="text-red-500 text-xs">{errors.newPassword}</p>
                  )}
                </fieldset>
                <fieldset>
                  <PasswordInput
                    onChange={handleChange}
                    name="confirmPassword"
                    placeholder="Confirmar contraseña"
                    variant="faded"
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-xs">
                      {errors.confirmPassword}
                    </p>
                  )}
                </fieldset>
              </ModalBody>
              <ModalFooter>
                <Button
                  isLoading={isLoading}
                  fullWidth
                  color="primary"
                  onPress={handleSubmit}
                >
                  Guardar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
