import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Tooltip,
  User,
  Button,
  Chip,
  ScrollShadow,
} from "@nextui-org/react";
import { auth } from "@/auth";
import { SkillLabel } from "@/components/cards/SkillLabel";
import { RequestDropdown } from "./components/RequestDropdown";
import {
  HiOutlineChat,
  HiOutlineThumbUp,
  HiOutlineTrash,
} from "react-icons/hi";
// import { getComments } from "@/lib/functions";
import {
  capitalizeFirstLetter,
  deleteCero,
  getRating,
  getRole,
  selectColor,
  truncateString,
} from "@/lib/functions";
import { ACEPTED, EMPLOYER, PENDING } from "@/types";
import { FeedbackModal } from "@/app/employee/components/FeedbackModal";
import { FeedBackButton } from "./components/FeedBackButton";
import { VerificationModal } from "@/components/modals/VerificationModal";
import { supabase } from "@/lib/supabase";
import { get } from "http";
import { FaWhatsapp } from "react-icons/fa6";
import { RefreshButton } from "@/components/buttons/RefreshButton";
import Link from "next/link";
import { redirect } from "next/navigation";
const getRequests = async (userId: string) => {
  const res = await fetch(`${process.env.PUBLIC_URL}/api/requests/${userId}`, {
   next:{revalidate: 180}
  });
  return res.json();
};

export default async function RequestsPage() {
  const session = await auth();
  if (!session) return null;
  const role = await getRole(session.user.id);
  if(role !== EMPLOYER) return redirect("/employee");
  const requests = await getRequests(session.user.id);

  return (
    <section
      className={`py-2 px-2 gap-4 my-10 relative grid md:grid-cols-3`}
    >
      <RefreshButton className="fixed  right-7 top-20 z-50" />
      {requests.length === 0 && (
        <div className="flex  justify-center">
          <p className="text-center text-lg">No tienes solicitudes</p>
        </div>
      )}
      {requests.map(async (request: any, i: number) => {
        const getComments = async () => {
          const { data, error } = await supabase
            .from("comments")
            .select("id")
            .eq("commentRecipientId", request.ownerId)
            .eq("commenterId", session.user.id)
            .eq("postId", request.postId);
          if (error) {
            console.log(error);
            return [];
          }
          return data;
        };
        const comments = await getComments();

        return (
          <Card key={i}>
            <CardHeader className="flex flex-col lg:flex-row items-start gap-3 lg:gap-0 lg:items-center w-full justify-between ">
              <User
                description={`${request.user.names} ${request.user.lastname}`}
                name={
                  <Tooltip
                    delay={400}
                    content={request.posts.profession.description}
                  >
                    {request.posts.profession.name}
                  </Tooltip>
                }
                avatarProps={{
                  src: request.user.profileImage,
                  name: `${request.user.names} ${request.user.lastname}`,
                }}
              />
              <Tooltip
                isDisabled={request.status !== PENDING}
                delay={500}
                placement="right"
                content={
                  <div className="max-w-44">
                    <p className="text-wrap">
                      Tienes que esperar a que{" "}
                      <span className="font-semibold">
                        {capitalizeFirstLetter(request.user.names)}
                      </span>{" "}
                      te acepte la solicitud
                    </p>
                  </div>
                }
              >
                <Chip variant="faded" color={selectColor(request.status)}>
                  {request.status}
                </Chip>
              </Tooltip>
              {/* <RequestDropdown
              session={session}
              request={request}
              requestId={request.id}
              status={request.status}
            /> */}
              {/* <Chip
              className={`text-xs rounded-full text-white p-2 ${selectColor(
                request.status
              )}`}
            >
              {request.status}
            </Chip> */}
            </CardHeader>
            <CardBody
              as={Link}
              href={`/post/${request.posts.id}`}
              className="space-y-3 hover:bg-default-100 transition-colors"
            >
              <p className="text-sm text-default-600">{truncateString(request.posts.description, 125)}</p>
              <ScrollShadow
                hideScrollBar
                className="flex gap-2 flex-wrap max-h-28 max-w-full"
              >
                {request.posts.skills.map((skill: string, i: number) => (
                  <SkillLabel key={i}>{skill}</SkillLabel>
                ))}
              </ScrollShadow>
            </CardBody>
            <CardFooter className="flex flex-col gap-2">
              {request.status === ACEPTED && (
                <Button
                  as="a"
                  href={`https://wa.me/+593${deleteCero(request.user.phone)}`}
                  className="flex items-center justify-center gap-2 w-full"
                  variant="bordered"
                  color="success"
                  target="_blank"
                >
                  Contactar
                  <FaWhatsapp size={17} />
                </Button>
              )}
              <div className="flex flex-col lg:flex-row w-full gap-2">
                {request.status === ACEPTED && (
                  <>
                    {comments.length === 0 ? (
                      <FeedBackButton
                        comments={comments}
                        session={session}
                        postId={request.postId}
                        requester={request.user}
                        commentRecipientId={request.ownerId}
                        status={request.status}
                      />
                    ) : (
                      <Button
                        endContent={<HiOutlineThumbUp />}
                        className="grow"
                        disabled
                      >
                        Ya has comentado a esta persona
                      </Button>
                    )}
                  </>
                )}

                <VerificationModal
                  requestId={request.id}
                  message={
                    <p className="text-default-500 text-sm font-normal">
                      ¿Estás seguro de eliminar esta solicitud?
                    </p>
                  }
                  className={request.status !== ACEPTED ? "grow" : "grow-0"}
                  color="danger"
                  variant="flat"
                  isIconOnly={request.status === ACEPTED}
                >
                  {request.status !== ACEPTED && "Eliminar solicitud"}
                  <HiOutlineTrash size={20} />
                </VerificationModal>
              </div>
            </CardFooter>
          </Card>
        );
      })}
    </section>
  );
}
