import { ImageCarousel } from "@/components/shadCn/ImageCarousel";
import { auth } from "@/auth";
import { EMPLOYER } from "@/types";
import { SkillLabel } from "@/components/cards/SkillLabel";
import { Avatar } from "@nextui-org/avatar";
import { ContactButton } from "@/components/buttons/ContactButton";
import { Rating } from "@/components/littleComponents/Rating";
import { supabase } from "@/lib/supabase";
import { getRating } from "@/lib/functions";
import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/react";
const getPost = async (id: string | number) => {
  try {
    const res = await fetch(`${process.env.PUBLIC_URL}/api/posts/${id}`, {
      cache: "no-cache",
    });
    const data = await res.json();

    return data;
  } catch (error) {
    console.error(error);
  }
};

const getVisitedPosts = async (userId: string | undefined, postId: string) => {
  if (!userId || !postId) return null;
  const { data, error } = await supabase
    .from("VisitedPosts")
    .select("postId,created_at")
    .eq("userId", userId)
    .eq("postId", postId)
    .single();
  if (error) {
    return "";
  }

  return data;
};

const getRequest = async (postId: string, userId: string | undefined) => {
  const { data, error } = await supabase
    .from("requests")
    .select()
    .eq("requesterId", userId)
    .eq("postId", postId)
    .single();
  if (error) {
    if(error.code === "PGRST116") return [];
    console.log(error);
    return [];
  }
  return data;
};

export default async function PostPage({ params }: { params: { id: string } }) {
  const post = await getPost(params.id);
  const session = await auth();
  const rating = (await getRating(post.users.id)) as number;
  const visitedPosts = await getVisitedPosts(session?.user.id, params.id);
  const request = await getRequest(params.id, session?.user.id);
  return (
    <section className="flex items-center justify-center h-screen">
      <Card className="scrollCard flex flex-col gap-4 bg-white rounded-xl relative overflow-y-auto overflow-x-hidden md:w-2/3 md:max-h-[600px] md:p-8">
        <ImageCarousel postData={post} />
        <div className="p-3 flex flex-col gap-2 ">
          <Avatar
            className=" w-24 h-24"
            src={post.users.profileImage}
            name={`${post.users.names} ${post.users.lastname}`}
          />
          <div>
            <h1 className="text-lg font-medium">
              {post.users.names} {post.users.lastname}
            </h1>
            <Rating disabled rating={rating} />
            <p className="text-neutral-400 text-sm">{post.profession.name}</p>
          </div>
          <div>
            <p className="text-neutral-500 text-sn">Descripción</p>
            <p className="text-sm">{post.description}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {post.skills &&
              post.skills.map((skill: string, index: number) => (
                <SkillLabel key={index}>{skill}</SkillLabel>
              ))}
          </div>

          <ContactButton
            status={request.status}
            visitedPost={visitedPosts}
            rating={rating}
            postId={params.id}
            postUserId={post.users.id}
            session={session}
            phone={post.users.phone}
          >
            Contactar
          </ContactButton>
        </div>
      </Card>
    </section>
  );
}
