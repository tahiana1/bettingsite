"use client";

import { Button, Card, message, Spin, Modal, Form, InputNumber, Layout } from "antd";
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
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAtom } from "jotai";
import { userState } from "@/state/state";
import Login from "@/components/Auth/Login";

const Casino: React.FC = () => {
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

    const ProcessCasino = (name : string) => {
        setLoading(true);
        setSelectedGame(name);
        console.log(userId, 'userid')
        
        // Clear any existing popup check interval
        if (popupCheckInterval.current) {
            clearInterval(popupCheckInterval.current);
            popupCheckInterval.current = null;
        }
        
        api("casino/get-game-link", {
            method: "GET",
            params: {
                username : userId,
                // username: userId,
                gameName: name
            }
        }).then((res) => {
            console.log('🎯 Game link received:', res.link);
            const newWindow = window.open(res.link, '_blank', 'width=1200,height=800,toolbar=no,menubar=no,scrollbars=yes,resizable=yes,location=no,status=no');
            
            if (newWindow) {
                console.log('✅ Popup window opened successfully');
                setPopupWindow(newWindow);
                popupGameName.current = name; // Store the game name
                handlePopupOpen(name);
                
                // Check if popup is closed every 2 seconds
                popupCheckInterval.current = setInterval(() => {
                    checkPopupClosed(name);
                }, 2000);
                
                // Also try to add an onbeforeunload event listener to the popup
                try {
                    newWindow.onbeforeunload = () => {
                        console.log(`🔄 Popup window unloading for ${name}`);
                        handlePopupClose(name);
                    };
                } catch (error) {
                    console.log('⚠️ Could not add onbeforeunload listener (cross-origin restriction)');
                }
                
            } else {
                console.log('❌ Popup blocked by browser');
                message.error('Popup blocked by browser. Please allow popups for this site.');
            }
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
                        <Image src={CasinoLogo} alt="casino" width={70} height={70} />
                        <div className="flex flex-col mt-1">
                            <div className="text-2xl font-bold">{t("casino")}</div>
                            <div className="text-sm text-gray-500">{t("totalLiveCasinoGameProviders")} <span className="text-blue-500">19</span> {t("liveCasinoGameProviders")}</div>
                        </div>
                    </div>
                    <div className="flex justify-end items-center gap-2 py-1 mb-1">
                        <div className="text-sm text-gray-500">{t("balance")}: <span className="text-blue-500">{balance}</span></div>
                        {/* <button 
                            className="bg-blue-500 text-white px-3 py-1 rounded-md cursor-pointer"
                            onClick={() => setIsAddBalanceModalOpen(true)}
                        >
                            {t("addBalance")}
                        </button> */}
                        {/* <button className="bg-red-500 text-white px-3 py-1 rounded-md cursor-pointer">{t("withdraw")}</button> */}
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
                        <div className="z-[3] absolute overflow-hidden w-full justify-center flex top-[40px]">
                            <span className="text-[25px] text-[yellow] font-bold">{provider.name}</span>
                        </div>
                        <Image src={gameBG} alt="game" className="absolute z-[2] top-0 left-0 w-full h-full" width={200} height={200} />
                        <Image src={provider.img} alt={provider.name} className="opacity-100 z-[1] absolute bottom-[10px] left-[0px]" width={200} height={190} />
                    </div>
                ))}
            </div>
        </Card>

        {/* Add Balance Modal */}
        {/* <Modal
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
        </Modal> */}
            </Content>
        )}

    </>
  );
};

export default Casino;