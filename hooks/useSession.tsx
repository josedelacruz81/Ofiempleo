"use server"
import { auth } from "@/auth"

export const useSession = async() => {
  const session:any = await auth()
  return session

}
