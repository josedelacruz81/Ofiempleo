"use client"
import { signOut } from "next-auth/react"

export function SignOutButton({
  children,
}: {
  children: React.ReactNode;
}) {
  return <button onClick={() => signOut()}>{children}</button>
}