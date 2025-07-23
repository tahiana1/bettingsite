"use client";

import { Button, Card, message, Spin, Modal, Form, InputNumber, Layout } from "antd";
import Image from "next/image";
import { Content } from "antd/es/layout/layout";
import CasinoLogo from "@/assets/img/casino/casino.png";
import gameBG from "@/assets/img/casino/game_bg.png";
import { useTranslations } from "next-intl";
import api from "@/api";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAtom } from "jotai";
import { userState } from "@/state/state";
import Login from "@/components/Auth/Login";

// Slot provider main images (larger versions)
import Boomerang from "@/assets/img/slot/boomerang (1).png";
import Mancala from "@/assets/img/slot/mancala (1).png";
import Caleta from "@/assets/img/slot/caleta (1).png";
import Platipus from "@/assets/img/slot/platipus (1).png";
import Booming from "@/assets/img/slot/booming (1).png";
import BGaming from "@/assets/img/slot/bgaming (1).png";
import Beefee from "@/assets/img/slot/beefee (1).png";
import Spinomenal from "@/assets/img/slot/spinomenal (1).png";
import Pariplay from "@/assets/img/slot/pariplay (1).png";
import Novomatic from "@/assets/img/slot/novomatic (1).png";
import EAGaming from "@/assets/img/slot/eagaming (1).png";
import SevenSevenSevenSeven from "@/assets/img/slot/7777 (1).png";
import PlatinaGaming from "@/assets/img/slot/platingaming (1).png";
import SmartSoft from "@/assets/img/slot/smartsoft (1).png";
import Fils from "@/assets/img/slot/fils (1).png";
import RetroGaming from "@/assets/img/slot/retrogaming (1).png";
import SevenMojos from "@/assets/img/slot/7mojos (1).png";
import FourThePlay from "@/assets/img/slot/4theplay (1).png";
import ReelPlay from "@/assets/img/slot/reelplay (1).png";
import WorldMatch from "@/assets/img/slot/worldmatch (1).png";
import Playtech from "@/assets/img/slot/playtech (1).png";
import Skywind from "@/assets/img/slot/skywind (1).png";
import GMW from "@/assets/img/slot/gmw (1).png";
import NetGaming from "@/assets/img/slot/netgaming (1).png";
import Naga from "@/assets/img/slot/naga (1).png";
import BTG from "@/assets/img/slot/btg (1).png";
import AvatarUX from "@/assets/img/slot/avatarux (1).png";
import Aspect from "@/assets/img/slot/aspect (1).png";
import ReelKingdom from "@/assets/img/slot/reelkingdom (1).png";
import Wazdan from "@/assets/img/slot/wazdan (1).png";
import GameArt from "@/assets/img/slot/gameart (1).png";
import PlayStar from "@/assets/img/slot/playstar (1).png";
import NetGame from "@/assets/img/slot/netgame (1).png";
import SlotMill from "@/assets/img/slot/slotmill (1).png";
import RedTiger from "@/assets/img/slot/redtiger (1).png";
import PlayPearls from "@/assets/img/slot/playpearls (1).png";
import Hacksaw from "@/assets/img/slot/hacksaw (1).png";
import Dragon from "@/assets/img/slot/dragon (1).png";
import Relax from "@/assets/img/slot/relax (1).png";
import Mobilots from "@/assets/img/slot/mobilots (1).png";
import RTGSlots from "@/assets/img/slot/rtg_slots (1).png";
import Thunder from "@/assets/img/slot/thunder (1).png";
import Elk from "@/assets/img/slot/elk (1).png";
import RedRake from "@/assets/img/slot/redrake (1).png";
import QuickSpin from "@/assets/img/slot/quickspin (1).png";
import Fantasma from "@/assets/img/slot/fantasma (1).png";
import Blueprint from "@/assets/img/slot/blueprint (1).png";
import NoLimit from "@/assets/img/slot/nolimit (1).png";
import OneXTwoGaming from "@/assets/img/slot/1x2gaming (1).png";
import NetEnt from "@/assets/img/slot/netent (1).png";

// Missing providers - Adding the 15 missing companies
import Asian from "@/assets/img/slot/asian (1).png";
import Booongo from "@/assets/img/slot/booongo (1).png";
import CQ9 from "@/assets/img/slot/cq9 (1).png";
import DreamTech from "@/assets/img/slot/dreamtech (1).png";
import EvoPlay from "@/assets/img/slot/evoplay (1).png";
import Genesis from "@/assets/img/slot/genesis (1).png";
import Habanero from "@/assets/img/slot/habanero (1).png";
import Micro from "@/assets/img/slot/micro (1).png";
import PGSoft from "@/assets/img/slot/pgsoft (1).png";
import PlaynGO from "@/assets/img/slot/playngo (1).png";
import Pragmatic from "@/assets/img/slot/pragmatic.png";
import TPG from "@/assets/img/slot/tpg (1).png";
import TTG from "@/assets/img/slot/ttg (1).png";
import Yggdrasil from "@/assets/img/slot/yggdrasil (1).png";

// Slot provider logos (smaller versions)
import BoomerangLogo from "@/assets/img/slot/boomerang.png";
import MancalaLogo from "@/assets/img/slot/mancala.png";
import CaletaLogo from "@/assets/img/slot/caleta.png";
import PlatipusLogo from "@/assets/img/slot/platipus.png";
import BoomingLogo from "@/assets/img/slot/booming.png";
import BGamingLogo from "@/assets/img/slot/bgaming.png";
import BeefeeLogo from "@/assets/img/slot/beefee.png";
import SpinomenalLogo from "@/assets/img/slot/spinomenal.png";
import PariplayLogo from "@/assets/img/slot/pariplay.png";
import NovomaticLogo from "@/assets/img/slot/novomatic.png";
import EAGamingLogo from "@/assets/img/slot/eagaming.png";
import SevenSevenSevenSevenLogo from "@/assets/img/slot/7777.png";
import PlatinaGamingLogo from "@/assets/img/slot/platingaming.png";
import SmartSoftLogo from "@/assets/img/slot/smartsoft.png";
import FilsLogo from "@/assets/img/slot/fils.png";
import RetroGamingLogo from "@/assets/img/slot/retrogaming.png";
import SevenMojosLogo from "@/assets/img/slot/7mojos.png";
import FourThePlayLogo from "@/assets/img/slot/4theplay.png";
import ReelPlayLogo from "@/assets/img/slot/reelplay.png";
import WorldMatchLogo from "@/assets/img/slot/worldmatch.png";
import PlaytechLogo from "@/assets/img/slot/playtech.png";
import SkywindLogo from "@/assets/img/slot/skywind.png";
import GMWLogo from "@/assets/img/slot/gmw.png";
import NetGamingLogo from "@/assets/img/slot/netgaming.png";
import NagaLogo from "@/assets/img/slot/naga.png";
import BTGLogo from "@/assets/img/slot/btg.png";
import AvatarUXLogo from "@/assets/img/slot/avatarux.png";
import AspectLogo from "@/assets/img/slot/aspect.png";
import ReelKingdomLogo from "@/assets/img/slot/reelkingdom.png";
import WazdanLogo from "@/assets/img/slot/wazdan.png";
import GameArtLogo from "@/assets/img/slot/gameart.png";
import PlayStarLogo from "@/assets/img/slot/playstar.png";
import NetGameLogo from "@/assets/img/slot/netgame.png";
import SlotMillLogo from "@/assets/img/slot/slotmill.png";
import RedTigerLogo from "@/assets/img/slot/redtiger.png";
import PlayPearlsLogo from "@/assets/img/slot/playpearls.png";
import HacksawLogo from "@/assets/img/slot/hacksaw.png";
import DragonLogo from "@/assets/img/slot/dragon.png";
import RelaxLogo from "@/assets/img/slot/relax.png";
import MobilotsLogo from "@/assets/img/slot/mobilots.png";
import RTGSlotsLogo from "@/assets/img/slot/rtg_slots.png";
import ThunderLogo from "@/assets/img/slot/thunder.png";
import ElkLogo from "@/assets/img/slot/elk.png";
import RedRakeLogo from "@/assets/img/slot/redrake.png";
import QuickSpinLogo from "@/assets/img/slot/quickspin.png";
import FantasmaLogo from "@/assets/img/slot/fantasma.png";
import BlueprintLogo from "@/assets/img/slot/blueprint.png";
import NoLimitLogo from "@/assets/img/slot/nolimit.png";
import OneXTwoGamingLogo from "@/assets/img/slot/1x2gaming.png";
import NetEntLogo from "@/assets/img/slot/netent.png";

// Missing provider logos
import AsianLogo from "@/assets/img/slot/asian.png";
import BooOngoLogo from "@/assets/img/slot/booongo.png";
import CQ9Logo from "@/assets/img/slot/cq9.png";
import DreamTechLogo from "@/assets/img/slot/dreamtech.png";
import EvoPlayLogo from "@/assets/img/slot/evoplay.png";
import GenesisLogo from "@/assets/img/slot/genesis.png";
import HabaneroLogo from "@/assets/img/slot/habanero.png";
import MicroLogo from "@/assets/img/slot/micro.png";
import PGSoftLogo from "@/assets/img/slot/pgsoft.png";
import PlaynGOLogo from "@/assets/img/slot/playngo.png";
import PragmaticLogo from "@/assets/img/slot/pragmatic_play_logo.png";
import TPGLogo from "@/assets/img/slot/tpg.png";
import TTGLogo from "@/assets/img/slot/ttg.png";
import YggdrasilLogo from "@/assets/img/slot/yggdrasil.png";

const SlotPage: React.FC = () => {
    const t = useTranslations();
    const [loading, setLoading] = useState(false);
    const [userId, setUserId] = useState<any>("");
    const [selectedGame, setSelectedGame] = useState("");
    const [balance, setBalance] = useState<any>(0);
    const [isAddBalanceModalOpen, setIsAddBalanceModalOpen] = useState(false);
    const [addBalanceForm] = Form.useForm();
    const [addBalanceLoading, setAddBalanceLoading] = useState(false);
    const [popupWindow, setPopupWindow] = useState<Window | null>(null);
    const popupCheckInterval = useRef<NodeJS.Timeout | null>(null);
    const [currentStatus, setCurrentStatus] = useState<any>(null);
    const popupGameName = useRef<string>('');
    const [profile, setProfile] = useState<any>(null);
    const router = useRouter(); 
    const [selectedSlotItems, setSelectedSlotItems] = useState<any>([]);
    // Check if user is logged in
    useEffect(() => {
        api("user/me").then((res) => {
            setProfile(res.data.profile);
        }).catch((err) => {
            console.log(err);
        });
    }, []);
    
    useEffect(() => {
        api("user/me").then((res) => {
            setUserId(res.data.userid);
            api("casino/get-balance", {
                method: "GET",
                params: {
                    username: res.data.userid
                }
            }).then((response) => {
                setBalance(response.balance);
                console.log(response.balance, 'balance');
            });
        }).catch((err) => {
          console.log(err);
        });
    }, [currentStatus]);

    // Cleanup popup check interval on component unmount
    useEffect(() => {
        return () => {
            if (popupCheckInterval.current) {
                clearInterval(popupCheckInterval.current);
            }
        };
    }, []);

    // Add window focus event listener to detect when popup closes
    useEffect(() => {
        const handleWindowFocus = () => {
            if (popupWindow && popupGameName.current) {
                // When main window gains focus, check if popup is still open
                setTimeout(() => {
                    checkPopupClosed(popupGameName.current);
                }, 100);
            }
        };

        window.addEventListener('focus', handleWindowFocus);
        
        return () => {
            window.removeEventListener('focus', handleWindowFocus);
        };
    }, [popupWindow]);

    const handlePopupOpen = (gameName: string) => {
        console.log(`🎮 Popup opened for game: ${gameName}`);
        message.success(`Opening ${gameName} game...`);
        handleAddBalance();
    };

    const handlePopupClose = (gameName: string) => {
        console.log(`🔒 Popup closed for game: ${gameName}`);
        message.info(`${gameName} game window closed`);
        setPopupWindow(null);
        popupGameName.current = ''; // Clear the game name
        if (popupCheckInterval.current) {
            clearInterval(popupCheckInterval.current);
            popupCheckInterval.current = null;
        }
        api("casino/withdraw", {
            method: "GET",
            params: {
                username: userId
            }
        }).then((response) => {
            console.log(response, 'response');
            setCurrentStatus(2);
        }).catch((err) => {
            message.error(err.response.data.error);
        });
    };

    const checkPopupClosed = (gameName: string) => {
        try {
            if (popupWindow) {
                // Try to access the window to check if it's closed
                // This will throw an error if the window is closed
                const isClosed = popupWindow.closed;
                console.log(`🔍 Checking popup status for ${gameName}:`, isClosed);
                
                if (isClosed) {
                    handlePopupClose(gameName);
                }
            }
        } catch (error) {
            console.log(`❌ Error checking popup status for ${gameName}:`, error);
            // If we can't access the window, it's likely closed
            handlePopupClose(gameName);
        }
    };

    const ProcessSlot = (name : string) => {
        setLoading(true);
        setSelectedGame(name);
        console.log(userId, 'userid')
        
        // Clear any existing popup check interval
        if (popupCheckInterval.current) {
            clearInterval(popupCheckInterval.current);
            popupCheckInterval.current = null;
        }
        
        api("slot/get-game-items", {
            method: "GET",
            params: {
                type: "slot",
                vendor: name.toLowerCase()
            }
        }).then((res) => {
            
            const stringData = JSON.stringify(res)
            const data = JSON.parse(stringData);
            console.log('🎯 Game items received:', data.data);
            setSelectedSlotItems(data.data);
        }).catch((err) => {
            console.log('❌ API error:', err);
            message.error(err.response?.data?.error || 'Failed to get game link');
        }).finally(() => {
            setLoading(false);
        });
    }

    const handleAddBalance = async () => {
        setAddBalanceLoading(true);
        api("casino/add-balance", {
            method: "GET",
            params: {
                username: userId
            }
        }).then((response) => {     
            console.log(response, 'response');
        }).catch((err) => {
            message.error(err.response.data.error);
        }).finally(() => {
            setAddBalanceLoading(false);
            setCurrentStatus(1);
            handleAddBalanceModalCancel();
        });
    };

    const handleAddBalanceModalCancel = () => {
        setIsAddBalanceModalOpen(false);
        addBalanceForm.resetFields();
    };

    return (
    <>
        {!profile?.userId ? (
            <Layout className="flex justify-center items-center h-[90vh]">
                <Login />
            </Layout>
        ) : (
            <Content className="p-4 overflow-y-auto h-[calc(100vh-40px)]">
       
        <Card
            title={
                <div className="flex justify-between flex-row w-full items-center gap-2 py-1 mb-1">  
                    <div className="flex flex-row items-center gap-2">
                        <div className="flex flex-col mt-1">
                            <div className="text-2xl font-bold">{t("user/slot")}</div>
                            <div className="text-sm text-gray-500">{t("user/slot/description")}</div>
                        </div>
                    </div>
                    <div className="flex justify-end items-center gap-2 py-1 mb-1">
                        <div className="text-sm text-gray-500">{t("balance")}: <span className="text-blue-500">{balance}</span></div>
                    </div>
                </div>
            }
        >
            <div className="flex flex-wrap w-full gap-3 justify-center">
                {
                selectedSlotItems?.map((provider: any, idx: any) => {
                    return( <div
                        key={provider.name}
                        className="relative cursor-pointer w-[200px] border-1 border-black h-[220px]"
                        // onClick={() => ProcessSlot(provider.id)}
                        >
                        {
                            loading && selectedGame === provider.name && <Spin className="flex z-[1000] justify-center items-center absolute top-[100px] left-0 w-full h-full" />
                        }
                        <div className="z-[3] w-full mt-1 justify-center flex">
                            <img 
                                src={provider.thumbnail} 
                                alt={provider.name}
                                width={180}
                                height={140}
                                className="object-contain"
                                loading="lazy"
                            />
                        </div>
                        <div className="z-[3] overflow-hidden w-full justify-center flex ">
                            <span className="text-[17px] mt-1 text-[yellow] font-bold">{provider.title}</span>
                        </div>
                        {/* <Image src={gameBG} alt="game" className="absolute z-[2] top-0 left-0 w-full h-full" width={200} height={200} />
                        <Image src={provider.img} alt={provider.name} className="opacity-100 z-[1] absolute bottom-[10px] left-[0px]" width={200} height={190} /> */}
                    </div> )
                })
                }
            </div>
            {
                selectedSlotItems?.length == 0 && (
                    <div className="flex flex-wrap w-full gap-3 justify-center">
                        {[
                            // { name: "Boomerang", img: Boomerang, logo: BoomerangLogo, id:"boomerang" },
                            { name: "Mancala", img: Mancala, logo: MancalaLogo, id:'mancala' },
                            { name: "Caleta", img: Caleta, logo: CaletaLogo, id: 'caletagaming' },
                            { name: "Platipus", img: Platipus, logo: PlatipusLogo, id: 'platipus' },
                            { name: "Booming", img: Booming, logo: BoomingLogo, id: "booming" },
                            { name: "BGaming", img: BGaming, logo: BGamingLogo, id: "bgaming" },
                            // { name: "Beefee", img: Beefee, logo: BeefeeLogo, id: "beefee" },
                            { name: "Spinomenal", img: Spinomenal, logo: SpinomenalLogo, id: "spinomenal" },
                            { name: "Pariplay", img: Pariplay, logo: PariplayLogo, id: "pariplay" },
                            { name: "Novomatic", img: Novomatic, logo: NovomaticLogo, id: "novomatic" },
                            { name: "EA Gaming", img: EAGaming, logo: EAGamingLogo, id: "eagaming" },
                            { name: "7777 Gaming", img: SevenSevenSevenSeven, logo: SevenSevenSevenSevenLogo, id: "7777" },
                            { name: "Platina Gaming", img: PlatinaGaming, logo: PlatinaGamingLogo, id: "platingaming" },
                            { name: "SmartSoft", img: SmartSoft, logo: SmartSoftLogo, id: "smartsoft" },
                            { name: "Fils", img: Fils, logo: FilsLogo, id: "fils" },
                            { name: "Retro Gaming", img: RetroGaming, logo: RetroGamingLogo, id: "retrogames" },
                            { name: "7 Mojos", img: SevenMojos, logo: SevenMojosLogo, id: "7-mojos" },
                            // { name: "4ThePlay", img: FourThePlay, logo: FourThePlayLogo, id: "4theplay" },
                            // { name: "ReelPlay", img: ReelPlay, logo: ReelPlayLogo, id: "reelplay" },
                            // { name: "WorldMatch", img: WorldMatch, logo: WorldMatchLogo, id: "worldmatch" },
                            { name: "Playtech", img: Playtech, logo: PlaytechLogo, id: "PlayTech" },
                            { name: "Skywind", img: Skywind, logo: SkywindLogo, id: "Skywind Slot" },
                            // { name: "GMW", img: GMW, logo: GMWLogo, id: "gmw" },
                            { name: "NetGaming", img: NetGaming, logo: NetGamingLogo, id: "netgame" },
                            // { name: "Naga", img: Naga, logo: NagaLogo, id: "naga" },
                            { name: "Big Time Gaming", img: BTG, logo: BTGLogo, id: "BigTimeGaming" },
                            { name: "AvatarUX", img: AvatarUX, logo: AvatarUXLogo, id: "AvatarUX" },
                            // { name: "Aspect", img: Aspect, logo: AspectLogo, id: "aspect" },
                            // { name: "Reel Kingdom", img: ReelKingdom, logo: ReelKingdomLogo, id: "reelkingdom" },
                            { name: "Wazdan", img: Wazdan, logo: WazdanLogo, id: "wazdan" },
                            { name: "GameArt", img: GameArt, logo: GameArtLogo, id: "GameArt" },
                            { name: "PlayStar", img: PlayStar, logo: PlayStarLogo, id: "PlayStar" },
                            { name: "NetGame", img: NetGame, logo: NetGameLogo, id: "netgame" },
                            { name: "SlotMill", img: SlotMill, logo: SlotMillLogo, id: "slotmill" },
                            { name: "Red Tiger", img: RedTiger, logo: RedTigerLogo, id: "redtiger" },
                            // { name: "PlayPearls", img: PlayPearls, logo: PlayPearlsLogo, id: "playpearls" },
                            { name: "Hacksaw Gaming", img: Hacksaw, logo: HacksawLogo, id: "Hacksaw" },
                            // { name: "Dragon Gaming", img: Dragon, logo: DragonLogo, id: "dragon" },
                            { name: "Relax Gaming", img: Relax, logo: RelaxLogo, id: "Relax Gaming" },
                            // { name: "Mobilots", img: Mobilots, logo: MobilotsLogo, id: "mobilots" },
                            { name: "RTG Slots", img: RTGSlots, logo: RTGSlotsLogo, id: "rtgslots" },
                            { name: "Thunder", img: Thunder, logo: ThunderLogo, id: "Thunderkick" },
                            // { name: "Elk Studios", img: Elk, logo: ElkLogo, id: "elk" },
                            { name: "Red Rake", img: RedRake, logo: RedRakeLogo, id: "redrake" },
                            { name: "QuickSpin", img: QuickSpin, logo: QuickSpinLogo, id: "quickspin" },
                            { name: "Fantasma", img: Fantasma, logo: FantasmaLogo, id: "fantasma" },
                            { name: "Blueprint", img: Blueprint, logo: BlueprintLogo, id: "Blueprint Gaming" },
                            { name: "NoLimit City", img: NoLimit, logo: NoLimitLogo, id: "Nolimit City" },
                            { name: "1X2 Gaming", img: OneXTwoGaming, logo: OneXTwoGamingLogo, id: "1x2 Gaming" },
                            { name: "NetEnt", img: NetEnt, logo: NetEntLogo, id: "netent" },
                            { name: "Asian", img: Asian, logo: AsianLogo, id: "Asia Gaming" },
                            { name: "Booongo", img: Booongo, logo: BooOngoLogo, id: "Booongo" },
                            { name: "CQ9", img: CQ9, logo: CQ9Logo, id: "CQ9" },
                            { name: "DreamTech", img: DreamTech, logo: DreamTechLogo, id: "dreamtech" },
                            { name: "EvoPlay", img: EvoPlay, logo: EvoPlayLogo, id: "evoplay" },
                            // { name: "Genesis", img: Genesis, logo: GenesisLogo, id: "genesis" },
                            { name: "Habanero", img: Habanero, logo: HabaneroLogo, id: "Habanero" },
                            { name: "Micro", img: Micro, logo: MicroLogo, id: "MicroGaming" },
                            { name: "PGSoft", img: PGSoft, logo: PGSoftLogo, id: "PG Soft" },
                            { name: "PlaynGO", img: PlaynGO, logo: PlaynGOLogo, id: "playngo" },
                            { name: "Pragmatic", img: Pragmatic, logo: PragmaticLogo, id: "PragmaticPlay" },
                            // { name: "TPG", img: TPG, logo: TPGLogo, id: "tpg" },
                            // { name: "TTG", img: TTG, logo: TTGLogo, id: "ttg" },
                            { name: "Yggdrasil", img: Yggdrasil, logo: YggdrasilLogo, id: "Yggdrasil" }
                        ].map((provider, idx) => (
                            <div
                                key={provider.name}
                                className="relative cursor-pointer w-[200px] h-[200px]"
                                onClick={() => ProcessSlot(provider.id)}
                            >
                                {
                                    loading && selectedGame === provider.name && <Spin className="flex z-[1000] justify-center items-center absolute top-[100px] left-0 w-full h-full" />
                                }
                                <div className="z-[3] absolute w-full top-1 justify-center flex">
                                    <Image src={provider.logo} alt={provider.name} width={100} height={100} />
                                </div>
                                <div className="z-[3] absolute overflow-hidden w-full justify-center flex top-[40px]">
                                    <span className="text-[25px] text-[yellow] font-bold">{provider.name}</span>
                                </div>
                                <Image src={gameBG} alt="game" className="absolute z-[2] top-0 left-0 w-full h-full" width={200} height={200} />
                                <Image src={provider.img} alt={provider.name} className="opacity-100 z-[1] absolute bottom-[10px] left-[0px]" width={200} height={190} />
                            </div>
                        ))}
                    </div>
                )
            }
           
        </Card>

        {/* Add Balance Modal */}
        <Modal
            title={t("addBalance")}
            open={isAddBalanceModalOpen}
            onCancel={handleAddBalanceModalCancel}
            footer={null}
        >
            <Form
                form={addBalanceForm}
                layout="vertical"
                onFinish={handleAddBalance}
            >
                <Form.Item
                    name="amount"
                    label={t("amount")}
                    rules={[
                        { required: true, message: "Please enter an amount" },
                        { type: "number", min: 1, message: "Amount must be greater than 0" }
                    ]}
                >
                    <InputNumber
                        style={{ width: "100%" }}
                        placeholder="Enter amount to add"
                        min={1}
                        precision={2}
                    />
                </Form.Item>
                <Form.Item>
                    <div className="flex justify-end gap-2">
                        <Button onClick={handleAddBalanceModalCancel}>
                            {t("cancel")}
                        </Button>
                        <Button 
                            type="primary" 
                            htmlType="submit" 
                            loading={addBalanceLoading}
                        >
                            {t("submit")}
                        </Button>
                    </div>
                </Form.Item>
            </Form>
        </Modal>
            </Content>
        )}

    </>
  );
};

export default SlotPage;