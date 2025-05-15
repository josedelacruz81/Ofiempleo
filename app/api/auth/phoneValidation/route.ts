import { deleteCero } from "@/lib/functions";
import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);
function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
export async function POST(req: Request) {
  try {
    const { phone, userId } = await req.json();
    const formattedPhone = deleteCero(phone);

    const code = generateVerificationCode();
    const { error } = await supabase
      .from("users")
      .update({ validationCodePhone: code })
      .eq("id", userId);
    if (error) {
      console.error(error);
      return NextResponse.json({ message: "Error" }, { status: 500 });
    }
    await client.messages.create({
      body: `Tu código de verificación de Ofiempleo es: ${code}`,

      from: "+14056792546",
      to: `+593${formattedPhone}`,
    });
    return NextResponse.json(
      { message: "Phone Verification" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}
