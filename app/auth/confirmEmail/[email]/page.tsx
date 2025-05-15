import { supabase } from "@/lib/supabase";
import { HiArrowLeft, HiArrowRight, HiCheck } from "react-icons/hi";
import { z } from "zod";
import { Button, Chip } from "@nextui-org/react";
import Link from "next/link";
const emailSchema = z.object({
  email: z.string().email(),
});
const confirmEmail = async (email: string) => {
  try {
    if (email === null)
      return {
        message: "No se ha enviado un email",
        type: "error",
      };

    const decodedEmail = await decodeURIComponent(email);

    const { email: validEmail } = emailSchema.parse({ email: decodedEmail });

    const { data, error } = await supabase
      .from("users")
      .select("email,isValidEmail")
      .eq("email", validEmail)
      .single();

    if (error) return console.log(error);

    if (!data)
      return {
        message: "Error al confirmar email, email no encontrado",
        type: "error",
      };
    if (data.isValidEmail)
      return {
        message: "Email ya ha sido confirmado",
        type: "info",
      };
    const { error: updateError } = await supabase
      .from("users")
      .update({ isValidEmail: true })
      .eq("email", validEmail);
    if (updateError) return console.log(updateError);
    return {
      message: "Email confirmado",
      type: "success",
    };
  } catch (error) {
    console.error(error);
    return {
      message: "Error al confirmar email",
      type: "error",
    };
  }
};

export default async function ConfirmEmail({
  params: { email },
}: {
  params: { email: string };
}) {
  const emailConfirmation = await confirmEmail(email);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="bg-green-500 rounded-full flex items-center justify-center h-7 w-7">
        <HiCheck className="text-white" />
      </div>
      <h3 className="text- font-semibold text-gray-700">{emailConfirmation?.message}</h3>
      <Button variant="light" color="secondary" as={Link} href="/">
      <HiArrowLeft /> Volver a la página principal 
      </Button>
    </div>
  );
}
