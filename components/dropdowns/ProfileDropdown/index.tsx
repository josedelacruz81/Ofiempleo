"use client";
import { Dropdown, DropdownTrigger } from "@nextui-org/dropdown";
import { Avatar } from "@nextui-org/avatar";
import { Items } from "./Items";
import { useRole } from "@/context/RoleContext";
import { Session } from "next-auth";

export const ProfileDropdown = ({
  session,
  placement = "bottom-end",
}: {
  session: any ;
  placement?: "bottom-start" | "bottom-end" | "bottom" | "left" | "left-end" | "left-start" | "right" | "right-end" | "right-start" | "top" | "top-end" | "top-start";

}) => {
  const { role } = useRole();

  return (
    <div className="flex items-center gap-4">
      <Dropdown  closeOnSelect={false} placement={placement}>
        <DropdownTrigger>
          <Avatar
            showFallback
            // @ts-ignore
            name={session?.user?.name}
            // @ts-ignore
            src={session?.user?.image}
            as="button"
            className="transition-transform"
          />
        </DropdownTrigger>

        <Items
          role={role}
          image={session?.user?.image}
          username={session?.user?.name}
          id={session?.user?.id}
        />
      </Dropdown>
    </div>
  );
};
