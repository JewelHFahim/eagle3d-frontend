import type { Metadata } from "next";
import { AppProviders } from "./providers";
import AppSidebar from "../components/layout/AppSidebar";
import Navbar from "../components/layout/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Eagle 3D Products",
  description: "Realtime product management app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50 h-screen overflow-hidden">
        <AppProviders>
          <div className="flex h-full">
            <AppSidebar />
            <div className="flex flex-1 flex-col overflow-hidden">
              <Navbar />
              <main className="flex-1 overflow-y-auto">
                {children}
              </main>
            </div>
          </div>
        </AppProviders>
      </body>
    </html>
  );
}
