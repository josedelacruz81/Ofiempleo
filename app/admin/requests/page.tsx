import { capitalizeFirstLetter, timeAgo } from "@/lib/functions";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
} from "@nextui-org/react";
import { getJobRequests } from "@/lib/services";
import { HiCheck, HiOutlineBan } from "react-icons/hi";
import { RequestsTable } from "../components/RequestsTable";

export default async function Page() {
  const jobRequests = await getJobRequests();

  return (
    <>
      <Card className="space-y-2">
        <CardHeader className="flex flex-col justify-stretch items-start gap-2">
          <h2 className="text-xl font-medium">Solicitudes de oficios</h2>
          <Card fullWidth>
            <CardBody className="grid grid-cols-5 px-5">
              <p className="text-sm font-bold col-span-2">Profesión</p>
              <p className="text-sm">Fecha</p>
              <p className="text-sm col-span-2">Usuario</p>
              {/* <p className="text-sm text-end">Acciones</p> */}
            </CardBody>
          </Card>
        </CardHeader>
        <CardFooter className="flex flex-col items-start gap-3">
          <RequestsTable requests={jobRequests}></RequestsTable>
        </CardFooter>
      </Card>
    </>
  );
}
