"use client";
import { supabase } from "@/lib/supabase";
import { createContext, useContext, useEffect, useState } from "react";
import { EMPLOYEE, EMPLOYER } from "@/types";
import { usePathname, useRouter } from "next/navigation";

interface RoleContextType {
  role: string;
  loading: boolean;

  deleteRole: (userId: string) => void;
  changeToEmployer: () => void;
  changeToEmployee: () => void;
}

export const RoleContext = createContext<RoleContextType>({
  role: "",
  loading: true,
  deleteRole: () => {},
  changeToEmployee: () => {},
  changeToEmployer: () => {},
});

export const useRole = () => {
  return useContext(RoleContext);
};

export const RoleProvider = ({
  children,
  session,
}: {
  children: React.ReactNode;
  session: any;
}) => {
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("");
  const router = useRouter();
  const getRole = async (userId: string | undefined) => {
    try {
      if (!userId) return null;

      const { data, error } = await supabase
        .from("users")
        .select("role")
        .eq("id", userId)
        .single();
      if (error) return console.log(error);
      setRole(data.role);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const changeToEmployee = async () => {
    if (!session?.user.id) return;
    await supabase
      .from("users")
      .update({ role: EMPLOYEE })
      .eq("id", session?.user.id);
    setRole(EMPLOYEE);
  };

  const changeToEmployer = async () => {
    if (!session?.user.id) return;
    await supabase
      .from("users")
      .update({ role: EMPLOYER })
      .eq("id", session?.user.id);
    setRole(EMPLOYER);
  };

  const deleteRole = async (userId: string) => {
    if (!userId) return;
    await supabase.from("users").update({ role: null }).eq("id", userId);
    setRole("");
  };

  useEffect(() => {
    getRole(session?.user.id);
    // if (role === EMPLOYEE && path === "/") return router.push("/employee");
  }, [session, role, router]);

  return (
    <RoleContext.Provider
      value={{ role, changeToEmployer, changeToEmployee, loading, deleteRole }}
    >
      {children}
    </RoleContext.Provider>
  );
};
