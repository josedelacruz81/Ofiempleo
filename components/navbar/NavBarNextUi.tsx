"use client";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Button,
  Input,
} from "@nextui-org/react";
import { useState } from "react";
import { Logo } from "@/components/littleComponents/Logo";
import Link from "next/link";
import { FilterDropdown } from "../dropdowns/FilterDropdown";
import { ProfileDropdown } from "../dropdowns/ProfileDropdown";
import { useRole } from "@/context/RoleContext";
import { ADMIN, EMPLOYEE, EMPLOYER } from "@/types";
import { usePathname } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/shadCn/Sheet";
import { HiOutlineSearch } from "react-icons/hi";
import { SearchModal } from "./SearchModal";
import { SearchBar } from "../SearchBar";
interface MenuItem {
  label: string;
  href: string;
}

export const NavBarNextUi = ({

  session,
}: {
  session: any;
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { role } = useRole();
  const pathname = usePathname();

  const menuItems = [
    "Profile",
    "Dashboard",
    "Activity",
    "Analytics",
    "System",
    "Deployments",
    "My Settings",
    "Team Settings",
    "Help & Feedback",
    "Log Out",
  ];

  const withOutSession = [
    {
      label: "Inicio",
      href: "/",
    },
    {
      label: "Sobre nosotros",
      href: "/about",
    },
    {
      label: "Iniciar sesión",
      href: "/auth",
    },
  ];

  const withSession: MenuItem[] = [
    {
      label: "Inicio",
      href: role === EMPLOYEE ? "/employee" : "/",
    },
    role === EMPLOYER && {
      label: "Mis solicitudes",
      href: "/employer/requests",
    },


    {
      label: "Sobre nosotros",
      href: "/about",
    },
  ].filter(Boolean) as MenuItem[];

  return (
    <Navbar
      classNames={{
        item: [
          "flex",
          "relative",
          "h-full",
          "items-center",
          "data-[active=true]:after:content-['']",
          "data-[active=true]:after:absolute",
          "data-[active=true]:after:bottom-0",
          "data-[active=true]:after:left-0",
          "data-[active=true]:after:right-0",
          "data-[active=true]:after:h-[2px]",
          "data-[active=true]:after:rounded-[2px]",
          "data-[active=true]:after:bg-primary",
        ],
      }}
      maxWidth="full"
      onMenuOpenChange={setIsMenuOpen}
    >
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand>
          {role === ADMIN && (
            <Sheet>
              <SheetTrigger className="md:text-3xl font-medium flex items-center justify-center">
                Admin
              </SheetTrigger>
              <SheetContent side={"left"}>
                <SheetHeader>
                  <SheetTitle>Are you absolutely sure?</SheetTitle>
                  <SheetDescription>
                    This action cannot be undone. This will permanently delete
                    your account and remove your data from our servers.
                  </SheetDescription>
                </SheetHeader>
              </SheetContent>
            </Sheet>
          )}
          {role !== ADMIN && <Logo />}
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-6" justify="center">
        <NavbarItem
          className={
            pathname === "/"
              ? "text-primary"
              : pathname === "/employee"
              ? "text-primary"
              : ""
          }
          isActive={
            pathname === "/" ? true : pathname === "/employee" ? true : false
          }
        >
          {!session ? (
            <Link color="foreground" href="/">
              Inicio
            </Link>
          ) : (
            <Link href={role === EMPLOYEE ? "/employee" : "/"}>Inicio</Link>
          )}
        </NavbarItem>

        {role === EMPLOYER && (
          <NavbarItem
            className={pathname === "/employer/requests" ? "text-primary" : ""}
            isActive={pathname === "/employer/requests" ? true : false}
          >
            <Link href="/employer/requests">
              <p>Mis solicitudes </p>
            </Link>
          </NavbarItem>
        )}

  
      </NavbarContent>
      <NavbarContent justify="end">
        <SearchModal />
        {!session ? (
          <NavbarItem>
            <Button as={Link} color="primary" href="/auth" variant="flat">
              Iniciar sesión
            </Button>
          </NavbarItem>
        ) : (
          <ProfileDropdown session={session} />
        )}
      </NavbarContent>
      <NavbarMenu>
        {!session &&
          withOutSession.map((item, index) => (
            <NavbarMenuItem
              onSelect={() => setIsMenuOpen(false)}
              key={item.label}
            >
              <Link
                className={`${
                  pathname === item.href ? "text-primary" : ""
                }  transition-colors`}
                href={item.href}
              >
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}
        {!!session &&
          withSession.map((item, index) => (
            <NavbarMenuItem key={item.label}>
              <Link
                className={`${
                  pathname === item.href ? "text-primary" : ""
                } hover:text-primary transition-colors`}
                href={item.href}
              >
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}
       
      </NavbarMenu>
    </Navbar>
  );
};
