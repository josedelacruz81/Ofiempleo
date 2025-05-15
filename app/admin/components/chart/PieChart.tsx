"use client";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/shadCn/Chart";
import { FaUserTie } from "react-icons/fa6";
import { GrUserWorker } from "react-icons/gr";
import {
  PieChart,
  Pie,
  ResponsiveContainer,
  Legend,
  Tooltip,
  CartesianGrid,
  Cell,
} from "recharts";
export const PieChartComponent = ({
  workers,
}: {
  workers: {
    employees: number;
    employers: number;
  };
}) => {

  const data = [
    { name: "Trabajadores", value: workers.employees },
    { name: "Empleadores", value: workers.employers },
  ];
  const chartConfig = {
    Employer: {
      label: "Totales",
      color: "#2563eb",
    },
    Employee: {
      label: "Rechazadas",
      color: "#f5a524",
    },
  } satisfies ChartConfig;
  const COLORS = ["#7828c8", "#006fee"];

  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <PieChart accessibilityLayer data={data}>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          labelLine={false}
          label={renderCustomizedLabel}
          fill="var(--color-Employee)"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>

        <ChartTooltip content={<ChartTooltipContent />} />
        <Legend content={renderLegend} />
      </PieChart>
    </ChartContainer>
  );
};

const renderLegend = (props: any) => {
  const { payload } = props;

  return (
    <ul className="flex w-full items-center justify-center gap-5">
      {payload.map((entry: any, index: number) => (
        <li key={`item-${index}`} className="flex items-center gap-1">
          <div
            style={{ backgroundColor: entry.color }}
            className={`
             

            rounded-sm h-2 w-2`}
          ></div>

          {index === 0 ? (
            <GrUserWorker className="text-secondary" size={18} />
          ) : (
            <FaUserTie className="text-primary" size={18} />
          )}
          <p>{entry.value}</p>
        </li>
      ))}
    </ul>
  );
};

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
}: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};
