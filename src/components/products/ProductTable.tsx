"use client";

import { useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit2, Trash2, Eye, Badge } from "lucide-react";
import { Product, ProductStatus } from "@/src/lib/redux/features/productsSlice";

interface ProductTableProps {
  data: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onChangeStatus: (product: Product) => void;
}

const statusVariant: Record<ProductStatus, string> = {
  pending: "bg-amber-50 text-amber-700 border border-amber-100",
  confirmed: "bg-blue-50 text-blue-700 border border-blue-200",
  delivered: "bg-emerald-50 text-emerald-700 border border-emerald-100",
  cancelled: "bg-rose-50 text-rose-700 border border-rose-100",
};

const STATUS_OPTIONS: { label: string; value: ProductStatus | "all" }[] = [
  { label: "All status", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancelled" },
];

export function ProductTable({
  data,
  onEdit,
  onDelete,
  onChangeStatus,
}: ProductTableProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ProductStatus | "all">(
    "all"
  );

  const formatDate = (iso?: string) => {
    if (!iso) return "-";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "-";
    return d.toLocaleDateString();
  };

  const handleClearFilters = () => {
    setSearch("");
    setStatusFilter("all");
  };

  const filteredData = useMemo(() => {
    const term = search.trim().toLowerCase();

    return data.filter((product) => {
      if (statusFilter !== "all" && product.status !== statusFilter) {
        return false;
      }

      if (!term) return true;

      const haystack = [
        product.name,
        product.sku,
        product.category,
        product.status,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(term);
    });
  }, [data, search, statusFilter]);

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 shadow-sm sm:px-6">
      {/* Header */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="mt-1 text-xs text-gray-500">
            Manage products
          </p>
        </div>

        <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
          {/* search */}
          <Input
            placeholder="Search by name, SKU, category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 w-full text-xs sm:w-56"
          />

          {/* status filter */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as ProductStatus | "all")
                }
                className="h-9 rounded-md border border-gray-200 bg-white px-3 text-xs text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="inline-flex items-center gap-2 text-xs"
              onClick={handleClearFilters}
            >
              <Eye className="h-4 w-4" />
              See all
            </Button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-y border-gray-100 bg-gray-50">
            <TableRow>
              <TableHead className="py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                Product
              </TableHead>
              <TableHead className="py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                SKU
              </TableHead>
              <TableHead className="py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                Stock
              </TableHead>
              <TableHead className="py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                Price
              </TableHead>
              <TableHead className="py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                Category
              </TableHead>
              <TableHead className="py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                Status
              </TableHead>
              <TableHead className="py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                Created
              </TableHead>
              <TableHead className="py-3 text-right text-xs font-medium uppercase tracking-wide text-gray-500">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          {/* Body */}
          <TableBody className="divide-y divide-gray-100">
            {filteredData.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="py-6 text-center text-sm text-gray-500"
                >
                  No products found for this search/filter.
                </TableCell>
              </TableRow>
            )}

            {filteredData.map((product) => (
              <TableRow key={product.id} className="hover:bg-gray-50/70">
                <TableCell className="py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-slate-900 text-xs font-semibold uppercase text-white">
                      {product.name
                        .split(" ")
                        .map((p) => p[0])
                        .join("")
                        .slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {product.name}
                      </p>
                    </div>
                  </div>
                </TableCell>

                <TableCell className="py-3 text-sm text-gray-500">
                  {product.sku || "-"}
                </TableCell>

                <TableCell className="py-3 text-sm text-gray-500">
                  {product.stock}
                </TableCell>

                <TableCell className="py-3 text-sm text-gray-500">
                  ${product.price}
                </TableCell>

                <TableCell className="py-3 text-sm text-gray-500">
                  {product.category || "-"}
                </TableCell>

                <TableCell className="py-3 text-center">
                  <p
                    className={`inline-flex rounded-2xl px-3 py-1 text-xs font-medium capitalize ${statusVariant[product.status]}`}
                  >
                    {product.status}
                  </p>
                </TableCell>

                <TableCell className="py-3 text-sm text-gray-500">
                  {formatDate(product.createdAt)}
                </TableCell>

                <TableCell className="py-3">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onChangeStatus(product)}
                      title="Change status"
                    >
                      <span className="sr-only">Change status</span>
                      <Badge className="border-slate-200 bg-slate-50 px-2 py-0 text-[10px] font-medium uppercase tracking-wide text-slate-600">
                        Toggle
                      </Badge>
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-slate-600 hover:text-slate-900"
                      onClick={() => onEdit(product)}
                      title="Edit"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-500 hover:text-red-600"
                      onClick={() => onDelete(product)}
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
