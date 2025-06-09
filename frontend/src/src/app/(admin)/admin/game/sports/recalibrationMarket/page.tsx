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
  Select,
  Tooltip,
} from "antd";

import type { TableProps } from "antd";
import { Content } from "antd/es/layout/layout";

import { useTranslations } from "next-intl";
import { BiRefresh } from "react-icons/bi";
import dayjs from "dayjs";


interface DataType {
  key: React.Key;
  id: string;
  registrationNumber: string;
  marketNumber: string;
  marketName: string;
  fixtureID: string;
  gameTime: string;
  nation: string;
  league: string;
  team: string;
  previousMatchResult: string;
  resultsOfSubsequentMatches: string;
  recalculationTime: string;
  manager: string;
}

const data: DataType[] = [
  {
    key: "1",
    id: "1",
    manager: "Hanline1",
    registrationNumber: "Hanline1",
    marketNumber: "14848558",
    marketName: "14848558",
    fixtureID: "14848558",
    gameTime: "14848558",
    nation: "2025-01-01",
    league: "Game change hostory - None",
    team: "Game change hostory - None",
    previousMatchResult: "Game change hostory - None",
    resultsOfSubsequentMatches: "Game change hostory - None",
    recalculationTime: "Market change(236)",
  },
  {
    key: "2",
    id: "2",
    manager: "Hanline1",
    registrationNumber: "Hanline1",
    marketNumber: "14848558",
    marketName: "14848558",
    fixtureID: "14848558",
    gameTime: "14848558",
    nation: "2025-01-01",
    league: "Game change hostory - None",
    team: "Game change hostory - None",
    previousMatchResult: "Game change hostory - None",
    resultsOfSubsequentMatches: "Game change hostory - None",
    recalculationTime: "Market change(236)",
  }
];

const SportsRecalibrationMarket: React.FC = () => {
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
      title: t("registrationNumber"),
      dataIndex: "registrationNumber",
      key: "registrationNumber",
    },
    {
      title: t("marketNumber"),
      dataIndex: "marketNumber",
      key: "marketNumber",
    },
    {
      title: t("marketName"),
      dataIndex: "marketName",
      key: "marketName",
    },
    {
      title: t("fixtureID"),
      dataIndex: "fixtureID",
      key: "fixtureID",
    },
    {
      title: t("gameTime"),
      dataIndex: "gameTime",
      key: "gameTime",
    },
    {
      title: t("nation"),
      dataIndex: "nation",
      key: "nation",
    },
    {
      title: t("league"),
      dataIndex: "league",
      key: "league",
    },
    {
      title: t("team"),
      dataIndex: "team",
      key: "team",
    },
    {
      title: t("previousMatchResult"),
      dataIndex: "previousMatchResult",
      key: "previousMatchResult",
    },
    {
      title: t("resultsOfSubsequentMatches"),
      dataIndex: "resultsOfSubsequentMatches",
      key: "resultsOfSubsequentMatches",
    },
    {
      title: t("recalculationTime"),
      dataIndex: "recalculationTime",
      key: "recalculationTime",
    },
    {
      title: t("manager"),
      dataIndex: "manager",
      key: "manager",
    },
  ];

  return (
    <Layout>
      <Content className="overflow-auto h-[calc(100vh-100px)] dark:bg-black">
        <Card
          title={t("admin/menu/recalibrationMarket")}
          extra={<Space className="gap-2">
            {dayjs().format('YYYY-MM-DD HH:mm:ss')}
            <Tooltip title={t("refresh")}>
              <Button
                type="text"
                color="primary"
                icon={<BiRefresh />}
                // onClick={() => onBlockMatch(record)}
              />
            </Tooltip>
          </Space>
          }
        >
          <Card size="small"
            className="w-full"
            extra={<Space className="gap-2">
              <DatePicker.RangePicker />
              <Button
                size="small"
                type="primary"
              >{t("search")}</Button>
              <Select
                value={25}
                style={{ width: 200 }}
                options={[
                  { value: 25, label: `25 ${t("outputs")}` },
                  { value: 50, label: `50 ${t("outputs")}` },
                  { value: 100, label: `100 ${t("outputs")}` },
                ]}
                // onChange={(value) => onOutputChange(record, value)}
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

export default SportsRecalibrationMarket;
