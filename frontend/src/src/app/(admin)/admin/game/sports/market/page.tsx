"use client";
import React, { useState } from "react";

import { 
  Layout, 
  Input, 
  Space, 
  Card, 
  Table,
  Button,
  Switch,
  Tag,
} from "antd";

import type { TableProps } from "antd";
import { Content } from "antd/es/layout/layout";

import { useTranslations } from "next-intl";


interface MarketDataType {
  key: React.Key;
  id: React.Key;
  code: string;
  name: string;
  enName: string;
  use: Boolean;
}

const marketData: MarketDataType[] = [
  {
    key: "1",
    id: "1",
    code: "9",
    name: "Crew Pass",
    enName: "IX2",
    use: true,
  },
  {
    key: "2",
    id: "2",
    code: "10",
    name: "Score odd even",
    enName: "Odd/Even",
    use: true,
  },
  {
    key: "3",
    id: "3",
    code: "12",
    name: "Foul total",
    enName: "Total Fouls",
    use: false,
  },
];

const SportsMarketSettings: React.FC = () => {
  const t = useTranslations();

  const marketColumns: TableProps<MarketDataType>["columns"] = [
    {
      title: t("number"),
      dataIndex: "number",
      key: "number",
      render: (_, __, index) => index + 1,
      width: 50,
    },
    {
      title: t("code"),
      dataIndex: "code",
      key: "code",
    },
    {
      title: t("marketName"),
      dataIndex: "name",
      key: "name",
    },
    {
      title: t("englishName"),
      dataIndex: "enName",
      key: "enName",
    },
    {
      title: t("situation"),
      dataIndex: "use",
      key: "use",
      render: (use, record) => {
        return (
          <div
            style={{
              backgroundColor: use ? "cyan" : "red",
              textAlign: "center",
              margin: "-8px",
            }}>
            {use ? t("use") : t("notUse")}
          </div>
        );
      },
    },
    {
      title: t("whetherToUse"),
      dataIndex: "use",
      key: "use",
      render: (text, record) => {
        return (
          <Switch
            size="small"
            checked={text}
            // onChange={(checked) => onStatusChange(record, checked)}
          ></Switch>
        );
      },
    },
  ];

  return (
    <Layout>
      <Content className="overflow-auto h-[calc(100vh-100px)] dark:bg-black">
        <Card
          title={t("admin/menu/mainEventSettings")}
        >
          <Card size="small"
            title={`${t("marketlist")}`}
            className="w-full"
            extra={<Space className="gap-2">
              <Input.Search
                size="small"
                placeholder={t("marketName")}
                suffix={
                  <Button
                    size="small"
                    type="text"
                  />
                }
                enterButton={t("search")}
              />
              <Button
                size="small"
                type="primary"
              >{t("entire")}</Button>
              <Button
                size="small"
                type="primary"
              >{t("use")}</Button>
              <Button
                size="small"
                type="primary"
              >{t("notUse")}</Button>
            </Space>}
          >
            <Table<MarketDataType>
              columns={marketColumns}
              dataSource={marketData}
              className="w-full"
            />
          </Card>
        </Card>
      </Content>
    </Layout>
  );
};

export default SportsMarketSettings;
