"use client";

import React, { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";

// Import all casino game company logos
import algLogo from "@/assets/img/casinoGame/alg.png";
import betgamesLogo from "@/assets/img/casinoGame/betgames.png";
import dowinLogo from "@/assets/img/casinoGame/dowin.png";
import evolutionLogo from "@/assets/img/casinoGame/evolution.png";
import onetouchLogo from "@/assets/img/casinoGame/onetouch.png";
import playtechLogo from "@/assets/img/casinoGame/playtech.png";
import mojosLogo from "@/assets/img/casinoGame/7mojos.png";
import agLogo from "@/assets/img/casinoGame/ag.png";
import allbetLogo from "@/assets/img/casinoGame/allbet.png";
import botaLogo from "@/assets/img/casinoGame/bota.png";
import dreamgamingLogo from "@/assets/img/casinoGame/dreamgaming.png";
import ezugiLogo from "@/assets/img/casinoGame/ezugi.png";
import hiltonLogo from "@/assets/img/casinoGame/hilton.png";
import pragmaticLogo from "@/assets/img/casinoGame/pragmatic.png";
import sexyLogo from "@/assets/img/casinoGame/sexy.png";
import skywindLogo from "@/assets/img/casinoGame/skywind.png";
import taishanLogo from "@/assets/img/casinoGame/taishan.png";
import vivoLogo from "@/assets/img/casinoGame/vivo.png";
import wmLogo from "@/assets/img/casinoGame/wm.png";


const Index: React.FC = () => {
  const t = useTranslations();

  // Array of casino game companies with their logos and names
  const casinoCompanies = [
    { name: "Evolution", logo: evolutionLogo },
    { name: "Taishan", logo: taishanLogo },
    { name: "Asia Gaming", logo: agLogo },
    { name: "Ezugi", logo: ezugiLogo },
    { name: "Allbet", logo: allbetLogo },
    { name: "Dream Gaming", logo: dreamgamingLogo },
    { name: "Pragmatic", logo: pragmaticLogo },
    { name: "Sexy Gaming", logo: sexyLogo },
    { name: "Vivo Gaming", logo: vivoLogo },
    { name: "WM Casino", logo: wmLogo },
    { name: "Betgames", logo: betgamesLogo },
    { name: "Bota Casino", logo: botaLogo },
    { name: "Skywind", logo: skywindLogo },
    { name: "Dowin", logo: dowinLogo },
    { name: "Playtech", logo: playtechLogo },
    { name: "OneTouch", logo: onetouchLogo },
    { name: "ALG Casino", logo: algLogo },
    { name: "7 Mojos", logo: mojosLogo },
    { name: "Hilton Casino", logo: hiltonLogo },
  ];

 
 
  return (
    <div className="mt-10">
      <h1 className="section-title">Live Casino</h1>
      
      {/* Casino Game Companies Grid */}
      <div className="mt-8">
        <div className="casino-game-grid flex flex-wrap gap-8 justify-center">
          {casinoCompanies.map((company, index) => (
            <div
              key={index}
              className="casino-game-grid-item max-w-[300px] rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col items-center justify-center cursor-pointer hover:scale-105 transform transition-transform"
            >
              <div className="w-full h-full relative">
                <Image
                  src={company.logo}
                  alt={`${company.name} logo`}
                  className="object-contain w-full opacity-10 rounded-t-lg border-b-1 border-[#ffd273]"
                />
              </div>
              <div className="text-xl py-3 text-white font-bold text-center bg-image-game-item w-full">
                {company.name}
              </div>
            </div>
          ))}
        </div>
      </div>
     
    </div>
  );
};

export default Index;