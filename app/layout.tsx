import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import { siteConfig } from "@/config/site";
import { Providers } from "./providers";
import { Inter } from "next/font/google";
import { NavBar } from "@/components/navbar";
import { Toaster } from "@/components/shadCn/Toaster";
import { Link as UiLink } from "@nextui-org/link";
import Link from "next/link";
import { auth } from "@/auth";
import { RoleModal } from "@/components/modals/RoleModal";
import { Sidebar } from "./admin/Sidebar";
import { ADMIN } from "@/types";
import { getRole } from "@/lib/functions";
const inter = Inter({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default async function RootLayout({
  children,
  postmodal,
  profilemodal,
  adminreview,
}: // commentsmodal
{
  children: React.ReactNode;
  postmodal: React.ReactNode;
  profilemodal: React.ReactNode;
  adminreview: React.ReactNode;
  // commentsmodal: React.ReactNode;
}) {
  const session = await auth();
  const role = await getRole(session?.user.id);

  return (
    <html lang="es" suppressHydrationWarning>
      <head />
      <body
        className={`${inter.className} bg-[#f0f5fa] dark:bg-[#18181b] min-h-screen`}
      >
        <Providers session={session}>
          <Toaster />
          <div className={` ${role === ADMIN ? "flex" : ""}`}>
            {role !== ADMIN ? <NavBar /> : <Sidebar session={session} />}

            <main className=" min-h-screen grow mx-auto px-4">
              <section id="modal-root" />
              {profilemodal}
              {postmodal}
              {adminreview}
              {children}
            </main>
          </div>
          <footer className="bg-black text-white text-center py-5 flex flex-col items-center gap-2">
            <p className="text-sm">
              &copy; {new Date().getFullYear()} {siteConfig.name}
            </p>
            <div className="flex items-center gap-8">
              <UiLink
                className="text-sm"
                as={Link}
                href="https://firebasestorage.googleapis.com/v0/b/ofiempleo-9310c.appspot.com/o/terminos%20y%20condiciones%2FMANUAL_DE_USUARIO_PARA_EL_USO_DE_LA_PLATAORMA_WEB_OFIEMPLEO.pdf?alt=media&token=ecd04f4e-f8bd-4aa0-9e00-60cdd60ed075"
              >
                Manual de usuario
              </UiLink>

              <UiLink
                className="text-sm"
                as={Link}
                color="primary"
                href="/about"
              >
                Sobre nosotros
              </UiLink>
            </div>
          </footer>
          <RoleModal session={session} />
        </Providers>

        {/* <>
            
  
            
           

            
          </> */}
      </body>
    </html>
  );
}
