import { capitalizeFirstLetter } from "@/lib/functions";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Input,
  Spinner,
  User,
} from "@nextui-org/react";
import { ReportDropdown } from "../components/ReportDropdown";
import Link from "next/link";
import { report } from "@/types";
import { useEffect, useState } from "react";
import { HiSearch } from "react-icons/hi";
import { auth } from "@/auth";
import { ReportsList } from "../components/ReportsList";
import { redirect } from "next/navigation";

const getReports = async () => {
  const res = await fetch(`${process.env.PUBLIC_URL}/api/admin/reports`);
  const data = await res.json();
  return data;
};

export default async function Page() {
  const session = await auth();
  if(!session) return redirect("/auth");
  const reports = await getReports();

  return (
    <Card>
      <ReportsList reportsData={reports} />
    </Card>
  );
}
