import { userInterface, UserManagment } from "@/types";
import UsersTable from "../components/UsersTable";
import { UserTable } from "../components/UserTable";
import { Card, CardBody } from "@nextui-org/react";

const getUsers = async (): Promise<UserManagment> => {
  const res = await fetch(
    `${process.env.PUBLIC_URL}/api/admin/users?_start=0&_end=10`,
    {
      cache: "no-store",
    }
  );
  const data = await res.json();
  return data;
};

export default async function Page() {
  return (
    <div>
      <Card>
        <CardBody>
          <UserTable />
      {/* <UsersTable/> */}
        </CardBody>
      </Card>
    </div>
  );
}
