import { uploadProfileImage } from "@/lib/firebase";
import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";
export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const userId = formData.get("userId") as string;
    const profileImage = await uploadProfileImage(file);
    
    const { error } = await supabase
      .from("users")
      .update({
        profileImage,
      })
      .eq("id", userId);
    if (error) return NextResponse.json({ error: "Error updating user" });
    return NextResponse.json({ data: "Image uploaded" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error uploading image" });
  }
}
