import { uploadImg } from "@/lib/firebase";
import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { keys, PostInterface } from "@/types";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const key = searchParams.get("key") as keys;

  let fromDate: string | null = null;
  let toDate = new Date().toISOString();

  if (key === keys.mensual) {
    fromDate = new Date(
      new Date().setMonth(new Date().getMonth() - 1)
    ).toISOString();
  } else if (key === keys.semanal) {
    fromDate = new Date(
      new Date().setDate(new Date().getDate() - 7)
    ).toISOString();
  }

  let query = supabase.from("requests").select(
    `
   id
    `
  );

  if (fromDate) {
    query = query.gte("created_at", fromDate).lte("created_at", toDate);
  }

  const { data, error } = await query;
  if (!!error)
    return NextResponse.json({ message: error.message, status: 400 });

  return NextResponse.json(data);
}

// export const POST = auth(async function POST(req) {
//   if (req.auth) return NextResponse.json(req.auth);
//   return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
// });
export async function POST(req: Request) {
  try {
    const session = await auth();

    const { data, error: checkError } = await supabase
      .from("posts")
      .select("id")
      .eq("userId", session?.user.id)
      .single();

    if (!!data)
      return NextResponse.json(
        {
          message: "Ya tienes tu perfil publicado, no puedes crear otro",
        },
        { status: 401 }
      );

    const getImagesFromFormData = (formData: FormData) => {
      const images: any = [];
      formData.forEach((value, key) => {
        if (key.startsWith("image")) {
          images.push(value);
        }
      });
      return images;
    };
    const formData = await req.formData();

    const profession = formData.get("profession");
    const description = formData.get("description");
    const formSkills = formData.get("skills");
    const typeWork = formData.get("typeWork");
    const hourly = typeWork !== "job" ? formData.get("hourly") : 0;
    const images = getImagesFromFormData(formData);
    const skills = formSkills === null ? [] : JSON.parse(formSkills.toString());

    const imagesURL = await Promise.all(
      images.map((image: any) => uploadImg(image))
    );
    const { error } = await supabase.from("posts").insert({
      profession,
      hourly,
      description,
      typeWork,
      skills,
      images: imagesURL,
      userId: session?.user?.id,
    });

    if (error) {
      console.log(error);
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
    revalidatePath("/", "page");
    return NextResponse.json({ message: "Post created" }, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Error" });
  }
}
