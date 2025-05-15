"use client";
import { signInAction } from "@/components/actions/signInAction";
import { Logo } from "@/components/icons";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/shadCn/Input-otp";
import { useToast } from "@/components/shadCn/useToast";
import { useSignInContext } from "@/context/signInContext";
import { supabase } from "@/lib/supabase";
import { CiEdit } from "react-icons/ci";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  Input,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { HiOutlinePhone } from "react-icons/hi";
import { FiSave } from "react-icons/fi";
import { phoneSchema, processZodError } from "@/lib/zodValidations";
import { cellphone } from "ecuador-validator"
export default function VerificationPhonePage() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [localData, setLocalData] = useState({
    phone: "",
    userId: "",
    password: "",
  });
  const [timer, setTimer] = useState(0);

  const [errors, setErrors] = useState({
    phone: "",
  });
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const phone = localStorage.getItem("phoneNumber") as string;
    const userId = localStorage.getItem("id") as string;
    const password = localStorage.getItem("password") as string;
    if (!phone || !userId || !password) {
      router.push("/auth");
    }
    setLocalData({ phone, userId, password });
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleValidation = async (value: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("users")
        .select(`validationCodePhone`)
        .eq("id", localData.userId)
        .single();
      if (!!error)
        return toast({
          title: "Error",
          variant: "destructive",
          className: "text-red-500 bg-red-100",
          description: "Usuario no encontrado",
        });

      if (data.validationCodePhone !== parseInt(value))
        return toast({
          title: "Error",
          variant: "destructive",
          className: "text-red-500 bg-red-100",
          description: "Código incorrecto",
        });

      const { error: updateVerificationError } = await supabase
        .from("users")
        .update({ isValidPhone: true })
        .eq("id", localData.userId);
      if (!!updateVerificationError)
        return toast({
          title: "Error",
          variant: "destructive",
          className: "text-red-500 bg-red-100",
          description: "Error al verificar el número de teléfono",
        });

      toast({
        title: "Verificación completada con éxito",
        className: "text-green-500 bg-green-100",
        description: "Iniciando sesión...",
      });
      const signInFormData = new FormData();
      signInFormData.append("id", localData.userId);
      signInFormData.append("password", localData.password);
      await signInAction(signInFormData);
      setTimeout(() => {
        router.push("/");
      }, 50);
      localStorage.removeItem("phoneNumber");
      localStorage.removeItem("id");
      localStorage.removeItem("email");
      localStorage.removeItem("password");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const sendCode = async () => {
    try {
      setLoading(true);

      phoneSchema.parse({
        phone:localData.phone
      });

      if (!cellphone(localData.phone)) {
        return setErrors({
          ...errors,
          phone: "Número de teléfono inválido",
        });
      }

      if (timer === 0) {
        const res = await fetch("/api/auth/phoneValidation", {
          method: "POST",
          body: JSON.stringify({
            phone: localData.phone,
            userId: localData.userId,
          }),
        });
        const data = await res.json();
        toast({
          title: "Código enviado",
          variant: "destructive",
          className: "text-green-500 bg-green-100",
          description: "Código enviado correctamente",
        });
        setTimer(90); // 1 minuto y medio (90 segundos)
      } else {
        toast({
          title: "Espera para reenviar",
          variant: "destructive",
          className: "text-yellow-500 bg-yellow-100",
          description: `Espera ${timer} segundos para reenviar el código.`,
        });
      }
    } catch (error) {
      console.log(error);
      const errors = processZodError(error);
      setErrors(errors);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (value: string) => {
    setOtp(value);

    if (value.length === 6) {
      handleValidation(value);
    }
  };

  return (
    <section className="h-screen flex items-center justify-center">
      <Card className="p-4 flex flex-col w-96">
        <CardHeader className="flex flex-col gap-2">
          <h2 className="text-2xl flex gap-2 items-center font-medium">
            <Logo /> Ofiempleo
          </h2>

          <p className="text-gray-500 text-sm">
            Ingresa el código enviado a tu número teléfonico
          </p>

          <fieldset>
          <Input
           
        
            value={localData.phone}
            name="phone"
            onChange={(e) =>
              setLocalData({ ...localData, phone: e.target.value })
            }
            variant="faded"
            startContent={
              <HiOutlinePhone size={25} className="text-gray-500/90" />
            }
            placeholder="09********"
            type="number"
          />
          {errors.phone && (
            <p className="text-danger text-xs">
              {errors.phone}
            </p>
          )}
          </fieldset>
        </CardHeader>
        <div className="flex items-center justify-center">
          <InputOTP
            className="mx-auto"
            value={otp}
            onChange={handleChange}
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
        <CardFooter className="flex flex-col mt-5">
          <Button
            fullWidth
            isLoading={loading}
            color="primary"
            className={` text-sm ${timer > 0 ? " cursor-not-allowed" : ""}`}
            onClick={sendCode}
            disabled={timer > 0}
          >
            {timer > 0 ? `Reenviar en ${timer} segundos` : "Enviar código"}
          </Button>
        </CardFooter>
      </Card>
    </section>
  );
}
