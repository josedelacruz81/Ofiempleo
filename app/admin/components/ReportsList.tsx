"use client";
import { report } from "@/types";
import { useEffect, useState } from "react";
import { ReportDropdown } from "./ReportDropdown";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Input,
  Link,
  User,
} from "@nextui-org/react";
import NextLink from "next/link";
import { capitalizeFirstLetter } from "@/lib/functions";
import { HiSearch } from "react-icons/hi";

export const ReportsList = ({ reportsData }: { reportsData: report[] }) => {
  const [reports, setReports] = useState<report[]>(reportsData);
  const [isLoading, setIsLoading] = useState(true);
  const getReports = async () => {
    try {
      const res = await fetch(`/api/admin/reports`);
      const data = await res.json();

      setReports(data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getReports();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "") {
      getReports();
    } else if (!isNaN(parseInt(value))) {
      const filteredReports = reports.filter((report) =>
        report.reported.id
          .toString()
          .toLowerCase()
          .includes(value.toLowerCase())
      );
      setReports(filteredReports);
    } else {
      const filteredReports = reports.filter((report) =>
        `${report.reported.names} ${report.reported.lastname}`
          .toLowerCase()
          .includes(value.toLowerCase())
      );
      setReports(filteredReports);
    }
  };

  return (
    <>
      <CardHeader className="flex justify-between items-center">
        <div>
          <h2 className="font-semibold text-xl">Reportes</h2>
          <p className="text-sm text-default-500">
            Aquí puedes ver los reportes de los usuarios y tomar las acciones
            necesarias.
          </p>
        </div>
        <Input
          startContent={<HiSearch className="text-default-500" />}
          placeholder="Buscar reportes"
          className="w-72"
          onChange={handleSearch}
        />
      </CardHeader>
      <CardBody>
        <div>
          {" "}
          {reports.length === 0 ? (
            <h3>No hay usuarios reportados aún</h3>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {reports.map((report) => (
                <Card className="basis-1/3" key={report.id}>
                  <CardHeader className="flex justify-between items-start">
                    <div>
                    <p className="text-default-500 text-sm">
                      Usuario reportado:
                    </p>
                    <Link href={`/review/profile/${report.reported.id} `}>
                      <User
                        avatarProps={{
                          src: report.reported.profileImage,
                          name: report.reported.names,
                        }}
                        description={report.reported.email}
                        name={capitalizeFirstLetter(report.reported.names)}
                      />
                    </Link>
                    </div>
                    <ReportDropdown reported={report.reported} />

                  </CardHeader>
                  <CardBody>
                    <h3 className="text-default-500 text-sm">Motivo:</h3>
                    <p>{report.reason}</p>
                  </CardBody>
                  <CardFooter className="flex justify-between  items-center gap-2">
                    <div>
                      <p className="text-default-500 text-sm">
                        Reportado por:{" "}
                      </p>
                      <Link
                        as={NextLink}
                        href={`/review/profile/${report.reportedByUser.id}`}
                      >
                        <User
                          avatarProps={{
                            src: report.reportedByUser.profileImage,
                            name: report.reportedByUser.names,
                          }}
                          description={report.reportedByUser.email}
                          name={capitalizeFirstLetter(
                            report.reportedByUser.names
                          )}
                        />
                      </Link>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </CardBody>
    </>
  );
};
