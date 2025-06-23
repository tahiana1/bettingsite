"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

import { Layout, Menu, Avatar, Button, theme, Dropdown } from "antd";
import type { MenuProps } from "antd";

import {
  MoonOutlined,
  SunOutlined,
  SettingOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

import { useQuery } from "@apollo/client";

import LangSwitcher from "./Common/LangSwitcher";
import { useLocale, useTranslations } from "next-intl";
import { currentTheme, userState } from "@/state/state";
import { useAtom } from "jotai";
import api from "@/api";
import Logo from "@/assets/img/logo.png";
import Image from "next/image";
import { GET_USER_MENU } from "@/actions/menu";
import Sidebar from "./Sidebar";
import Link from "next/link";

const { Header } = Layout;

const Head = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { token } = theme.useToken();
  const [profile, setProfile] = useAtom<any>(userState);

  const t = useTranslations();
  const locale = useLocale();
  console.log({ locale });
  const [selectedkeys, setSelectedkeys] = useState<string[]>(["home"]);
  const [isDarkTheme, setDarkTheme] = useAtom<boolean>(currentTheme);
  const [menu, setMenu] = useState<any[]>([]);
  const { data } = useQuery(GET_USER_MENU, {
    variables: {
      filters: [
        {
          field: "status",
          value: "true",
          op: "eq",
        },
      ],
    },
  });
  const onMenuClick = (e: MenuInfo) => {
    setSelectedkeys(e.keyPath);
    console.log(e.key, 'e.key');
    if (pathname === e.key) {
      router.refresh();
    } else {
      if (pathname === "/billing/deposit" || pathname === "/billing/withdraw" || pathname === "/profile/point") {
        router.push("../" + e.key);
      } else {
        router.push(e.key as string);
      }
    }
  };

  const onLogout = () => {
    api("auth/logout", { method: "POST" }).then((res) => {
      if (res) {
        setProfile({});
      }
    });
  };

  const onThemeChange = () => {
    if (!isDarkTheme) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    setDarkTheme(!isDarkTheme);
  };

  const profileItems: MenuProps["items"] = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: t(`profile`),
      onClick: (e: MenuInfo) => {
        console.log({ e });
        setSelectedkeys(e.keyPath);
        router.push("/" + e.key);
      },
    },
    {
      key: "setting",
      icon: <SettingOutlined />,
      label: t(`setting`),
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: t(`auth/logout`),
      onClick: onLogout,
    },
  ];

  useEffect(() => {
    if (isDarkTheme) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkTheme]);

  useEffect(() => {
    if (data) {
      setMenu(
        data.response.map((m: Menu) => ({
          key: m.key,
          label: t(m.label.toLowerCase()),
          icon: <span className={"icon-" + m.icon}></span>,
          path: m.path,
          children: m.children
        })) ?? []
      );
    }
  }, [data, locale]);
  return (
    <>
      <Header
        className="w-full !flex !h-13 items-center !leading-10 gap-1 overflow-y-hidden overflow-x-auto !fixed md:!sticky justify-between"
        style={{
          background: isDarkTheme ? "" : token.colorBgContainer,
          position: "sticky",
          top: 0,
          zIndex: 1000,
          width: "100%",
          // display: "flex",
          alignItems: "center",
        }}
      >
        <Link href="/" className="min-w-[123px]">
          <Image src={Logo} width={123} height={45} alt="Toto Admin"  className=" cursor-pointer"/>
        </Link>
        
        <Menu
          className="!hidden md:!flex !w-[calc(100vw-230px)]"
          theme={isDarkTheme ? "dark" : "light"}
          mode="horizontal"
          defaultSelectedKeys={["event"]}
          selectedKeys={selectedkeys}
          items={menu}
          onClick={onMenuClick}
        />
        <LangSwitcher locale={locale} />
        <Button
          type="text"
          icon={isDarkTheme ? <SunOutlined /> : <MoonOutlined />}
          onClick={onThemeChange}
          className="!h-10 text-base px-4"
        />
        {profile?.id ? (
          <Dropdown
            menu={{ items: profileItems }}
            placement="bottomRight"
            trigger={["click"]}
            // className="!hidden"
            className="flex gap-2 items-center"
          >
            <Button type="text" className="!h-10">
              <Avatar icon={<UserOutlined />} className="w-8 h-8" />
              {/* {profile.name} */}
            </Button>
          </Dropdown>
        ) : null}
      </Header>
      <Sidebar isDarkTheme={isDarkTheme} menu={menu} />
    </>
  );
};

export default Head;
