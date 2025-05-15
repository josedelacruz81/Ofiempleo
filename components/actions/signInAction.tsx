"use server";
import { signIn } from "@/auth";
import { supabase } from "@/lib/supabase";

export const signInAction = async (formData: FormData) => {
  const credentials: any = Object.fromEntries(formData.entries());

   
  const { data, error } = await supabase
    .from("users")
    .select("id,password,isBanned,banReason, banFinishDate")
    .eq("id", credentials.id)
    .single();
  if (error) {
   
    return {
      message: "No hay ningun usuario registrado con esa cédula",
      ok:false
    };
  }

  if (credentials.password !== data.password){
    return {
      message: "Una de las credenciales es incorrecta",
      ok:false
    };
  }
  if (data.isBanned) {
    return {
      message: `Usuario baneado por ${data.banReason} hasta ${
        new Date(data.banFinishDate).toLocaleDateString()
      }`,
      ok:false
    };
  }
    
  

  await signIn("credentials", formData);
  return {
    message: "Sesión iniciada correctamente",
    ok:true
  };
};
