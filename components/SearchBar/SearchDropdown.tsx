"use client";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import { useMemo, useState } from "react";

export const SearchDropdown = ({
  selectedKeys,
  setSelectedKeys,
  items,
  buttonClassName
}:{
  selectedKeys: Set<any>;
  setSelectedKeys: (selectedKeys: Set<any>) => void;
  items: any;
  buttonClassName?: string;
}) => {
  

  
  
  const selectedValue = useMemo(() => {
    const selectedArray = Array.from(selectedKeys);
    return selectedArray.map(item => item.label).join(", ");
  }, [selectedKeys]);

  const handleSelectionChange = (keys:any) => {
    const selectedItem = items.find((item:any) => item.key === keys.anchorKey);
    if (selectedItem) {
      setSelectedKeys(new Set([selectedItem]));
    }
  };
  
  return (
    <Dropdown>
      <DropdownTrigger>
        <button className={`text-gray-600 border-r-1 border-gray-400 pr-3 outline-none text-sm ${buttonClassName}`}>
          {selectedValue}
        </button>
      </DropdownTrigger>
      <DropdownMenu
        disallowEmptySelection
        selectionMode="single"
        selectedKeys={selectedKeys}
        onSelectionChange={handleSelectionChange}
        aria-label="Dynamic Actions"
        items={items}
      >
        {(item:any) => (
          <DropdownItem
            key={item.key}
            color={item.key === "delete" ? "danger" : "default"}
            className={item.key === "delete" ? "text-danger" : ""}
          >
            {item.label}
          </DropdownItem>
        )}
      </DropdownMenu>
    </Dropdown>
  );
};
