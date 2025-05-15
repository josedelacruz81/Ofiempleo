import { ImageCarousel } from "@/components/shadCn/ImageCarousel";
import {
  ModalBody,
  ModalFooter,
  ScrollShadow,
} from "@nextui-org/react";
import { auth } from "@/auth";
import { CloseButton } from "./CloseButton";
import { ADMIN, PostInterface } from "@/types";
import { SkillLabel } from "@/components/cards/SkillLabel";
import { Avatar } from "@nextui-org/avatar";
import { ContactButton } from "@/components/buttons/ContactButton";
import { Rating } from "@/components/littleComponents/Rating";
import { supabase } from "@/lib/supabase";
import { capitalizeFirstLetter, getRating } from "@/lib/functions";
import { EvaluatePost } from "@/app/admin/components/EvaluatePost";

const getPost = async (id: string | number): Promise<PostInterface> => {
  const res = await fetch(`${process.env.PUBLIC_URL}/api/posts/${id}`);
  const data = await res.json();

  return data;
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
    if (error.code === "PGRST116") return null;
    console.log(error);
    return null;
  }
  return data;
};

export default async function PostModal({
  params,
}: {
  params: { id: string };
}) {
  const post = await getPost(params.id);
  const session = await auth();

  const rating = (await getRating(post?.users.id)) as number;
  const visitedPosts = await getVisitedPosts(session?.user.id, params.id);
  const request = await getRequest(params.id, session?.user.id);

  if (!post) return <p>Hubo un problema al obtener la publicación</p>;
  return (
    <>
      <ModalBody className="flex flex-col p-2">
        <CloseButton />
        <ImageCarousel size={20} postData={post} />
        <div className=" flex flex-col gap-4 ">
          <div className="flex gap-2 items-center">
            <Avatar
              className=" w-20 h-20"
              src={post.users.profileImage}
              name={`${post.users.names} ${post.users.lastname}`}
            />
            <div>
              <h2 className="text-lg font-medium">{post.profession.name}</h2>
              <Rating disabled rating={rating} />
              <p className="text-default-500 text-sm">
                {capitalizeFirstLetter(
                  `${post.users.names} ${post.users.lastname}`
                )}
              </p>
            </div>
          </div>
          <div>
            <p className="text-default-500 text-sm">Descripción</p>
            <p className="text-sm">{post.description}</p>
          </div>
        </div>
        <div>
          <ScrollShadow
            as="div"
            orientation="horizontal"
            hideScrollBar
            className="flex flex-wrap my-2 gap-2 max-w-full max-h-56"
          >
            {post.skills &&
              post.skills.map((skill: string, index: number) => (
                <SkillLabel key={index}>{skill}</SkillLabel>
              ))}
          </ScrollShadow>
        </div>
      </ModalBody>
      {session && (
        <ModalFooter className="p-2">
          <ContactButton
            status={request && request.status}
            visitedPost={visitedPosts}
            rating={rating}
            postId={params.id}
            postUserId={post.users.id}
            session={session}
            phone={post.users.phone}
          >
            Contactar
          </ContactButton>
          {session.user.role === ADMIN && (
            <EvaluatePost/>
          )}
        </ModalFooter>
      )}
    </>
  );
}
