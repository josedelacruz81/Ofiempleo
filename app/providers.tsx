"use client";

import { ReactNode } from "react";
import { NextUIProvider } from "@nextui-org/system";
import { useRouter } from "next/navigation";
import { SessionProvider } from "next-auth/react";
import { ThemeProviderProps } from "next-themes/dist/types";
import { PostProvider } from "@/context/PostContext";
import { RoleProvider } from "@/context/RoleContext";
import { SignInProvider } from "@/context/signInContext";
export interface ProvidersProps {
  children: ReactNode;
  themeProps?: ThemeProviderProps;
  session?: any;
}

export function Providers({ children, session }: ProvidersProps) {
  const router = useRouter();

  return (
    <>
      <NextUIProvider navigate={router.push}>
        <SessionProvider session={session}>
          <SignInProvider>
            <RoleProvider session={session}>
              <PostProvider>{children}</PostProvider>
            </RoleProvider>
          </SignInProvider>
        </SessionProvider>
      </NextUIProvider>
    </>
  );
}
