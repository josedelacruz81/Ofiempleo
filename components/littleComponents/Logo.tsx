"use client";
import { Logo as NewLogo } from "../icons";
import Link from "next/link";
import { useRole } from "@/context/RoleContext";
import { EMPLOYEE } from "@/types";
export const Logo = () => {
  const { role } = useRole();
  return (
    <Link
      href={role === EMPLOYEE ? "/employee" : "/"}
      className=" md:text-4xl font-medium flex items-center justify-center "
    >
      <h1 className="hidden md:block">Ofiempleo</h1>
      <NewLogo  size={55}/>
    </Link>
  );
};
