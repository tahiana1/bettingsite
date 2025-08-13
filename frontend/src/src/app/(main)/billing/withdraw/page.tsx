"use client";

import { Content } from "antd/es/layout/layout";
import React, { useEffect, useState } from "react";
import WithdrawRequest from "@/components/Billing/WithdrawRequst";
import { Layout, message } from "antd";
import { userState } from "@/state/state";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import api from "@/api";
import Login from "@/components/Auth/Login";

const Deposit: React.FC = () => {
  const t = useTranslations();
  const [profile, setProfile] = useState<any>(null);
  const router = useRouter();
  const checkoutModal = (modal: string) => {
    console.log(modal);
  }
  useEffect(() => {
    api("user/me").then((res) => {
      setProfile(res.data.profile);
    }).catch((err) => {
      console.log(err);
    });
  }, []);
    // Check if user is logged in
    
  return (
    <>
      {!profile?.userId ? (
        <Layout className="flex justify-center items-center h-[90vh]">
          <Login />
        </Layout>
      ) : (
        <Content className="p-4 overflow-y-auto h-[calc(100vh-40px)]">
          <WithdrawRequest checkoutModal={() => {}} />
        </Content>
      )}
    </>
  );
};

export default Deposit;
