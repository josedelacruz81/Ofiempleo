"use client";
import { capitalizeFirstLetter } from "@/lib/functions";
import { comment } from "@/types";
import { Avatar, Card, CardBody, CardHeader, ScrollShadow } from "@nextui-org/react";

export const CommentsTab = ({
  commentsEmployer,
  commentsEmployee,
}: {
  commentsEmployer: comment[];
  commentsEmployee: comment[];
}) => {
  return (
    <Card>
      <CardHeader  className="text-default-500 font-semibold text-sm">
        Aquí puedes ver los comentarios que el usuario ha hecho a otros usuarios clasificado por el rol que han tenido
      </CardHeader>
      <CardBody className="min-h-96 max-h-96 overflow-auto ">
        {commentsEmployer.length > 0 ? (
          <section className="flex flex-col gap-2">
            <h4 className=" font-normal text-gray-600 ">
              Comentarios como <span className="font-medium">Trabajador</span>
            </h4>
            <div>
              <ScrollShadow className="flex flex-col max-h-44 scrollCard gap-2">
                {commentsEmployer.map((comment: any, index: number) => (
                  <article
                    className="flex items-center gap-2  border-2  border-default-200 rounded-xl w-full p-2"
                    key={index}
                  >
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
        ):(
          <p className="text-center font-semibold text-xl my-4">
            No hay commentarios como Trabajador
          </p>
        )}
        {commentsEmployee.length > 0 ? (
          <section className="flex flex-col gap-2 w-full p-2">
            <h4 className=" font-normal text-gray-600 ">
              Comentarios como <span className="font-medium">Empleador</span>
            </h4>
            <div>
              <ScrollShadow className="flex flex-col max-h-44 scrollCard gap-2">
                {commentsEmployee.map((comment: any, index: number) => (
                  <article
                    className="flex items-center gap-2  border-2  border-default-200 rounded-xl w-full p-2"
                    key={index}
                  >
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
        ):(
          <p className="text-center font-semibold text-xl my-4">
            No hay commentarios como Empleador
          </p>
        )}  
      </CardBody>
    </Card>
  );
};
