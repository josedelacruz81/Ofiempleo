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
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function VerificationPage() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const { signInCredentials } = useSignInContext();
  const { toast } = useToast();
  const  router= useRouter();
  const [localData, setLocalData] = useState({
    phone: "",
    userId: "",
    password: "",
  });



  useEffect(() => {
    const phone = localStorage.getItem("phoneNumber") as string;
    const userId = localStorage.getItem("id") as string;
    const password = localStorage.getItem("password") as string;
    if (!phone || !userId || !password) {
      router.push("/auth");
    }
    setLocalData({ phone, userId, password });
  }, []);

  const handleValidation = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("users")
        .select(`validationCode`)
        .eq("id", localData.userId)
        .single();
      if (!!error)
        return toast({
          title: "Error",
          variant: "destructive",
          className: "text-red-500 bg-red-100",
          description: "Usuario no encontrado",
        });

      if (data.validationCode !== parseInt(otp))
        return toast({
          title: "Error",
          variant: "destructive",
          className: "text-red-500 bg-red-100",
          description: "Código incorrecto",
        });

      const { error: updateVerificationError } = await supabase
        .from("users")
        .update({ isValidEmail: true })
        .eq("id", localData.userId);
      if (!!updateVerificationError)
        return toast({
          title: "Error",
          variant: "destructive",
          className: "text-red-500 bg-red-100",
          description: "Error al verificar el correo",
        });
      if(localData.phone==="0983648704"){
        router.push("/verification/phone");
        return;
      }
     
      const signInFormData = new FormData();
      signInFormData.append("id", localData.userId);
      signInFormData.append("password",localData.password);
      
      await signInAction(signInFormData);
      setTimeout(() => {
        router.push("/");
      }, 50);
      localStorage.removeItem("phoneNumber");
      localStorage.removeItem("id");
      localStorage.removeItem("email");
      localStorage.removeItem("password");
      toast({
        title: "Verificación completada con éxito",
        className: "text-green-500 bg-green-100",
        description: "Iniciando sesión...",
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <section className="h-screen flex items-center justify-center">
      <Card className="p-4 flex flex-col items-center justify-center">
        <CardHeader className="flex flex-col">
          <h2 className="text-2xl flex gap-2 items-center font-medium">
            {" "}
            <Logo /> Ofiempleo
          </h2>
          <h3 className="text-medium "> Verificación de correo electrónico</h3>
          <p className="text-gray-500 text-sm">
            Ingresa el código enviado a tu correo electrónico
          </p>
        </CardHeader>
        <CardBody className="flex items-center justify-center">
          <InputOTP
            value={otp}
            onChange={(value) => setOtp(value)}
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
        </CardBody>
        <CardFooter>
          <Button
            fullWidth
            isLoading={loading}
            color="primary"
            variant="light"
            onPress={handleValidation}
          >
            Verificar
          </Button>
        </CardFooter>
      </Card>
    </section>
  );
}
