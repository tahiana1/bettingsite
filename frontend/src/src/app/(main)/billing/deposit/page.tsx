"use client";
import { useEffect, useState } from "react";
import { Content } from "antd/es/layout/layout";
import React from "react";
import DepositRequest from "@/components/Billing/DepositRequst";
import { useAtom } from "jotai";
import { userState } from "@/state/state";
import { useRouter } from "next/navigation";
import { Layout, message } from "antd";
import { useTranslations } from "next-intl";
import api from "@/api";
import Login from "@/components/Auth/Login";

const Deposit: React.FC = () => {
  const t = useTranslations();
  const [profile, setProfile] = useState<any>(null);
    const router = useRouter();
  
    // Check if user is logged in
  useEffect(() => {
    api("user/me").then((res) => {
      setProfile(res.data.profile);
    }).catch((err) => {
      console.log(err);
    });
  }, [profile]);
    
  return (
    <>
      {!profile?.userId ? (
        <Layout className="flex justify-center items-center h-[90vh]">
          <Login />
        </Layout>
      ) : (
        <Content className="p-4 overflow-y-auto h-[calc(100vh-40px)]">
          <DepositRequest />
        </Content>
      )}
    </>
  );
};

export default Deposit;
