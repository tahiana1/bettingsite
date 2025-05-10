"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { Layout, Menu, theme } from "antd";
import type { MenuProps } from "antd";



import Link from "next/link"; 
import Logo from "@/assets/img/logo.png";
import Image from "next/image";

type MenuItem = Required<MenuProps>['items'][number];

const { Sider } = Layout;

type SidebarProps = {
  isDarkTheme: boolean;
  menu: MenuItem[];
};

const Sidebar: React.FC<SidebarProps> = ({ isDarkTheme, menu }) => {
  const router = useRouter();
  const { token } = theme.useToken();
 
  const [selectedkeys, setSelectedkeys] = useState<string[]>(["home"]);
  const onMenuClick = (e: MenuInfo) => {
    setSelectedkeys(e.keyPath);
    // console.log(e.key)
    router.push(e.key);
  };

  return (
    <Sider
      breakpoint="md"
      collapsedWidth="0"
      className="h-screen md:hidden"
      style={{
        background: isDarkTheme ? "" : token.colorBgContainer,
        zIndex: 1000,
        position: "absolute",
        top: 0,
      }}
    >
      <Link href={"/"} className="w-full justify-center flex">
        <Image src={Logo} width={120} height={40} alt="Toto Admin" />
      </Link>
      <Menu
        theme={isDarkTheme ? "dark" : "light"}
        mode="inline"
        defaultSelectedKeys={["event"]}
        selectedKeys={selectedkeys}
        items={menu}
        onClick={onMenuClick}
      />
    </Sider>
  );
};

export default Sidebar;
