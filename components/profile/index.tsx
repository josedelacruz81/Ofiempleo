import ImageInput from "@/components/profile/ImageInput";
import { Avatar } from "@nextui-org/avatar";
import { Rating } from "../littleComponents/Rating";
import { EditUser } from "./EditUser";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  ScrollShadow,
} from "@nextui-org/react";
import { capitalizeFirstLetter, filterCommentsByRole } from "@/lib/functions";

import { ReportModal } from "../modals/ReportModal";
import { Session } from "next-auth";
import { userInterface } from "@/types";
import { GoBackButton } from "../buttons/GoBackButton";

export const Profile = ({
  user,
  session,
  rating,
  comments,
  ratingCount,
  isReported,
}: {
  user: userInterface;
  session: Session | null;
  rating: number;
  comments: any;
  ratingCount: number;
  isReported: boolean;
}) => {
  const { employees, employers } = filterCommentsByRole(comments);

  return (
    <Card>
      <CardHeader className="flex flex-wrap gap-3 ">
        <div className="flex items-center justify-between w-full relative">
          <div className="flex items-center  gap-4">
            {session?.user?.id.toString() === user.id.toString() ? (
              <ImageInput userId={user.id}>
                <Avatar
                  src={user.profileImage}
                  name={user.names}
                  className="w-20 h-20"
                />
              </ImageInput>
            ) : (
              <Avatar
                src={user.profileImage}
                name={user.names}
                className="w-20 h-20"
              />
            )}

            <div>
              <h3>{capitalizeFirstLetter(`${user.names} ${user.lastname}`)}</h3>
              {/* <p className="text-gray-400 text-sm">{user.profession}</p> */}
              <div className="flex gap-2 items-center">
                <Rating
                  rating={rating}
                  userId={user.id}
                  session={session}
                  disabled
                />
                <p className="text-default-500 text-sm font-normal">
                  {!rating ? 0 : rating.toFixed(1)}({ratingCount})
                </p>
              </div>
            </div>
          </div>
          <div>
            {session && session?.user?.id.toString() !== user.id.toString() && (
              <ReportModal
                isReported={isReported}
                reportedId={user.id}
                reportedBy={session.user.id}
              />
            )}
          </div>
        <GoBackButton/>
        </div>
      </CardHeader>
      <CardBody className="flex flex-col gap-4">
        <EditUser user={user} session={session} />
     
        {employers.length > 0 && (
          <section className="flex flex-col gap-2 border-2  border-default-200 rounded-xl w-full p-2">
            <h4 className=" font-normal text-gray-600 ">
              Comentarios como <span className="font-medium">Trabajador</span>
            </h4>
            <div>
              <ScrollShadow className="flex flex-col max-h-44 scrollCard gap-2">
                {employers.map((comment: any, index: number) => (
                  <article className="flex items-center gap-2" key={index}>
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
            </div>
          </section>
        )}
        {employees.length > 0 && (
          <section className="flex flex-col gap-2 border-2  border-default-200 rounded-xl w-full p-2">
            <h4 className=" font-normal text-gray-600 ">
              Comentarios como <span className="font-medium">Empleador</span>
            </h4>
            <div>
              <ScrollShadow className="flex flex-col max-h-44 scrollCard gap-2">
                {employees.map((comment: any, index: number) => (
                  <article className="flex items-center gap-2" key={index}>
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
            </div>
          </section>
        )}
      </CardBody>
    </Card>
  );
};
