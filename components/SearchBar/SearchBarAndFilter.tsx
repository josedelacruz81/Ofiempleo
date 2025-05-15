"use client";
import { useEffect, useState } from "react";
import { SearchBar } from ".";
import { FilterDrawer } from "../navbar/FilterDrawer";
import { HiOutlineFilter } from "react-icons/hi";
import { Button } from "@nextui-org/react";

export const SearchBarAndFilter = () => {
  const [scrollY, setScrollY] = useState(0);

  const handleScroll = () => {
    setScrollY(window.scrollY);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className={` flex items-center gap-4 z-50 transition-all ${
        scrollY > 300 && "fixed top-24 md:top-5"
      }`}
    >
      <SearchBar bordered />
      {/* <FilterDrawer>
        <Button
          variant="bordered"
          className={`z-50   ${scrollY > 300 && "text-white"}`}
          radius="full"
        >
          <span >Filtros</span> <HiOutlineFilter size={40} />
        </Button>
      </FilterDrawer> */}
    </div>
  );
};
