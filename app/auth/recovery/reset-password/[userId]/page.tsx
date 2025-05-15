import { PasswordInput } from "@/components/littleComponents/PasswordInput";
import { supabase } from "@/lib/supabase";
import { Button, Input } from "@nextui-org/react";
import { redirect } from "next/navigation";

export default function Page({
  params,
}: {
  params: {
    userId: string;
  };
}) {
  const resetPassword = async (formData: FormData) => {
    "use server";
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;
    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }
    const { error } = await supabase
      .from("users")
      .update({
        password,
      })
      .eq("id", params.userId);
    if (error) {
      console.log(error);
    }
    redirect("/auth");
  };

  return (
    <form action={resetPassword} className="space-y-4">
      <div>
        <h3 className="text-xl font-bold">Restablecer contraseña</h3>
        <p className="text-default-500 text-sm">Ingrese la nueva contraseña</p>
      </div>
      <PasswordInput name="password" placeholder="Escribe la nueva contraseña"/>
      <PasswordInput name="confirmPassword" placeholder="Confirma la contraseña"/>
      <Button type="submit" fullWidth color="primary">
        Restablecer contraseña
      </Button>
    </form>
  );
}
