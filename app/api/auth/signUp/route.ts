import { ci,cellphone } from "ecuador-validator";
import { supabase } from "@/lib/supabase";
import { AVAILABLE } from "@/types";
import { NextResponse } from "next/server";
import { credentialsSchema } from "@/lib/zodValidations";
import { Resend } from "resend";
import { EmailTemplate } from "@/components/auth/EmailTemplate";
import { generateVerificationCode } from "@/lib/functions";

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

const options = {
  method: "GET",
  headers: {
    Accept: "application/json",
    Authorization: `Bearer ${process.env.SERVICESEC_TOKEN}`,
  },
};

export async function POST(req: Request) {
  const credentials = await req.json();

  try {
    const validData = credentialsSchema.parse(credentials);
 
    if (!ci(validData.id))
      return NextResponse.json(
        { message: "Cédula incorrecta" },
        { status: 400 }
      );
    const { data: userIdFinded } = await supabase
      .from("users")
      .select("id")
      .eq("id", validData.id)
      .single();
    const { data: userEmailFinded } = await supabase
      .from("users")
      .select("email")
      .eq("email", validData.email)
      .single();
    if (!!userIdFinded) {
      return NextResponse.json(
        {
          message: "Usuario ya registrado",
        },
        { status: 400 }
      );
    }
    if (!!userEmailFinded) {
    
        return NextResponse.json(
          {
            message: "El email ya está en uso",
          },
          { status: 400 }
        );
      
    }

    if(!cellphone(validData.phone)){
      return NextResponse.json(
        {
          message: "Número de teléfono incorrecto",
        },
        { status: 400 }
      );
    }
    
    const formatedPhone = validData.phone.replace(/^0/, "");
   
    // const apiResponse = await fetch(
    //   `https://webservices.ec/api/checkwhatsapp/593${formatedPhone}`,
    //   options
    // );
  

    // const response = await apiResponse.json();
    // console.log(response,apiResponse);
    // if(apiError) {
     
    //   return NextResponse.json(
    //     {
    //       message: "Error al verificar número de whatsapp",
    //     },
    //     { status: 400 }
    //   );
    // }
   
    // if (status !== AVAILABLE) {
    //   return NextResponse.json(
    //     {
    //       message: "Número de whatsapp no disponible, ingrese otro número",
    //     },
    //     { status: 400 }
    //   );
    // }
    const url = `https://webservices.ec/api/cedula/${validData.id}`;
    const res = await fetch(url, options);
    const result = await res.json();
    const verificationCode = generateVerificationCode();

    const { error } = await supabase.from("users").insert({
      password: validData.password,
      names: result.data.response.nombres,
      lastname: result.data.response.apellidos,
      location: validData.location,
      phone: validData.phone,
      id: validData.id,
      email: validData.email,
      isValidEmail: false,
      validationCode: verificationCode,
    });
    if (!!error) {
      return NextResponse.json(
        {
          message: "Error al registrar usuario",
        },
        { status: 400 }
      );
    }
    if (validData.email === "jdelacruz1423@utm.edu.ec") {
      const emailResponse = sendEmail(
        validData.email,
        verificationCode,
        result.data.response.nombres
      );
      if (!emailResponse) {
        return NextResponse.json(
          {
            message: "Error al enviar correo de verificación",
          },
          { status: 400 }
        );
      }
      return NextResponse.json(
        {
          message: "Se ha enviado un correo de verificación",
        },
        { status: 201 }
      );
    }
    return NextResponse.json(
      {
        message: "Usuario registrado correctamente",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      message: "Error al registrar usuario",
      status: 400,
    });
  }
}
