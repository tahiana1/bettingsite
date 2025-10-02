"use client";

import { Button, message, Spin, Modal, Form, InputNumber, Layout } from "antd";
import Image from "next/image";
import { useTranslations } from "next-intl";
import api from "@/api";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAtom } from "jotai";
import { userState } from "@/state/state";
import Login from "@/components/Auth/Login";

// Import slot provider logos using actual images from the directory
import MancalaLogo from "@/assets/img/slot/mancala.png";
import CaletaLogo from "@/assets/img/slot/caleta.png";
import PlatipusLogo from "@/assets/img/slot/platipus.png";
import BoomingLogo from "@/assets/img/slot/booming.png";
import BGamingLogo from "@/assets/img/slot/bgaming.png";
import SpinomenalLogo from "@/assets/img/slot/spinomenal.png";
import PariplayLogo from "@/assets/img/slot/pariplay.png";
import NovomaticLogo from "@/assets/img/slot/novomatic.png";
import EAGamingLogo from "@/assets/img/slot/eagaming.png";
import SevenSevenSevenSevenLogo from "@/assets/img/slot/7777.png";
import SmartSoftLogo from "@/assets/img/slot/smartsoft.png";
import FilsLogo from "@/assets/img/slot/fils.png";
import SevenMojosLogo from "@/assets/img/slot/7mojos.png";
import PlaytechLogo from "@/assets/img/slot/playtech.png";
import SkywindLogo from "@/assets/img/slot/skywind.png";
import NetGamingLogo from "@/assets/img/slot/netgaming.png";
import BTGLogo from "@/assets/img/slot/btg.png";
import AvatarUXLogo from "@/assets/img/slot/avatarux.png";
import WazdanLogo from "@/assets/img/slot/wazdan.png";
import GameArtLogo from "@/assets/img/slot/gameart.png";
import PlayStarLogo from "@/assets/img/slot/playstar.png";
import NetGameLogo from "@/assets/img/slot/netgame.png";
import SlotMillLogo from "@/assets/img/slot/slotmill.png";
import RedTigerLogo from "@/assets/img/slot/redtiger.png";
import HacksawLogo from "@/assets/img/slot/hacksaw.png";
import RelaxLogo from "@/assets/img/slot/relax.png";
import RTGSlotsLogo from "@/assets/img/slot/rtg.png";
import ThunderLogo from "@/assets/img/slot/thunder.png";
import RedRakeLogo from "@/assets/img/slot/redrake.png";
import QuickSpinLogo from "@/assets/img/slot/quickspin.png";
import FantasmaLogo from "@/assets/img/slot/fantasma.png";
import BlueprintLogo from "@/assets/img/slot/blueprint.png";
import NoLimitLogo from "@/assets/img/slot/nolimit.png";
import OneXTwoGamingLogo from "@/assets/img/slot/1x2.png";
import NetEntLogo from "@/assets/img/slot/netent.png";
import AsianLogo from "@/assets/img/slot/asian.png";
import BooOngoLogo from "@/assets/img/slot/booongo.png";
import CQ9Logo from "@/assets/img/slot/cq9.png";
import DreamTechLogo from "@/assets/img/slot/dreamtech.png";
import EvoPlayLogo from "@/assets/img/slot/evoplay.png";
import HabaneroLogo from "@/assets/img/slot/habanero.png";
import MicroLogo from "@/assets/img/slot/micro.png";
import PGSoftLogo from "@/assets/img/slot/pgsoft.png";
import PlaynGOLogo from "@/assets/img/slot/playngo.png";
import PragmaticLogo from "@/assets/img/slot/pragmatic.png";
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
    const [searchTerm, setSearchTerm] = useState("");
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

    const getGameLaunchLink = (gameName: string, gameId: string) => {
        api("slot/get-game-launch-link", {
            method: "GET",
            params: {
                game_id: gameId,
                vendor: gameName.toLowerCase(),
                username: userId,
                nickname: profile?.nickname
            }
        }).then((res) => {
            const newWindow = window.open(res.data, '_blank', 'width=screen.width,height=screen.height,toolbar=no,menubar=no,scrollbars=yes,resizable=yes,location=no,status=no');
            
            if (newWindow) {
                console.log('✅ Popup window opened successfully');
                setPopupWindow(newWindow);
                popupGameName.current = gameName; // Store the game name
                handlePopupOpen(gameName);
                
                // Check if popup is closed every 2 seconds
                popupCheckInterval.current = setInterval(() => {
                    checkPopupClosed(gameName);
                }, 2000);
                
                // Also try to add an onbeforeunload event listener to the popup
                try {
                    newWindow.onbeforeunload = () => {
                        console.log(`🔄 Popup window unloading for ${gameName}`);
                        handlePopupClose(gameName);
                    };
                } catch (error) {
                    console.log('⚠️ Could not add onbeforeunload listener (cross-origin restriction)');
                }
            } else {
                console.log('❌ Popup blocked by browser');
                message.error('Popup blocked by browser. Please allow popups for this site.');
            }
        }).catch((err) => {
            console.log(err, 'err');
        });
    }

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
            <div className="mt-10 relative">
                <div className="flex justify-center items-center mb-4">
                    <h1 className="section-title">{t("slot")}</h1>
                    {/* <div className="text-lg text-white">
                        {t("balance")}: <span className="text-yellow-400 font-bold">{balance}</span>
                    </div> */}
                </div>
            {/* Slot Games Modal */}
            {selectedSlotItems?.length > 0 && (
                <Modal
                    title={
                        <div className="text-center">
                            <div className="text-2xl font-bold text-yellow-400 mb-2">{selectedGame}</div>
                            <div className="text-sm text-gray-400">{selectedGame}</div>
                        </div>
                    }
                    open={selectedSlotItems?.length > 0}
                    onCancel={() => {
                        setSelectedSlotItems([]);
                        setSearchTerm("");
                    }}
                    footer={null}
                    width={1200}
                    className="slot-games-modal"
                    style={{
                        background: 'linear-gradient(135deg, #2a1810, #1a0f0a)',
                        borderRadius: '12px'
                    }}
                >
                    <div className="p-4" style={{ background: 'linear-gradient(135deg, #2a1810, #1a0f0a)' }}>
                        <input 
                            type="text" 
                            placeholder="search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full p-3 mb-6 border border-gray-600 rounded-lg text-white bg-gray-800 placeholder-gray-400 focus:border-yellow-400 focus:outline-none"
                        />
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-h-[60vh] overflow-y-auto">
                            {selectedSlotItems
                                ?.filter((game: any) => 
                                    game.title.toLowerCase().includes(searchTerm.toLowerCase())
                                )
                                .map((game: any, idx: any) => (
                                <div
                                    key={game.id}
                                    className="relative cursor-pointer rounded-lg overflow-hidden hover:scale-105 transform transition-transform group border border-yellow-600"
                                    onClick={() => getGameLaunchLink(selectedGame, game.id)}
                                >
                                    <div className="relative">
                                        <img 
                                            src={game.thumbnail} 
                                            alt={game.title}
                                            className="w-full h-32 object-cover"
                                            loading="lazy"
                                        />
                                        {/* Loading Spinner */}
                                        {loading && (
                                            <div className="absolute inset-0 bg-opacity-80 flex items-center justify-center z-10">
                                                <Spin size="large" />
                                            </div>
                                        )}
                                        {/* Play overlay */}
                                        <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center">
                                            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                <div className="w-12 h-12 bg-yellow-400 bg-opacity-80 rounded-full flex items-center justify-center">
                                                    <div className="w-0 h-0 border-l-4 border-l-black border-t-2 border-t-transparent border-b-2 border-b-transparent ml-1"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-2 bg-gradient-to-b from-yellow-800 to-yellow-900">
                                        <p className="text-white text-sm font-medium text-center truncate">
                                            {game.title}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </Modal>
            )}
            {/* Slot Providers Grid */}
            <div className="mt-8">
                <div className="casino-game-grid grid grid-cols-6 gap-4 md:gap-6 justify-items-center">
                    {[
                        { name: "Mancala", logo: MancalaLogo, id: 'mancala' },
                        { name: "Caleta", logo: CaletaLogo, id: 'caletagaming' },
                        { name: "Platipus", logo: PlatipusLogo, id: 'platipus' },
                        { name: "Booming", logo: BoomingLogo, id: "booming" },
                        { name: "BGaming", logo: BGamingLogo, id: "bgaming" },
                        { name: "Spinomenal", logo: SpinomenalLogo, id: "spinomenal" },
                        { name: "Pariplay", logo: PariplayLogo, id: "pariplay" },
                        { name: "Novomatic", logo: NovomaticLogo, id: "novomatic" },
                        { name: "EA Gaming", logo: EAGamingLogo, id: "eagaming" },
                        { name: "7777 Gaming", logo: SevenSevenSevenSevenLogo, id: "7777" },
                        { name: "SmartSoft", logo: SmartSoftLogo, id: "smartsoft" },
                        { name: "Fils", logo: FilsLogo, id: "fils" },
                        { name: "7 Mojos", logo: SevenMojosLogo, id: "7-mojos" },
                        { name: "Playtech", logo: PlaytechLogo, id: "PlayTech" },
                        { name: "Skywind", logo: SkywindLogo, id: "Skywind Slot" },
                        { name: "NetGaming", logo: NetGamingLogo, id: "netgame" },
                        { name: "Big Time Gaming", logo: BTGLogo, id: "BigTimeGaming" },
                        { name: "AvatarUX", logo: AvatarUXLogo, id: "AvatarUX" },
                        { name: "Wazdan", logo: WazdanLogo, id: "wazdan" },
                        { name: "GameArt", logo: GameArtLogo, id: "GameArt" },
                        { name: "PlayStar", logo: PlayStarLogo, id: "PlayStar" },
                        { name: "NetGame", logo: NetGameLogo, id: "netgame" },
                        { name: "SlotMill", logo: SlotMillLogo, id: "slotmill" },
                        { name: "Red Tiger", logo: RedTigerLogo, id: "redtiger" },
                        { name: "Hacksaw Gaming", logo: HacksawLogo, id: "Hacksaw" },
                        { name: "Relax Gaming", logo: RelaxLogo, id: "Relax Gaming" },
                        { name: "RTG Slots", logo: RTGSlotsLogo, id: "rtgslots" },
                        { name: "Thunder", logo: ThunderLogo, id: "Thunderkick" },
                        { name: "Red Rake", logo: RedRakeLogo, id: "redrake" },
                        { name: "QuickSpin", logo: QuickSpinLogo, id: "quickspin" },
                        { name: "Fantasma", logo: FantasmaLogo, id: "fantasma" },
                        { name: "Blueprint", logo: BlueprintLogo, id: "Blueprint Gaming" },
                        { name: "NoLimit City", logo: NoLimitLogo, id: "Nolimit City" },
                        { name: "1X2 Gaming", logo: OneXTwoGamingLogo, id: "1x2 Gaming" },
                        { name: "NetEnt", logo: NetEntLogo, id: "netent" },
                        { name: "Asian", logo: AsianLogo, id: "Asia Gaming" },
                        { name: "Booongo", logo: BooOngoLogo, id: "Booongo" },
                        { name: "CQ9", logo: CQ9Logo, id: "CQ9" },
                        { name: "DreamTech", logo: DreamTechLogo, id: "dreamtech" },
                        { name: "EvoPlay", logo: EvoPlayLogo, id: "evoplay" },
                        { name: "Habanero", logo: HabaneroLogo, id: "Habanero" },
                        { name: "Micro", logo: MicroLogo, id: "MicroGaming" },
                        { name: "PGSoft", logo: PGSoftLogo, id: "PG Soft" },
                        { name: "PlaynGO", logo: PlaynGOLogo, id: "playngo" },
                        { name: "Pragmatic", logo: PragmaticLogo, id: "PragmaticPlay" },
                        { name: "Yggdrasil", logo: YggdrasilLogo, id: "Yggdrasil" }
                    ].map((provider, idx) => (
                        <div
                            key={provider.name}
                            className="casino-game-grid-item min-w-[180px] md:max-w-[200px] max-w-[180px] rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col items-center justify-center cursor-pointer hover:scale-105 transform transition-transform group relative"
                            onClick={() => ProcessSlot(provider.id)}
                        >
                            <div className="w-full h-full relative">
                                <Image
                                    src={provider.logo}
                                    alt={`${provider.name} logo`}
                                    className="object-contain w-full opacity-100 rounded-t-lg border-b-1 border-[#ffd273]"
                                />
                                {/* Loading Spinner */}
                                {loading && selectedGame === provider.id && (
                                    <div className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center rounded-t-lg z-10">
                                        <Spin size="large" />
                                    </div>
                                )}
                                {/* Play Now Overlay */}
                                <div className="absolute inset-0 hover:bg-black-60 bg-opacity-60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-t-lg">
                                    <button className="bg-gradient-to-b cursor-pointer from-[#fce18f] to-[#774b03] text-white font-bold py-3 px-6 rounded-lg border border-[#ffe991] shadow-lg hover:from-[#774b03] hover:to-[#fce18f] transition-all duration-300 transform hover:scale-105">
                                        {t("playNow")}
                                    </button>
                                </div>
                            </div>
                            <div className="text-xl py-3 text-white font-bold text-center bg-image-game-item w-full">
                                {provider.name}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

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
            </div>
        )}
    </>
  );
};

export default SlotPage;