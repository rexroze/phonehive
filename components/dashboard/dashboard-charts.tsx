"use client";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface MonthlyData {
  month: string;
  revenue: number;
  profit: number;
  itemsSold: number;
  expenses: number;
}

interface DashboardChartsProps {
  monthlyData: MonthlyData[];
}

export function DashboardCharts({ monthlyData }: DashboardChartsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-lg border bg-card p-4">
        <h3 className="mb-4 text-lg font-semibold">Revenue & Profit</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="revenue" stroke="#8884d8" name="Revenue" />
            <Line type="monotone" dataKey="profit" stroke="#82ca9d" name="Profit" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="rounded-lg border bg-card p-4">
        <h3 className="mb-4 text-lg font-semibold">Items Sold</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="itemsSold" fill="#8884d8" name="Items Sold" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="rounded-lg border bg-card p-4">
        <h3 className="mb-4 text-lg font-semibold">Expenses</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="expenses" fill="#ff7300" name="Expenses" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

