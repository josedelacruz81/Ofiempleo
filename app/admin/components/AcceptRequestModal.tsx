"use client'";
import { useToast } from "@/components/shadCn/useToast";
import { supabase } from "@/lib/supabase";
import { jobSchema, processZodError } from "@/lib/zodValidations";
import { jobRequest } from "@/types";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
  Tooltip,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { HiCheck } from "react-icons/hi";

const initialState = {
  jobName: "",
  description: "",
};

export const AcceptRequestModal = ({
  isOpen,
  onClose,
  onOpenChange,
  requestSelected,
}: {
  isOpen: boolean;
  onClose: () => void;
  onOpenChange: () => void;
  requestSelected: jobRequest | null;
}) => {
  const [jobData, setJobData] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState(initialState);
  const { toast } = useToast();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setIsLoading(true);
      setErrors(initialState);

      if (!jobData.jobName && requestSelected?.jobName) {
        setJobData({ ...jobData, jobName: requestSelected?.jobName });
      }
      jobSchema.parse({
        ...jobData,
        jobName: jobData.jobName || requestSelected?.jobName,
      });

      const { error } = await supabase.from("jobs").insert({
        name: jobData.jobName,
        description: jobData.description,
        value: jobData.jobName.replace(/ /g, "_"),
      });
      if (error) {
        console.log(error);
        toast({
          title: "Error",
          description: "Error al aceptar la solicitud",
          className: "border border-warning bg-yellow-50 text-warning",
        });
        return;
      }
      const { error: updateError } = await supabase
        .from("jobRequests")
        .update({ status: "Aceptado" })
        .eq("id", requestSelected?.id);
      if (updateError) {
        console.log(updateError);
        toast({
          title: "Error",
          description: "Error al aceptar la solicitud",
          className: "border border-warning bg-yellow-50 text-warning",
        });
        return;
      }
      toast({
        title: "Solicitud aceptada",
        description: "La solicitud ha sido aceptada correctamente",
        className: "border border-success bg-green-50 text-success",
      });
      onClose();
    } catch (error) {
      console.log(error);
      const errors = processZodError(error);
      setErrors(errors);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      setJobData(initialState);
      setErrors(initialState);
    };
  }, [isOpen]);

  return (
    <>
      <Modal
        backdrop="blur"
        isOpen={isOpen}
        onClose={onClose}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          <form onSubmit={handleSubmit}>
            <ModalHeader className="flex flex-col items-center">
              <Button variant="flat" color="success" isIconOnly size="lg">
                <HiCheck size={20} />
              </Button>
              <h3>Acceptar solicitud</h3>
            </ModalHeader>
            <ModalBody>
              <p className=" font-semibold ">
                <span className="text-default-500 text-sm">Solicitud: </span>
                {requestSelected?.jobName}
              </p>
              <fieldset>
                <Input
                  labelPlacement="outside"
                  errorMessage={errors.jobName}
                  isInvalid={!!errors.jobName}
                  variant="faded"
                  value={jobData.jobName}
                  onChange={(e) =>
                    setJobData({ ...jobData, jobName: e.target.value })
                  }
                  label={
                    <div>
                      Título del oficio{" "}
                      <Tooltip color="warning" placement="right" content="Si no escribes el nombre, se usará el de la solicitud">
                        <span className="text-default-500 text-xs">
                          (opcional)
                        </span>
                      </Tooltip>
                    </div>
                  }
                  placeholder={requestSelected?.jobName}
                />
                <p className="text-center text-xs text-default-500">
                  Puedes editar el titulo del oficio para corregir faltas
                  ortográficas
                </p>
              </fieldset>
              <Textarea
                labelPlacement="outside"
                errorMessage={errors.description}
                isInvalid={!!errors.description}
                variant="faded"
                value={jobData.description}
                onChange={(e) =>
                  setJobData({ ...jobData, description: e.target.value })
                }
                label={
                  <p>
                    Descripción del trabajo{" "}
                    <span className="text-danger">*</span>
                  </p>
                }
                placeholder="Debes ingresar una descripción sobre el trabajo que se va a añadir"
              />
            </ModalBody>
            <ModalFooter>
              <Button
                color="danger"
                variant="light"
                onPress={() => {
                  onClose();
                }}
              >
                Cancelar
              </Button>
              <Button isLoading={isLoading} color="primary" type="submit">
                Aceptar
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};
