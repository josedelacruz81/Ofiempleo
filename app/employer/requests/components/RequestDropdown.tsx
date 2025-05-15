"use client";
import { FeedbackModal } from "@/app/employee/components/FeedbackModal";
import { useToast } from "@/components/shadCn/useToast";
import { selectColor } from "@/lib/functions";
import { supabase } from "@/lib/supabase";
import { ACEPTED } from "@/types";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  Spinner,
  useDisclosure,
} from "@nextui-org/react";
import { color } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  HiDotsHorizontal,
  HiOutlineChat,
  HiOutlineHand,
  HiOutlineTrash,
} from "react-icons/hi";

export const RequestDropdown = ({
  status,
  requestId,
  request,
  session,
}: {
  status: string;
  requestId: string;
  request: any;
  session: any;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { refresh } = useRouter();
  const handleDelete = async () => {
    try {
      setIsLoading(true);

      const { error } = await supabase
        .from("requests")
        .delete()
        .eq("id", requestId);
      if (error) {
        console.log(error);

        return;
      }
      refresh();
      onClose();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const items = [
    {
      key: "status",
      label: status,
      onPress: () => {},
      icon: <HiOutlineHand size={20} />,
    },
    status === ACEPTED && {
      key: "comment",
      label: "Calificar y comentar",
      icon: <HiOutlineChat size={20} />,
      onPress: onOpen,
    },
    {
      key: "delete",
      label: "Eliminar",
      icon: <HiOutlineTrash size={20} />,
      onPress: handleDelete,
    },
  ];

  return (
    <>
      <Dropdown placement="right-start">
        <DropdownTrigger>
          <Button isIconOnly variant="light">
            <HiDotsHorizontal
              size={25}
              className={`text-${selectColor(status)}`}
            />
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          variant="faded"
          closeOnSelect={false}
          aria-label="Static Actions"
          items={items}
        >
          {(item: any) => (
            <DropdownItem
              color={item.key === "delete" ? "danger" : selectColor(status)}
              className={
                item.key === "delete"
                  ? "text-danger"
                  : `text-${selectColor(status)}`
              }
              startContent={item.icon}
              closeOnSelect={item.key === "comment"}
              key="status"
              onPress={item.onPress}
            >
              {item.label}
            </DropdownItem>
          )}
        </DropdownMenu>
      </Dropdown>
    </>
  );
};
