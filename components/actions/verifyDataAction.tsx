"use server"
import { generateVerificationCode } from "@/lib/functions";
import { supabase } from "@/lib/supabase";
import { Resend } from "resend";
import { EmailTemplate } from "@/components/auth/EmailTemplate";

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (email: string, code: string, username: string) => {
  const { data, error } = await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to: "jdelacruz1423@utm.edu.ec",
    subject: "Verificación de correo",
    react: EmailTemplate({ username, code }),
    text: "Hello world",
  });
  if (error) {
    console.log("Hubo un problema al enviar el correo electronico de verificación",error);
    return false;
  }
  
  console.log("Correo enviado correctamente",data);
  return true;
};
export const verifyDataAction = async (formData: FormData) => {
  const id = formData.get("id") as string;
  const email = formData.get("email") as string;
  const { data, error } = await supabase
    .from("users")
    .select("id")
    .eq("id", id)
    .eq("email", email);
  if(error) {
    console.log(error);
    return null;
  }
  if(data.length === 0) {
    return null;
  }
  const code = generateVerificationCode();
  const isSended =  await sendEmail(email, code, id);
  if(!isSended) {
    return null;
  }
  return {
    code,
    userId: data[0].id,
  };
}