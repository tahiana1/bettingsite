"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

import { Layout, Menu, Avatar, Button, theme, Dropdown, message } from "antd";
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
import BannerRight from "@/assets/img/main/home-hero-img.png";
import Jackpot from "@/assets/img/main/progressive-jackpot-img.png";
import casinoActiveIcon from "@/assets/img/btn/casino-tab1.png";
import casinoGameIcon from "@/assets/img/btn/casino-tab2.png";
import slotActiveIcon from "@/assets/img/btn/slot-tab1.png";
import slotGameIcon from "@/assets/img/btn/slot-tab2.png";
import miniActiveIcon from "@/assets/img/btn/mini-tab1.png";
import miniGameIcon from "@/assets/img/btn/mini-tab2.png";

const { Header } = Layout;

const Head = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { token } = theme.useToken();
  const [profile, setProfile] = useAtom<any>(userState);

  const t = useTranslations();
  const locale = useLocale();
  
  // Real-time jackpot counter state
  const [jackpotAmount, setJackpotAmount] = useState((new Date()).getTime()/1200);
  const [selectedkeys, setSelectedkeys] = useState<string[]>(["home"]);

  const [activeTab, setActiveTab] = useState<string>("casino");

  // Real-time jackpot updater
  useEffect(() => {
    const interval = setInterval(() => {
      setJackpotAmount(prev => prev + (Math.floor(Math.random() * 15) + 5) * 2);
    }, 50); // Update every 50ms for smooth real-time effect

    return () => clearInterval(interval);
  }, []);



  useEffect(() => {
    const path = pathname.split("/")[1];
    console.log(path, 'path');
    if (path === "") {
      setActiveTab("casino");
    } else if (path === "slot") {
      setActiveTab("slot");
    } else if (path === "mini") {
      setActiveTab("mini");
    }
  }, [pathname]);

  // Format number with commas and milliseconds simulation
  const formatJackpot = (amount: number) => {
    return amount.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  };
  const [isDarkTheme, setDarkTheme] = useAtom<boolean>(currentTheme);
  const [menu, setMenu] = useState<any[]>([
    {
      key: "home",
      label: t(`home`),
    },
    {
      key: "casino",
      label: t(`casino`),
    },
    {
      key: "event",
      label: t(`event`),
    },
    {
      key: "bulletin",
      label: t(`bulletin`),
    }
  ]);

  const onMenuClick = (e: MenuInfo) => {
    setSelectedkeys(e.keyPath);
    console.log(e.key, 'e.key');
    if (pathname === e.key) {
      router.refresh();
    } else {
      router.push(e.key as string);
    }
  };

  const onLogout = () => {
    api("auth/logout", { method: "POST" }).then((res) => {
      if (res) {
        setProfile({});
      }
    });
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

  return (
    <div>
      <header className="py-4 navbar mx-auto flex justify-between items-center max-w-[1300px] mx-auto mx-[15px]">
        <div>
          <Link href='/'>
            <Image src={Logo} alt="logo" height={100} className="cursor-pointer"/>
          </Link>
        </div>
        <div className="w-full flex nav-item-menu mr-[35px]">
          <ul className="flex gap-[25px] w-full justify-end">
            <li>  
              <Link href="/deposit" className="font-bold">
                <span>
                  {t(`deposit`)}
                </span>
              </Link>
            </li>
            <li>
              <Link href="/withdraw" className="font-bold">
                <span>
                  {t(`withdraw`)}
                </span>
              </Link>
            </li>
            <li>
              <Link href="/notice" className="font-bold">
                <span>
                  {t(`notice`)}
                </span>
              </Link>
            </li>
            <li>
              <Link href="/event" className="font-bold">
                <span>
                  {t(`event`)}
                </span>
              </Link>
            </li>
          </ul>
        </div>
        <div className="mr-[35px] language-switcher">
          <LangSwitcher locale={locale} />
        </div>
        <div className="flex gap-4">
          <button className="header-button btn-login max-h-[40px]">
            <span>
              {t(`login`)}
            </span>
          </button>
          <button className="header-button btn-joinnow max-h-[40px]">
            <span>
              {t(`joinUs`)}
            </span>
          </button>
        </div>
      </header>
      <div className="banner flex min-h-[450px] border-b-[2px] border-[#fce18f]">
        <div className="max-w-[1300px] mx-auto pb-[60px] mx-[15px] flex justify-between items-center">
          <div className="banner-left w-[50%]">
            <h2>{t(`playOnlineCasinoWinMoneyUnlimited`)}</h2>
          </div>
          <div className="banner-right w-[50%] flex justify-center">
            <Image src={BannerRight} alt="banner-right"/>
          </div>
        </div>
      </div>
      <div className="jackpot-section mt-[-60px] max-w-[1350px] mx-auto flex items-center justify-between px-10 rounded-[20px] border-[2px] border-[#fce18f]">
        <div className="flex items-center relative gap-6 w-full">
          <div className="jackpot-image">
            <Image src={Jackpot} alt="jackpot" className="w-[230px] flex absolute bottom-0 left-0" />
          </div>
          <div className="jackpot-content text-center w-full justify-between ml-[250px] flex">
            <div className="jackpot-label gap-0 my-auto">
              <h5 className="text-[40px] my-0 font-semibold text-white uppercase">Progressive</h5>
              <h5 className="text-[#fce18f] my-0 text-[40px] font-semibold uppercase">Jackpot</h5>
            </div>
            <div className="jackpot-amount">
              <span className="text-[80px] font-bold text-white tracking-wider">
                {formatJackpot(jackpotAmount)}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center">
        <div className="flex gap-4 relative cursor-pointer" onClick={() => setActiveTab("casino")}>
          {
            activeTab !== "casino" ? (
              <>
                <Image src={casinoActiveIcon} alt="casinoActiveIcon" width={120} height={140}/>
              </>
            ) : (
              <>
                <Image src={casinoGameIcon} alt ="casinoGameIcon" width={120} height={140}/>
              </>
          )}
          <h2 className="absolute top-6 w-[120px] text-center text-[#fce18f] text-[30px]">Casino</h2>
        </div>
        <div className="flex gap-4 relative cursor-pointer" onClick={() => setActiveTab("slot")}>
          {
            activeTab !== "slot" ? (
              <>
                <Image src={slotActiveIcon} alt="slotActiveIcon" width={120} height={140} />
              </>
            ) : (
              <>
                <Image src={slotGameIcon} alt="slotGameIcon" width={120} height={140}/>
              </>
            )
          }
          <h2 className="absolute top-6 w-[120px] text-center text-[#fce18f] text-[30px]">Slot</h2>
        </div>
        <div className="flex gap-4 relative cursor-pointer" onClick={() => setActiveTab("mini")}>
          {
            activeTab !== "mini" ? (
              <>
                <Image src={miniActiveIcon} alt="miniActiveIcon" width={120} height={140}/>
              </>
            ) : (
              <>
                <Image src={miniGameIcon} alt="miniGameIcon" width={120} height={140}/>
              </>
            )
          }
          <h2 className="absolute top-6 w-[120px] text-center text-[#fce18f] text-[30px]">Mini</h2>
        </div>
      </div> 
      {/* <Sidebar isDarkTheme={isDarkTheme} menu={menu} /> */}
    </div>
  );
};

export default Head;