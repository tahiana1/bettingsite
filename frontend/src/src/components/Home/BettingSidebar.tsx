"use client";

import React from "react";
import { Space } from "antd";

import { useAtom } from "jotai";
import { userState, rateState } from "@/state/state";
import BettingCart from "@/components/Home/BettingCart"; 

const BettingSidebar: React.FC = () => {
  const [user] = useAtom<any>(userState);
  const [currentRates] = useAtom<any[]>(rateState);

  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      {user?.id && currentRates.length > 0 ? <BettingCart /> : null}
    </Space>
  );
};

export default BettingSidebar;
