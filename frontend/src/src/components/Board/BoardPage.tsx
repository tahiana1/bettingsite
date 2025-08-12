"use client"

import { useQuery } from "@apollo/client";
import { FILTER_NOTI } from "@/actions/notification"
import { useState, useEffect } from "react";
import api from "@/api";
import TransactionFeed from '@/components/Common/TransactionFeed';
import dayjs from "dayjs";
import { useTranslations } from "next-intl";
export default function BoardPage() {
    const t = useTranslations();
    const { data, loading, error } = useQuery(FILTER_NOTI);
    const [notificationData, setNotiticationData] = useState<any[]>([]);
    const [eventData, setEventData] = useState<any[]>([]);
    useEffect(() => {
        api("common/notifications").then((result) => {
          setNotiticationData(result.data);
        });
        api("common/events").then((result) => {
          setEventData(result.data);
        });
    }, []);
  return (
    <div className="max-w-[1300px] md:px-0 px-4 mx-auto w-full">
        <div className="xl:flex justify-between w-full gap-5 min-h-[350px]">
            <div className="md:w-1/3 w-full xl:mx-0 mx-auto">
                <h1 className="text-2xl font-bold text-center text-[#d5b270]">♦ {t("notice")} ♦</h1>
                <div className="flex flex-col border-2 rounded-[15px] border-[#d5b270] px-2 min-h-[360px] max-h-[360px] overflow-y-auto mt-4">
                    {
                        notificationData.map((data, index) => {
                            return <div key={index} className="flex py-4 items-center justify-between w-full border-b border-[#312807] hover:text-[#d5b270] cursor-pointer">
                                <div className="text-xm flex items-center gap-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" fill="white" width="14" height="14" >
                                        <path d="M224.5 160C224.5 147.1 232.3 135.4 244.3 130.4C256.3 125.4 270 128.2 279.1 137.4L439.1 297.4C451.6 309.9 451.6 330.2 439.1 342.7L279.1 502.7C269.9 511.9 256.2 514.6 244.2 509.6C232.2 504.6 224.5 492.9 224.5 480L224.5 160z"/>
                                    </svg>
                                    {data.title}</div>
                                <div className="text-xm">{dayjs(data.createdAt).format("YYYY-MM-DD HH:mm:ss")}</div>
                            </div>
                        })
                    }
                </div>
            </div>  
            <div className="md:w-1/3 w-full xl:mx-0 mx-auto xl:mt-0 mt-5">
                <h1 className="text-2xl font-bold text-center text-[#d5b270]">♠ {t("realTime")} ♠</h1>
                <div className="flex flex-col border-2 rounded-[15px] border-[#d5b270] px-2 min-h-[360px] max-h-[360px] overflow-y-auto mt-4">
                    <TransactionFeed />
                </div>
            </div>
            <div className="md:w-1/3 w-full xl:mx-0 mx-auto xl:mt-0 mt-5">
                <h1 className="text-2xl font-bold text-center text-[#d5b270]">♣ {t("events")} ♣</h1>
                <div className="flex flex-col border-2 rounded-[15px] border-[#d5b270] px-2 min-h-[360px] max-h-[360px] overflow-y-auto mt-4">
                    {
                        eventData?.map((data, index) => {
                            return <div key={index} className="flex py-4 items-center justify-between w-full border-b border-[#312807] hover:text-[#d5b270] cursor-pointer">
                                <div className="text-xm flex items-center gap-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" fill="white" width="14" height="14" >
                                        <path d="M224.5 160C224.5 147.1 232.3 135.4 244.3 130.4C256.3 125.4 270 128.2 279.1 137.4L439.1 297.4C451.6 309.9 451.6 330.2 439.1 342.7L279.1 502.7C269.9 511.9 256.2 514.6 244.2 509.6C232.2 504.6 224.5 492.9 224.5 480L224.5 160z"/>
                                    </svg>
                                    {data.title}</div>
                                <div className="text-xm">{dayjs(data.createdAt).format("YYYY-MM-DD HH:mm:ss")}</div>
                            </div>
                        })
                    }
                </div>
            </div>
        </div>
    </div>
  )
}