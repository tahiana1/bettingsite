"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { ApolloProvider } from "@apollo/client";
import client from "@/api/apollo-client-ws";

import {
  ConfigProvider,
  Layout,
  Menu,
  Avatar,
  Button,
  theme,
  Flex,
  Dropdown,
  Space,
  notification,
  Breadcrumb,
} from "antd";
import { List, MenuProps } from "antd";

import {
  MoonOutlined,
  SunOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
  UserOutlined,
  LogoutOutlined,
  CalculatorOutlined,
  InboxOutlined,
} from "@ant-design/icons";

import { BsRobot, BsSpeedometer2 } from "react-icons/bs";
import LayoutContext from "@/contexts/LayoutContextProvider";

import { useLocale, useTranslations } from "next-intl";
import LangSwitcher from "../Common/LangSwitcher";
import { currentAdminTheme, userState } from "@/state/state";
import { useAtom } from "jotai";
import api from "@/api";
import { ROUTES } from "@/routes";
import { Content } from "antd/es/layout/layout";
import Link from "next/link";
import { FaFootball, FaUsersGear } from "react-icons/fa6";
import { MdAnnouncement } from "react-icons/md";
import { SiDistrokid } from "react-icons/si";
import { BiDiamond, BiSupport } from "react-icons/bi";

import Image from "next/image";
import Logo from "@/assets/img/logo.png";

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
  const [isDarkTheme, setDarkTheme] = useAtom<boolean>(currentAdminTheme);
  const [isAdmin, setAdmin] = useState<boolean>(false);

  const [notiApi, contextHolder] = notification.useNotification();

  const t = useTranslations();
  const locale = useLocale();

  const [currentUser, setUser] = useAtom<any>(userState);

  const [data] = useState<{ label: string; value: number; color?: string }[]>([
    {
      label: "Honor Link",
      value: 2321,
      color: "cyan",
    },
    {
      label: "Deposit today",
      value: 0,
      color: "lightgreen",
    },
    {
      label: "Withdrawl today",
      value: 0,
      color: "tomato",
    },
    {
      label: "Betting today",
      value: 23210,
      color: "lightgreen",
    },
    {
      label: "Today's winner",
      value: 23212,
      color: "yellow",
    },
    {
      label: "User ammount",
      value: 2321234,
      color: "tomato",
    },
    {
      label: "User Points",
      value: 2322321,
      color: "lightgreen",
    },
    {
      label: "Total amount of distribution reserves",
      value: 94232321,
      color: "yellow",
    },
    {
      label: "Total points",
      value: 832321,
      color: "yellow",
    },
    {
      label: "Total loss",
      value: 4222321,
      color: "yellow",
    },
    {
      label: "Rolling the total",
      value: 200232321,
      color: "yellow",
    },
    {
      label: "Total sales loss today",
      value: 0,
      color: "tomato",
    },
    {
      label: "Today's distribution rolling",
      value: 0,
      color: "tomato",
    },
    {
      label: "Sports Pending Betting",
      value: 0,
      color: "lightgreen",
    },

    {
      label: "Sports Rebate Betting",
      value: 0,
      color: "lightgreen",
    },
  ]);

  const onLogout = () => {
    api("auth/logout", { method: "POST" }).then(() => {
      setUser({});
      localStorage.removeItem("token");
      router.push(ROUTES.admin.login);
    });
  };

  const sideBarItems: MenuProps["items"] = [
    {
      key: "home",
      label: (
        <List
          className="!text-white"
          header={"Home"}
          dataSource={data}
          renderItem={(item: any) => {
            return (
              <List.Item className={`!p-0 flex justify-between !items-end`}>
                <div style={{ color: item.color }}>{item.label}</div>
                <div style={{ color: item.color }}>{item.value}</div>
              </List.Item>
            );
          }}
        />
      ),
      type: "group",
    },
    {
      key: "manage",
      label: t("admin/menu/administrations"),
      type: "group",
    },
    {
      key: "admin/settlements",
      label: t("admin/menu/settlements"),
      icon: <CalculatorOutlined />,
      children: [
        {
          key: "admin/settlements/",
          label: `Home`,
        },
      ],
    },
    {
      key: "admin/financals",
      label: t("admin/menu/financals"),
      icon: <BiDiamond />,
      children: [
        {
          key: "/",
          icon: <BsRobot />,
          label: t("admin/menu/financals"),
        },
        {
          key: "dashboard",
          icon: <BsSpeedometer2 />,
          label: `Dashboard`,
        },
      ],
    },
    {
      key: "admin/partners",
      label: t("admin/menu/partners"),
      icon: <SiDistrokid />,
      children: [
        {
          key: "admin/partners/",
          label: t("admin/menu/partners"),
        },
        {
          key: "admin/partners/status",
          label: t("admin/menu/partnerStatus"),
        },
        {
          key: "admin/partners/domain",
          label: t("admin/menu/partnerDomain"),
        },
      ],
    },
    {
      key: "admin/users",
      label: t("admin/menu/users"),
      icon: <FaUsersGear />,
      children: [
        {
          key: "admin/users/",
          label: t("admin/menu/users"),
        },
        {
          key: "admin/users/pending",
          label: t(`admin/menu/pendings`),
        },
        {
          key: "admin/users/status",
          label: t(`admin/menu/userStatus`),
        },
        {
          key: "admin/users/logs",
          label: t(`admin/menu/logs`),
        },
        {
          key: "admin/users/activity",
          label: t(`admin/menu/activity`),
        },
      ],
    },
    {
      key: "admin/settings",
      label: t("admin/menu/settings"),
      icon: <SettingOutlined />,
      children: [
        {
          key: "admin/settings/site",
          label: t("admin/menu/siteSetting"),
        },
        {
          key: "admin/settings/global",
          label: t("admin/menu/globalSetting"),
        },
        {
          key: "admin/settings/design",
          label: t("admin/menu/designSetting"),
        },
        {
          key: "admin/settings/menu",
          label: t("admin/menu/menuSetting"),
        },
        {
          key: "admin/settings/domain",
          label: t("admin/menu/domainSetting"),
        },
        {
          key: "admin/settings/auth",
          label: t("admin/menu/authSetting"),
        },
        {
          key: "admin/settings/alarm",
          label: t("admin/menu/alarmSetting"),
        },
        {
          key: "admin/settings/popup",
          label: t("admin/menu/popupSetting"),
        },
        {
          key: "admin/settings/bank",
          label: t("admin/menu/bankSetting"),
        },
      ],
    },
    {
      key: "game",
      label: t("admin/menu/game"),
      type: "group",
    },
    {
      key: "admin/game/sports",
      label: t("admin/menu/sports"),
      icon: <FaFootball />,
      children: [
        {
          key: "admin/game/sports/",
          label: t("admin/menu/sports"),
        },
      ],
    },
    {
      key: "board",
      label: t("admin/menu/board"),
      type: "group",
    },
    {
      key: "admin/board",
      label: t("admin/menu/bulletins"),
      icon: <MdAnnouncement />,
      children: [
        {
          key: "admin/board/announcements",
          label: t("admin/menu/announcements"),
        },
        {
          key: "admin/board/notifications",
          label: t("admin/menu/notifications"),
        },
        {
          key: "admin/board/events",
          label: t("admin/menu/events"),
        },
      ],
    },
    {
      key: "admin/support",
      label: t("admin/menu/customSupport"),
      icon: <BiSupport />,
      children: [
        {
          key: "admin/support/p2p",
          label: t("admin/menu/p2p"),
        },
        {
          key: "admin/support/events",
          label: t("admin/menu/events"),
        },
      ],
    },
    {
      key: "admin/inbox",
      label: t("admin/menu/inbox"),
      icon: <InboxOutlined />,
      children: [
        {
          key: "admin/inbox/custom",
          label: t("admin/menu/inbox"),
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
      onClick: onLogout,
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
    router.push("/" + e.key);
    // router.push("/" + e.keyPath.reverse().join("/"));
  };

  useEffect(() => {
    api("user/me")
      .then((result) => {
        if (result.data.role === "A") {
          setAdmin(true);
          setUser(result.data);
          // router.push(ROUTES.admin.home);
        } else {
          setAdmin(false);
          router.push(ROUTES.admin.login);
          notiApi.error({
            message: "Error",
            description: "You are not able to access to Admin page!",
          });
        }
        localStorage.setItem("token", result.token);
      })
      .catch((err) => {
        console.log({ err }, ROUTES.admin.login);
        router.push(ROUTES.admin.login);
      });
    return () => {};
  }, []);

  useEffect(() => {
    setMount(true);
    setDarkTheme(false);
    document.documentElement.classList.remove("dark");
  }, []);
  useEffect(() => {
    if (currentUser?.role === "A") {
      setAdmin(true);
    } else {
      setAdmin(false);
    }
  }, [currentUser]);
  return mounted ? (
    <ApolloProvider client={client}>
      <ConfigProvider
        theme={{
          token: {
            borderRadius: 0,
            motion: false,
          },
          components: {
            Card: {
              headerHeight: 40,
              bodyPadding: 16,
            },
          },
          algorithm: isDarkTheme ? theme.darkAlgorithm : theme.defaultAlgorithm,
        }}
      >
        {contextHolder}
        <LayoutContext.Provider
          value={{ isDarkTheme, collapsed, setCollapsed }}
        >
          <Layout>
            {isAdmin ? (
              <Sider
                className="h-screen !absolute md:!relative z-50 top-0"
                breakpoint="md"
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
                <Space
                  direction="vertical"
                  className="h-screen overflow-y-auto"
                >
                  <div
                    className="h-10 justify-center items-center text-center p-6 cursor-pointer flex"
                    onClick={() => {
                      setSelectedkeys(["admin"]);
                      router.push("/admin");
                    }}
                  >
                    <Image src={Logo} height={40} alt="Toto Admin" />
                  </div>

                  <Menu
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={["admin"]}
                    selectedKeys={selectedkeys}
                    items={sideBarItems}
                    onClick={onMenuClick}
                    className="!text-white"
                  />
                </Space>
              </Sider>
            ) : null}
            <Layout className="min-h-screen">
              {isAdmin ? (
                <Header
                  className="w-full !px-2 flex !h-10 items-center !leading-10"
                  style={{ background: isDarkTheme ? "" : colorBgContainer }}
                >
                  <Button
                    type="text"
                    icon={
                      collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />
                    }
                    onClick={() => setCollapsed(!collapsed)}
                    className="!w-10 !h-10 text-base !hidden lg:!block"
                  />
                  <Space className="w-full">Admin</Space>
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
                      className="!w-10 !h-10 text-base invisible lg:visible"
                    />
                    <Dropdown
                      className="w-32 flex gap-2 items-center"
                      menu={{ items: profileItems }}
                      placement="bottomRight"
                      trigger={["click"]}
                    >
                      <Button type="text" className="!h-10">
                        <Avatar icon={<UserOutlined />} className="w-8 h-8" />
                        {currentUser.name}
                      </Button>
                    </Dropdown>
                  </Flex>
                </Header>
              ) : null}
              {isAdmin ? (
                <Breadcrumb
                  className="!p-2 shadow"
                  items={[
                    {
                      title: <Link href="/admin">Home</Link>,
                    },
                    {
                      title: <Link href="/admin">Dashboard</Link>,
                    },
                  ]}
                />
              ) : null}
              <Content className="p-2">{children}</Content>
            </Layout>
          </Layout>
        </LayoutContext.Provider>
      </ConfigProvider>
    </ApolloProvider>
  ) : (
    "LOADING..."
  );
}
