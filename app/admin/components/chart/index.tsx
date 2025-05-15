"use client";

import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/shadCn/Chart";
import { StatCardProps } from "@/types";

export default function BarChartTest({
  statsData,
}: {
  statsData: any[];
}) {

  const chartData = [
    {
      month: "Publicaciones",
      Totales: statsData[0].length,
      Aceptadas: statsData[1].length,
      Rechazadas: statsData[2].length,
      Pendientes: statsData[3].length,
    },
  ];

  const chartConfig = {
    Totales: {
      label: "Totales",
      color: "#2563eb",
    },

    Aceptadas: {
      label: "Aceptadas",
      color: "#17c964",
    },
    Rechazadas: {
      label: "Rechazadas",
      color: "#f31260",
    },
    Pendientes: {
      label: "Pendientes",
      color: "#f5a524",
    },
  } satisfies ChartConfig;
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="Totales" fill="var(--color-Totales)" radius={4} />
        <Bar dataKey="Aceptadas" fill="var(--color-Aceptadas)" radius={4} />
        <Bar dataKey="Rechazadas" fill="var(--color-Rechazadas)" radius={4} />
        <Bar dataKey="Pendientes" fill="var(--color-Pendientes)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}
