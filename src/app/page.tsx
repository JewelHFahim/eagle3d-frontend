"use client";

import {
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  Line,
  ResponsiveContainer,
  BarChart,
  LineChart,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProductsRealtime } from "@/src/hooks/useProductsRealtime";
import { useAppSelector } from "@/src/lib/redux/hooks";
import ProtectedPage from "@/src/components/auth/ProtectedPage";

export default function Home() {
  useProductsRealtime();
  const products = useAppSelector((state) => state.products.items);

  // Products by status
  const statusCounts = products.reduce<Record<string, number>>((acc, p) => {
    acc[p.status] = (acc[p.status] || 0) + 1;
    return acc;
  }, {});

  const statusData = Object.entries(statusCounts).map(([status, count]) => ({
    status: status.replace("_", " "),
    count,
  }));

  // Products by category
  const categoryCounts = products.reduce<Record<string, number>>((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {});

  const categoryData = Object.entries(categoryCounts).map(
    ([category, count]) => ({ category, count, })
  );

  // Products created per month
  const monthCounts = products.reduce<Record<string, number>>((acc, p) => {
    if (!p.createdAt) return acc;
    const d = new Date(p.createdAt);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart( 2, "0")}`;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const monthData = Object.entries(monthCounts)
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([month, count]) => ({ month, count, }));

  return (
    <ProtectedPage>
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              Analytics
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              High-level insights based on current product data.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Products by status */}
            <Card>
              <CardHeader>
                <CardTitle>Products by status</CardTitle>
              </CardHeader>
              <CardContent className="h-64">
                {statusData.length ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={statusData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="status" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Bar dataKey="count" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-sm text-slate-500">
                    No data available yet.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Products by category */}
            <Card>
              <CardHeader>
                <CardTitle>Products by category</CardTitle>
              </CardHeader>
              <CardContent className="h-64">
                {categoryData.length ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={categoryData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="category" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Bar dataKey="count" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-sm text-slate-500">
                    No data available yet.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Products created per month */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Products created per month</CardTitle>
              </CardHeader>
              <CardContent className="h-72">
                {monthData.length ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Line type="monotone" dataKey="count" />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-sm text-slate-500">
                    No data available yet.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedPage>
  );
}
