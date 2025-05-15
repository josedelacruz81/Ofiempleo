import { capitalizeFirstLetter, timeAgo } from "@/lib/functions";
import { postStatus, request, userInterface } from "@/types";
import {
  Card,
  CardBody,
  CardHeader,
  Chip,
  Link,
  User,
} from "@nextui-org/react";
interface requestAdd extends request {
  ownerId: string;
  owner: userInterface;
}
export const RequestsTab = ({ requests }: { requests: requestAdd[] }) => {
  return (
    <Card>
      <CardHeader className="text-default-500 font-semibold text-sm">
        Aquí puedes ver las solicitudes que el usuario ha hecho a otros usuarios
      </CardHeader>
      <CardBody className="max-h-96 min-h-96 space-y-2 overflow-auto">
        {requests.length > 0 ? (
          <>
            {requests.map((request, index) => (
              <div
                className="flex items-center justify-between p-2 border rounded-xl"
                key={index}
              >
                <div>
                  <User
                    description={
                      <div>
                        <p>{timeAgo(request.created_at)}</p>
                        {/* {requester.rating && (
        <Rating disabled rating={requester.rating} />
      )} */}
                      </div>
                    }
                    name={
                      <Link
                        className="hover:underline"
                        href={`/user/profile/${request.ownerId}`}
                      >
                        {capitalizeFirstLetter(
                          `${request.owner.names} ${request.owner.lastname}`
                        )}
                      </Link>
                    }
                    avatarProps={{
                      src: request.owner.profileImage,
                      name: `${request.owner.names} ${request.owner.lastname}`,
                    }}
                  />

                  <div>
                    <h4 className="text-default-500 text-sm ">
                      {request.message ? "Descripción:" : "Sin descripción"}
                    </h4>
                    <p className="text-wrap">{request.message}</p>
                  </div>
                </div>
                <div>
                  <Chip
                    //@ts-ignore
                    color={
                      postStatus.find(
                        (status) => status.value === request.status
                      )?.color
                    }
                  >
                    {request.status}
                  </Chip>
                </div>
              </div>
            ))}
          </>
        ) : (
          <p className="text-center font-semibold text-xl">
            No hay solicitudes
          </p>
        )}
      </CardBody>
    </Card>
  );
};
