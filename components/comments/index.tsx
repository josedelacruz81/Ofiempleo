import { capitalizeFirstLetter, getComments } from "@/lib/functions";
import { supabase } from "@/lib/supabase";
import { Avatar, ScrollShadow, User } from "@nextui-org/react";
import Link from "next/link";


export const CommentsContent = async ({ userId }: { userId: string }) => {
  const comments = await getComments(userId);

  return (
    <div>
      <p className="font-semibold text-xl">Comentarios</p>
      <h2 className="text-sm text-default-400 mb-5">Estos son los comentarios que otros usuarios han hecho sobre tí</h2>
      {!comments.length ? (
        <section>No hay comentarios</section>
      ) : (
        <ScrollShadow as="section" className="flex flex-col gap-3 max-h-52">
          {comments.map((comment: any) => (
             <article className="flex items-center gap-2" key={comment.id}>
             <Avatar
             size="md"
               src={comment.commenter.profileImage}
               name={comment.commenter.names}
             />
             <div>
             <p className="text-xs text-gray-500">
               {capitalizeFirstLetter(
                 `${comment.commenter.names} ${comment.commenter.lastname}`
               )}
             </p>
             <p className="text-sm text-gray-900">{comment.comment}</p>
             </div>
           </article>
          ))}
        </ScrollShadow>
      )}
    </div>
  );
};
