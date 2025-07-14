"use client";

import { Content } from "antd/es/layout/layout";
import { Layout } from "antd";
import React, { useEffect, useState } from "react";

import MyProfileForm from "@/components/Profile/ProfileForm";
import api from "@/api";
import Login from "@/components/Auth/Login";

const RoulettePage: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  useEffect(() => {
    api("user/me").then((res) => {
      setProfile(res.data.profile);
    }).catch((err) => {
      console.log(err);
    });
  }, []);
  return (
    <>
      {!profile?.userId ? (
        <Layout className="flex justify-center items-center h-[90vh]">
          <Login />
        </Layout>
      ) : (
        <Content className="p-4 overflow-y-auto h-[calc(100vh-70px)]">
          <MyProfileForm />
        </Content>
      )}
    </>
  );
};

export default RoulettePage;
