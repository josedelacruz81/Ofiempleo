
import { auth } from "@/auth";
import { AuthTabs } from "@/components/auth/AuthTabs";
import { redirect } from "next/navigation";

export default async function Page() {

  const session = await auth();
  if(session) return redirect("/");

  return (
    <div className="flex flex-col items-center gap-6">

       <AuthTabs /> 

    </div>
  );
}
