"use client";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  useDisclosure,
} from "@nextui-org/react";
import { HiOutlineBan } from "react-icons/hi";
import { BanModal } from "./BanModal";
import { userInterface } from "@/types";
import { HiEllipsisHorizontal } from "react-icons/hi2";

export const ReportDropdown = ({ reported }: { reported: userInterface }) => {
  const { isOpen, onClose, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Dropdown placement="right-end">
        <DropdownTrigger>
          <Button variant="light"  isIconOnly>
            <HiEllipsisHorizontal size={22}  className="text-default-700"/>
          </Button>
        </DropdownTrigger>
        <DropdownMenu onAction={(key) => onOpen()} aria-label="Static Actions">
          <DropdownItem
            key="delete"
            endContent={<HiOutlineBan />}
            className="text-danger"
            color="danger"
          >
            Sancionar
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <BanModal selectedUser={reported} isOpen={isOpen} onOpenChange={onOpenChange} onClose={onClose} />
    </>
  );
};
