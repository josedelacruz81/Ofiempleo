import { Card, CardBody } from "@nextui-org/react";
import Link from "next/link";
import { HiOutlineViewGrid } from "react-icons/hi";
import { Sidebar } from "./Sidebar";
import { supabase } from "@/lib/supabase";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { ADMIN } from "@/types";
import { getRole } from "@/lib/functions";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const role = await getRole(session?.user.id);
  if(role !== ADMIN) redirect("/");

  return (
    <div className="min-h-screen bg-gray-100 gap-5 my-5">
      
      <section >{children}</section>
    </div>
  );
}
