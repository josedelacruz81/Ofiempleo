"use client";
import { jobInterface, StatCardProps } from "@/types";
import { useState } from "react";
import { StatCard } from "./StatCard";
import {
  Card,
  CardFooter,
  CardHeader,
  Select,
  SelectItem,
} from "@nextui-org/react";
import Chart from "./chart";
import { PieChartComponent } from "./chart/PieChart";

export const StatList = ({
  statsData,
  jobs,
  workers,
}: {
  statsData: StatCardProps[];
  jobs: jobInterface[];
  workers: {
    employees: number;
    employers: number;
  };
}) => {
  const [stats, setStats] = useState<StatCardProps[]>(statsData);
  const [selectedJob, setSelectedJob] = useState<string>("todo");
  const jobData = [{ name: "Todo", value: "todo" }, ...jobs];

  const getPosts = async (key: string) => {
    const res = await fetch(`/api/admin/posts?key=${key}`);
    const data = await res.json();
    return data;
  };

  const getRequests = async (key: string) => {
    const res = await fetch(`/api/admin/requests?key=${key}`);
    const data = await res.json();
    return data;
  };

  const handleTimeStats = async (selectedKey: Set<string>) => {
    const keyArray = Array.from(selectedKey);
    const key = keyArray[0];

    const request = await getRequests(key);
    const posts = await getPosts(key);

    setStats((prevStats) =>
      prevStats.map((stat) =>
        stat.header === "Total"
          ? { ...stat, stat: posts.length }
          : stat.header === "Aceptadas"
          ? { ...stat, stat: request.aceptadas.length }
          : stat.header === "Rechazadas"
          ? { ...stat, stat: request.rechazadas.length }
          : stat.header === "Pendientes"
          ? { ...stat, stat: request.pendientes.length }
          : stat
      )
    );
  };

  const handleSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedJob(e.target.value);
  };

  // Recogemos todos los filteredData
  const allFilteredData = stats.map((stat) =>
    selectedJob === "todo"
      ? stat.data
      : stat.data.filter((item) => item?.post.profession.value === selectedJob)
  );

  return (
    <>
      <div className="grid md:grid-cols-4 gap-4">
        <h2 className="text-xl font-medium">Solicitudes</h2>
        <Select
          defaultSelectedKeys={["todo"]}
          variant="faded"
          radius="lg"
          classNames={{ trigger: "bg-white border-0 radius-xl" }}
          color="primary"
          onSelectionChange={(keys) => handleTimeStats(keys)}
          label="Selecciona un periodo"
        >
          <SelectItem key="todo">Todo</SelectItem>
          <SelectItem key="semanal">Semanal</SelectItem>
          <SelectItem key="mensual">Mensual</SelectItem>
        </Select>
        <Select
          defaultSelectedKeys={["todo"]}
          variant="faded"
          radius="lg"
          classNames={{ trigger: "bg-white border-0 radius-xl" }}
          color="primary"
          onChange={handleSelectionChange}
          label="Selecciona un empleo"
          items={jobData}
        >
          {(job) => <SelectItem key={job.value}>{job.name}</SelectItem>}
        </Select>
      </div>

      <article className="grid md:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const filteredData =
            selectedJob === "todo"
              ? stat.data
              : stat.data.filter(
                  (item) => item?.post.profession.value === selectedJob
                );

          return (
            <StatCard
              key={i}
              icon={stat.icon}
              stat={filteredData.length}
              color={stat.color}
              href={stat.href}
              header={stat.header}
            />
          );
        })}
      </article>

      <article className="grid md:grid-cols-2 gap-4">
        <Card className="">
          <CardHeader>
            <h2 className="text-xl font-semibold ">Estadísticas</h2>
          </CardHeader>
          <CardFooter>
            {/* Pasamos el allFilteredData al Chart */}
            <Chart statsData={allFilteredData} />
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold ">Estadísticas</h2>
          </CardHeader>
          <CardFooter>
            <PieChartComponent workers={workers} />
          </CardFooter>
        </Card>
      </article>
    </>
  );
};
