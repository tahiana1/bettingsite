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
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

import {
  BsRobot,
  BsSpeedometer2,
  BsShield,
  BsNewspaper,
  BsCheck2Square,
  BsPeopleFill,
  BsCalendarEvent,
  BsCalendar2Check,
} from "react-icons/bs";
import Image from "next/image";
import LayoutContext from "@/contexts/LayoutContextProvider";

import ProfileImage from "../assets/avatars/nic.webp";
import { useLocale, useTranslations } from "next-intl";
import LangSwitcher from "./Common/LangSwitcher";

const { Header, Sider } = Layout;

export default function AdminRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const [mounted, setMount] = useState<boolean>(false);
  const [collapsed, setCollapsed] = useState<boolean>(true);
  const [selectedkeys, setSelectedkeys] = useState<string[]>(["home"]);
  const [isDarkTheme, setDarkTheme] = useState<boolean>(true);

  const t = useTranslations();
  const locale = useLocale();

  const sideBarItems: MenuProps["items"] = [
    {
      key: "page",
      label: t("menu/international"),
      icon: <BsCalendarEvent />,
      children: [
        {
          key: "",
          icon: <BsRobot />,
          label: `Home`,
        },
        {
          key: "dashboard",
          icon: <BsSpeedometer2 />,
          label: `Dashboard`,
        },
      ],
    },
    {
      key: "today",
      label: t("menu/national"),
      icon: <BsCalendar2Check />,
      children: [
        {
          key: "leads",
          icon: <BsPeopleFill />,
          label: `Leads`,
        },
        {
          key: "news",
          icon: <BsNewspaper />,
          label: `News`,
        },
        {
          key: "tasks",
          icon: <BsCheck2Square />,
          label: `Tasks`,
        },
        {
          key: "competition",
          icon: <BsShield />,
          label: `Competition`,
        },
      ],
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
    router.push("/" + e.keyPath.reverse().join("/"));
  };
  const renderMenu = () => {
    return (
      <>
        <div
          className="h-16 justify-center items-center text-center p-6 cursor-pointer flex"
          onClick={() => {
            setSelectedkeys(["home"]);
            router.push("/home");
          }}
        >
          {/* <Image src={Logo} alt="L" width={76} height={61} /> */}
          Admin
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["home"]}
          selectedKeys={selectedkeys}
          items={sideBarItems}
          onClick={onMenuClick}
        />
      </>
    );
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
      <LayoutContext.Provider value={{ isDarkTheme, collapsed, setCollapsed }}>
        <Layout hasSider>
          <Sider
            breakpoint="lg"
            collapsedWidth="0"
            collapsed={collapsed}
            onBreakpoint={(broken) => {
              console.log(broken);
            }}
            onCollapse={(collapsed, type) => {
              console.log(collapsed, type);
              setCollapsed(collapsed);
            }}
          >
            {/* <div className="demo-logo-vertical" /> */}
            {renderMenu()}
          </Sider>
          <Layout className="min-h-screen">
            <Header
              className="w-full flex h-10 items-center leading-10 pl-1"
              style={{ background: isDarkTheme ? "" : colorBgContainer }}
            >
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                className="!w-10 h-10 text-base hidden lg:block"
              />
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
                  className="!w-10 h-10 text-base invisible lg:visible"
                />
                <Dropdown
                  menu={{ items: profileItems }}
                  placement="bottomRight"
                  trigger={["click"]}
                >
                  <Avatar
                    src={<Image src={ProfileImage} alt="" />}
                    className="w-8 h-8"
                  />
                </Dropdown>
              </Flex>
            </Header>
            {children}
          </Layout>
        </Layout>
        {/* </WebSocketProvider> */}
      </LayoutContext.Provider>
    </ConfigProvider>
  ) : (
    "loading..."
  );
}
