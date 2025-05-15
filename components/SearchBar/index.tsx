"use client";
import { Input } from "@nextui-org/input";
import { HiSearch } from "react-icons/hi";
import { supabase } from "@/lib/supabase";
import { searchAction } from "@/components/actions/searchAction";
import { useState } from "react";
import { usePost } from "@/context/PostContext";
import { SearchDropdown } from "./SearchDropdown";
export const SearchBar = ({bordered}:{bordered?:boolean}) => {
  const { setPosts,setUsers } = usePost();
  // Inicialmente seleccionar el primer elemento
  const items = [
    {
      key: "profession",
      label: "Profesión",
    },
    {
      key: "skill",
      label: "Habilidad",
    },
    {
      key: "users",
      label: "Usuarios",
    },
  ];
  const [selectedKeys, setSelectedKeys] = useState(new Set([items[0]]));

  const getSelectedSkill = () => {
    const selectedArray = Array.from(selectedKeys);
    return selectedArray.length > 0 ? selectedArray[0] : null;
  };

  return (
    <form
      className="flex items-center gap-2 w-full"
      action={async (formData: FormData) => {
     
        const selectedSkill = getSelectedSkill();
        if(selectedSkill?.key === "users"){
          const res = (await searchAction(formData, selectedSkill)) as any;
          
          return setUsers(res);
        }
        
        const res = (await searchAction(formData, selectedSkill)) as any;
        //@ts-ignore
        setPosts(res);
     
      }}
    >
      <Input
        
        name="query"
        isClearable
        startContent={
          <SearchDropdown
          
            items={items}
            selectedKeys={selectedKeys}
            setSelectedKeys={setSelectedKeys}
          />
        }
        variant="faded"
        radius="full"
        placeholder="Buscar..."
      />
    </form>
  );
};
