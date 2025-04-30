"use client";

import { Content } from "antd/es/layout/layout";
import React from "react";

import Login from "@/components/Admin/Login";

const LoginPage: React.FC = () => {
  return (
    <Content className="p-4 flex items-center overflow-y-auto h-screen justify-center">
      <Login />
    </Content>
  );
};

export default LoginPage;
