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
import EOS1Component from "@/components/mini/eos1";
import eos1pb from '@/assets/img/mini/eos1pb.png';
import eos2pb from '@/assets/img/mini/eos2pb.png';
import eos3pb from '@/assets/img/mini/eos3pb.png';
import eos4pb from '@/assets/img/mini/eos4pb.png';
import eos5pb from '@/assets/img/mini/eos5pb.png';
import bepick from '@/assets/img/mini/bepick.png';
import powerball from '@/assets/img/mini/powerball.png';
import poverballgame from '@/assets/img/mini/poverballgame.png';
import dhpowerball from '@/assets/img/mini/dhpowerball.png';

const MiniPage: React.FC = () => {
    const t = useTranslations();
    const [userId, setUserId] = useState<any>("");
    const [balance, setBalance] = useState<any>(0);
    const popupCheckInterval = useRef<NodeJS.Timeout | null>(null);
    const [currentStatus, setCurrentStatus] = useState<any>(null);
    const popupGameName = useRef<string>('');
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedGame, setSelectedGame] = useState<string>('');
    const [showEOS1, setShowEOS1] = useState<boolean>(false);
    const router = useRouter();

    // Mini games data
    const minigames = [
        {
            name: "EOS 1min",
            logo: eos1pb
        },
        {
            name: "EOS 2min", 
            logo: eos2pb
        },
        {
            name: "EOS 3min",
            logo: eos3pb
        },
        {
            name: "EOS 4min",
            logo: eos4pb
        },
        {
            name: "EOS 5min",
            logo: eos5pb
        },
        {
            name: "Bepick PBG",
            logo: bepick
        },
        {
            name: "Powerball",
            logo: powerball
        },
        {
            name: "Poverball Game",
            logo: poverballgame
        },
        {
            name: "Dhpowerball",
            logo: dhpowerball
        }
    ]; 

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
                </div>
                <div className="casino-game-grid mt-8 flex flex-wrap gap-4 md:gap-8 justify-center">
                    {minigames.map((company, index) => (
                        <div
                        key={index}
                        className="casino-game-grid-item md:max-w-[300px] max-w-[180px] rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col items-center justify-center cursor-pointer hover:scale-105 transform transition-transform group relative"
                        >
                        <div className="w-full h-full relative">
                            <Image
                                src={company.logo}
                                alt={`${company.name} logo`}
                                width={300}
                                height={200}
                                className="object-contain w-full opacity-100 rounded-t-lg border-b-1 border-[#ffd273]"
                            />
                            {/* Loading Spinner */}
                            {loading && selectedGame === company.name && (
                            <div className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center rounded-t-lg z-10">
                                <Spin size="large" />
                            </div>
                            )}
                            {/* Play Now Overlay */}
                            <div className="absolute inset-0 hover:bg-black-60 bg-opacity-60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-t-lg">
                                <button 
                                    className="bg-gradient-to-b cursor-pointer from-[#fce18f] to-[#774b03] text-white font-bold py-3 px-6 rounded-lg border border-[#ffe991] shadow-lg hover:from-[#774b03] hover:to-[#fce18f] transition-all duration-300 transform hover:scale-105"
                                    onClick={() => {
                                        if (company.name === "EOS 1min") {
                                            window.open(`/eos1`, '_blank', 'width=screen.width,height=screen.height,toolbar=no,menubar=no,scrollbars=yes,resizable=yes,location=no,status=no');
                                        } else {
                                            // Handle other games
                                            // setLoading(true);
                                            // setSelectedGame(company.name);
                                        }
                                    }}
                                >
                                    {t("playNow")}
                                </button>
                            </div>
                        </div>
                        <div className="text-xl py-3 text-white font-bold text-center bg-image-game-item w-full">
                            {company.name}
                        </div>
                        </div>
                    ))}
                </div>
            </div>
        )}
    </>
  );
};

export default MiniPage;