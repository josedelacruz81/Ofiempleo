"use client";
import { CustomRadio } from "@/app/admin/components/BanModal";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  RadioGroup,
  Textarea,
  Tooltip,
  useDisclosure,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { HiOutlineExclamation } from "react-icons/hi";
import { useToast } from "../shadCn/useToast";

export const ReportModal = ({
  reportedId,
  reportedBy,
  isReported
}: {
  reportedId: string;
  reportedBy: string;
  isReported: boolean;
}) => {
  const { isOpen, onClose, onOpenChange, onOpen } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState("short");
  const [reason, setReason] = useState("");
  const [report, setReport] = useState("");
  const { toast } = useToast();

  const getReportedUser = async () => {
    try {
      const res = await fetch(`/api/reports/${reportedId}?reportedBy=${reportedBy}`);
      const data = await res.json();
      console.log(data);
      setReport(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleReport = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/reports/${reportedId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body:
          selectedOption === "other"
            ? JSON.stringify({ reason, reportedBy })
            : JSON.stringify({ reason: selectedOption, reportedBy }),
      });
      const data = await res.json();
      if(!res.ok){
        toast({
          title: "Error",
          description: data.message,
          className: "bg-danger  text-white border-danger",
        });
        return;
      }
      toast({
        title: "Reporte enviado",
        description: data.message,
        className: "bg-success text-white border-success",
      });
      onClose();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getReportedUser();
  }, []);

  return (
    <>
      <Tooltip content="Reportar usuario"
      >
        <Button
        onPress={onOpen}
        isIconOnly
        size="sm"
        variant="light"
        color="danger"
        className="mr-3"
      >
        <HiOutlineExclamation size={25} />
      </Button>
      </Tooltip>
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
              <HiOutlineExclamation size={25} />
            </Button>
            <h2>¿Estás seguro?</h2>
          </ModalHeader>

          <ModalBody>
            <p className="text-default-500 text-sm text-center">
              ¿Por qué quieres reportar a este usuario?
            </p>
            <RadioGroup
              value={selectedOption}
              onValueChange={setSelectedOption}
              className=" flex flex-col items-center"
            >
              <CustomRadio value=" Comportamiento inapropiado">
                Comportamiento inapropiado
              </CustomRadio>
              <CustomRadio value="Perfil falso o engañoso">
                Perfil falso o engañoso
              </CustomRadio>
              <CustomRadio value="Contenido inapropiado">
                Contenido inapropiado
              </CustomRadio>
              <CustomRadio value=" Incumplimiento de acuerdos">
                Incumplimiento de acuerdos
              </CustomRadio>
              <CustomRadio value="other">Otro</CustomRadio>
            </RadioGroup>
            {selectedOption === "other" && (
              <div className="w-full">
                <Textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  label="Escribe la razón:"
                />
              </div>
            )}
          </ModalBody>
          <ModalFooter className="flex flex-col">
            <Button isLoading={isLoading} onPress={handleReport} color="danger">
              Reportar
            </Button>
            <Button onPress={onClose} variant="bordered">
              Cancelar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
