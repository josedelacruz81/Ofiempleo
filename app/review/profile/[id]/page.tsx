import { UserTabs } from "@/app/admin/components/userProfile/UserTabs";
import { auth } from "@/auth";
import { Rating } from "@/components/littleComponents/Rating";
import { filterCommentsByRole, getRating } from "@/lib/functions";
import { ADMIN, parroquias } from "@/types";
import { Card, Chip, Input, User } from "@nextui-org/react";
import { redirect } from "next/navigation";
// interface requestAdd extends request {
//   ownerId: string;
//   owner: userInterface;
// }
const getUserDetails = async (id: string) => {
  const res = await fetch(`${process.env.PUBLIC_URL}/api/admin/users/${id}`, {
    cache: "no-store",
  });
  const data = await res.json();
  return data;
};

export default async function Page({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const session = await auth();
  if (!session) return redirect("/auth");
  if (session.user.role !== ADMIN) return redirect("/auth");
  const rating = await getRating(params.id);
  const { post, requests, user, reports, comments } = await getUserDetails(
    params.id
  );
  const filteredComments = filterCommentsByRole(comments);
  return (
    <Card fullWidth>
      <div className="p-2 md:p-5 md:flex justify-start gap-5">
        <div className="space-y-2">
          <User
            className="h-fit"
            name={user.names}
            description={user.email}
            classNames={{
              name: "font-semibold text-lg",
              description: "text-default-500 text-sm",
            }}
            avatarProps={{
              className: "w-20 h-20",
              src: user.profileImage,
              alt: user.names,
            }}
          />
          <div className="p-2 space-y-2">
            <Chip variant="dot" color={user.isBanned ? "danger" : "success"}>
              {user.isBanned ? "Baneado" : "Activo"}
            </Chip>
            <Rating
              rating={rating}
              userId={user.id}
              session={session}
              disabled
            />
            <Input
              label="Parroquia"
              disabled
              value={parroquias.find((p) => p.value === user.location)?.label}
            />
            <Input label="Teléfono" disabled value={user.phone} />
            <Input
              label="Descripción"
              disabled
              value={user.description ? user.description : "No hay descripción"}
            />
          </div>
        </div>
        <UserTabs
          post={post}
          comments={filteredComments}
          reports={reports}
          requests={requests}
        />
      </div>
    </Card>
  );
}
