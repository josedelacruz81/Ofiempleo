import { Card } from "@nextui-org/react";
export default function Layout({ children }: { children: React.ReactNode }) {
  return <div className="h-screen flex justify-center items-center  w-full">{children}</div>;
}
