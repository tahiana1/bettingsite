"use client";

import React from "react";
import { List } from "antd";

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
  return (
    <div className="w-full px-2 pt-2">
      <List
        itemLayout="horizontal"
        dataSource={casinoProviders}
        header={
          <div className="w-full text-black font-bold text-xl px-4 justify-center flex py-3 bg-[yellow] rounded-md">
            Casino Providers
          </div>
        }
        className="w-full"
        renderItem={(item: any) => (
          <div className="cursor-pointer hover:bg-[#49aa19] hover:border-[#49aa19] rounded py-2 border-1 mb-1 border-[#999] dark:hover:bg-[#49aa19] transition-all">
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