import { SkillLabel } from "@/components/cards/SkillLabel";
import { VerificationModal } from "@/components/modals/VerificationModal";
import {
  capitalizeFirstLetter,
  deleteCero,
  selectColor,
} from "@/lib/functions";
import { ACEPTED, PENDING } from "@/types";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  Link,
  ScrollShadow,
  Tooltip,
  User,
} from "@nextui-org/react";
import { FaWhatsapp } from "react-icons/fa6";
import { HiOutlineTrash } from "react-icons/hi";

const getRequests = async (status: string) => {
  const res = await fetch(
    `${process.env.PUBLIC_URL}/api/requests/status/${status}`,
    {
      cache: "no-store",
    }
  );
  const data = await res.json();
  return data;
};

export default async function Page({
  params,
}: {
  params: {
    status: string;
  };
}) {
  const requests = await getRequests(params.status);

  return (
    <div>
      <h2 className="text-xl font-medium mb-5  ml-4"></h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-10">
      {requests.length === 0 ? (
          <div className="flex  justify-center grow">
            <p className="text-center text-lg">No hay solicitudes</p>
          </div>
        ) : (
          requests.map((request: any, i: number) => (
            <Card className="max-w-80" key={i}>
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
               
              </CardHeader>
               <CardBody
                as={Link}
                href={`/post/${request.posts.id}`}
                className="space-y-3 hover:bg-default-100 transition-colors"
              >
                <p>{request.posts.description}</p>
                <ScrollShadow
                  hideScrollBar
                  className="flex gap-2 flex-wrap max-h-28 max-w-full"
                >
                  {request.posts.skills.map((skill: string, i: number) => (
                    <SkillLabel key={i}>{skill}</SkillLabel>
                  ))}
                </ScrollShadow>
              </CardBody>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

{/* <Card key={i}>
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
               
              </CardHeader>
              <CardBody
                as={Link}
                href={`/post/${request.posts.id}`}
                className="space-y-3 hover:bg-default-100 transition-colors"
              >
                <p>{request.posts.description}</p>
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
                  <VerificationModal
                    requestId={request.id}
                    message={
                      <p className="text-default-500 text-sm font-normal">
                        ¿Estás seguro de eliminar esta solicitud?
                      </p>
                    }
                    className={request.status !== ACEPTED ? "grow" : "grow-0"}
                    color="danger"
                    variant="light"
                    isIconOnly={request.status === ACEPTED}
                  >
                    {request.status !== ACEPTED && "Eliminar solicitud"}
                    <HiOutlineTrash size={20} />
                  </VerificationModal>
                </div>
              </CardFooter>
            </Card> */}