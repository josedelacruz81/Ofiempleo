import { LottieAnimation } from "@/components/littleComponents/LottieAnimation";
import AboutLottie from "@/public/aboutLottie.json";
import { Avatar } from "@nextui-org/avatar";
import { siteConfig } from "@/config/site";
import { Tooltip } from "@nextui-org/react";
export default function AboutPage() {
  return (
    <section className="grid md:grid-cols-2 md:items-center gap-10 p-5 mb-20">
      <article className="w-full md:col-span-2 space-y-5">
        <h2 className="text-2xl md:text-4xl font-medium text-center">
          Sobre nosotros
        </h2>
        <div className="flex w-full items-center justify-center gap-3">
          <Tooltip delay={500}  content="José Pastor De La Cruz Zambrano" placement="top">
            <Avatar
              name="José"
              className="w-20 h-20 md:w-36 md:h-36"
              src="https://firebasestorage.googleapis.com/v0/b/ofiempleo-9310c.appspot.com/o/profileImages%2FImagen%20de%20WhatsApp%202024-07-20%20a%20las%2010.41.01_1f7691a9.jpg?alt=media&token=fb958d5e-de7d-4115-aedd-4d3c0da19be2"
            />
          </Tooltip>
          <Tooltip delay={500}  content="Josthin Xavier Acosta Rosado " placement="top">
            <Avatar
              src="https://firebasestorage.googleapis.com/v0/b/ofiempleo-9310c.appspot.com/o/profileImages%2FImagen%20de%20WhatsApp%202024-07-21%20a%20las%2015.41.25_a81428c0.jpg?alt=media&token=2d546073-e921-4310-8125-d47cb35a3f72"
              name="Josthin"
              className="w-20 h-20 md:w-36 md:h-36"
            />
          </Tooltip>
        </div>
        <p className="text-center text-sm mx-auto">
          En Ofiempleo, creemos en el poder de la comunidad y en la capacidad de
          cada individuo para construir su propio éxito.
        </p>
        <p className="text-sm text-blue-500 text-center">
          &copy; {new Date().getFullYear()} {siteConfig.name}
        </p>
      </article>
      <article className="space-y-3">
        <h3 className="text-xl md:text-2xl font-medium">¿Quienes somos?</h3>
        <p className="text-sm  text-justify">
          En Ofiempleo, estamos dedicados a conectar a la comunidad de
          Portoviejo a través de una plataforma innovadora que facilita la
          publicación y contratación de trabajos locales. Nuestra plataforma
          nace con el propósito de facilitar la conexión entre quienes ofrecen
          servicios y quienes los necesitan, creando un espacio seguro y
          eficiente para la publicación y contratación de trabajos locales.
        </p>
      </article>
      <article className=" w-full ">
        <LottieAnimation animationData={AboutLottie} />
      </article>
      <article className="space-y-3 md:space-y-6">
        <h2 className="text-xl md:text-2xl font-medium text-center mx-auto text-blue-500">
          Misión
        </h2>
        <section>
          <p className="text-justify">
            En Ofiempleo, nuestra misión es proporcionar a los residentes de
            Portoviejo una plataforma intuitiva y confiable para la contratación
            de servicios, facilitando conexiones entre trabajadores de oficio y
            clientes mediante un sistema transparente y accesible.
          </p>
        </section>
      </article>
      <article className="space-y-3 md:space-y-6">
        <h2 className="text-xl md:text-2xl font-medium text-center  mx-auto text-blue-500">
          Visión
        </h2>
        <section>
          <p className="text-justify">
            Nuestra visión es ser la plataforma preferida en Portoviejo para la
            contratación de servicios, proporcionando un espacio donde la
            calidad, la confianza y la satisfacción mutua sean el fundamento de
            todas las relaciones laborales.
          </p>
        </section>
      </article>

      {/* <article className="md:col-span-2  text-center space-y-5">
        <h2 className="text-4xl font-medium text-center">Sobre nosotros</h2>
        <div className="flex w-full items-center justify-center gap-3">
          <Avatar
            name="José"
            className="w-36 h-36"
            src="https://firebasestorage.googleapis.com/v0/b/ofiempleo-9310c.appspot.com/o/profileImages%2FImagen%20de%20WhatsApp%202024-07-20%20a%20las%2010.41.01_1f7691a9.jpg?alt=media&token=fb958d5e-de7d-4115-aedd-4d3c0da19be2"
          />
          <Avatar
            src="https://firebasestorage.googleapis.com/v0/b/ofiempleo-9310c.appspot.com/o/profileImages%2FImagen%20de%20WhatsApp%202024-07-21%20a%20las%2015.41.25_a81428c0.jpg?alt=media&token=2d546073-e921-4310-8125-d47cb35a3f72"
            name="Josthin"
            className="w-36 h-36"
          />
        </div>
        <p className="text-center md:w-[80%] mx-auto">
          En Ofiempleo, creemos en el poder de la comunidad y en la capacidad de
          cada individuo para construir su propio éxito.
        </p>
        <p className="text-sm text-blue-500">
          &copy; {new Date().getFullYear()} {siteConfig.name}
        </p>
      </article>
      <article className=" flex flex-col items-start  md:w-[70%] md:mx-auto gap-5">
        <h3 className="text-2xl font-medium">¿Quienes somos?</h3>
        <p className="text-justify">
          En Ofiempleo, estamos dedicados a conectar a la comunidad de
          Portoviejo a través de una plataforma innovadora que facilita la
          publicación y contratación de trabajos locales. Nuestra plataforma
          nace con el propósito de facilitar la conexión entre quienes ofrecen
          servicios y quienes los necesitan, creando un espacio seguro y
          eficiente para la publicación y contratación de trabajos locales.
        </p>
      </article>
      <article>
        <LottieAnimation animationData={AboutLottie} />
      </article>
      <article className="md:col-span-2 text-2xl md:text-4xl">
        <h2 className="font-medium text-center w-[90%] mx-auto">
          ¿Cuál es nuestra{" "}
          <span className="text-blue-500">Misión y Visión</span>?
        </h2>
      </article>
      <div className="grid md:grid-cols-2 col-span-2 my-10">
        <article className="mx-auto w-[85%] md:w-[70%]">
          <p className="text-justify">
            En Ofiempleo, nuestra misión es proporcionar a los residentes de
            Portoviejo una plataforma intuitiva y confiable para la contratación
            de servicios, facilitando conexiones entre trabajadores de oficio y
            clientes mediante un sistema transparente y accesible.
          </p>
        </article>
        <article className=" mx-auto w-[85%] md:w-[70%]">
          <p className="text-justify">
            Nuestra visión es ser la plataforma preferida en Portoviejo para la
            contratación de servicios, proporcionando un espacio donde la
            calidad, la confianza y la satisfacción mutua sean el fundamento de
            todas las relaciones laborales.
          </p>
        </article>
      </div> */}
    </section>
  );
}
