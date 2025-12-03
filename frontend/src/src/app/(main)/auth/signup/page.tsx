"use client";

import { Content } from "antd/es/layout/layout";
import React from "react";

import SignUp from "@/components/Auth/SignUp";
import { usePageTitle } from "@/hooks/usePageTitle";

const SignUpPage: React.FC = () => {
  usePageTitle("TOTOCLUB - Sign Up Page");
  return (
    <Content className="p-4 overflow-y-auto h-[calc(100vh-70px)]">
      <SignUp />
    </Content>
  );
};

export default SignUpPage;
