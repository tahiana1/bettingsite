"use client";

import React, {useEffect, useState} from "react";
import { List } from "antd";
import { useTranslations } from "next-intl";
import api from "@/api";

const casinoProviders = [
  { name: "Evolution"},
  { name: "Taishan"},
  { name: "Asia Gaming"},
  { name: "Ejugi"},
  { name: "Allbet"},
  { name: "Dream Gaming"},
  { name: "Pragmatic"},
  { name: "Sexy Casino"},
  { name: "Vivogaming"},
  { name: "WM Casino"},
  { name: "BetgamesTV"},
  { name: "Bota Casino"},
  { name: "Skywind"},
  { name: "Dowin"},
  { name: "Playtech"},
  { name: "One Touch"},
  { name: "ALG Casino"},
  { name: "7Mojos"},
  { name: "Hilton Casino"},
];

const CasinoSidebar: React.FC = () => {
  const t  = useTranslations();
  const [loading, setLoading] = useState(false);
    const [userId, setUserId] = useState<any>("")
    useEffect(() => {
      api("user/me").then((res) => {
          setUserId(res.data.userid);
      }).catch((err) => {
        console.log(err);
      });
    }, []);
    const ProcessCasino = (name : string) => {
      setLoading(true);
      console.log(userId, 'userid')
      api("casino/get-game-link", {
          method: "GET",
          params: {
              username: userId,
              gameName: name
          }
      }).then((res) => {
          console.log(res.link);
          window.open(res.link, '_blank', 'width=1200,height=800,toolbar=no,menubar=no,scrollbars=yes,resizable=yes,location=no,status=no');
      }).catch((err) => {
          console.log(err);
      }).finally(() => {
          setLoading(false);
      });
    }
  return (
    <div className="w-full px-2 pt-2">
      <List
        itemLayout="horizontal"
        dataSource={casinoProviders}
        header={
          <div className="w-full text-white font-bold text-xl px-4 justify-center flex py-3 bg-[#141414] rounded-md">
            {t("casino")}
          </div>
        }
        className="w-full"
        renderItem={(item: any) => (
          <div onClick={() => ProcessCasino(item.name)} className="cursor-pointer hover:bg-blue-500 hover:border-blue-500 rounded py-2 border-1 mb-1 border-[#999] dark:hover:bg-blue-500 transition-all">
            <div className="w-full flex items-center gap-3 select-none px-2 ">
              <span className="font-medium">{item.name}</span>
            </div>
          </div>
        )}
      />
    </div>
  );
};

export default CasinoSidebar;