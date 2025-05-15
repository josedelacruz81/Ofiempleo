"use server";
import { z } from "zod";
import { supabase } from "@/lib/supabase";

export const editProfileAction = async (formData: FormData, userId: string) => {
  try {
    const data = Object.fromEntries(formData.entries());

    const schema = z.object({
      password: z.string().min(6),
      passwordConfirm: z.string().min(6),
    });
    const parsedData = schema.parse(data);
    if (parsedData.password.match(parsedData.passwordConfirm)) {
      

      const { error } = await supabase
        .from("users")
        .update({
          password: parsedData.password,
        })
        .eq("id", userId);
      if (error) return { message: error.message };
      return { message: "La contraseña fue cambiada con exito" };
    } else {
      return { message: "Las contraseñas no coinciden" };
    }
  } catch (error) {
    console.error(error);
  }
};
