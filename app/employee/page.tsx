import { CvForm } from "@/components/modals/PostModal/cvForm";
import { auth } from "@/auth";
import { supabase } from "@/lib/supabase";
import { Card, CardBody, CardHeader, Tooltip, Button } from "@nextui-org/react";
import { UserCard } from "@/components/profile/userCard";
import { redirect } from "next/navigation";
import { FaInfo } from "react-icons/fa6";
import { comment, EMPLOYER, request } from "@/types";
import { RefreshButton } from "@/components/buttons/RefreshButton";
import { getRole } from "@/lib/functions";
import { RequestsList } from "./components/RequestsList";
import { NextResponse } from "next/server";

const getUserData = async (id: string) => {
  const userUrl = `${process.env.PUBLIC_URL}/api/user/${id}`;
  const res = await fetch(userUrl, { cache: "no-store" });
  const userData = await res.json();
  return userData;
};

const getRequests = async (
  userId: string
): Promise<{
  data: {
    pendingRequests: request[];
    acceptedRequests: request[];
    rejectedRequests: request[];
  };
  isEmpty: boolean;
}> => {
  // Aquí va tu lógica para obtener las solicitudes.
  const res = await fetch(
    `${process.env.PUBLIC_URL}/api/employee/requests/${userId}`,
    { cache: "no-store" }
  );
  const data = await res.json();
  // Ejemplo de retorno
  return data;
};


const getJobRequest = async (userId: string) => {
  const { data, error } = await supabase
    .from("jobRequests")
    .select("id")
    .eq("userId", userId);
  if (error) {
    console.error(error);
    return false;
  }
  return data.length > 0; // true if there is a job request
};

export default async function EmployeePage() {
  const session = await auth();

  if (!session) return redirect("/auth");

  const role = await getRole(session?.user.id);

  if (role === EMPLOYER) return redirect("/");
  const { user, post } = await getUserData(session?.user.id);

  const requests = await getRequests(session?.user.id);

  const jobRequests = await getJobRequest(session?.user.id);
 
  return (
    <div
      className={`my-5 gap-5 ${
        !requests.isEmpty
          ? "grid lg:grid-cols-2"
          : "flex grow items-center justify-center "
      }`}
    >
      <Card
        className={`${!requests.isEmpty ? "" : "w-full sm:w-5/6 lg:w-1/2"}`}
      >
        <CardBody>
          {!post ? (
            <CvForm requested={jobRequests} user={user} />
          ) : (
            <UserCard post={post} user={user} />
          )}
        </CardBody>
      </Card>
      {!requests.isEmpty && (
        <Card>
          <CardHeader className="flex items-center justify-between">
            <div className="flex items-center">
              <h3 className="font-semibold text-xl">Solicitudes</h3>

              <Tooltip
                delay={400}
                color="secondary"
                content="Aquí puedes ver todas las personas interesadas en tu servicio"
              >
                <Button
                  radius="full"
                  size="sm"
                  variant="light"
                  color="secondary"
                  isIconOnly
                >
                  <FaInfo />
                </Button>
              </Tooltip>
            </div>
            <RefreshButton />
          </CardHeader>

          <CardBody>
            {!!post ? (
              <RequestsList session={session} requestsData={requests} />
            ) : (
              <h3>No hay solicitudes</h3>
            )}
          </CardBody>
        </Card>
      )}
    </div>
  );
}
