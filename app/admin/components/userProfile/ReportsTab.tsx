import { capitalizeFirstLetter } from "@/lib/functions";
import { report } from "@/types";
import { Card, CardBody, CardHeader, Divider, User } from "@nextui-org/react";
import Link from "next/link";

export const ReportsTab = ({ reports }: { reports: report[] }) => {
  return (
    <Card>
      <CardHeader className="text-default-500 font-semibold text-sm">
        Aquí puedes ver los reportes que los usuarios han hecho sobre este
        usuario
      </CardHeader>
      <CardBody className="max-h-96 min-h-96 space-y-2 overflow-auto">
        {reports.length > 0 ? (
          <>
            {reports.map((report, index) => (
              <div
                className="flex justify-between border rounded-lg p-2"
                key={index}
              >
                <div>
                  <p className="text-default-500 text-sm">Reportado por:</p>
                  <Link href={`/user/profile/${report.reportedBy}`}>
                    <User
                      avatarProps={{
                        src: report.reportedByUser.profileImage,
                        name: report.reportedByUser.names,
                      }}
                      description={report.reportedByUser.email}
                      name={capitalizeFirstLetter(report.reportedByUser.names)}
                    />
                  </Link>
                </div>
                <Divider orientation="vertical" />
                <div className="">
                  <p className="text-default-500 text-sm">Motivo:</p>
                  <p>{report.reason}</p>
                </div>
              </div>
            ))}
          </>
        ) : (
          <p className="text-center font-semibold text-xl">
            El usuario no tiene ningun reporte
          </p>
        )}
      </CardBody>
    </Card>
  );
};
