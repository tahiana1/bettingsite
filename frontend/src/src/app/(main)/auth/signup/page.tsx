"use client";

import { Content } from "antd/es/layout/layout";
import React from "react";

import SignUp from "@/components/Auth/SignUp";

const SignUpPage: React.FC = () => {
  return (
    <Content className="p-4 overflow-y-auto h-[calc(100vh-70px)]">
      <SignUp />
    </Content>
  );
};

export default SignUpPage;
