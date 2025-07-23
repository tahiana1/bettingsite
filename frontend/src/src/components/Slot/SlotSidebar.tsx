"use client";

import React, {useEffect, useState} from "react";
import { List, Spin } from "antd";
import { useTranslations } from "next-intl";
import api from "@/api";

const casinoProviders = [
    // { name: "Boomerang", img: Boomerang, logo: BoomerangLogo, id:"boomerang" },
    { name: "Mancala", id:'mancala' },
    { name: "Caleta", id: 'caletagaming' },
    { name: "Platipus", id: 'platipus' },
    { name: "Booming", id: "booming" },
    { name: "BGaming", id: "bgaming" },
    // { name: "Beefee", img: Beefee, logo: BeefeeLogo, id: "beefee" },
    { name: "Spinomenal", id: "spinomenal" },
    { name: "Pariplay", id: "pariplay" },
    { name: "Novomatic", id: "novomatic" },
    { name: "EA Gaming", id: "eagaming" },
    { name: "7777 Gaming", id: "7777" },
    { name: "Platina Gaming", id: "platingaming" },
    { name: "SmartSoft", id: "smartsoft" },
    { name: "Fils", id: "fils" },
    { name: "Retro Gaming", id: "retrogames" },
    { name: "7 Mojos", id: "7-mojos" },
    // { name: "4ThePlay", img: FourThePlay, logo: FourThePlayLogo, id: "4theplay" },
    // { name: "ReelPlay", img: ReelPlay, logo: ReelPlayLogo, id: "reelplay" },
    // { name: "WorldMatch", img: WorldMatch, logo: WorldMatchLogo, id: "worldmatch" },
    { name: "Playtech", id: "PlayTech" },
    { name: "Skywind", id: "Skywind Slot" },
    // { name: "GMW", img: GMW, logo: GMWLogo, id: "gmw" },
    { name: "NetGaming", id: "netgame" },
    // { name: "Naga", img: Naga, logo: NagaLogo, id: "naga" },
    { name: "Big Time Gaming", id: "BigTimeGaming" },
    { name: "AvatarUX", id: "AvatarUX" },
    // { name: "Aspect", img: Aspect, logo: AspectLogo, id: "aspect" },
    // { name: "Reel Kingdom", img: ReelKingdom, logo: ReelKingdomLogo, id: "reelkingdom" },
    { name: "Wazdan", id: "wazdan" },
    { name: "GameArt", id: "GameArt" },
    { name: "PlayStar", id: "PlayStar" },
    { name: "NetGame", id: "netgame" },
    { name: "SlotMill", id: "slotmill" },
    { name: "Red Tiger", id: "redtiger" },
    // { name: "PlayPearls", img: PlayPearls, logo: PlayPearlsLogo, id: "playpearls" },
    { name: "Hacksaw Gaming", id: "Hacksaw" },
    // { name: "Dragon Gaming", img: Dragon, logo: DragonLogo, id: "dragon" },
    { name: "Relax Gaming", id: "Relax Gaming" },
    // { name: "Mobilots", img: Mobilots, logo: MobilotsLogo, id: "mobilots" },
    { name: "RTG Slots", id: "rtgslots" },
    { name: "Thunder", id: "Thunderkick" },
    // { name: "Elk Studios", img: Elk, logo: ElkLogo, id: "elk" },
    { name: "Red Rake", id: "redrake" },
    { name: "QuickSpin", id: "quickspin" },
    { name: "Fantasma", id: "fantasma" },
    { name: "Blueprint", id: "Blueprint Gaming" },
    { name: "NoLimit City", id: "Nolimit City" },
    { name: "1X2 Gaming", id: "1x2 Gaming" },
    { name: "NetEnt", id: "netent" },
    { name: "Asian", id: "Asia Gaming" },
    { name: "Booongo", id: "Booongo" },
    { name: "CQ9", id: "CQ9" },
    { name: "DreamTech", id: "dreamtech" },
    { name: "EvoPlay", id: "evoplay" },
    // { name: "Genesis", img: Genesis, logo: GenesisLogo, id: "genesis" },
    { name: "Habanero", id: "Habanero" },
    { name: "Micro", id: "MicroGaming" },
    { name: "PGSoft", id: "PG Soft" },
    { name: "PlaynGO", id: "playngo" },
    { name: "Pragmatic", id: "PragmaticPlay" },
    // { name: "TPG", img: TPG, logo: TPGLogo, id: "tpg" },
    // { name: "TTG", img: TTG, logo: TTGLogo, id: "ttg" },
    { name: "Yggdrasil", id: "Yggdrasil" }
];

const SlotSidebar: React.FC = () => {
  const t  = useTranslations();
  const [loading, setLoading] = useState(false);
    const [userId, setUserId] = useState<any>("");
    const [selectedGame, setSelectedGame] = useState<any>("");
    useEffect(() => {
      api("user/me").then((res) => {
          setUserId(res.data.userid);
      }).catch((err) => {
        console.log(err);
      });
    }, []);

  return (
    <div className="w-full px-2 pt-2">
      <List
        itemLayout="horizontal"
        dataSource={casinoProviders}
        header={
          <div className="w-full text-white font-bold text-xl px-4 justify-center flex py-3 bg-[#141414] rounded-md">
            {t("user/slot")}
          </div>
        }
        className="w-full"
        renderItem={(item: any) => (
          <div className="cursor-pointer hover:bg-blue-500 hover:border-blue-500 rounded py-2 border-1 mb-1 border-[#999] dark:hover:bg-blue-500 transition-all">
            <div className="w-full flex items-center gap-3 select-none px-2 ">
              <span className="font-medium">{item.name}</span>
              {loading && selectedGame === item.name && <Spin />}
            </div>
          </div>
        )}
      />
    </div>
  );
};

export default SlotSidebar;