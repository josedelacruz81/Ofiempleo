import { Button, Switch, VisuallyHidden, useSwitch } from "@nextui-org/react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { EMPLOYEE, EMPLOYER } from "@/types";
import { useState } from "react";
import { useRole } from "@/context/RoleContext";
import { FaUserTie } from "react-icons/fa6";
import { GrUserWorker } from "react-icons/gr";
export const RoleSwitch = ({
  withDescription,
}: {
  withDescription?: boolean;
}) => {
  const [loading, setLoading] = useState(false);
  const { role, changeToEmployee, changeToEmployer } = useRole();
  const [isSelected, setIsSelected] = useState(role === EMPLOYER);
  const router = useRouter();
  const handleSwitch = async () => {
    setLoading(true);
    if (role === EMPLOYER) {
      
      await changeToEmployee();
      router.refresh();
    } else {
      await changeToEmployer();
      router.refresh();
    }
    setIsSelected(!isSelected);
    setLoading(false);
  };

  if (withDescription)
    return (
      <div className="flex justify-between items-center w-full">
        <div>
          <p className="text-sm text-gray-500">Tipo de usuario:</p>
          <p
            className={`
              ${isSelected ? "text-primary" : "text-secondary"}
            `}
          >
            {isSelected ? "Empleador" : "Trabajador"}
          </p>
        </div>
        <Button
          variant="ghost"
          isLoading={loading}
          onPress={handleSwitch}
          isIconOnly
          size="md"
          color={isSelected ? "primary" : "secondary"}
        >
          {isSelected ? <FaUserTie size={18} /> : <GrUserWorker size={18} />}
        </Button>
      </div>
    );

  return (
    <Button
      variant="ghost"
      isLoading={loading}
      onPress={handleSwitch}
      isIconOnly
      size="sm"
      color={isSelected ? "primary" : "secondary"}
    >
      {isSelected ? <FaUserTie size={18} /> : <GrUserWorker size={18} />}
    </Button>
  );
};
