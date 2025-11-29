"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/src/components/common/ConfirmDialog";
import { useProductsRealtime } from "@/src/hooks/useProductsRealtime";
import { useAppSelector } from "@/src/lib/redux/hooks";
import { useCreateProductMutation, useDeleteProductMutation, useUpdateProductMutation, useUpdateProductStatusMutation } from "@/src/lib/redux/services/productApi";
import { Product, ProductStatus } from "@/src/lib/redux/features/productsSlice";
import ProtectedPage from "@/src/components/auth/ProtectedPage";
import { ProductTable } from "@/src/components/products/ProductTable";
import { ProductFormDialog } from "@/src/components/products/ProductFormDialog";

export default function ProductsPage() {
  useProductsRealtime();
  const products = useAppSelector((state) => state.products.items);

  const [createProduct, { isLoading: creating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: updating }] = useUpdateProductMutation();
  const [deleteProduct, { isLoading: deleting }] = useDeleteProductMutation();
  const [updateStatus, { isLoading: changingStatus }] = useUpdateProductStatusMutation();

  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleAddClick = () => {
    setEditingProduct(null);
    setFormOpen(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormOpen(true);
  };

  const handleDelete = (product: Product) => {
    setSelectedProduct(product);
    setDeleteDialogOpen(true);
  };

  const handleChangeStatus = (product: Product) => {
    setSelectedProduct(product);
    setStatusDialogOpen(true);
  };

  const handleFormSubmit = async (values: {
    name: string;
    sku: string;
    price: number;
    stock: number;
    category: string;
    status: ProductStatus;
  }) => {
    if (editingProduct) {
      await updateProduct({
        id: editingProduct.id,
        ...values,
      }).unwrap();
    } else {
      await createProduct(values).unwrap();
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedProduct) return;
    await deleteProduct(selectedProduct.id).unwrap();
  };

  const handleConfirmStatusChange = async () => {
    if (!selectedProduct) return;
    const nextStatus: ProductStatus = selectedProduct.status === "confirmed" ? "confirmed" : "delivered";
    await updateStatus({ id: selectedProduct.id, status: nextStatus }).unwrap();
  };

  const anyLoading = creating || updating || deleting || changingStatus;

  return (
    <ProtectedPage>
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">
                Products
              </h1>
            </div>
            <Button onClick={handleAddClick} disabled={anyLoading}>
              Add product
            </Button>
          </div>

          <ProductTable
            data={products}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onChangeStatus={handleChangeStatus}
          />

          <ProductFormDialog
            open={formOpen}
            onOpenChange={setFormOpen}
            initialProduct={editingProduct}
            onSubmit={handleFormSubmit}
            loading={creating || updating}
          />

          <ConfirmDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            title="Delete product"
            description={
              selectedProduct
                ? `Are you sure you want to delete "${selectedProduct.name}"? This action cannot be undone.`
                : ""
            }
            confirmLabel="Delete"
            destructive
            onConfirm={handleConfirmDelete}
          />

          <ConfirmDialog
            open={statusDialogOpen}
            onOpenChange={setStatusDialogOpen}
            title="Change product status"
            description={
              selectedProduct
                ? `Toggle status for "${selectedProduct.name}" between active and inactive.`
                : ""
            }
            confirmLabel="Change status"
            onConfirm={handleConfirmStatusChange}
          />
        </div>
      </div>
    </ProtectedPage>
  );
}
