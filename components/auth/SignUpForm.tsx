"use client";
import {
  HiOutlineIdentification,
  HiOutlineLockClosed,
  HiOutlinePhone,
  HiOutlineLocationMarker,
  HiEyeOff,
  HiEye,
  HiOutlineMail,
} from "react-icons/hi";

import { credentialsInterface, parroquias } from "@/types";
import { Input } from "@nextui-org/input";
import { useRouter } from "next/navigation";
import { Button } from "@nextui-org/button";
import { useState } from "react";
import { z } from "zod";
import { useToast } from "@/components/shadCn/useToast";
import {
  Autocomplete,
  AutocompleteItem,
  Checkbox,
  Link as UiLink,
} from "@nextui-org/react";
import Link from "next/link";
import { ci } from "ecuador-validator";
import { signUpSchema } from "@/lib/zodValidations";
import { supabase } from "@/lib/supabase";

import { useSignInContext } from "@/context/signInContext";
import { signInAction } from "../actions/signInAction";

const initialCredentials: credentialsInterface = {
  id: "",
  password: "",
  confirmPassword: "",
  location: "",
  phone: "",
  role: "",
};

export const SignUpForm = () => {
  const [isVisible, setIsVisible] = useState({
    password: false,
    confirmPassword: false,
  });

  const toggleVisibility = () => {
    setIsVisible({
      password: !isVisible.password,
      confirmPassword: !isVisible.confirmPassword,
    });
  };

  const [location, setLocation] = useState("");
  const [credentials, setCredentials] =
    useState<credentialsInterface>(initialCredentials);
  const { handleCredentialsChange } = useSignInContext();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [terms, setTerms] = useState(false);
  const { toast } = useToast();
  const [errors, setErrors] =
    useState<credentialsInterface>(initialCredentials);

  const handleSubmit = async (formData: FormData) => {
    try {
      setLoading(true);
      setErrors(initialCredentials);
      const rawFormData = Object.fromEntries(formData.entries());

      signUpSchema.parse({
        id: credentials.id,
        password: credentials.password,
        confirmPassword: credentials.confirmPassword,
        email: rawFormData.email,
        phone: rawFormData.phone,
        location,
      });

      const passwordsMatch = (password: string, confirmPassword: string) =>
        password === confirmPassword;
      //@ts-ignore
      if (!passwordsMatch(credentials.password, credentials.confirmPassword))
        return toast({
          title: "Error",
          variant: "destructive",
          className: "text-red-500 bg-red-100",
          description: "Las contraseñas no coinciden",
        });

      if (!terms)
        return toast({
          title: "Error",
          variant: "destructive",
          className: "text-red-500 bg-red-100",
          description: "Debe aceptar los términos y condiciones",
        });

      if (!ci(credentials.id))
        return setErrors({ ...errors, id: "Cédula inválida" });
      const { data: user, error } = await supabase
        .from("users")
        .select("id,isValidEmail,isValidPhone")
        .eq("id", credentials.id);

      if (error)
        return toast({
          title: "Error",
          variant: "destructive",
          className: "text-red-500 bg-red-100",
          description: "Error al verificar el usuario",
        });

      if (user?.length > 0) {
        return toast({
          title: "Error",
          variant: "destructive",
          className: "text-red-500 bg-red-100",
          description: (
            <div>
              <p>El usuario ya existe, inicia sesión</p>
            </div>
          ),
        });
      }

      const res = await fetch(`/api/auth/signUp`, {
        method: "POST",
        body: JSON.stringify({
          ...credentials,
          location,
        }),
      });
      const data = await res.json();

      if (res.status !== 201) {
        toast({
          title: "Error",
          variant: "destructive",
          className: "text-red-500 bg-red-100",
          description: data.message,
        });
        return false;
      }

      if (credentials.email === "jdelacruz1423@utm.edu.ec") {
        localStorage.setItem("id", credentials.id);
        localStorage.setItem("phoneNumber", rawFormData.phone as string);
        localStorage.setItem("email", rawFormData.email as string);
        localStorage.setItem("password", credentials.password);
        router.push("/verification");
        toast({
          className: "text-green-500 bg-green-100",
          title: "Te has registrado correctamente",
          description: "Redirigiendo...",
        });
        return;
      }
      if (credentials.phone === "0983708845") {
        localStorage.setItem("id", credentials.id);
        localStorage.setItem("phoneNumber", rawFormData.phone as string);
        localStorage.setItem("email", rawFormData.email as string);
        localStorage.setItem("password", credentials.password);
        router.push("/verification/phone");
        toast({
          className: "text-green-500 bg-green-100",
          title: "Te has registrado correctamente",
          description: "Te hemos enviado un código de verificación, puede demorar unos minutos en llegar",
        });
        return;
      }

      const signInFormData = new FormData();
      signInFormData.append("id", credentials.id);
      signInFormData.append("password", credentials.password);
      await signInAction(signInFormData);

      toast({
        className: "text-green-500 bg-green-100",
        title: "Te has registrado correctamente",
        description: data.message,
      });
      setTimeout(() => {
        router.push("/");
      }, 50);
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(
          error.errors.reduce((acc, err) => {
            return { ...acc, [err.path[0]]: err.message };
          }, initialCredentials)
        );

        return false;
      } else {
        console.error("Unexpected error:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAction = (formData: FormData) => {
    if (!handleSubmit(formData)) return;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  return (
    <form
      action={async (formData: FormData) => {
        await handleAction(formData);
      }}
      className="w-full flex flex-col gap-4"
    >
      <section className={`flex flex-col gap-3 `}>
        <fieldset>
          <Input
            name="id"
            variant="faded"
            onChange={(e) => {
              handleChange(e), handleCredentialsChange(e);
            }}
            placeholder="Cédula"
            maxLength={10}
            type="number"
            value={credentials.id}
            startContent={
              <HiOutlineIdentification size={25} className="text-gray-500/90" />
            }
          />
          {errors.id && <p className="text-red-500 text-xs">{errors.id}</p>}
        </fieldset>
        <fieldset>
          <Input
            value={credentials.email}
            variant="faded"
            placeholder="Correo electrónico"
            startContent={
              <HiOutlineMail size={25} className="text-gray-500/90" />
            }
            onChange={handleChange}
            name="email"
          />
          {errors.email && (
            <p className="text-red-500 text-xs">{errors.email}</p>
          )}
        </fieldset>
        <div className="flex flex-col md:flex-row gap-2 items-center w-full ">
          <fieldset className=" w-full">
            <Input
              value={credentials.password}
              autoComplete="new-password"
              name="password"
              onChange={(e) => {
                handleChange(e), handleCredentialsChange(e);
              }}
              variant="faded"
              aria-label="contraseña"
              endContent={
                <button
                  className="focus:outline-none"
                  type="button"
                  onClick={toggleVisibility}
                  aria-label="toggle password visibility"
                >
                  {isVisible.password ? (
                    <HiEyeOff className="text-2xl text-default-400 pointer-events-none" />
                  ) : (
                    <HiEye className="text-2xl text-default-400 pointer-events-none" />
                  )}
                </button>
              }
              startContent={
                <HiOutlineLockClosed size={30} className="text-gray-500/90" />
              }
              placeholder="Contraseña"
              type={isVisible.password ? "text" : "password"}
            />
            {errors.password && (
              <p className="text-red-500 text-xs">{errors.password}</p>
            )}
          </fieldset>

          <fieldset className="w-full">
            <Input
              value={credentials.confirmPassword}
              autoComplete="on"
              onChange={handleChange}
              name="confirmPassword"
              variant="faded"
              startContent={
                <HiOutlineLockClosed size={30} className="text-gray-500/90" />
              }
              endContent={
                <button
                  className="focus:outline-none"
                  type="button"
                  onClick={toggleVisibility}
                  aria-label="toggle password visibility"
                >
                  {isVisible.confirmPassword ? (
                    <HiEyeOff className="text-2xl text-default-400 pointer-events-none" />
                  ) : (
                    <HiEye className="text-2xl text-default-400 pointer-events-none" />
                  )}
                </button>
              }
              aria-label="confirmar contraseña"
              placeholder="Confirmar contraseña"
              type={isVisible.password ? "text" : "password"}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs">{errors.confirmPassword}</p>
            )}
          </fieldset>
        </div>

        <div className="grid md:grid-cols-2 gap-2">
          <fieldset>
            <Autocomplete
              defaultItems={parroquias}
              selectedKey={location}
              //@ts-ignore
              onSelectionChange={(e) => setLocation(e)}
              startContent={
                <HiOutlineLocationMarker
                  size={30}
                  className="text-gray-500/90"
                />
              }
              variant="faded"
              placeholder="Parroquia"
              aria-label="Parroquia"
            >
              {({ value, label }) => (
                <AutocompleteItem key={value} value={value}>
                  {label}
                </AutocompleteItem>
              )}
            </Autocomplete>
            {errors.location && (
              <p className="text-red-500 text-xs">{errors.location}</p>
            )}
          </fieldset>
          <fieldset>
            <Input
              value={credentials.phone}
              name="phone"
              onChange={handleChange}
              variant="faded"
              startContent={
                <HiOutlinePhone size={25} className="text-gray-500/90" />
              }
              placeholder="09********"
              type="number"
            />
            {errors.phone && (
              <p className="text-red-500 text-xs">{errors.phone}</p>
            )}
          </fieldset>
        </div>

        <Checkbox size="sm" isSelected={terms} onValueChange={setTerms}>
          Acepta nuestros{" "}
          <UiLink
            className="text-sm"
            as={Link}
            href="https://firebasestorage.googleapis.com/v0/b/ofiempleo-9310c.appspot.com/o/terminos%20y%20condiciones%2FT%C3%A9rminos%20y%20Condiciones%20de%20Ofiempleo.pdf?alt=media&token=a6ad587f-3453-4442-a59e-3c711558d231"
            target="_blank"
          >
            términos y condiciones
          </UiLink>
        </Checkbox>
        <Button
          isLoading={loading}
          color="primary"
          variant="ghost"
          type="submit"
        >
          Continuar
        </Button>
      </section>

      {/* <Carousel setApi={setApi} className="w-full ">
        <CarouselContent>
          {form.map(({ id, content }) => (
            <CarouselItem key={id}>{content}</CarouselItem>
          ))}
        </CarouselContent>

        {current < 3 && (
          <div className="flex items-center gap-2 mt-4">
            <CarouselPrevious variant="solid" size="md" className="" />
            <CarouselNext
              as={Button}
              onPress={handleNext}
              isLoading={loading}
              color="primary"
              className="flex-1"
              size="md"
            >
              continuar
            </CarouselNext>
          </div>
        )}
      </Carousel> */}
    </form>
  );
};
