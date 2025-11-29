"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Product, ProductStatus } from "@/src/lib/redux/features/productsSlice";

type FormValues = {
  name: string;
  sku: string;
  price: number;
  stock: number;
  category: string;
  status: ProductStatus;
};

interface ProductFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialProduct?: Product | null;
  onSubmit: (values: FormValues) => Promise<void>;
  loading?: boolean;
}

const STATUS_OPTIONS: ProductStatus[] = ["pending" , "confirmed" , "delivered" , "cancelled"];

export function ProductFormDialog({
  open,
  onOpenChange,
  initialProduct,
  onSubmit,
  loading,
}: ProductFormDialogProps) {
  const isEdit = !!initialProduct;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: "",
      sku: "",
      price: 0,
      stock: 0,
      category: "",
      status: "pending",
    },
  });

  useEffect(() => {
    if (initialProduct) {
      reset({
        name: initialProduct.name,
        sku: initialProduct.sku,
        price: initialProduct.price,
        stock: initialProduct.stock,
        category: initialProduct.category,
        status: initialProduct.status,
      });
    } else {
      reset({
        name: "",
        sku: "",
        price: 0,
        stock: 0,
        category: "",
        status: "pending",
      });
    }
  }, [initialProduct, reset]);

  const internalSubmit = async (values: FormValues) => {
    await onSubmit(values);
    onOpenChange(false);
  };

  const statusValue = watch("status");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit product" : "Add product"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the product information."
              : "Create a new product entry."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(internalSubmit)} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              {...register("name", { required: "Name is required" })}
            />
            {errors.name && (
              <p className="text-xs text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="sku">SKU</Label>
            <Input
              id="sku"
              {...register("sku", { required: "SKU is required" })}
            />
            {errors.sku && (
              <p className="text-xs text-red-600">{errors.sku.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                {...register("price", {
                  required: "Price is required",
                  valueAsNumber: true,
                })}
              />
              {errors.price && (
                <p className="text-xs text-red-600">{errors.price.message}</p>
              )}
            </div>
            <div className="space-y-1">
              <Label htmlFor="stock">Stock</Label>
              <Input
                id="stock"
                type="number"
                {...register("stock", {
                  required: "Stock is required",
                  valueAsNumber: true,
                })}
              />
              {errors.stock && (
                <p className="text-xs text-red-600">{errors.stock.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              {...register("category", { required: "Category is required" })}
            />
            {errors.category && (
              <p className="text-xs text-red-600">{errors.category.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label>Status</Label>
            <Select
              value={statusValue}
              onValueChange={(value) => setValue("status", value as FormValues["status"])}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status.replace("_", " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.status && (
              <p className="text-xs text-red-600">{errors.status.message}</p>
            )}
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : isEdit ? "Save changes" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
