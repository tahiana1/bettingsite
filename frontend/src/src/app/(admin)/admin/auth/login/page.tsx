"use client";

import { Content } from "antd/es/layout/layout";
import React from "react";

import Login from "@/components/Admin/Login";

const LoginPage: React.FC = () => {
  return (
    <Content className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#0a0504] via-[#160d0c] to-[#1a120f] p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#edd497] opacity-5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#c9a972] opacity-5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-[#e3b27f] opacity-5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(237,212,151,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(237,212,151,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
      
      <div className="relative z-10 w-full max-w-md">
        <Login />
      </div>
    </Content>
  );
};

export default LoginPage;
