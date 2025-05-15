import { uploadImg } from "@/lib/firebase";
import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { ACEPTED, PENDING, PostInterface } from "@/types";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;

  const userId = searchParams.get("userId");
  if (!userId) {
    const { data, error } = await supabase
      .from("posts")
      .select(
        `
      *,
      users (names,lastname, location,profileImage),
      profession (*)
      
      `
      )
      .order("created_at", { ascending: false })
      .eq("status", ACEPTED);
    if (!!error) {
      console.log(error);
      return NextResponse.json({ data: [] }, { status: 400 });
    }

    return NextResponse.json(data);
  }
  const { data, error } = await supabase
    .from("posts")
    .select(
      `
    *,
    users (names,lastname, location,profileImage),
    profession (*)
    
    `
    )
    .neq("userId", userId)
    .order("created_at", { ascending: false })
    .eq("status", ACEPTED);

  if (!!error) {
    console.log(error);
    return NextResponse.json({ data: [] }, { status: 400 });
  }
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
      status: PENDING,
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
