import { StatCardProps } from "@/types";
import { Button, Card, CardFooter, CardHeader, Link } from "@nextui-org/react";
import { HiOutlineChevronRight } from "react-icons/hi";

export const StatCard = ({
  header,
  icon,
  stat,
  color,
  href,
}: {
  header: string;
  icon: React.ReactNode;
  stat: string | number;
  color: "primary" | "secondary" | "success" | "warning" | "default" | "danger";
  href: string;
}) => {
  return (
    <Card shadow="none">
      <CardHeader className="flex items-center justify-between">
        {header}
        {icon}
      </CardHeader>
      <CardFooter className="flex items-center justify-between">
        <p className="text-xl font-semibold">{stat}</p>
        <Button as={Link} color={color} href={href} size="sm" isIconOnly>
          <HiOutlineChevronRight size={18} />
        </Button>
      </CardFooter>
    </Card>
  );
};
