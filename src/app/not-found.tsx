"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-linear-to-b from-slate-50 to-slate-100 px-6">
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-lg ring-1 ring-black/5">
        <Search className="h-12 w-12 text-slate-400" />
      </div>

      <h1 className="text-7xl font-extrabold text-slate-800 tracking-tight">
        404
      </h1>

      <p className="mt-3 text-lg text-slate-600 max-w-md text-center">
        Ops! The page you are looking for does not exist.
      </p>

      <div className="mt-8 flex items-center gap-3">
        <Button asChild variant="default" className="px-5">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Home
          </Link>
        </Button>

        <Button asChild variant="outline" className="px-5">
          <Link href="/products">View Products</Link>
        </Button>
      </div>

      <p className="mt-10 text-xs text-slate-400">
        Realtime Products Dashboard
      </p>
    </div>
  );
}
