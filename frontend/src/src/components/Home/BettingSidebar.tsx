"use client";

import React from "react";
import { Space } from "antd";

import { useAtom } from "jotai";
import { userState } from "@/state/state";
import ProfileCard from "@/components/Home/ProfileCard";
import BettingCart from "@/components/Home/BettingCart";

const BettingSidebar: React.FC = () => {
  const [user] = useAtom<any>(userState);

  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <ProfileCard />

      {user?.id ? <BettingCart /> : null}
    </Space>
  );
};

export default BettingSidebar;
