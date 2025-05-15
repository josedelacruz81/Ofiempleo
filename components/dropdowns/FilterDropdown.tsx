"use client";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/shadCn/NavigationMenu";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { forwardRef, useState } from "react";
import { jobInterface } from "@/types";
import { Input, ScrollShadow } from "@nextui-org/react";
import { IoHammerOutline } from "react-icons/io5";

export const FilterDropdown = ({
  className,
  jobs,
}: {
  className?: string;
  jobs: jobInterface[];
}) => {
  const [query, setQuery] = useState("");
  const [filteredJobs, setFilteredJobs] = useState<jobInterface[]>(jobs);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchQuery = e.target.value;
    setQuery(searchQuery);

    if (searchQuery) {
      const filtered = jobs.filter((job) =>
        job.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredJobs(filtered);
    } else {
      setFilteredJobs(jobs);
    }
  };

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className={`bg-transparent ${className}`}>
            Empleos
          </NavigationMenuTrigger>
          <NavigationMenuContent className="border-none rounded-xl bg-white  w-80 ">
            <ul className=" flex flex-col  overflow-auto rounded-xl text-black gap-2 p-2">
              <Input
                fullWidth
                value={query}
                onChange={handleChange}
                startContent={<IoHammerOutline className="text-gray-600" />}
                placeholder="Busca el empleo"
                variant="faded"
                className="w-[95%] mx-auto mt-2"
              />

              <ScrollShadow className="max-h-72 scrollCard flex flex-col p-2">
                {filteredJobs.length > 0 ? (
                  filteredJobs.map(({ name, value,id }) => (
                    <Link
                      className="py-2 px-4  transition-all ring-[#d4d4d8] hover:bg-[#f4f4f5] hover:ring-1 rounded-md text-sm"
                      key={value}
                      href={`/jobs/${id}`}
                    >
                      {name}
                    </Link>
                  ))
                ) : (
                  <li className="py-2 px-4 text-gray-600 text-sm">
                    No se encontraron empleos
                  </li>
                )}
              </ScrollShadow>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

const ListItem = forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
