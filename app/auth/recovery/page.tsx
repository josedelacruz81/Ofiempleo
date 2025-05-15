"use client";
import { verifyDataAction } from "@/components/actions/verifyDataAction";
import { Button, Input } from "@nextui-org/react";
import { useState } from "react";
import { HiOutlineIdentification, HiOutlineMail } from "react-icons/hi";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/shadCn/Input-otp";
import { useRouter } from "next/navigation";
export default function Page() {
  const [isVerified, setIsVerified] = useState(false);
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const onAction = async (formData: FormData) => {
    setIsLoading(true);
    const res = await verifyDataAction(formData);
    console.log(res?.code);
    if (res) {
      setIsVerified(true);
      localStorage.setItem("code", res.code);
      localStorage.setItem("userId", res.userId);
      setIsLoading(false);
    } else {
      setError(
        "Los datos ingresados están incorrectos, revise y vuelva a intentar"
      );
      setIsLoading(false);
    }
  };

  const handleChange = (value: string) => {
    setValue(value);

  };


  const handleVerification = () => {
    
    if (value.length === 6) {
      if (value === localStorage.getItem("code")) {
        router.push(
          `/auth/recovery/reset-password/${localStorage.getItem("userId")}`
        );
      } else {
        alert("Código incorrecto");
      }
    }
  }

  return (
    <>
      <div>
        <h3 className="text-xl font-bold">
          {!isVerified
            ? "Recuperar contraseña"
            : "Ingresar código de verificación"}
        </h3>
        <p className="text-default-500 text-sm">
          {!isVerified
            ? "Ingrese su cédula y correo electrónico para recuperar su contraseña"
            : "Hemos enviado un código de verificación a su correo electrónico. Por favor ingréselo a continuación."}
        </p>
      </div>
      {!isVerified ? (
        <form action={onAction} className="space-y-3">
          <fieldset>
            <Input
              name="id"
              variant="faded"
              placeholder="Cédula"
              type="number"
              required
              maxLength={10}
              startContent={
                <HiOutlineIdentification
                  size={35}
                  className="text-gray-500/90"
                />
              }
            />

            {/* {errors.id && <p className="text-red-500 text-xs">{errors.id}</p>} */}
          </fieldset>
          <fieldset>
            <Input
              variant="faded"
              required
              placeholder="Correo electrónico"
              startContent={
                <HiOutlineMail size={25} className="text-gray-500/90" />
              }
              name="email"
            />
          </fieldset>
          {error && <p className="text-sm text-danger">{error}</p>}
          <Button isLoading={isLoading} color="primary" fullWidth type="submit">
            Continuar
          </Button>
        </form>
      ) : (
        <>
          <div className="w-fit mx-auto space-y-3">
            <InputOTP
              value={value}
              onChange={handleChange}
              className=""
              maxLength={6}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>
          <div className="space-y-2">
          <Button variant="light" color="primary" fullWidth type="submit">
            Reenviar código
          </Button>
          <Button color="primary" fullWidth onPress={handleVerification}>
            Continuar
          </Button>
          </div>
        </>
      )}
    </>
  );
}
