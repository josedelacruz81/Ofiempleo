import { Logo } from "@/components/icons";
import { Chip } from "@nextui-org/react";
import { auth } from "@/auth";
import { EMPLOYEE } from "@/types";
import { redirect } from "next/navigation";
import { getRole } from "@/lib/functions";
import { PostsList } from "@/components/PostsList";
import { FadeInEffect } from "@/components/littleComponents/FadeInEffect";
import { supabase } from "@/lib/supabase";
const getPosts = async (userId?: string) => {
  try {
    const res = await fetch(
      `${process.env.PUBLIC_URL}/api/posts${userId ? `?userId=${userId}` : ""}`,
      {
        cache: "no-store",
      }
    );
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

const getJobs = async () => {
  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .neq("value", "otro");
  if (error) {
    console.log(error);
    return [];
  }
  return data;
};
export default async function Page() {
  const session = await auth();
  const jobs = await getJobs();

  const posts = await getPosts(session?.user.id);
  const role = await getRole(session?.user.id);

  if (role === EMPLOYEE) redirect("/employee");
  return (
    <section className="py-2 px-2 flex flex-col gap-8 mb-20">
      <FadeInEffect>
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
          <section className="flex flex-col items-center justify-center text-2xl md:text-3xl lg:text-5xl">
            <h2 className="font-medium text-center">
              Conecta <span className="text-primary">talentos,</span>
            </h2>
            <h2 className="font-medium text-center">
              Crea <span className="text-primary"> oportunidades</span>
            </h2>
            <div className="flex flex-col items-center justify-center  my-10">
              <p className="w-3/4  text-center text-sm ">
                Con Ofiempleo, navegar por el mercado laboral nunca ha sido tan
                fácil.
              </p>
              <p className="w-3/4 text-center text-sm">
                Nuestro panel intuitivo está diseñado para ayudarle a encontrar
                el trabajo perfecto que se alinee con sus Habilidades.
              </p>
            </div>
            {/* <SearchBarAndFilter /> */}
          </section>
        </div>
      </FadeInEffect>

      <PostsList postsData={posts} session={session} jobs={jobs} />
    </section>
  );
}
