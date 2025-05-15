"use client";
import { SkillLabel } from "./SkillLabel";
import { timeAgo, truncateString } from "@/lib/functions";
import Link from "next/link";
import {
  User,
  Tooltip,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  ScrollShadow,
  Chip,
} from "@nextui-org/react";
import { capitalizeFirstLetter } from "@/lib/functions";
import { HiOutlineTrash } from "react-icons/hi";
import { parroquias, PostInterface, postStatus } from "@/types";
import dynamic from "next/dynamic";
const DynamicVerificationModal = dynamic(() =>
  import("../modals/VerificationModal").then((mod) => mod.VerificationModal)
);
export const PostCard = ({
  post,
  username,
  id,
  userId,
  profileImage,
  admin,
  session,
  handleDeletePost,
}: {
  post: PostInterface;
  username: string;
  id: string;
  profileImage: string;
  userId: string;
  admin?: boolean;
  session?: any;
  handleDeletePost?: (id: string) => void;
}) => {
  return (
    <Card className="" shadow="none">
      <CardHeader className="flex items-center justify-between">
        <Link href={`/user/profile/${userId}`}>
          <User
            name={
              <div className="flex gap-2 items-center">
                <Tooltip
                  delay={400}
                  content={
                    <div className="max-w-56">
                      <p className="text-wrap">{post.profession.description}</p>
                    </div>
                  }
                >
                  {truncateString(post.profession.name, 15)}
                </Tooltip>

                <div className="text-xs font-normal text-[#b6b6b6]">
                  - {timeAgo(post.created_at)}
                </div>
              </div>
            }
            description={
              <p className="text-sm">
                {truncateString(capitalizeFirstLetter(username), 25)}
              </p>
            }
            avatarProps={{
              src: profileImage,
              size: "md",
              name: username,
            }}
          />
        </Link>
        {admin && (
          <Chip
            size="sm"
            //@ts-ignore
            color={
              postStatus.find((status) => status.value === post.status)?.color
            }
          >
            {postStatus.find((status) => status.value === post.status)?.value}
          </Chip>
        )}
      </CardHeader>
      <CardBody>
        <ScrollShadow
          hideScrollBar
          className="flex flex-col gap-2 w-max-52 h-24 "
        >
          {!!post.skills &&
            post.skills.map((skill, index) => (
              <SkillLabel key={index}>{skill}</SkillLabel>
            ))}
        </ScrollShadow>
      </CardBody>

      <CardFooter className="flex items-center justify-between">
        {!session ? (
          <Button
            as={Link}
            href={`/auth`}
            // onPress={() => {
            //   getPost(id);
            //   handleOpen();
            // }}
            passHref
            radius="full"
            variant="light"
            className="w-full"
            color="warning"
          >
            Inicia sesión para ver más
          </Button>
        ) : (
          <>
            <div className="">
              <p className="font-bold text-sm">
                {post.typeWork === "job"
                  ? "Cobra por trabajo"
                  : post.typeWork === "daily"
                  ? `Cobra por día: $${post.hourly}`
                  : `Cobra por hora: $${post.hourly}`}
              </p>
              <p className="font-normal text-xs text-neutral-500">
                {
                  parroquias.find(
                    (parroquia) => parroquia.value === post.users.location
                  )?.label
                }
              </p>
            </div>

            <div className="flex gap-2 items-center">
              {!!admin && handleDeletePost && (
                <>
                  {/* <Button onPress={() => handleDeletePost(id)}></Button> */}
                  <DynamicVerificationModal
                    radius="full"
                    alertMessage={
                      <p className="text-default-500 text-sm text-center">
                        Si borras esta publicación todas las solicitudes y
                        comentarios serán eliminados
                      </p>
                    }
                    action={() => handleDeletePost(post.id)}
                    isIconOnly
                    color="danger"
                    variant="light"
                  >
                    <HiOutlineTrash size={20} />
                  </DynamicVerificationModal>
                </>
              )}
              <Button
                as={Link}
                href={`/post/${post.id}`}
                // onPress={() => {
                //   getPost(id);
                //   handleOpen();
                // }}
                passHref
                radius="full"
                className="bg-black text-white flex justify-center items-center"
              >
                {admin ? "Gestionar" : "Detalles"}
              </Button>
            </div>
          </>
        )}
      </CardFooter>
    </Card>
  );
};
