"use client";
import { Card, CardBody, Tooltip } from "@nextui-org/react";
import {
  HiHome,
  HiOutlineChartSquareBar,
  HiOutlineCheck,
  HiOutlineClipboardList,
  HiOutlineExclamation,
  HiOutlineUserGroup,
  HiOutlineViewGrid,
  HiOutlineX,
} from "react-icons/hi";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/littleComponents/Logo";
import { ProfileDropdown } from "@/components/dropdowns/ProfileDropdown";
import { Session } from "next-auth";
import { capitalizeFirstLetter } from "@/lib/functions";
import { useState } from "react";

export const Sidebar = ({ session }: { session: Session | null }) => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);


  const navLinks = [
    {
      name: "Inicio",
      href: "/",
      icon: <HiHome size={25} />,
    },
    // {
    //   name: "Mi perfil",
    //   href: "/employee",
    //   icon: <GrUserWorker size={25} />,
    // },
    // {
    //   name: "Mis solicitudes",
    //   href: "/employer/requests",
    //   icon: <HiOutlineClipboardList size={25} />,
    // },
  ];

  const navAdminLinks = [
    {
      name: "Usuarios",
      href: "/admin/users",
      icon: <HiOutlineUserGroup size={25} />,
    },
    {
      name:"Reportes",
      href:"/admin/reports",
      icon:<HiOutlineExclamation size={25} />
    },
    {
      name: "Estadisticas",
      href: "/admin/stats",
      icon: <HiOutlineChartSquareBar size={25} />,
    },

    {
      name: "Solicitudes de oficios",
      href: "/admin/requests",
      icon: <HiOutlineClipboardList size={25} />,
    },
    {
      name: "Gestión de publicaciones",
      href: "/admin/posts",
      icon: <HiOutlineViewGrid size={25} />,
    },
  ];

  const handleNavSize = () => {
    return isOpen ? "md:w-80" : "md:w-5";
  };

  return (
    <aside className="space-y-2 lg:sticky lg:top-0 md:h-screen  w-72 flex flex-col">
      <Card className={` w-full transition-all p-2 `}>
        <CardBody className="flex flex-row items-center justify-between overflow-hidden">
          <div className="flex flex-col items-center justify-center">
            {isOpen && <Logo />}
            <p className="text-sm font-semibold">Admin</p>
          </div>
        </CardBody>
      </Card>
      <Card className={`grow w-full  ${handleNavSize} transition-all p-1 `}>
        <CardBody
          className={`flex flex-col justify-between`}
        >
          
          <ul
            className={`flex justify-between  h-full ${
              !isOpen && "items-center"
            } flex-row md:flex-col gap-2 lg:gap-4 lg:mt-2`}
          >
            <h3 className="text-[#808080] text-sm font-bold">Menú</h3>
            {navLinks.map((link, i) => (
              <li key={i}>
                <Link
                  href={link.href}
                  className={`flex items-center ${
                    !isOpen && " justify-center"
                  } p-2 gap-2  font-normal  transition-colors rounded-xl ${
                    pathname === link.href
                      ? "text-[#f7f7f7] bg-[#262626]  "
                      : "text-[#808080]"
                  }`}
                >
                  {link.icon}
                  <Tooltip placement="right" content={link.name}>
                    <p className={`${isOpen ? "md:block" : "hidden"}`}>
                      {link.name}
                    </p>
                  </Tooltip>
                </Link>
              </li>
            ))}
            <h3 className="text-[#808080] text-sm font-bold hidden lg:block">
              Admin
            </h3>

            {navAdminLinks.map((link, i) => (
              <li key={i}>
                <Link
                  href={link.href}
                  className={`flex items-center p-3 gap-2  font-normal  transition-colors rounded-xl ${
                    pathname === link.href
                      ? "text-[#f7f7f7] bg-[#262626]  "
                      : "text-[#808080]"
                  }`}
                >
                  {link.icon}
                  <Tooltip placement="right" content={link.name}>
                    <p className={`${isOpen ? "md:block" : "hidden"}`}>
                      {link.name}
                    </p>
                  </Tooltip>
                </Link>
              </li>
            ))}

            <h3 className="text-[#808080] text-sm font-bold hidden lg:block">
              Cuenta
            </h3>
            <li className="flex items-center gap-3">
              <ProfileDropdown session={session} />
              <p className={`${isOpen ? "md:block" : "hidden"}`}>
                {!!session && capitalizeFirstLetter(session?.user.name)}
              </p>
            </li>
          </ul>
        </CardBody>
      </Card>
    </aside>
  );
};
