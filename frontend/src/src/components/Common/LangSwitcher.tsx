import React, { useState } from "react";
import { Button, Dropdown, MenuProps } from "antd";

import { Locale } from "@/i18n/config";
import { setUserLocale } from "@/services/locale";
import { MenuItemType } from "antd/es/menu/interface";

const LangSwitcher: React.FC<{ locale: Locale }> = ({ locale }) => {
  const [lang, setLang] = useState(locale);
  const items: MenuProps["items"] = [
    {
      key: "en",
      label: "🇺🇸 EN",
      onClick: (info) => handleChange(info.key),
    },
    {
      key: "cn",
      label: "🇨🇳 CN",
      onClick: (info) => handleChange(info.key),
    },
    {
      key: "th",
      label: "🇹🇭 TH",
      onClick: (info) => handleChange(info.key),
    },
  ];
  const handleChange = (value: Locale) => {
    setLang(value);
    setUserLocale(value);
  };

  return (
    <Dropdown menu={{ items }}>
      <Button type="text">
        {(items.find((i) => i?.key == lang) as MenuItemType)?.label}
      </Button>
    </Dropdown>
  );
};

export default LangSwitcher;
