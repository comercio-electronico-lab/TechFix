"use client";

import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { usePathname } from "next/navigation";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <>
      <Navbar />
      <main className={`flex-1 ${isHome ? "" : "pt-[72px]"}`}>
        {children}
      </main>
      <Footer />
    </>
  );
}
