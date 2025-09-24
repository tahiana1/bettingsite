"use client";

import React, { useEffect, useState } from "react";
import { useAtom } from "jotai";

import Layout from "@/components/Layout";
import "@/styles/globals.css";
import DeviceTracker from "@/components/Common/DeviceTracker";
import { showBettingCartState, userState } from "@/state/state";
import api from "@/api";
import { useRouter , usePathname} from "next/navigation";
import Image from "next/image";
import BoardPage from "@/components/Board/BoardPage";
import { useTranslations } from "next-intl";

// Import ficon logos for carousel
import btgLogo from "@/assets/img/ficon/btg.png";
import skywindFiconLogo from "@/assets/img/ficon/skywind.png";
import saLogo from "@/assets/img/ficon/sa.png";
import vivoFiconLogo from "@/assets/img/ficon/vivo.png";
import betsoftLogo from "@/assets/img/ficon/betsoft.png";
import playngoLogo from "@/assets/img/ficon/playngo.png";
import reelkingdomLogo from "@/assets/img/ficon/reelkingdom.png";
import sevenMojosLogo from "@/assets/img/ficon/7mojos.png";
import bfGamesLogo from "@/assets/img/ficon/BF게임즈.png";
import netentLogo from "@/assets/img/ficon/netent.png";
import redtigerLogo from "@/assets/img/ficon/redtiger.png";
import relaxLogo from "@/assets/img/ficon/relax.png";
import oneX2Logo from "@/assets/img/ficon/1x2.png";
import tpgLogo from "@/assets/img/ficon/TPG.png";
import dragoonsoftLogo from "@/assets/img/ficon/dragoonsoft.png";
import elkLogo from "@/assets/img/ficon/elk.png";
import mobilotsLogo from "@/assets/img/ficon/Mobilots.png";
import blueprintLogo from "@/assets/img/ficon/blueprint.png";
import nolimitLogo from "@/assets/img/ficon/nolimit.png";
import playpearlsLogo from "@/assets/img/ficon/playpearls.png";
import thunderkickLogo from "@/assets/img/ficon/thunderkick.png";
import gameartLogo from "@/assets/img/ficon/gameart.png";
import habaneroLogo from "@/assets/img/ficon/habanero.png";
import pgsoftLogo from "@/assets/img/ficon/pgsoft.png";
import playsonLogo from "@/assets/img/ficon/playson.png";
import playstarLogo from "@/assets/img/ficon/playstar.png";
import bngLogo from "@/assets/img/ficon/bng.png";
import botaFiconLogo from "@/assets/img/ficon/bota.png";
import cq9Logo from "@/assets/img/ficon/cq9.png";
import evoplayLogo from "@/assets/img/ficon/evoplay.png";
import wazdanLogo from "@/assets/img/ficon/wazdan.png";
import betGamesFiconLogo from "@/assets/img/ficon/BetGames.png";
import dowinFiconLogo from "@/assets/img/ficon/Dowin.png";
import microgamingLogo from "@/assets/img/ficon/microgaming.png";
import agFiconLogo from "@/assets/img/ficon/ag.png";
import dreamgameFiconLogo from "@/assets/img/ficon/dreamgame.png";
import evolutionFiconLogo from "@/assets/img/ficon/evolution.png";
import pragmaticFiconLogo from "@/assets/img/ficon/pragmatic.png";
import wmFiconLogo from "@/assets/img/ficon/wm.png";

import LogoImage from "@/assets/img/logo.png"

import PhoneImage from "@/assets/img/contact/phone.png"
import TelegramImage from "@/assets/img/contact/telegram.png"
import TalkImage from "@/assets/img/contact/kakao.png"
import holdemRight from "@/assets/img/main/holdem-right.png";
import holdemLeft from "@/assets/img/main/holdem-left.png";
import slotLeft from "@/assets/img/main/slot-left.png";
import slotRight from "@/assets/img/main/slot-right.png";
import miniLeft from "@/assets/img/main/mini-left.png";
import miniRight from "@/assets/img/main/mini-right.png";

// Logo Carousel Component
interface LogoCarouselProps {
  logos: Array<{ name: string; logo: any }>;
}

 // Array of ficon logos for carousel animation
 const ficonLogos = [
  { name: "BTG", logo: btgLogo },
  { name: "Skywind", logo: skywindFiconLogo },
  { name: "SA Gaming", logo: saLogo },
  { name: "Vivo Gaming", logo: vivoFiconLogo },
  { name: "Betsoft", logo: betsoftLogo },
  { name: "Play'n GO", logo: playngoLogo },
  { name: "Reel Kingdom", logo: reelkingdomLogo },
  { name: "7 Mojos", logo: sevenMojosLogo },
  { name: "BF Games", logo: bfGamesLogo },
  { name: "NetEnt", logo: netentLogo },
  { name: "Red Tiger", logo: redtigerLogo },
  { name: "Relax", logo: relaxLogo },
  { name: "1X2 Network", logo: oneX2Logo },
  { name: "TPG", logo: tpgLogo },
  { name: "Dragoon Soft", logo: dragoonsoftLogo },
  { name: "ELK Studios", logo: elkLogo },
  { name: "Mobilots", logo: mobilotsLogo },
  { name: "Blueprint", logo: blueprintLogo },
  { name: "Nolimit City", logo: nolimitLogo },
  { name: "Play Pearls", logo: playpearlsLogo },
  { name: "Thunderkick", logo: thunderkickLogo },
  { name: "GameArt", logo: gameartLogo },
  { name: "Habanero", logo: habaneroLogo },
  { name: "PG Soft", logo: pgsoftLogo },
  { name: "Playson", logo: playsonLogo },
  { name: "Playstar", logo: playstarLogo },
  { name: "BNG", logo: bngLogo },
  { name: "Bota", logo: botaFiconLogo },
  { name: "CQ9", logo: cq9Logo },
  { name: "Evoplay", logo: evoplayLogo },
  { name: "Wazdan", logo: wazdanLogo },
  { name: "BetGames", logo: betGamesFiconLogo },
  { name: "Dowin", logo: dowinFiconLogo },
  { name: "Microgaming", logo: microgamingLogo },
  { name: "AG", logo: agFiconLogo },
  { name: "Dream Game", logo: dreamgameFiconLogo },
  { name: "Evolution", logo: evolutionFiconLogo },
  { name: "Pragmatic Play", logo: pragmaticFiconLogo },
  { name: "WM", logo: wmFiconLogo },
];

const LogoCarousel: React.FC<LogoCarouselProps> = ({ logos }) => {
  
  return (
    <div className="w-full overflow-hidden rounded-lg py-2" style={{
      borderTop: '#312807 solid 1px',
      borderBottom: '#312807 solid 1px',
      backgroundColor: '#000000d8',
    }}>
      <div className="relative flex items-center py-2">
        {/* Single continuous carousel with duplicated logos */}
        <div className="flex items-center whitespace-nowrap logo-carousel-animation">
          {/* First set of logos */}
          {logos.map((company, index) => (
            <div key={`first-${index}`} className="inline-block mx-8 flex-shrink-0">
              <Image
                src={company.logo}
                alt={`${company.name} logo`}
                className="h-12 w-auto max-w-[120px] object-contain filter brightness-90 contrast-110 hover:brightness-110 hover:scale-105 transition-all duration-300 cursor-pointer"
                width={120}
                height={48}
              />
            </div>
          ))}
          {/* Second set of logos for seamless loop */}
          {logos.map((company, index) => (
            <div key={`second-${index}`} className="inline-block mx-8 flex-shrink-0">
              <Image
                src={company.logo}
                alt={`${company.name} logo`}
                className="h-12 w-auto max-w-[120px] object-contain filter brightness-90 contrast-110 hover:brightness-110 hover:scale-105 transition-all duration-300 cursor-pointer"
                width={120}
                height={48}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const t = useTranslations();
  const pathname = usePathname();
  const [showBettingCart] = useAtom(showBettingCartState);
  const [profile, setProfile] = useAtom<any>(userState);
  const [contactData, setContactData] = useState({
    phone: "",
    telegram: "",
    kakaoTalk: ""
  });

  useEffect(() => {
    api("user/me").then((res) => {
      setProfile(res.data.profile);
    }).catch((err) => {
      console.log(err);
    });

    // Fetch contact data
    api("contact-info").then((res) => {
      if (res.success && res.data) {
        setContactData({
          phone: res.data.phone || "",
          telegram: res.data.telegram || "",
          kakaoTalk: res.data.kakaoTalk || ""
        });
      }
    }).catch((err) => {
      console.log("Error fetching contact data:", err);
    });
  }, []);

  const handleContactClick = (type: 'phone' | 'telegram' | 'kakaoTalk') => {
    const contact = contactData[type];
    if (!contact) return;

    switch (type) {
      case 'phone':
        window.open(`tel:${contact}`, '_self');
        break;
      case 'telegram':
        const telegramUrl = contact.startsWith('@') ? `https://t.me/${contact.slice(1)}` : `https://t.me/${contact}`;
        window.open(telegramUrl, '_blank');
        break;
      case 'kakaoTalk':
        window.open(`https://open.kakao.com/o/${contact}`, '_blank');
        break;
    }
  };
  return (
    <Layout>
      <DeviceTracker />
      
      <div className="relative">
        {
          pathname === "/" && (
            <div>
              <Image src={holdemRight} alt="holdemRight" className="absolute md:top-5 top-[-70px] md:w-[450px] w-[150px] right-[-30px] md:right-[-80px] holdem-right-animation"/>
              <Image src={holdemLeft} alt="holdemLeft" height={200} className="absolute md:w-[450px] w-[150px] md:top-5 top-[-70px] left-[-30px] md:left-[-90px] holdem-left-animation"/>
            </div> 
          )
        }
        {
          pathname === "/slot" && (
            <div>
              <Image src={slotRight} alt="slotRight" className="absolute md:top-5 top-[-70px] md:w-[450px] w-[150px] right-[-30px] md:right-[-80px] holdem-right-animation"/>
              <Image src={slotLeft} alt="slotLeft" height={200} className="absolute md:w-[450px] w-[150px] md:top-5 top-[-70px] left-[-30px] md:left-[-90px] holdem-left-animation"/>
            </div>
          )
        }
        {
          pathname === "/mini" && (
            <div>
              <Image src={miniRight} alt="miniRight" className="absolute md:top-5 top-[-70px] md:w-[450px] w-[150px] right-[-30px] md:right-[-80px] holdem-right-animation"/>
              <Image src={miniLeft} alt="miniLeft" height={200} className="absolute md:w-[450px] w-[150px] md:top-5 top-[-70px] left-[-30px] md:left-[-90px] holdem-left-animation"/>
            </div>
          )
        }
        <div className="max-w-[1300px] w-full mx-auto mx-[15px]">
          {children}
        </div>
      </div>
       {/* Logo Carousel Animation */}
      <div className="w-full my-10">
        <LogoCarousel logos={ficonLogos} />
      </div>
      <BoardPage />
      <footer className="flex justify-center flex-col items-center mt-10">
        <div>
          <Image src={LogoImage} alt="logoImage" className="xl:w-[250px] w-[170px]"/>
        </div>
        <div className="flex justify-center items-center flex-col">
          <h3 className="xl:text-[28px] text-[22px] font-bold my-5">{t("contactUs")}</h3>
          <div className="flex items-center justify-center mt-5 gap-6">
            <button 
              className={`btn-contact xl:px-14 xl:py-3 px-8 py-2 transition-all duration-100 ${
                contactData.phone 
                  ? 'cursor-pointer hover:scale-105' 
                  : 'cursor-not-allowed opacity-50'
              }`}
              onClick={() => handleContactClick('phone')}
              disabled={!contactData.phone}
              title={contactData.phone ? `Call ${contactData.phone}` : 'Phone number not available'}
            >
              <Image src={PhoneImage} alt="phoneImage" width={40} height={40}/>
            </button>
            <button 
              className={`btn-contact xl:px-14 xl:py-3 px-8 py-2 transition-all duration-100 ${
                contactData.telegram 
                  ? 'cursor-pointer hover:scale-105' 
                  : 'cursor-not-allowed opacity-50'
              }`}
              onClick={() => handleContactClick('telegram')}
              disabled={!contactData.telegram}
              title={contactData.telegram ? `Message ${contactData.telegram}` : 'Telegram not available'}
            >
              <Image src={TelegramImage} alt="telegramImage" width={40} height={40}/>
            </button>
            <button 
              className={`btn-contact xl:px-14 xl:py-3 px-8 py-2 transition-all duration-100 ${
                contactData.kakaoTalk 
                  ? 'cursor-pointer hover:scale-105' 
                  : 'cursor-not-allowed opacity-50'
              }`}
              onClick={() => handleContactClick('kakaoTalk')}
              disabled={!contactData.kakaoTalk}
              title={contactData.kakaoTalk ? `KakaoTalk ${contactData.kakaoTalk}` : 'KakaoTalk not available'}
            >
              <Image src={TalkImage} alt="talkImage" width={40} height={40}/>
            </button>
          </div>
        </div>
        <div className="bg-[#000] py-4 mt-14 w-full justify-center flex">
          <span className="text-[17px] text-center block text-white block">{t("copyright")}</span>
        </div>
      </footer>
    </Layout>
  );
}
