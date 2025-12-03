"use client";
import React from "react";
import { usePathname } from "next/navigation";
import { Content } from "antd/es/layout/layout";

export default function PartnerContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const contentHeightClass = pathname.includes('/partner/popup') || pathname.includes('/partner/auth/login')
    ? 'h-[100vh]'
    : 'h-[calc(100vh-100px)]';

  return (
    <Content className={`overflow-auto ${contentHeightClass} dark:bg-black`}>
      {children}
    </Content>
  );
} 
