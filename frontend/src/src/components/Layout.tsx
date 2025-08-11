"use client";
import { useEffect, useState } from "react";

import { ConfigProvider, Layout, theme } from "antd";

import { ApolloProvider } from "@apollo/client";
import client from "@/api/apollo-client-ws";

import LayoutContext from "@/contexts/LayoutContextProvider";

import { Content } from "antd/es/layout/layout";
import WebSocketTracker from "./Common/WebSocketTracker";
import { currentTheme } from "@/state/state";
import { useAtom } from "jotai";
import Head from "./Header";
import Loading from "@/assets/img/main/loader.png";
import Image from "next/image";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [mounted, setMount] = useState<boolean>(false);
  const [collapsed, setCollapsed] = useState<boolean>(true);
  const [isDarkTheme] = useAtom<boolean>(currentTheme);

  useEffect(() => {
    setMount(true);
  }, []);

  useEffect(() => {
    if (isDarkTheme) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkTheme]);
  return mounted ? (
    <ApolloProvider client={client}>
      <ConfigProvider
        theme={{
          token: {
            borderRadius: 0,
            motion: false,
            fontSize: 12,
          },
          algorithm: isDarkTheme ? theme.darkAlgorithm : theme.defaultAlgorithm,
        }}
      >
        <WebSocketTracker />
          <Head />
          <Layout hasSider={false} style={{background: 'transparent'}}>
            <Content>{children}</Content>
          </Layout>
      </ConfigProvider>
    </ApolloProvider>
  ) : (
    <div className="flex justify-center bg-[#0b0600] items-center h-screen">
      <Image src={Loading} alt="Toto Admin" width={70} height={70} className="animate-spin" />
    </div>
  );
}
