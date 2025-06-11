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
  DatePicker,
  Typography,
} from "antd";

import type { TableProps } from "antd";
import { Content } from "antd/es/layout/layout";

import { useTranslations } from "next-intl";


interface DataType {
  key: React.Key;
  id: string;
  manager: string;
  isAuto: Boolean;
  gameID: string;
  registrationDate: string;
  gameChangeDetails: string;
  marketChangeHistory: string;
}

const data: DataType[] = [
  {
    key: "1",
    id: "1",
    manager: "Hanline1",
    isAuto: true,
    gameID: "14848558",
    registrationDate: "2025-01-01",
    gameChangeDetails: "Game change hostory - None",
    marketChangeHistory: "Market change(236)",
  },
  {
    key: "2",
    id: "2",
    manager: "9",
    isAuto: false,
    gameID: "15024531",
    registrationDate: "2025-01-01",
    gameChangeDetails: "Game change hostory - None",
    marketChangeHistory: "Market change(236)",
  },
  {
    key: "3",
    id: "3",
    manager: "9",
    isAuto: false,
    gameID: "15024531",
    registrationDate: "2025-01-01",
    gameChangeDetails: "Game change hostory - None",
    marketChangeHistory: "Market change(236)",
  },
];

const MatchManagementChangeHistory: React.FC = () => {
  const t = useTranslations();

  const columns: TableProps<DataType>["columns"] = [
    {
      title: t("number"),
      dataIndex: "number",
      key: "number",
      render: (_, __, index) => index + 1,
      width: 50,
    },
    {
      title: t("manager"),
      dataIndex: "manager",
      key: "manager",
    },
    {
      title: t("autoOrManual"),
      dataIndex: "isAuto",
      key: "isAuto",
      render: (isAuto) => (
        <Typography.Text>{isAuto ? t("automatic") : t("manual")}</Typography.Text>
      ),
    },
    {
      title: t("gameID"),
      dataIndex: "gameID",
      key: "gameID",
    },
    {
      title: t("registrationDate"),
      dataIndex: "registrationDate",
      key: "registrationDate",
    },
    {
      title: t("gameChangeDetails"),
      dataIndex: "gameChangeDetails",
      key: "gameChangeDetails",
    },
    {
      title: t("marketChangeHistory"),
      dataIndex: "marketChangeHistory",
      key: "marketChangeHistory",
    },
  ];

  return (
    <Layout>
      <Content className="overflow-auto h-[calc(100vh-100px)] dark:bg-black">
        <Card
          title={t("admin/menu/matchManagementHistory")}
        >
          <Space>
            <Space.Compact block>
              <Button type="primary">{t("entire")}</Button>
              <Button type="default">{t("manualMatch")}</Button>
              <Button type="default">{t("autoMatch")}</Button>
            </Space.Compact>
          </Space>
          <Card size="small"
            className="w-full"
            extra={<Space className="gap-2">
              <DatePicker.RangePicker />
              <Input
                size="small"
                placeholder={t("matchNumber")}
              />
              <Input.Search
              size="small"
              placeholder={t("adminChangeHistory")}
              suffix={
                <Button
                  size="small"
                  type="text"
                />
              }
              enterButton={t("search")}
            />
            </Space>}
          >
            <Table<DataType>
              columns={columns}
              dataSource={data}
              className="w-full"
              scroll={{ x: true }}
            />
          </Card>
        </Card>
      </Content>
    </Layout>
  );
};

export default MatchManagementChangeHistory;
