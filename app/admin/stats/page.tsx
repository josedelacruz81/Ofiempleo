import { Rating } from "@/components/littleComponents/Rating";
import {
  capitalizeFirstLetter,
  filterRatingByRole,
  filterRequestsByStatus,
  timeAgo,
} from "@/lib/functions";
import { rating, StatCardProps } from "@/types";
import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
} from "@nextui-org/react";
import Link from "next/link";
import React from "react";
import { FaUserTie } from "react-icons/fa6";
import { GrUserWorker } from "react-icons/gr";
import {
  HiOutlineCheck,
  HiOutlineClock,
  HiOutlineViewGrid,
  HiOutlineX,
} from "react-icons/hi";
import { getRating as getUserRating } from "@/lib/functions";
import { StatCard } from "../components/StatCard";
import { StatList } from "../components/StatList";
import { getAdminRequests } from "@/lib/services";
import { supabase } from "@/lib/supabase";
const getPosts = async () => {
  const res = await fetch(`${process.env.PUBLIC_URL}/api/admin/posts`, {
    cache: "no-store",
  });
  const data = await res.json();
  return data;
};

const getUsersCount = async () => {
  const res = await fetch(`${process.env.PUBLIC_URL}/api/user`, {
    cache: "no-store",
  });
  const data = await res.json();

  return data;
};

const getJobs = async () => {
  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .neq("value", "otro");
  if (error) return [];
  return data;
};

const getEmployesAndEmployers = async (): Promise<{
  employees: number;
  employers: number;
} > => {
  const res = await fetch(`${process.env.PUBLIC_URL}/api/admin`, {
    cache: "no-store",
  });
  const data = await res.json();
  return data;
};

const getRating = async (): Promise<rating[]> => {
  const res = await fetch(`${process.env.PUBLIC_URL}/api/admin/ratingUsers`, {
    cache: "no-store",
  });
  const data = await res.json();
  return data;
};

export default async function Page() {
  const posts = await getPosts();
  const { aceptadas, pendientes, rechazadas } = await getAdminRequests();
  const rating = await getRating();
  const jobs = await getJobs();

  const { employees, employers } = filterRatingByRole(rating);
  const workers = await getEmployesAndEmployers();
  const statsData: Array<StatCardProps> = [
    {
      header: "Total",
      icon: <HiOutlineViewGrid className="text-gray-700" size={25} />,
      stat: [...aceptadas, ...rechazadas, ...pendientes].length,
      data: [...aceptadas, ...rechazadas, ...pendientes],
      color: "primary",
      href: "/admin",
    },
    {
      header: "Aceptadas",
      icon: <HiOutlineCheck className="text-gray-700" size={25} />,
      stat: aceptadas.length,
      data: aceptadas,
      color: "success",
      href: "/admin/posts/Aceptado",
    },
    {
      header: "Rechazadas",
      icon: <HiOutlineX className="text-gray-700" size={25} />,
      stat: rechazadas.length,
      data: rechazadas,
      color: "danger",
      href: "/admin/posts/Rechazado",
    },
    {
      header: "Pendientes",
      icon: <HiOutlineClock className="text-gray-700" size={25} />,
      stat: pendientes.length,
      data: pendientes,
      color: "warning",
      href: "/admin/posts/Pendiente",
    },
  ];

  return (
    <section className="space-y-5">
      <StatList workers={workers} jobs={jobs} statsData={statsData} />

      <article className="grid md:grid-cols-2 gap-4">
        
        <h2 className="text-xl font-medium md:col-span-2">
          Usuarios destacados
        </h2>
        <Card shadow="none" className="bg-default-200">
          <CardHeader className="flex items-center justify-between">
            Trabajadores
            <GrUserWorker className="text-secondary" size={20} />
          </CardHeader>
          <CardFooter className="flex flex-col gap-2">
            {employees.map(({ user }, i) => (
              <Card key={i} fullWidth shadow="none">
                <CardBody className="flex flex-row justify-between items-center py-2 px-3">
                  <div className="flex items-center gap-2">
                    <Avatar size="sm" />
                    <p className="text-default-500 text-sm font-medium">
                      {capitalizeFirstLetter(`
                       ${user?.names} ${user?.lastname}
                        `)}
                    </p>
                  </div>
                  <Rating rating={5} disabled />
                </CardBody>
              </Card>
            ))}
          </CardFooter>
        </Card>
        <Card shadow="none" className="bg-default-200">
          <CardHeader className="flex items-center justify-between">
            Empleadores
            <FaUserTie className="text-primary" size={20} />
          </CardHeader>

          <CardFooter className="flex flex-col gap-2">
            {employers.map(async ({ user }, i) => {
              const rating = user ? await getUserRating(user.id) : 0;

              return (
                <Card key={i} fullWidth shadow="none">
                  <CardBody className="flex flex-row justify-between items-center py-2 px-3">
                    <div className="flex items-center gap-2">
                      <Avatar name={user?.names} size="sm" />
                      <p className="text-default-500 text-sm font-medium">
                        {capitalizeFirstLetter(`
                        ${user?.names} ${user?.lastname}
                          `)}
                      </p>
                    </div>
                    <Rating rating={rating} disabled />
                  </CardBody>
                </Card>
              );
            })}
          </CardFooter>
        </Card>
      </article>
    </section>
  );
}
