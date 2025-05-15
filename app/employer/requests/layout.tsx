import { auth } from "@/auth"
import { redirect } from "next/navigation"


export default async function Layout({
  children
}:{
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session) return redirect('/auth')
  return (
    <section className='min-h-screen'>{children}</section>
  )
}
