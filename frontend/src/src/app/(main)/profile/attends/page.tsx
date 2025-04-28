"use client";
 
import { Content } from "antd/es/layout/layout";
import React from "react";
 
import Attend from "@/components/Profile/Attend";

const AttendPage: React.FC = () => {
  return (
    <Content className="p-4 overflow-y-auto h-[calc(100vh-70px)]">
      <Attend />
    </Content>
  );
};

export default AttendPage;
