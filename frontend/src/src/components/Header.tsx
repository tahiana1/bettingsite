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
      <header className="py-4 navbar mx-auto flex justify-between 2xl:px-0 px-4 items-center max-w-[1300px] mx-auto mx-[15px]">
        <div className="max-w-[120px]">
          <Link href='/'>
            <Image src={Logo} alt="logo" height={100} className="cursor-pointer"/>
          </Link>
        </div>
        <div className="w-full nav-item-menu mr-[35px] md:flex hidden">
          <ul className="flex gap-[25px] w-full justify-end">
            <li>  
              <Link href="/deposit" className="font-bold text-white hover:text-[#fce18f] transition-all duration-300">
                <span>
                  {t(`deposit`)}
                </span>
              </Link>
            </li>
            <li>
              <Link href="/withdraw" className="font-bold text-white hover:text-[#fce18f] transition-all duration-300">
                <span>
                  {t(`withdraw`)}
                </span>
              </Link>
            </li>
            <li>
              <Link href="/notice" className="font-bold text-white hover:text-[#fce18f] transition-all duration-300">
                <span>
                  {t(`notice`)}
                </span>
              </Link>
            </li>
            <li>
              <Link href="/event" className="font-bold text-white hover:text-[#fce18f] transition-all duration-300">
                <span>
                  {t(`event`)}
                </span>
              </Link>
            </li>
          </ul>
        </div>
        <div className="flex items-center">
          <div className="mr-[10px] md:mr-[35px] language-switcher">
            <LangSwitcher locale={locale} />
          </div>
          <div className="flex gap-2 md:gap-4">
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
        </div>
        
      </header>
      <div className="banner flex md:min-h-[450px] min-h-[400px] border-b-[2px] md:px-10 px-4 border-[#fce18f]">
        <div className="max-w-[1300px] mx-auto pb-[60px] mx-[15px] flex justify-between items-center">
          <div className="banner-left w-[50%] md:flex hidden">
            <h2>{t(`playOnlineCasinoWinMoneyUnlimited`)}</h2>
          </div>
          <div className="banner-right md:w-[50%] w-full flex justify-center">
            <Image src={BannerRight} alt="banner-right"/>
          </div>
        </div>
      </div>
      <div className="jackpot-section mt-[-60px] xl:max-w-[1350px] max-w-[90%] px-4 mx-auto flex items-center justify-between rounded-[20px] border-[2px] border-[#fce18f]">
        <div className="flex items-center relative gap-6 md:py-0 py-3 w-full xl:flex-row flex-row-reverse">
          <div className="jackpot-image xl:flex hidden">
            <Image src={Jackpot} alt="jackpot" className="xl:w-[230px] w-[180px] flex absolute bottom-0 left-0" />
          </div>
          <div className="jackpot-content text-center w-full justify-between xl:ml-[250px] ml-0 xl:ml-[180px] xl:flex-row flex-row-reverse xl:flex">
            <div className="jackpot-label my-auto xl:block flex xl:gap-0 gap-2 xl:justify-start justify-center">
              <h5 className="xl:text-[40px] md:text-[30px] text-[25px] my-0 font-semibold text-white uppercase">{t(`progressive`)}</h5>
              <h5 className="text-[#fce18f] my-0 xl:text-[40px] md:text-[30px] text-[25px] font-semibold uppercase">{t(`jackpot`)}</h5>
            </div>
            <div className="jackpot-amount">
              <span className="xl:text-[80px] md:text-[60px] text-[45px] font-bold text-white tracking-wider">
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
                <Image src={casinoActiveIcon} alt="casinoActiveIcon" className="md:w-[120px] w-[80px] md:h-[140px] h-[95px]"/>
              </>
            ) : (
              <>
                <Image src={casinoGameIcon} alt ="casinoGameIcon" className="md:w-[120px] w-[80px] md:h-[140px] h-[95px]"/>
              </>
          )}
          <h2 className="absolute md:top-6 top-4 md:w-[120px] w-[80px] text-center text-[#fce18f] md:text-[30px] text-[20px]">{t("casino")}</h2>
        </div>
        <div className="flex gap-4 relative cursor-pointer" onClick={() => setActiveTab("slot")}>
          {
            activeTab !== "slot" ? (
              <>
                <Image src={slotActiveIcon} alt="slotActiveIcon" className="md:w-[120px] w-[80px] md:h-[140px] h-[95px]" />
              </>
            ) : (
              <>
                <Image src={slotGameIcon} alt="slotGameIcon" className="md:w-[120px] w-[80px] md:h-[140px] h-[95px]"/>
              </>
            )
          }
          <h2 className="absolute md:top-6 top-4 md:w-[120px] w-[80px] text-center text-[#fce18f] md:text-[30px] text-[20px]">{t("slot")}</h2>
        </div>
        <div className="flex gap-4 relative cursor-pointer" onClick={() => setActiveTab("mini")}>
          {
            activeTab !== "mini" ? (
              <>
                <Image src={miniActiveIcon} alt="miniActiveIcon" className="md:w-[120px] w-[80px] md:h-[140px] h-[95px]"/>
              </>
            ) : (
              <>
                <Image src={miniGameIcon} alt="miniGameIcon" className="md:w-[120px] w-[80px] md:h-[140px] h-[95px]"/>
              </>
            )
          }
          <h2 className="absolute md:top-6 top-4 md:w-[120px] w-[80px] text-center text-[#fce18f] md:text-[30px] text-[20px]">{t("mini")}</h2>
        </div>
      </div> 
      {/* <Sidebar isDarkTheme={isDarkTheme} menu={menu} /> */}
    </div>
  );
};

export default Head;