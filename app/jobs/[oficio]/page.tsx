import { supabase } from "@/lib/supabase";
import { jobs } from "@/types";
import { PostCard } from "@/components/cards/PostCard";
import noData from "@/public/noData.json";
import { LottieAnimation } from "@/components/littleComponents/LottieAnimation";
import { auth } from "@/auth";
const getPosts = async (query: string) => {
  try {
    const { data, error } = await supabase
      .from("posts")
      .select(
        `
          *,users (names,lastname,profileImage),profession (*)
          
        `
      )
      .eq("profession", query);

    if (error) {
      console.log(error);
      return [];
    }
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export default async function OficioPage({
  params,
}: {
  params: { oficio: string };
}) {
  const posts = await getPosts(params.oficio);

  const session = await auth();
  return (
    <main className="p-4 md:py-10  mx-auto h-screen">
      {/* <h2 className="text-2xl font-semibold text-blue-500 my-5">
        {jobs.find((job) => job.value === params.oficio)?.name}
      </h2> */}
      {posts.length > 0 ? (
        <ul className="auto-grid">
          {posts.map((post) => (
            <PostCard
              post={post}
              session={session}
              profileImage={post.users.profileImage}
              key={post.id}
              username={`${post.users.names} ${post.users.lastname}`}
              id={post.id}
              userId={post.userId}
            />
          ))}
        </ul>
      ) : (
        <div className="flex  justify-center flex-col">
          <h1>No hay ningun post de este tipo de empleo.</h1>
          <div className="w-96 mx-auto">
            <LottieAnimation animationData={noData} width={200} height={200} />
          </div>
        </div>
      )}
    </main>
  );
}
