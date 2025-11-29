"use client";

import { usePathname } from "next/navigation";
import { Search, Bell, SunMedium } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/src/lib/redux/hooks";

const Navbar = () => {
  const pathname = usePathname();
  const { user, isAuthenticated } = useAppSelector((s) => s.auth);

  if (!isAuthenticated || pathname === "/login") {
    return null;
  }

  const initials =
    user?.email
      ?.split("@")[0]
      ?.split(/[.\-_]/)
      .map((p) => p[0]?.toUpperCase())
      .join("") || "DU";

  return (
    <header className="h-14 border-b border-slate-200 bg-white">
      <div className="h-full flex items-center justify-between px-6 max-w-6xl mx-auto">
        {/* Search */}
        <div className="flex items-center gap-2 w-full max-w-md">
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-3 flex items-center">
              <Search className="w-4 h-4 text-slate-400" />
            </span>
            <Input
              className="pl-9 pr-3 h-9 text-sm"
              placeholder="Search products, categories..."
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            aria-label="Toggle theme"
          >
            <SunMedium className="w-4 h-4 text-slate-600" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="rounded-full relative"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4 text-slate-600" />
            <span className="absolute top-1.5 right-1.5 inline-flex h-2 w-2 rounded-full bg-red-500" />
          </Button>

          <div className="flex items-center gap-2 pl-2">
            <div className="h-8 w-8 rounded-full bg-slate-900 text-white text-xs flex items-center justify-center">
              {initials}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
