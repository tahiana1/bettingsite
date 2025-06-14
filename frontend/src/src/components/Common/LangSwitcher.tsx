import React, { useState } from "react";
import { Button, Dropdown, MenuProps } from "antd";
import Image from "next/image";
import { Locale } from "@/i18n/config";
import { setUserLocale } from "@/services/locale";
import { MenuItemType } from "antd/es/menu/interface";

import "dayjs/locale/en";
import "dayjs/locale/zh-cn";
import "dayjs/locale/ko";

import eNFlag from "@/assets/img/flags/us.svg";
import cnFlag from "@/assets/img/flags/cn.svg";
import koFlag from "@/assets/img/flags/kr.svg";
import dayjs from "dayjs";

const LangSwitcher: React.FC<{ locale: Locale }> = ({ locale }) => {
  const [lang, setLang] = useState(locale);
  const dayjsLang: { [key: string]: string } = {
    en: "en",
    cn: "zh-cn",
    ko: "ko",
  };
  const items: MenuProps["items"] = [
    {
      key: "en",
      label: "EN",
      icon: <Image src={eNFlag.src} width={24} height={12} alt="en" />,
      onClick: (info) => handleChange(info.key),
    },
    {
      key: "cn",
      label: "CN",
      icon: <Image src={cnFlag.src} width={24} height={12} alt="cn" />,
      onClick: (info) => handleChange(info.key),
    },
    {
      key: "ko",
      label: "KO",
      icon: <Image src={koFlag.src} width={24} height={12} alt="ko" />,
      onClick: (info) => handleChange(info.key),
    }, 
  ];
  const handleChange = (value: Locale) => {
    setLang(value);
    setUserLocale(value);
    dayjs.locale(dayjsLang[value]);
  };

  return (
    <Dropdown menu={{ items }} className="!h-10">
      <Button type="text">
        {(items.find((i) => i?.key == lang) as MenuItemType)?.icon}
        {(items.find((i) => i?.key == lang) as MenuItemType)?.label}
      </Button>
    </Dropdown>
  );
};

export default LangSwitcher;
