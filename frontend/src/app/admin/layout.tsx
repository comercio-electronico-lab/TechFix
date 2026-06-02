"use client";

import React from 'react';
import AdminSidebar from '@/components/layout/AdminSidebar';
import AdminNavbar from '@/components/admin/AdminNavbar';
import AdminFooter from '@/components/layout/AdminFooter';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-background min-h-screen">
      <AdminNavbar />
      <AdminSidebar />
      <main className="ml-64 pt-18 min-h-screen transition-all duration-300">
        <div className="max-w-container-max mx-auto p-gutter">
          {children}
        </div>
        <AdminFooter />
      </main>
    </div>
  );
}
