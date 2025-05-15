import { z } from "zod";
import { ci } from "ecuador-validator";
import { supabase } from "@/lib/supabase";

interface Fields {
  id: string;
  password: string;
  names: string;
  lastName: string;
  email: string;
  phone: string;
}

const credentialsSchema = z.object({
  id: z.string().min(10),
  password: z.string().min(6),
});

export async function POST(req: Request) {
  try {
    const credentials = await req.json();
    const validData = credentialsSchema.parse(credentials);

    if (!ci(validData.id)) {
      return new Response(JSON.stringify({ error: "Cédula incorrecta" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { data: user, error } = await supabase
      .from("users")
      .select("id,names,email,role,password")
      .eq("id", credentials.id)
      .single();

    if (error) {
      console.log(error);
      return new Response(JSON.stringify({ error: "Internal Server Error" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
    if (!user) {
      return new Response(JSON.stringify({ error: "Usuario no encontrado" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
    if (!validData.password.match(user.password)) {
      return new Response(JSON.stringify({ error: "Contraseña incorrecta" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    return new Response(JSON.stringify(user), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
