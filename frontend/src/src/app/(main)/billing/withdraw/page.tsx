"use client";

import { Content } from "antd/es/layout/layout";
import React from "react";
import WithdrawRequest from "@/components/Billing/WithdrawRequst";

const Deposit: React.FC = () => {
  return (
    <Content className="p-4 overflow-y-auto h-[calc(100vh-40px)]">
      <WithdrawRequest />
    </Content>
  );
};

export default Deposit;
