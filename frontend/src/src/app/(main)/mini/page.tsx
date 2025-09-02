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

const MiniPage: React.FC = () => {
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
            const newWindow = window.open(res.data, '_blank', 'width=1200,height=800,toolbar=no,menubar=no,scrollbars=yes,resizable=yes,location=no,status=no');
            
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
                    <h1 className="section-title">{t("miniGames")}</h1>
                    {/* <div className="text-lg text-white">
                        {t("balance")}: <span className="text-yellow-400 font-bold">{balance}</span>
                    </div> */}
                </div>
            </div>
        )}
    </>
  );
};

export default MiniPage;