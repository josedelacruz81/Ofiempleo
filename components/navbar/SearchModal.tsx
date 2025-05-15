"use client";

import {
  Button,
  Chip,
  Divider,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ScrollShadow,
  Skeleton,
  useDisclosure,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { HiOutlineSearch } from "react-icons/hi";
import { SearchItem } from "./searchItem";
import { searchResult } from "@/types";
import { HiOutlineXMark } from "react-icons/hi2";

export const SearchModal = () => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const debounceRef = useRef<NodeJS.Timeout>();
  const inputRef = useRef<HTMLInputElement>(null);
  const [searchResults, setSearchResults] = useState({
    posts: [],
    users: [],
  });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const { push } = useRouter();
  const [result, setResult] = useState<any>([]);
  const [value, setValue] = useState("");
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    if (debounceRef.current) {
      setLoading(true);
      clearTimeout(debounceRef.current);
    }
    if (e.target.value.length === 0) {
      setLoading(false);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      if (e.target.value.length > 1) await fetchSearch(e.target.value);
    }, 500);
  };

  const fetchSearch = async (query: string) => {
    try {
      const res = await fetch(`/api/search?query=${query}&limit=5`);
      if (res.ok) {
        const data = await res.json();

        setResult(
          data.length > 0
            ? data
            : [{ result: "No hay resultados de tu búsqueda", result_id: 0 }]
        );
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Función para cerrar el input cuando se hace clic fuera del componente
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(target) &&
        !document.querySelector("#searchBox")?.contains(event.target as Node)
      ) {
        setShow(false);
      }
    }

    // Agregar event listener cuando el componente se monta
    document.addEventListener("mousedown", handleClickOutside);

    // Remover event listener cuando el componente se desmonta
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleClear = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
      setResult([]);
      setValue("");
    }
  };

  return (
    <>
      <Button
        onClick={onOpen}
        radius="lg"
        className="text-default-500 hidden md:flex"
        variant="flat"
        startContent={<HiOutlineSearch className="text-default-400 w-5 h-5" />}
      >
        Búsqueda rápida...
      </Button>
      <Button
        onClick={onOpen}
        radius="lg"
        className="text-default-500 flex md:hidden"
        isIconOnly
      >
        <HiOutlineSearch className="w-5 h-5" />
      </Button>
      <Modal size="2xl" hideCloseButton isOpen={isOpen} onClose={onClose}>
        
        <ModalContent>
        <ModalHeader className="p-2">
          <div className="flex items-center gap-3 w-full ">
            <HiOutlineSearch className="text-default-500" size={20} />
            <input
              className="grow font-normal text-gray-700"
              ref={inputRef}
              value={value}
              placeholder="Puedes buscar por nombre, profesión y publicaciones"
              onChange={handleChange}
            />
            <button
              onClick={onClose}
              className="p-2 hover:bg-default-100 transition-colors rounded-full text-default-500"
            >
              <HiOutlineXMark size={20} />
            </button>
          </div>
        </ModalHeader>
          <Divider />
          <ModalBody className="px-2">
            {/* <div className="space-y-2">
              <p className="text-default-500 text-sm">¿Qué estas buscando?</p>
              <div className="flex justify-between items-center px-5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Chip key={i} as={Button}>
                    Trabajo
                  </Chip>
                ))}
              </div>
            </div>
            */}
            <ScrollShadow className="space-y-2 max-h-96">
              {loading ? (
                <div className="max-w-[300px] w-full flex items-center gap-3">
                  <div>
                    <Skeleton className="flex rounded-full w-12 h-12" />
                  </div>
                  <div className="w-full flex flex-col gap-2">
                    <Skeleton className="h-3 w-3/5 rounded-lg" />
                    <Skeleton className="h-3 w-4/5 rounded-lg" />
                  </div>
                </div>
              ) : (
                <>
                  {result.map((res: searchResult, i: number) => (
                    <SearchItem key={i} result={res} />
                  ))}
                </>
              )}
            </ScrollShadow>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
