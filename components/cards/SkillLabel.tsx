import { Chip } from "@nextui-org/react";
import { GoHorizontalRule } from "react-icons/go";
export const SkillLabel = ({
  children,
  onClose
}: {
  children: React.ReactNode;
  onClose?: () => void;
}) => {
  return (
    <Chip onClose={onClose} color="primary" variant="dot" className="font-bold text-sm text-gray-600" >{children}</Chip>
  )
}
