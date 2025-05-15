import { Logo } from "@/components/littleComponents/Logo";
import { auth } from "@/auth";
import { supabase } from "@/lib/supabase";
import { NavItems } from "./NavItems";
import { NavBarNextUi } from "./NavBarNextUi";



export const NavBar = async () => {
  const session = await auth();

  return <NavBarNextUi session={session}  />;
};

//   <nav className="w-[92%] text-white flex items-center justify-between">
//     <Logo />
//     <NavItems session={session} jobs={jobs} />
//   </nav>
