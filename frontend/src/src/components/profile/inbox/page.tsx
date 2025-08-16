"use client";

import { Content } from "antd/es/layout/layout";
import React from "react";

import Inbox from "@/components/Profile/Inbox";

const InboxPage: React.FC = () => {
  return (
    <Content className="p-4 overflow-y-auto h-[calc(100vh-70px)]">
      <Inbox />
    </Content>
  );
};

export default InboxPage;
