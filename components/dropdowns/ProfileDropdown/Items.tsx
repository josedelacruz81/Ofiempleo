"use client";

import { DropdownItem, DropdownMenu } from "@nextui-org/dropdown";
import { signOutAction } from "@/components/actions/signOutAction";
import { usePathname, useRouter } from "next/navigation";
import { useDisclosure, User } from "@nextui-org/react";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { ADMIN, EMPLOYER } from "@/types";
import { RoleSwitch } from "@/components/littleComponents/RoleSwitch";

export const Items = ({
  username,
  id,
  role,
  image,
}: {
  username?: string;
  id: string;
  role: string;
  image: string;
}) => {
  const router = useRouter();
  const [isSelected, setIsSelected] = useState(role === EMPLOYER);
  const path = usePathname();
  return (
    <DropdownMenu
      aria-label="Profile Actions"
      onAction={async (key) => {
        switch (key) {
          case "logout":
            if (role === ADMIN) {
              signOutAction();
              
              return;
            }

            await supabase.from("users").update({ role: null }).eq("id", id);
            signOutAction();
          
            break;
          case "profile":
            router.push(`/user/profile/${id}`);
            break;
          case "requests":
            router.push(`/employer/requests`);
            break;
          case "post":
            router.push(`/employee`);
            break;
          case "admin":
            router.push(`/admin/stats`);
            break;
          case "settings":
            router.push(`/user/editProfile`);
            break;

          case "comments":
            router.push(`/comments/${id}`);
            break;
          
          default:
            break;
        }
      }}
      variant="light"
    >
      <DropdownItem
        closeOnSelect
        key="profile"
        textValue="perfil"
        className="h-14 gap-2"
      >
        <User
          name={username}
          description={<span className="text-gray-500">@{id}</span>}
          avatarProps={{
            src: image,
          }}
        />
      </DropdownItem>

      
      <DropdownItem
        title="Tipo de usuario:"
        description={isSelected ? "Empleador" : "Trabajador"}
        endContent={<RoleSwitch />}
        key="role"
        className={role !== ADMIN ? "" : "hidden"}
        textValue="role"
      />
      {/* <DropdownItem closeOnSelect key="comments">Comentarios</DropdownItem> */}
      <DropdownItem
        closeOnSelect
        textValue="Cerrar sesión"
        key="logout"
        color="danger"
        className="text-start"
      >
        Cerrar sesión
      </DropdownItem>
    </DropdownMenu>
  );
};
