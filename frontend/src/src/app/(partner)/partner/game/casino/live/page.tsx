"use client";
import React, { useEffect, useState } from "react";
import { Content } from "antd/es/layout/layout";
import { Layout, Card, Tabs } from "antd";
import { useFormatter, useTranslations } from "next-intl";
import CasinoLiveWin from "./win";
import CasinoLiveSports from "./sports";
import CasinoLiveCup from "./cup";
import CasinoLiveOlebet from "./olebet";
import CasinoLiveSoul from "./soul";
import CasinoLiveDnine from "./dnine";
import CasinoLiveChoco from "./choco";
import CasinoLiveCok from "./cok";
import CasinoLiveOsaka from "./osaka";
import CasinoLiveBelly from "./belly";
import CasinoLiveHouse from "./house";
import CasinoLiveBlue from "./blue";
import CasinoLiveVivaldi from "./vivaldi";
const CasinoLivePage: React.FC = () => {
  const t = useTranslations();
  const f = useFormatter();
  const items = [
    {
      key: "1",
      label: t("admin/menu/casino/live/win"),
      children: <CasinoLiveWin />,
    },
    {
      key: "2",
      label: t("admin/menu/casino/live/sports"),
      children: <CasinoLiveSports />,
    },
    {
      key: "3",
      label: t("admin/menu/casino/live/cup"),
      children: <CasinoLiveCup />,
    },
    {
      key: "4",
      label: t("admin/menu/casino/live/olebet"),
      children: <CasinoLiveOlebet />,
    },
    {
      key: "5",
      label: t("admin/menu/casino/live/soul"),
      children: <CasinoLiveSoul />,
    },
    {
      key: "6",
      label: t("admin/menu/casino/live/dnine"),
      children: <CasinoLiveDnine />,
    },
    {
      key: "7",
      label: t("admin/menu/casino/live/choco"),
      children: <CasinoLiveChoco />,
    },
    {
      key: "8",
      label: t("admin/menu/casino/live/cok"),
      children: <CasinoLiveCok />,
    },
    {
      key: "9",
      label: t("admin/menu/casino/live/osaka"),
      children: <CasinoLiveOsaka />,
    },
    {
      key: "10",
      label: t("admin/menu/casino/live/belly"),
      children: <CasinoLiveBelly />,
    },
    {
      key: "11",
      label: t("admin/menu/casino/live/house"),
      children: <CasinoLiveHouse />,
    },
    {
      key: "12",
      label: t("admin/menu/casino/live/blue"),
      children: <CasinoLiveBlue />,
    },
    {
      key: "13",
      label: t("admin/menu/casino/live/blue"),
      children: <CasinoLiveBlue />,
    },
    {
      key: "14",
      label: t("admin/menu/casino/live/vivaldi"),
      children: <CasinoLiveVivaldi />,
    },
  ];
  return (
    <Layout>
      <Content className="overflow-auto h-[calc(100vh-100px)] dark:bg-black">
        <Card
          title={t("admin/menu/casinoLive")}
          classNames={{
            body: "!p-0",
          }}
        >
          <div className="px-3 pb-3">
            <Tabs items={items} />
          </div>
        </Card>
      </Content>
    </Layout>
  );
};

export default CasinoLivePage;
