"use client";

import { Content } from "antd/es/layout/layout";
import React from "react";

import MyProfileForm from "@/components/Profile/ProfileForm";

const RoulettePage: React.FC = () => {
  return (
    <Content className="p-4 overflow-y-auto h-[calc(100vh-70px)]">
      <MyProfileForm />
    </Content>
  );
};

export default RoulettePage;
