"use client";

import { Content } from "antd/es/layout/layout";
import React from "react";

import Login from "@/components/Admin/Login";

const SignUpPage: React.FC = () => {
  return (
    <Content className="p-4 flex items-center overflow-y-auto h-[calc(100vh-70px)] justify-center">
      <Login />
    </Content>
  );
};

export default SignUpPage;
