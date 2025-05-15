"use client";

import { Button } from "@nextui-org/react";

import { useRouter } from "next/navigation";
import { GrRefresh } from "react-icons/gr";
export const RefreshButton = ({...rest}) => {
  const { refresh } = useRouter();
  return (
    <Button size="sm" color="primary" variant="flat" onPress={refresh} isIconOnly {...rest}>
      <GrRefresh />
    </Button>
  );
};
