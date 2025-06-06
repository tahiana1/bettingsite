import React from "react";
import type { Metadata } from "next";
import AdminRootLayout from "@/components/Admin/Layout";
import "@/styles/globals.css";
import 'quill/dist/quill.snow.css';
import DeviceTracker from "@/components/Common/DeviceTracker";
import AdminContent from "@/app/(admin)/AdminContent";

export const metadata: Metadata = {
  title: "Betting Admin",
  description: "Generated by Betting",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AdminRootLayout>
      <DeviceTracker />
      <AdminContent>
        {children}
      </AdminContent>
    </AdminRootLayout>
  );
}
