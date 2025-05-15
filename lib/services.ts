import { jobInterface, jobRequest, report, request } from "@/types";

export const getJobRequests = async (): Promise<jobRequest[]> => {
  const res = await fetch(`${process.env.PUBLIC_URL}/api/admin/jobRequests`, {
    cache: "no-store",
  });
  const data = await res.json();
  return data;
};

export const getReportedUser = async (
  reportedId: string,
  reportedBy: string
) => {
  try {
    const res = await fetch(
      `${process.env.PUBLIC_URL}/api/reports/${reportedId}?reportedBy=${reportedBy}`
    );
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getReports = async (): Promise<report[]> => {
  const res = await fetch(`${process.env.PUBLIC_URL}/api/admin/reports`, {
    cache: "no-store",
  });
  const data = await res.json();
  return data;
};

export const getAdminRequests = async (): Promise<{
  aceptadas: request[];
  pendientes: request[];
  rechazadas: request[];
}> => {
  const res = await fetch(`${process.env.PUBLIC_URL}/api/admin/requests`, {
    cache: "no-store",
  });
  const data = await res.json();
  return data;
};
