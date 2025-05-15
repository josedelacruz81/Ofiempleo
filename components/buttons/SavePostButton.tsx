import { Button } from "@nextui-org/button";
import { HiOutlineBookmark } from "react-icons/hi";

export const SavePostButton = ({...rest}) => {
  return (
    <Button className="flex items-center gap-2 " size="sm" variant="light" {...rest}>
      Guardar
      <HiOutlineBookmark />
    </Button>
  );
};
