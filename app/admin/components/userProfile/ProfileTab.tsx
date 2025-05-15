import { ImageCarousel } from "@/components/shadCn/ImageCarousel";
import { timeAgo } from "@/lib/functions";
import { payTypes, PostInterface } from "@/types";
import { Card, CardBody, CardHeader, Chip } from "@nextui-org/react";

export const ProfileTab = ({ post }: { post: PostInterface }) => {
  return (
    <Card>
      {!post ? (
        <CardBody className="min-h-96">
          <p className="text-center font-semibold text-xl">
            El usuario no ha publicado su perfil
          </p>
        </CardBody>
      ) : (
        <>
          <CardHeader className="flex flex-col items-start gap-1">
            <div className="flex justify-between items-center w-full">
              <div className="flex items-center gap-1">
                <h3 className="font-semibold text-lg">
                  {post.profession.name}
                </h3>
              </div>
              <p className="text-default-500 text-xs">
                {timeAgo(post.created_at)}
              </p>
            </div>
            <div className="flex items-center gap-1 ">
              <p className="font-semibold ">{post.hourly}$</p>
              <p className="font-medium text-default-600 text-sm">
                {" "}
                {
                  payTypes.find((payType) => payType.value === post.typeWork)
                    ?.label
                }
              </p>
            </div>
          </CardHeader>
          <CardBody className="space-y-2 min-h-96 max-h-96 overflow-auto">
            <div className="space-y-1">
              <h3 className="font-semibold text-default-500">Descripción</h3>
              <p>{post.description}</p>
            </div>

            <div className="space-y-1">
              <h3 className="font-semibold text-default-500">Habilidades</h3>
              <div className="flex gap-2 flex-wrap">
                {post.skills.map((skill, index) => (
                  <Chip key={index}>{skill}</Chip>
                ))}
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-default-500">Imagenes</h3>
              <ImageCarousel size={20} postData={post} />
            </div>
          </CardBody>
        </>
      )}
    </Card>
  );
};
