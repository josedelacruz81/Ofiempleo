"use client";

import { EMPLOYEE, EMPLOYER, jobInterface } from "@/types";
import { PostModal } from "../modals/PostModal";
import Link from "next/link";
import { ProfileDropdown } from "../dropdowns/ProfileDropdown";
import { NavModal } from "../modals/navModal";
import { useRole } from "@/context/RoleContext";
import { FilterDropdown } from "../dropdowns/FilterDropdown";
export const NavItems = ({
  session,
  jobs,
}: {
  session: any;
  jobs: jobInterface[];
}) => {
  const { role } = useRole();
  if (!session)
    return (
      <>
        <ul className="w-1/2 hidden lg:flex items-center justify-around">
          <li>
            <Link href="/">Inicio</Link>
          </li>
          <li className="">
            <FilterDropdown jobs={jobs} />
          </li>

          <li>
            <Link href="/about">
              <p>Sobre nosotros</p>
            </Link>
          </li>

          <li>
            <Link href="/auth">
              <p>Iniciar sesión</p>
            </Link>
          </li>
        </ul>
        <article className="flex lg:hidden">
          <NavModal session={session} jobs={jobs} />
        </article>
      </>
    );

  return (
    <>
      <ul className={`hidden w-1/2 lg:flex justify-around  items-center `}>
        <li>
          <Link href={role === EMPLOYEE ? "/employee" : "/"}>Inicio</Link>
        </li>
        {role !== EMPLOYEE && (
          <li>
            <FilterDropdown jobs={jobs} />
          </li>
        )}
        {role === EMPLOYER && (
          <li>
            <Link href="/employer/requests">
              <p>Mis solicitudes </p>
            </Link>
          </li>
        )}

        {/* <li >{role === EMPLOYEE && <PostModal />}</li> */}
        <li>
          <Link href="/about">
            <p className="text-white">Sobre nosotros</p>
          </Link>
        </li>

        <li>
          <ProfileDropdown session={session} />
        </li>
      </ul>
      <article className="flex lg:hidden">
        <NavModal session={session} jobs={jobs} />
      </article>
    </>
  );
};
