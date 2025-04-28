"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  ConfigProvider,
  Layout,
  Menu,
  Avatar,
  Button,
  theme,
  Flex,
  Dropdown,
} from "antd";
import type { MenuProps } from "antd";
import { MenuInfo } from "@/types";

import {
  MoonOutlined,
  SunOutlined,
  SettingOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

import LayoutContext from "@/contexts/LayoutContextProvider";
// import { wsURL } from "@/api";

import { Content } from "antd/es/layout/layout";
import Link from "next/link";
import LangSwitcher from "./Common/LangSwitcher";
import { useLocale, useTranslations } from "next-intl";
import { IoBasketball, IoFootball } from "react-icons/io5";
import { ImFeed } from "react-icons/im";
import { MdEvent, MdSportsVolleyball } from "react-icons/md";
import RecoilContextProvider from "@/contexts/JotaiContextProvider";
import { BiMoneyWithdraw, BiNotification } from "react-icons/bi";
import { CiMoneyBill } from "react-icons/ci";
import { BsChat } from "react-icons/bs";
import WebSocketTracker from "./Common/WebSocketTracker";

const { Header } = Layout;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const { token } = theme.useToken();
  const [mounted, setMount] = useState<boolean>(false);
  const [collapsed, setCollapsed] = useState<boolean>(true);
  const [selectedkeys, setSelectedkeys] = useState<string[]>(["home"]);
  const [isDarkTheme, setDarkTheme] = useState<boolean>(true);
  const t = useTranslations();
  const locale = useLocale();

  const sideBarItems: MenuProps["items"] = [
    {
      key: "national",
      label: t("menu/national"),
      icon: <IoFootball />,
    },
    {
      key: "international",
      label: t("menu/international"),
      icon: <IoBasketball />,
    },
    {
      key: "live",
      label: t("menu/live"),
      icon: <ImFeed />,
    },
    {
      key: "special",
      label: t("menu/special"),
      icon: <MdSportsVolleyball />,
    },
    {
      key: "history",
      label: t("menu/invest"),
      icon: <MdSportsVolleyball />,
    },
    {
      key: "billing/deposit",
      label: t("menu/deposit"),
      icon: <CiMoneyBill />,
    },
    {
      key: "billing/withdraw",
      label: t("menu/withdraw"),
      icon: <BiMoneyWithdraw />,
    },
    {
      key: "events",
      label: t("menu/events"),
      icon: <MdEvent />,
    },
    {
      key: "notifications",
      label: t("menu/notifications"),
      icon: <BiNotification />,
    },
    {
      key: "livechat",
      label: t("menu/livechat"),
      icon: <BsChat />,
    },
  ];

  const profileItems: MenuProps["items"] = [
    {
      key: "myprofile",
      icon: <UserOutlined />,
      label: `Profile`,
    },
    {
      key: "setting",
      icon: <SettingOutlined />,
      label: `Setting`,
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: `Logout`,
    },
  ];

  const onThemeChange = () => {
    if (!isDarkTheme) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    setDarkTheme(!isDarkTheme);
  };
  const onMenuClick = (e: MenuInfo) => {
    setSelectedkeys(e.keyPath);
    // router.push("/" + e.key);
    router.push("/");
  };

  useEffect(() => {
    setMount(true);
  }, []);
  return mounted ? (
    <ConfigProvider
      theme={{
        token: {
          borderRadius: 0,
          motion: false,
        },
        algorithm: isDarkTheme ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }}
    >
      <RecoilContextProvider>
        <LayoutContext.Provider
          value={{ isDarkTheme, collapsed, setCollapsed }}
        >
          <Layout>
            <WebSocketTracker />
            <Layout className="min-h-screen">
              <Header
                className="w-full flex !h-10 items-center !leading-10"
                style={{
                  background: isDarkTheme ? "" : token.colorBgContainer,
                  position: "sticky",
                  top: 0,
                  zIndex: 1000,
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Link href={"/"}>
                  <div className="p-4">Logo</div>
                </Link>
                {/* <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                className="!w-10 h-10 text-base invisible lg:visible"
              /> */}
                <Menu
                  theme={isDarkTheme ? "dark" : "light"}
                  mode="horizontal"
                  defaultSelectedKeys={["event"]}
                  selectedKeys={selectedkeys}
                  items={sideBarItems}
                  onClick={onMenuClick}
                  className="w-full"
                />
                <Flex
                  align="flex-end"
                  justify="space-between"
                  className="gap-2 items-center"
                >
                  <LangSwitcher locale={locale} />
                  <Button
                    type="text"
                    icon={isDarkTheme ? <SunOutlined /> : <MoonOutlined />}
                    onClick={onThemeChange}
                    className=" text-base"
                  />
                  <Dropdown
                    menu={{ items: profileItems }}
                    placement="bottomRight"
                    trigger={["click"]}
                    className="!hidden"
                  >
                    <Avatar src={<UserOutlined />} className="w-8 h-8" />
                  </Dropdown>
                </Flex>
              </Header>
              <Content>{children}</Content>
            </Layout>
          </Layout>
        </LayoutContext.Provider>
      </RecoilContextProvider>
    </ConfigProvider>
  ) : null;
}
