"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import clsx from "clsx";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/src/lib/redux/hooks";
import { useLogoutMutation } from "@/src/lib/redux/services/authApi";
import { resetAuth } from "@/src/lib/redux/features/authSlice";
import Image from "next/image";

const AppSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((s) => s.auth);

  const [logout, { isLoading }] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
    } finally {
      dispatch(resetAuth());
      router.replace("/login");
    }
  };

  if (!isAuthenticated || pathname === "/login") {
    return null;
  }

  const navItemClass = (href: string) =>
    clsx(
      "flex items-center px-4 py-2 mt-2 text-sm font-medium rounded-lg transition-colors duration-200",
      pathname.startsWith(href)
        ? "bg-gray-100 text-gray-900"
        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
    );

  const avatarName = user?.email?.split("@")[0] || "Demo User";
  const avatarEmail = user?.email || "demo@example.com";

  return (
    <aside className="flex flex-col w-64 h-screen px-4 py-6 overflow-y-auto bg-white border-r border-gray-200">
      {/* Logo */}
      <div className="flex items-center justify-center">
        <span className="text-lg font-semibold tracking-tight">
          Eagle3D Products
        </span>
      </div>

      {/* User */}
      <div className="flex flex-col items-center mt-6 -mx-2">

        <div  className=" w-20 h-20 mx-2 rounded-full relative overflow-hidden">
          <Image src="/avatar.avif" alt="avatar" fill className="object-cover"/>
        </div>

        <h4 className="mx-2 mt-3 text-sm font-semibold text-gray-800">
          {avatarName}
        </h4>
        <p className="mx-2 mt-1 text-xs text-gray-500">{avatarEmail}</p>
      </div>

      {/* Nav */}
      <div className="flex flex-col justify-between flex-1 mt-6">
        <nav className="space-y-1">
          <Link href="/products" className={navItemClass("/products")}>
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 11H5M19 11C20.1046 11 21 11.8954 21 13V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V13C3 11.8954 3.89543 11 5 11M19 11V9C19 7.89543 18.1046 7 17 7M5 11V9C5 7.89543 5.89543 7 7 7M7 7V5C7 3.89543 7.89543 3 9 3H15C16.1046 3 17 3.89543 17 5V7M7 7H17"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <span className="mx-3">Products</span>
          </Link>

          <Link href="/analytics" className={navItemClass("/analytics")}>
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5 12L9 8L13 12L19 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M19 10V6H15"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <span className="mx-3">Analytics</span>
          </Link>
        </nav>

        <div className="mt-6 border-t border-gray-200 pt-4">
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-center"
            onClick={handleLogout}
            disabled={isLoading}
          >
            {isLoading ? "Logging out..." : "Logout"}
          </Button>
        </div>
      </div>
    </aside>
  );
};

export default AppSidebar;
