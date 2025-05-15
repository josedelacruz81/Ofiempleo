"use client";

import { Button } from "@nextui-org/button";
import { useRouter } from "next/navigation";
import { HiMiniXMark } from "react-icons/hi2";

export function CloseButton() {
  const router = useRouter();

  return (
    <Button
      size="sm"
      isIconOnly
      radius="full"
      variant="light"
      className="absolute top-2 right-6 text-2xl  z-10 text-danger"
      onPress={() => {
        router.back();
      }}
    >
      <HiMiniXMark size={25} />
    </Button>
  );
}
