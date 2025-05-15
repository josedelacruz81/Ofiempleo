"use client"
import {
  Avatar,
  CardBody,
  Input,
  ScrollShadow,
} from "@nextui-org/react";
import { ImageCarousel } from "../shadCn/ImageCarousel";
import { SkillLabel } from "../cards/SkillLabel";
import { Rating } from "../littleComponents/Rating";
import { PostInterface, userInterface } from "@/types";
import { EditProfileModal } from "@/app/employee/components/EditProfileModal";

export const UserCard = ({
  post,
  user,
}: {
  post: PostInterface;
  user: userInterface;
}) => {
  return (
    <CardBody>
      <ImageCarousel postData={post} />
      <section className="space-y-4 mt-4">
        <article className="flex items-center justify-between">
          <div className="flex gap-2 items-center">
            <Avatar
              size="lg"
              name={`${user.names} ${user.lastname}`}
              src={user.profileImage}
            />
            <div>
              <h3>
                {user.names} {user.lastname}
              </h3>
              <Rating disabled rating={user.rating} />
              <p className="text-gray-400 text-sm">{post.profession.name}</p>
            </div>
          </div>

          <EditProfileModal defaultData={{
          
            description: post.description,
            hourly: post.hourly,
            typeWork: post.typeWork,
            skills: post.skills,
          }} postId={post.id} professionId={post.profession.id} />
        </article>
        <fieldset className="flex items-center flex-wrap gap-2">
          <Input disabled label="Descripción" value={post.description} />

          <Input
            disabled
            label="Cobro"
            value={`${
              post.typeWork === "job"
                ? "Por trabajo"
                : post.typeWork === "daily"
                ? `Por día: $${post.hourly}`
                : `Por hora: $${post.hourly}`
            }`}
          />
        </fieldset>
        <ScrollShadow
          orientation="horizontal"
          hideScrollBar
          className="flex gap-2 flex-wrap max-w-full"
        >
          {post.skills.map((skill: string, index: number) => (
            <SkillLabel key={index}>{skill}</SkillLabel>
          ))}
        </ScrollShadow>
      </section>
    </CardBody>
  );
};
