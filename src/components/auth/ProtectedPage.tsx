"use client";

import { ReactNode, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAppSelector } from "@/src/lib/redux/hooks";

interface ProtectedPageProps {
  children: ReactNode;
}

export default function ProtectedPage({ children }: ProtectedPageProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, initialized } = useAppSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (!initialized) return;
    if (!isAuthenticated) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [initialized, isAuthenticated, router, pathname]);

  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-gray-500">
        Checking authentication...
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
