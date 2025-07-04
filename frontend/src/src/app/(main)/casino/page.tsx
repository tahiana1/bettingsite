"use client";

import { Card, message, Spin } from "antd";
import Image from "next/image";
import { Content } from "antd/es/layout/layout";
import CasinoLogo from "@/assets/img/casino/casino.png";
import gameBG from "@/assets/img/casino/game_bg.png";
import { useTranslations } from "next-intl";
import Evolution from "@/assets/img/casino/evolution.png";
import Taishan from "@/assets/img/casino/taishan.png";
import AsiaGaming from "@/assets/img/casino/asian.png";
import Ejugi from "@/assets/img/casino/ezugi.png";
import Allbet from "@/assets/img/casino/allbet.png";
import DreamGaming from "@/assets/img/casino/dream.png";
import Pragmatic from "@/assets/img/casino/pragmatic.png";
import SexyCasino from "@/assets/img/casino/sexycasino.png";
import Vivogaming from "@/assets/img/casino/vivo.png";
import WMcasino from "@/assets/img/casino/wmcasino.png";
import BetgamesTV from "@/assets/img/casino/betgamestv.png";
import BotaCasino from "@/assets/img/casino/bota.png";
import Skywind from "@/assets/img/casino/skywind.png";
import Dowin from "@/assets/img/casino/dowin.png";
import Playtech from "@/assets/img/casino/playtech.png";
import OneTouch from "@/assets/img/casino/onetouch.png";
import ALG from "@/assets/img/casino/alg.png";
import SevenMojos from "@/assets/img/casino/7mojos.png";
import HiltonCasino from "@/assets/img/casino/hilton.png";
import EvolutionLogo from '@/assets/img/casino/logo/evolution.png';
import TaishanLogo from '@/assets/img/casino/logo/taishan.png';
import AsiaGamingLogo from "@/assets/img/casino/logo/asian.png";
import EjugiLogo from "@/assets/img/casino/logo/ezugi.png";
import AllbetLogo from "@/assets/img/casino/logo/allbet.png";
import DreamGamingLogo from "@/assets/img/casino/logo/dream.png";
import PragmaticLogo from "@/assets/img/casino/logo/pragmatic.png";
import SexyCasinoLogo from "@/assets/img/casino/logo/sexycasino.png";
import VivogamingLogo from "@/assets/img/casino/logo/vivo.png";
import WMcasinoLogo from "@/assets/img/casino/logo/wmcasino.png";
import BetgamesTVLogo from "@/assets/img/casino/logo/betgamestv.png";
import BotaCasinoLogo from "@/assets/img/casino/logo/bota.png";
import SkywindLogo from "@/assets/img/casino/logo/skywind.png";
import DowinLogo from "@/assets/img/casino/logo/dowin.png";
import PlaytechLogo from "@/assets/img/casino/logo/playtech.png";
import OneTouchLogo from "@/assets/img/casino/logo/onetouch.png";
import ALGLogo from "@/assets/img/casino/logo/alg.png";
import SevenMojosLogo from "@/assets/img/casino/logo/7mojos.png";
import HiltonCasinoLogo from "@/assets/img/casino/logo/hilton.png";
import api from "@/api";
import { useEffect, useState } from "react";

const Casino: React.FC = () => {
    const t = useTranslations();
    const [loading, setLoading] = useState(false);
    const [userId, setUserId] = useState<any>("");
    const [selectedGame, setSelectedGame] = useState("");
    useEffect(() => {
        api("user/me").then((res) => {
            setUserId(res.data.userid);
        }).catch((err) => {
          console.log(err);
        });
      }, []);
    const ProcessCasino = (name : string) => {
        setLoading(true);
        setSelectedGame(name);
        console.log(userId, 'userid')
        api("casino/get-game-link", {
            method: "GET",
            params: {
                username : 'webforyou',
                // username: userId,
                gameName: name
            }
        }).then((res) => {
            console.log(res.link);
            window.open(res.link, '_blank', 'width=1200,height=800,toolbar=no,menubar=no,scrollbars=yes,resizable=yes,location=no,status=no');
        }).catch((err) => {
            message.error(err.response.data.error);
        }).finally(() => {
            setLoading(false);
        });
    }

    return (
    <Content className="p-4 overflow-y-auto h-[calc(100vh-40px)]">
        <Card
            title={
                <div className="flex justify-start items-center gap-2 py-1 mb-1">
                    <Image src={CasinoLogo} alt="casino" width={70} height={70} />
                    <div className="flex flex-col mt-1">
                        <div className="text-2xl font-bold">{t("casino")}</div>
                        <div className="text-sm text-gray-500">{t("totalLiveCasinoGameProviders")} <span className="text-blue-500">19</span> {t("liveCasinoGameProviders")}</div>
                    </div>
                </div>
            }
        >
            <div className="flex flex-wrap w-full gap-3 justify-center">
                {[
                    { name: "Evolution", img: Evolution, logo: EvolutionLogo},
                    { name: "Taishan", img: Taishan, logo: TaishanLogo},
                    { name: "Asia Gaming", img: AsiaGaming, logo: AsiaGamingLogo },
                    { name: "Ejugi", img: Ejugi, logo: EjugiLogo },
                    { name: "Allbet", img: Allbet, logo: AllbetLogo },
                    { name: "Dream Gaming", img: DreamGaming, logo: DreamGamingLogo },
                    { name: "Pragmatic", img: Pragmatic, logo: PragmaticLogo },
                    { name: "Sexy Casino", img: SexyCasino, logo: SexyCasinoLogo },
                    { name: "Vivogaming", img: Vivogaming, logo: VivogamingLogo },
                    { name: "WM Casino", img: WMcasino, logo: WMcasinoLogo },
                    { name: "BetgamesTV", img: BetgamesTV, logo: BetgamesTVLogo },
                    { name: "Bota Casino", img: BotaCasino, logo: BotaCasinoLogo },
                    { name: "Skywind", img: Skywind, logo: SkywindLogo },
                    { name: "Dowin", img: Dowin, logo: DowinLogo },
                    { name: "Playtech", img: Playtech, logo: PlaytechLogo },
                    { name: "One Touch", img: OneTouch, logo: OneTouchLogo },
                    { name: "ALG Casino", img: ALG, logo: ALGLogo },
                    { name: "7Mojos", img: SevenMojos, logo: SevenMojosLogo },
                    { name: "Hilton Casino", img: HiltonCasino, logo: HiltonCasinoLogo }
                ].map((provider, idx) => (
                    <div
                        key={provider.name}
                        className="relative cursor-pointer w-[200px] h-[200px]"
                        onClick={() => ProcessCasino(provider.name)}
                    >
                        {
                            loading && selectedGame === provider.name && <Spin className="flex z-[1000] justify-center items-center absolute top-[100px] left-0 w-full h-full" />
                        }
                        <div className="z-[3] absolute w-full top-1 justify-center flex">
                            <Image src={provider.logo} alt={provider.name} width={100} height={100} />
                        </div>
                        <div className="z-[3] absolute max-h-[24px] overflow-hidden w-full justify-center flex top-[48px]">
                            <span className="text-[25px] text-[yellow] font-bold">{provider.name}</span>
                        </div>
                        <Image src={gameBG} alt="game" className="absolute z-[2] top-0 left-0 w-full h-full" width={200} height={200} />
                        <Image src={provider.img} alt={provider.name} className="opacity-100 z-[1] absolute bottom-[10px] left-[0px]" width={200} height={190} />
                    </div>
                ))}
            </div>
        </Card>
    </Content>
  );
};

export default Casino;