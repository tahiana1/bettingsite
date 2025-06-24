"use client";

import React from "react";
import { List } from "antd";
import { useTranslations } from "next-intl";

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
  return (
    <div className="w-full px-2 pt-2">
      <List
        itemLayout="horizontal"
        dataSource={casinoProviders}
        header={
          <div className="w-full text-white font-bold text-xl px-4 justify-center flex py-3 bg-[#141414] rounded-md">
            {t("casinoProviders")}
          </div>
        }
        className="w-full"
        renderItem={(item: any) => (
          <div className="cursor-pointer hover:bg-blue-500 hover:border-blue-500 rounded py-2 border-1 mb-1 border-[#999] dark:hover:bg-blue-500 transition-all">
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