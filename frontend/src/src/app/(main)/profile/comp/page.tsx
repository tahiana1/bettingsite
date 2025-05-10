"use client";
 
import { Content } from "antd/es/layout/layout";
import React from "react";
 
import PointConversion from "@/components/Profile/PointConversion";

const CompPage: React.FC = () => {
  return (
    <Content className="p-4 overflow-y-auto h-[calc(100vh-70px)]">
      <PointConversion />
    </Content>
  );
};

export default CompPage;
