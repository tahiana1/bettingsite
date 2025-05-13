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
        <LayoutContext.Provider
          value={{ isDarkTheme, collapsed, setCollapsed }}
        >
          <WebSocketTracker />
          <Head />
          <Layout className="min-h-screen" hasSider={false}>
            <Content>{children}</Content>
            {/* <Footer className="md:hidden !fixed bottom-0 w-full">Here is the footer</Footer> */}
          </Layout>
        </LayoutContext.Provider>
      </ConfigProvider>
    </ApolloProvider>
  ) : null;
}
