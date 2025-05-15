"use client";
import { Input } from "@nextui-org/input";
import {
  HiEye,
  HiEyeOff,
  HiOutlineIdentification,
  HiOutlineLockClosed,
} from "react-icons/hi";
import { Button } from "@nextui-org/button";
import { useState } from "react";
import { credentialsInterface } from "@/types";
import validator from "ecuador-validator";
import { signInAction } from "../actions/signInAction";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useToast } from "../shadCn/useToast";
import { supabase } from "@/lib/supabase";
import { processZodError } from "@/lib/zodValidations";
import Link from "next/link";
const credentialsSchema = z.object({
  id: z.string().min(10, {
    message: "Ingrese el número de cédula",
  }),
  password: z.string().min(6, {
    message: "Ingrese la contraseña",
  }),
});
const initialCredentials = {
  id: "",
  password: "",
};

export const SignInForm = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const [errors, setErrors] =
    useState<credentialsInterface>(initialCredentials);
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const validateAndSubmit = async (formData: FormData) => {
    try {
      setLoading(true);
      setErrors(initialCredentials);
      const rawFormData = Object.fromEntries(formData.entries());

      const validData = credentialsSchema.parse(rawFormData);
      if (!validator.ci(validData.id))
        return setErrors({
          ...errors,
          id: "Ingrese un número de cédula válido",
        });
      if (!validator.ci(validData.id))
        return setErrors({
          ...errors,
          id: "Ingrese un número de cédula válido",
        });
      const { data: userFinded, error } = await supabase
        .from("users")
        .select("email,isValidEmail,isValidPhone")
        .eq("id", validData.id)
        .single();
      if (
        !!userFinded &&
        !userFinded.isValidEmail &&
        userFinded.email === "jdelacruz1423@utm.edu.ec"
      ) {
        toast({
          title: "Error",
          variant: "destructive",
          className: "text-red-500 bg-red-100",
          description: "Usuario no verificado",
        });
        router.push("/verification");
        return;
      }
   
      //   if(!!userFinded && !userFinded.isValidPhone){
      //   toast({
      //     title: "Error",
      //     variant: "destructive",
      //     className: "text-red-500 bg-red-100",
      //     description: "Usuario no verificado",
      //   });
      //   router.push("/verification/phone");
      //   return;
      // }
      const data = await signInAction(formData);

      if (!!data) {
        return toast({
          title: "Error",
          variant: "destructive",
          className: "text-red-500 bg-red-100",
          description: data.message,
        });
      }
      if (!data) {
        toast({
          className: "text-green-500 bg-green-100",
          title: "Exito",
          description: "Sesión iniciada correctamente",
          variant: "destructive",
        });
        setTimeout(() => {
          router.push("/");
        }, 50);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = processZodError(error);
        setErrors(errors);
      } else {
        console.error("Unexpected error:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAction = (formData: FormData) => {
    if (!validateAndSubmit(formData)) return;

    return;
  };

  return (
    <form action={handleAction} className="grid grid-rows-4 gap-3">
      <fieldset>
        <Input
          name="id"
          variant="faded"
          placeholder="Cédula"
          type="number"
          maxLength={10}
          startContent={
            <HiOutlineIdentification size={35} className="text-gray-500/90" />
          }
        />
        {errors.id && <p className="text-red-500 text-xs">{errors.id}</p>}
      </fieldset>
      <fieldset>
        <Input
          endContent={
            <button
              className="focus:outline-none"
              type="button"
              onClick={toggleVisibility}
              aria-label="toggle password visibility"
            >
              {isVisible ? (
                <HiEyeOff className="text-2xl text-default-400 pointer-events-none" />
              ) : (
                <HiEye className="text-2xl text-default-400 pointer-events-none" />
              )}
            </button>
          }
          name="password"
          variant="faded"
          autoComplete="new-password"
          startContent={
            <HiOutlineLockClosed size={30} className="text-gray-500/90" />
          }
          placeholder="Contraseña"
          type={isVisible ? "text" : "password"}
        />
        {errors.password && (
          <p className="text-red-500 text-xs">{errors.password}</p>
        )}
       
      </fieldset>
      <p className="text-sm">¿Olvidaste tú contraseña? <Link className="text-primary" href="/auth/recovery">Recupérala aquí</Link></p>
      {/* <div>
        <Lin href="/auth/forgot-password" className="text-blue-500 text-sm hover:underline">
          Olvidé mi contraseña
        </Lin>
      </div> */}
      <div className="flex justify-around gap-2">
        <Button
          type="submit"
          className="w-full"
          color="primary"
          variant="ghost"
          isLoading={loading}
        >
          Continuar
        </Button>
      </div>
    </form>
  );
};
