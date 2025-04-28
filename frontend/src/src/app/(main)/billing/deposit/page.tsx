"use client";

import { Content } from "antd/es/layout/layout";
import React from "react";
import DepositRequest from "@/components/Billing/DepositRequst";

const Deposit: React.FC = () => {
  return (
    <Content className="p-4 overflow-y-auto h-[calc(100vh-40px)]">
      <DepositRequest />
    </Content>
  );
};

export default Deposit;
