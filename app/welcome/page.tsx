import { Logo } from "@/components/icons";
import { SearchBar } from "@/components/SearchBar";
import { Chip } from "@nextui-org/react";

export default function Welcome() {
  return (
    <div className="flex flex-col items-center mt-10 gap-10">
      <Chip
        variant="bordered"
        classNames={{
          base: "border-default-400",
        }}
      >
        <div className="flex  items-center text-default-900">
          Ofiempleo
          <Logo size={30} />
        </div>
      </Chip>
      <section className="flex flex-col items-center justify-center text-5xl">
        <h2 className="font-medium">
          Descubre nuevas <span className="text-blue-500">oportunidades</span>{" "}
          que
        </h2>
        <h3 className="flex items-center gap-4  font-medium">
          Cumpla tus <span className="text-blue-500">ambiciones</span>
        </h3>
        <p className="w-1/2 text-center text-sm mt-10">
          Con Ofiempleo, navegar por el mercado laboral nunca ha sido tan fácil.
          Nuestro panel intuitivo está diseñado para ayudarle a encontrar el
          trabajo perfecto que se alinee con sus habilidades.
        </p>
       <div className="mt-10">
       <SearchBar bordered/>
       </div>
      </section>
    </div>
  );
}
