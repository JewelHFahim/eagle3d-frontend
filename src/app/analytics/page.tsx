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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Package,
  ShoppingBag,
  TrendingUp,
  AlertTriangle,
  Badge,
} from "lucide-react";
import { useProductsRealtime } from "@/src/hooks/useProductsRealtime";
import { useAppSelector } from "@/src/lib/redux/hooks";
import ProtectedPage from "@/src/components/auth/ProtectedPage";

export default function AnalyticsPage() {
  useProductsRealtime();
  const products = useAppSelector((state) => state.products.items);

  // Filters & Counts
  const totalProducts = products.length;
  const pendingProducts = products.filter((p) => p.status === "pending").length;
  const cancelledProducts = products.filter((p) => p.status === "cancelled").length;
  const deliveredProducts = products.filter((p) => p.status === "delivered").length;

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
    ([category, count]) => ({ category, count })
  );

  // Products per month
  const monthCounts = products.reduce<Record<string, number>>((acc, p) => {
    if (!p.createdAt) return acc;
    const d = new Date(p.createdAt);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart( 2, "0" )}`;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const monthData = Object.entries(monthCounts)
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([month, count]) => ({ month, count }));

  const hasAnyData = statusData.length || categoryData.length || monthData.length;

  return (
    <ProtectedPage>
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            {/* Total Products */}
            <Card className="rounded-2xl border border-gray-200 bg-white">
              <CardContent className="p-5 md:p-6">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-50">
                  <Package className="size-6 text-indigo-600" />
                </div>

                <div className="flex items-end justify-between mt-5">
                  <div>
                    <span className="text-sm text-gray-500">
                      Total products
                    </span>
                    <h4 className="mt-2 text-2xl font-bold text-gray-800">
                      {totalProducts}
                    </h4>
                  </div>
                  <Badge className="text-indigo-700 border-0">
                    • Live
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Pending Products */}
            <Card className="rounded-2xl border border-gray-200 bg-white">
              <CardContent className="p-5 md:p-6">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-amber-50">
                  <ShoppingBag className="size-6 text-amber-600" />
                </div>

                <div className="flex items-end justify-between mt-5">
                  <div>
                    <span className="text-sm text-gray-500">
                      Pending products
                    </span>
                    <h4 className="mt-2 text-2xl font-bold text-gray-800">
                      {pendingProducts}
                    </h4>
                  </div>
                  <Badge className="text-amber-700 border-0">
                    <TrendingUp className="mr-1 size-3" />
                    {totalProducts ? `${Math.round( (pendingProducts / totalProducts) * 100 )}%` : "0%"}
                    <span className="ml-1 text-[10px]">active</span>
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Cancelled Products */}
            <Card className="rounded-2xl border border-gray-200 bg-white">
              <CardContent className="p-5 md:p-6">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-rose-50">
                  <AlertTriangle className="size-6 text-rose-600" />
                </div>

                <div className="flex items-end justify-between mt-5">
                  <div>
                    <span className="text-sm text-gray-500">
                      Out of stock
                    </span>
                    <h4 className="mt-2 text-2xl font-bold text-gray-800">
                      {cancelledProducts}
                    </h4>
                  </div>
                  <Badge className="text-rose-700 border-0">
                    {cancelledProducts > 0 ? "Needs attention" : "All good"}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Delivered Products */}
            <Card className="rounded-2xl border border-gray-200 bg-white">
              <CardContent className="p-5 md:p-6">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-50">
                  <TrendingUp className="size-6 text-emerald-600" />
                </div>

                <div className="flex items-end justify-between mt-5">
                  <div>
                    <span className="text-sm text-gray-500">
                      Delivered Products
                    </span>
                    <h4 className="mt-2 text-2xl font-bold text-gray-800">
                      {deliveredProducts}
                    </h4>
                  </div>
                  <Badge className="text-emerald-700 border-0"> est. </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* CHARTS Here*/}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

            {/* Products by status */}
            <Card className="rounded-2xl border border-gray-200 bg-white">
              <CardHeader>
                <CardTitle className="text-sm font-semibold text-slate-800">
                  Products by status
                </CardTitle>
              </CardHeader>
              <CardContent className="h-72">
                {statusData.length ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={statusData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis
                        dataKey="status"
                        tickLine={false}
                        tickMargin={8}
                        axisLine={false}
                      />
                      <YAxis
                        allowDecimals={false}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip
                        cursor={{ fill: "rgba(148, 163, 184, 0.1)" }}
                        contentStyle={{
                          borderRadius: 12,
                          border: "1px solid #E2E8F0",
                          fontSize: 12,
                        }}
                      />
                      <Bar
                        dataKey="count"
                        radius={[10, 10, 0, 0]}
                        fill="#6366F1"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <EmptyChartState />
                )}
              </CardContent>
            </Card>

            {/* Products by category */}
            <Card className="rounded-2xl border border-gray-200 bg-white">
              <CardHeader>
                <CardTitle className="text-sm font-semibold text-slate-800">
                  Products by category
                </CardTitle>
              </CardHeader>
              <CardContent className="h-72">
                {categoryData.length ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={categoryData}>
                      <CartesianGrid strokeDasharray="4 4" vertical={false} />
                      <XAxis
                        dataKey="category"
                        tickLine={false}
                        tickMargin={8}
                        axisLine={false}
                      />
                      <YAxis
                        allowDecimals={false}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip
                        cursor={{ fill: "rgba(16, 185, 129, 0.05)" }}
                        contentStyle={{
                          borderRadius: 12,
                          border: "1px solid #E2E8F0",
                          fontSize: 12,
                        }}
                      />
                      <Bar
                        dataKey="count"
                        radius={[10, 10, 0, 0]}
                        fill="#10B981"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <EmptyChartState />
                )}
              </CardContent>
            </Card>

            {/* Products created per month */}
            <Card className="md:col-span-2 rounded-2xl border border-gray-200 bg-white">
              <CardHeader>
                <CardTitle className="text-sm font-semibold text-slate-800">
                  Products created per month
                </CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                {monthData.length ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="month"
                        tickLine={false}
                        tickMargin={8}
                        axisLine={false}
                      />
                      <YAxis
                        allowDecimals={false}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip
                        contentStyle={{
                          borderRadius: 12,
                          border: "1px solid #E2E8F0",
                          fontSize: 12,
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="count"
                        stroke="#F97316"
                        strokeWidth={2.4}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <EmptyChartState />
                )}
              </CardContent>
            </Card>
          </div>

          {!hasAnyData && (
            <p className="text-xs text-slate-400">
              Add some products first to see full analytics.
            </p>
          )}
        </div>
      </div>
    </ProtectedPage>
  );
}

function EmptyChartState() {
  return (
    <div className="flex h-full items-center justify-center text-sm text-slate-500">
      Not enough data yet.
    </div>
  );
}
