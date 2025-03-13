"use client";

import DashboardStatCard from "./DashboardStatCard";
import { Receipt, DollarSign, PiggyBank } from "lucide-react";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Label,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
  Bar,
  BarChart,
  XAxis,
  YAxis,
  LabelList,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";

const DashboardSection = ({ stats }) => {
  const attendeeChartData = [stats.attendees.perType];
  const attendeeChartConfig = {
    Golfer: {
      label: "Golfers",
      color: "hsl(var(--chart-1))",
    },
    "Dinner Guests": {
      label: "Dinner Guests",
      color: "hsl(var(--chart-2))",
    },
  };

  const donationChartData = stats.donations.byType;

  const donationChartConfig = {
    amount: {
      label: "Total Amount",
      color: "hsl(var(--chart-2))",
    },
  };

  return (
    <div id="dashboard-wrapper" className="p-8">
      <div
        id="stat-cards"
        className="grid lg:grid-cols-3 sm:grid-cols-2 gap-4 mb-5"
      >
        <DashboardStatCard
          title="Total Revenue"
          stat={stats.income.gross_income}
          CustomIcon={Receipt}
          isMoney={true}
        />

        <DashboardStatCard
          title="Total Expenses"
          stat={stats.expenses.total_expenses}
          CustomIcon={DollarSign}
          isMoney={true}
        />

        <DashboardStatCard
          title="Total Profit"
          stat={stats.income.gross_income - stats.expenses.total_expenses}
          CustomIcon={PiggyBank}
          isMoney={true}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Attendees</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ChartContainer
              config={attendeeChartConfig}
              className="w-full m-auto h-[80%]"
            >
              <RadialBarChart
                data={attendeeChartData}
                endAngle={180}
                innerRadius={80}
                outerRadius={130}
              >
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        return (
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor="middle"
                          >
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) - 16}
                              className="fill-foreground text-2xl font-bold"
                            >
                              {stats.attendees.totalAmount.toLocaleString()}
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 4}
                              className="fill-muted-foreground"
                            >
                              Attendees
                            </tspan>
                          </text>
                        );
                      }
                    }}
                  />
                </PolarRadiusAxis>
                <RadialBar
                  dataKey="Golfer"
                  stackId="a"
                  cornerRadius={5}
                  fill="hsl(var(--chart-1))"
                  className="stroke-transparent stroke-2"
                />
                <RadialBar
                  dataKey="Dinner Guest"
                  fill="hsl(var(--chart-2))"
                  stackId="a"
                  cornerRadius={5}
                  className="stroke-transparent stroke-2"
                />
              </RadialBarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Donation Totals By Type</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={donationChartConfig}>
              <BarChart
                accessibilityLayer
                data={donationChartData}
                layout="vertical"
                margin={{
                  right: 100,
                  left: 10,
                }}
              >
                <XAxis type={"number"} dataKey={"amount"} hide />
                <YAxis
                  dataKey={"item"}
                  type={"category"}
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                  hide
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Bar dataKey="amount" fill="hsl(var(--chart-2))" radius={5}>
                  <LabelList
                    dataKey="item"
                    position="insideLeft"
                    offset={8}
                    className="fill-[--color-label]"
                    fontSize={12}
                  />
                  <LabelList
                    dataKey="amount"
                    position="right"
                    offset={8}
                    className="fill-foreground"
                    fontSize={12}
                  />
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardSection;
