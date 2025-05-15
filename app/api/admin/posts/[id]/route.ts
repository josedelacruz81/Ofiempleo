import { auth } from "@/auth";
import { getRole } from "@/lib/functions";
import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();

  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const role = await getRole(session.user.id);
  if (role !== "admin") return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const { error } = await supabase.from("posts").delete().eq("id", params.id);
  if (error) {
    return NextResponse.json(
      { message: "Error deleting post" },
      { status: 500 }
    );
  }
  revalidatePath("/","page");
  return NextResponse.json({ message: "Post deleted" });
}
