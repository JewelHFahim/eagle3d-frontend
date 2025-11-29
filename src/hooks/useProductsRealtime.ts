"use client";

import { useEffect } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { Product, ProductStatus, setProducts } from "../lib/redux/features/productsSlice";
import { useAppDispatch } from "../lib/redux/hooks";
import { db } from "../lib/firebase";
export function useProductsRealtime() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const q = query(
      collection(db, "products"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot( q,
      (snapshot) => {
        const items: Product[] = snapshot.docs.map((doc) => {
          const data = doc.data() as any;

          return {
            id: doc.id,
            name: data.name,
            sku: data.sku,
            price: data.price,
            stock: data.stock,
            category: data.category,
            status: data.status as ProductStatus,
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : "",
            updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : "",
          };
        });
        dispatch(setProducts(items));
      },
      (error) => {
        console.error("Firestore subscription error:", error);
      }
    );

    return () => unsubscribe();
  }, [dispatch]);
}
