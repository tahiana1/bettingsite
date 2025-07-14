"use client";

import { Content } from "antd/es/layout/layout";
import React from "react";
import WithdrawRequest from "@/components/Billing/WithdrawRequst";
import { message } from "antd";
import { userState } from "@/state/state";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

const Deposit: React.FC = () => {
  const t = useTranslations();
  const [profile] = useAtom(userState);
    const router = useRouter();
  
    // Check if user is logged in
    if (!profile?.userId) {
      message.warning(t("partner/menu/pleaseLogin"));
      router.push("/auth/signIn");
      return;
    }
  return (
    <Content className="p-4 overflow-y-auto h-[calc(100vh-40px)]">
      <WithdrawRequest />
    </Content>
  );
};

export default Deposit;
