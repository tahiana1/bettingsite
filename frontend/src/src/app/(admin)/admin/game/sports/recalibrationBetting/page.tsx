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
  bettingNumber: string;
  bettingDetailsNumber: string;
  gameID: string;
  marketID: string;
  marketName: string;
  bettingMember: string;
  type: string;
  previousDividend: string;
  subsequentDividend: string;
  previousBettingDirection: string;
  bettingDirectionAfter: string;
  previousMatchResult: string;
  resultsOfSubsequentMatches: string;
  previousBettingResults: string;
  AfterBettingResults: string;
  appliedArea: string;
  recalculationTime: string;
  manager: string;
}

const data: DataType[] = [
  {
    key: "1",
    id: "1",
    manager: "Hanline1",
    bettingNumber: "14848558",
    bettingDetailsNumber: "Hanline1",
    gameID: "14848558",
    marketID: "14848558",
    marketName: "14848558",
    bettingMember: "Game",
    type: "None",
    previousDividend: "2025-01-01",
    subsequentDividend: "2025-01-01",
    previousBettingDirection: "forward",
    bettingDirectionAfter: "forward",
    previousMatchResult: "Game change hostory - None",
    resultsOfSubsequentMatches: "Game change hostory - None",
    previousBettingResults: "Market change(236)",
    AfterBettingResults: "Market change(236)",
    appliedArea: "Market change(236)",
    recalculationTime: "Market change(236)",
  },
  {
    key: "2",
    id: "2",
    manager: "Hanline1",
    bettingNumber: "14848558",
    bettingDetailsNumber: "Hanline1",
    gameID: "14848558",
    marketID: "14848558",
    marketName: "14848558",
    bettingMember: "Game",
    type: "None",
    previousDividend: "2025-01-01",
    subsequentDividend: "2025-01-01",
    previousBettingDirection: "forward",
    bettingDirectionAfter: "forward",
    previousMatchResult: "Game change hostory - None",
    resultsOfSubsequentMatches: "Game change hostory - None",
    previousBettingResults: "Market change(236)",
    AfterBettingResults: "Market change(236)",
    appliedArea: "Market change(236)",
    recalculationTime: "Market change(236)",
  },
];

const SportsRecalibrationBetting: React.FC = () => {
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
      title: t("bettingNumber"),
      dataIndex: "bettingNumber",
      key: "bettingNumber",
    },
    {
      title: t("bettingDetailsNumber"),
      dataIndex: "bettingDetailsNumber",
      key: "bettingDetailsNumber",
    },
    {
      title: t("gameID"),
      dataIndex: "gameID",
      key: "gameID",
    },
    {
      title: t("marketID"),
      dataIndex: "marketID",
      key: "marketID",
    },
    {
      title: t("marketName"),
      dataIndex: "marketName",
      key: "marketName",
    },
    {
      title: t("bettingMember"),
      dataIndex: "bettingMember",
      key: "bettingMember",
    },
    {
      title: t("type"),
      dataIndex: "type",
      key: "type",
    },
    {
      title: t("previousDividend"),
      dataIndex: "previousDividend",
      key: "previousDividend",
    },
    {
      title: t("subsequentDividend"),
      dataIndex: "subsequentDividend",
      key: "subsequentDividend",
    },
    {
      title: t("previousBettingDirection"),
      dataIndex: "previousBettingDirection",
      key: "previousBettingDirection",
    },
    {
      title: t("bettingDirectionAfter"),
      dataIndex: "bettingDirectionAfter",
      key: "bettingDirectionAfter",
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
      title: t("previousBettingResults"),
      dataIndex: "previousBettingResults",
      key: "previousBettingResults",
    },
    {
      title: t("AfterBettingResults"),
      dataIndex: "AfterBettingResults",
      key: "AfterBettingResults",
    },
    {
      title: t("appliedArea"),
      dataIndex: "appliedArea",
      key: "appliedArea",
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
          title={t("admin/menu/recalibrationBetting")}
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
          <Space>
            <Space.Compact block>
              <Button type="primary">{t("entire")}</Button>
              <Button type="default">{t("overseas")}</Button>
              <Button type="default">{t("domestic")}</Button>
              <Button type="default">{t("inPlay")}</Button>
              <Button type="default">{t("realtime")}</Button>
              <Button type="default">{t("special")}</Button>
            </Space.Compact>
          </Space>
          <Card size="small"
            className="w-full"
            extra={<Space className="gap-2">
              <Space.Compact>
                <DatePicker.RangePicker />
                <Input
                  size="small"
                  placeholder={t("idNicknameAccount")}
                />
                <Select
                  value={"entire"}
                  style={{ width: 100 }}
                  options={[
                    { value: "entire", label: t("entire") },]}
                  // onChange={(value) => onLevelChange(record, value)}
                />
                <Button
                  size="small"
                  type="primary"
                >{t("search")}</Button>
              </Space.Compact>
              <Space.Compact>
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
              </Space.Compact>
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

export default SportsRecalibrationBetting;
