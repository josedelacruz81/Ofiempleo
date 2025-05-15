"use client";
import { CheckboxGroup, Checkbox } from "@nextui-org/checkbox";
import { Slider } from "@/components/littleComponents/Slider";
import { usePathname } from "next/navigation";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/shadCn/Drawer";
import { Button } from "@nextui-org/button";

export const FilterDrawer = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  if (pathname === "/auth" || pathname === "/about" || pathname === "/welcome")
    return null;
  return (
    <Drawer>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="flex flex-col  w-1/2 mx-auto gap-5">
          <DrawerTitle className="text-center">¿Cómo puedes filtrar las publicaciones?</DrawerTitle>
          <DrawerDescription>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full ">
              <CheckboxGroup
                label="Tipo de Trabajo"
                className="text-sm"
                defaultValue={["buenos-aires", "london"]}
              >
                <Checkbox size="sm" value="buenos-aires">
                  <p className="text-sm">Tiempo Completo</p>
                </Checkbox>
                <Checkbox size="sm" value="sydney">
                  <p className="text-sm">Medio Tiempo</p>
                </Checkbox>
                <Checkbox size="sm" value="san-francisco">
                  <p className="text-sm">TeleTrabajo</p>
                </Checkbox>
                <Checkbox size="sm" value="london">
                  <p className="text-sm">Proyecto</p>
                </Checkbox>
                <Checkbox size="sm" value="tokyo">
                  <p className="text-sm">Tokyo</p>
                </Checkbox>
              </CheckboxGroup>
              <Slider />
            </div>
          </DrawerDescription>
        </DrawerHeader>

        <DrawerFooter>
          <Button color="primary">Aplicar</Button>
          <DrawerClose asChild>
            <Button variant="bordered">Cerrar</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

{
  /* <div className="sticky top-[6.5rem] p-5 flex flex-col gap-4">
      <CheckboxGroup
        label="Tipo de Trabajo"
        className="text-sm"
        defaultValue={["buenos-aires", "london"]}
      >
        <Checkbox size="sm" value="buenos-aires">
          <p className="text-sm">Tiempo Completo</p>
        </Checkbox>
        <Checkbox size="sm"  value="sydney">
          <p className="text-sm">Medio Tiempo</p>
        </Checkbox>
        <Checkbox size="sm" value="san-francisco">
          <p className="text-sm">TeleTrabajo</p>
        </Checkbox>
        <Checkbox size="sm" value="london">
          <p className="text-sm">Proyecto</p>
        </Checkbox>
        <Checkbox size="sm" value="tokyo">
          <p className="text-sm">Tokyo</p>
        </Checkbox>
      </CheckboxGroup>
      <Slider />
    </div> */
}
