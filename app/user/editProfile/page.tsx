"use client";

import { z } from "zod";
import { Input } from "@nextui-org/input";
import { supabase } from "@/lib/supabase";
import { Button } from "@nextui-org/button";
import { useSession } from "next-auth/react";
import { editProfileAction } from "@/components/actions/editProfileAction";
import { useState } from "react";
import ImageInput from "@/components/profile/ImageInput";
import { Avatar } from "@nextui-org/avatar";
export default function Page() {
  const session = useSession();
  const [error, setError] = useState("");
  const handleAction = async (formData: FormData) => {
    const res = await editProfileAction(
      formData,
      // @ts-ignore
      session.data?.user.id.toString()
    );
    if (res) {
      setError(res.message);
    }
  };
  return (
    <form
      action={handleAction}
      className="w-[70%] mx-auto bg-white mt-10 p-8 rounded-xl grid grid-cols-5"
    >
      <div className="col-span-1 flex items-center justify-center">
        <ImageInput userId={session.data? session.data?.user.id.toString() :''}>
          <Avatar
          // @ts-ignore
            src={session.data?.user?.profileImage?.toString()}
            // @ts-ignore
            name={session.data?.user?.names?.toString()}
            className="w-20 h-20"
          />
        </ImageInput>
      </div>
      <div className="flex flex-col gap-5 flex-2 col-span-4">
        <Input
          label="Email"
          variant="bordered"
          disabled
          value={
            session.status === "authenticated"
              ? session.data?.user?.email?.toString()
              : ""
          }
        />
        <Input
          name="password"
          label="Contraseña"
          variant="bordered"
          type="password"
        />
        <Input
          name="passwordConfirm"
          label="Confirmar Contraseña"
          variant="bordered"
          type="password"
        />
        {error && <p className="text-sm text-blue-500">{error}</p>}
        <Button type="submit" color="primary" variant="bordered">
          Guardar
        </Button>
      </div>
    </form>
  );
}
