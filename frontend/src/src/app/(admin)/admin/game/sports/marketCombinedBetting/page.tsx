"use client";
import React, { useState } from "react";

import { 
  Layout, 
  Input, 
  Space, 
  Card, 
  Table,
  Select,
  Button,
  Switch,
  Popconfirm,
  Image,
  Row,
  Col,
  Typography,
  Tooltip,
} from "antd";

import type { TableProps } from "antd";
import { Content } from "antd/es/layout/layout";

import { useTranslations } from "next-intl";

import { RxLetterCaseToggle } from "react-icons/rx";
import { BiBlock, BiEdit, BiTrash } from "react-icons/bi";
import { useQuery } from "@apollo/client";
import { FILTER_NATION } from "@/actions/nation";


interface MarketDataType {
  key: React.Key;
  id: string;
  event: string;
  code: string;
  name: string;
  currentMinDividend: number;
  currentMaxDividend: number;
  dividendX: string;
  dividend: number;
  dividendHome: number;
  dividendNo: number;
  dividendWon: number;
  orderNum: number;
  benchmark: string;
  displayedOverseasType: Boolean;
  statusDomesticType: Boolean;
  statusSpecialDisplay: Boolean;
  notPossibleSingleBetting: Boolean;
}

interface CombinationDataType {
  key: React.Key;
  id: string;
  type: string;
  event: string;
  bettingCombination: string;
}

const marketData: MarketDataType[] = [
  {
    key: "1",
    id: "1",
    event: "Soccer",
    code: "9",
    name: "Crew Pass",
    currentMinDividend: 1,
    currentMaxDividend: 100,
    dividendX: "Station:1, Jeong:1",
    dividend: 0,
    dividendHome: 0,
    dividendNo: 0,
    dividendWon: 0,
    orderNum: 1,
    benchmark: "itemSpecific",
    displayedOverseasType: true,
    statusDomesticType: true,
    statusSpecialDisplay: true,
    notPossibleSingleBetting: true,
  },
];

const combinationData: CombinationDataType[] = [
  {
    key: "1",
    id: "1",
    type: "overseas",
    event: "eSports",
    bettingCombination: "203+990",
  },
  {
    key: "2",
    id: "2",
    type: "realtime",
    event: "eSports",
    bettingCombination: "1150+990",
  },
];

const MarketCombinedBetting: React.FC = () => {
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
      title: t("event"),
      dataIndex: "event",
      key: "event",
    },
    {
      title: t("marketCode"),
      dataIndex: "code",
      key: "code",
    },
    {
      title: t("marketName"),
      dataIndex: "name",
      key: "name",
    },
    {
      title: t("currentMinDividend"),
      dataIndex: "currentMinDividend",
      key: "currentMinDividend",
    },
    {
      title: t("currentMaxDividend"),
      dataIndex: "currentMaxDividend",
      key: "currentMaxDividend",
    },
    {
      title: t("dividendX"),
      dataIndex: "dividendX",
      key: "dividendX",
    },
    {
      title: t("dividend"),
      dataIndex: "dividend",
      key: "dividend",
    },
    {
      title: `${t("dividendIncreaseDeduction")} ${t("homeNoWon")}`,
      key: "combined",
      minWidth: 150,
      width: 150,
      render: (val, record) => (
        <Space direction="vertical" align="center">
          <Space.Compact block size="small" className="gap-1">
            <Input value={record.dividendHome}/>
            <Input value={record.dividendNo}/>
            <Input value={record.dividendWon}/>
            <Button
              size="small"
              type="primary"
            >{t("apply")}</Button>
          </Space.Compact>
        </Space>
      ),
    },
    {
      title: t("order"),
      dataIndex: "orderNum", 
      key: "orderNum",
      render: (orderNum, record) => {
        const options = Array.from({length: 3}, (_, i) => ({
          value: i + 1,
          label: i + 1
        }));
        return (
          <Select
            value={orderNum}
            style={{ width: 50 }}
            options={options}
            // onChange={(value) => onLevelChange(record, value)}
          />
        );
      }
    },
    {
      title: t("benchmark"),
      dataIndex: "benchmark", 
      key: "benchmark",
      minWidth: 120,
      width: 120,
      render: (val, record) => {
        return (
          <Select
            value={val}
            style={{ width: 120 }}
            options={[{
              value: "itemSpecific", label: "Item-specific settings"
            }]}
            // onChange={(value) => onLevelChange(record, value)}
          />
        );
      }
    },
    {
      title: t("displayedOverseasType"),
      dataIndex: "displayedOverseasType",
      key: "displayedOverseasType",
      render: (val, record) => {
        return (
          <Switch
            size="small"
            checked={val}
            // onChange={(checked) => }
          ></Switch>
        );
      },
    },
    {
      title: t("statusDomesticType"),
      dataIndex: "statusDomesticType",
      key: "statusDomesticType",
      render: (val, record) => {
        return (
          <Switch
            size="small"
            checked={val}
            // onChange={(checked) => }
          ></Switch>
        );
      },
    },
    {
      title: t("statusSpecialDisplay"),
      dataIndex: "statusSpecialDisplay",
      key: "statusSpecialDisplay",
      render: (val, record) => {
        return (
          <Switch
            size="small"
            checked={val}
            // onChange={(checked) => }
          ></Switch>
        );
      },
    },
    {
      title: t("notPossibleSingleBetting"),
      dataIndex: "notPossibleSingleBetting",
      key: "notPossibleSingleBetting",
      render: (val, record) => {
        return (
          <Switch
            size="small"
            checked={val}
            // onChange={(checked) => }
          ></Switch>
        );
      },
    },
    {
      title: "action",
      key: "action",
      fixed: "right",
      render: (_, reid) => (
        <Space>
          <Space.Compact size="small" className="gap-2" direction="vertical">
            <Button type="primary">{t("change")}</Button>
            <Button type="primary" color="danger">{t("combine")}</Button>
          </Space.Compact>
        </Space>
      ),
    },
  ];

  const combinationColumns: TableProps<CombinationDataType>["columns"] = [
    {
      title: t("number"),
      dataIndex: "number",
      key: "number",
      render: (_, __, index) => index + 1,
      width: 50,
    },
    {
      title: "type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: t("event"),
      dataIndex: "event",
      key: "event",
    },
    {
      title: t("bettingCombination"),
      dataIndex: "bettingCombination",
      key: "bettingCombination",
    },
    {
      title: "action",
      key: "action",
      fixed: "right",
      render: (_, reid) => (
        <Space>
          <Space.Compact size="small" className="gap-2">
            <Tooltip title={t("change")}>
              <Button
                type="primary"
                variant="outlined"
                color="primary"
                icon={<BiEdit />}
                // onClick={() => onBlockMatch(record)}
              />
            </Tooltip>
            <Popconfirm
              title={t("confirmSure")}
              // onConfirm={() => onDeleteMatch(record)}
              description={t("deleteMessage")}
            >
              <Button
                title={t("delete")}
                variant="outlined"
                color="danger"
                icon={<BiTrash />}
              />
            </Popconfirm>
          </Space.Compact>
        </Space>
      ),
    },
  ];

  return (
    <Layout>
      <Content className="overflow-auto h-[calc(100vh-100px)] dark:bg-black">
        <Card
          title={t("admin/menu/marketCombinedBetting")}
        >
          <Space className="w-full justify-between p-2">
            <Space>
              <Button
                size="small"
                type="primary"
              >{t("prematchSTM")}</Button>
              <Button
                size="small"
                type="primary"
              >{t("liveSTM")}</Button>
            </Space>
            <Space>
              <Button
                size="small"
                type="primary"
              >{t("appUseEntirePrematchMarket")}</Button>
              <Button
                size="small"
                type="primary"
              >{t("allPrematchCombinationBetsApply")}</Button>
            </Space>
          </Space>
          <Row>
            <Col span={16} className="px-1">
              <Card size="small"
                title={`${t("marketlist")}`}
                extra={<Space className="gap-2 flex justify-between !w-full py-1">
                  <Space.Compact>
                    <Select
                      value={"entire"}
                      style={{ width: 100 }}
                      options={[
                        { value: "entire", label: t("entire") },]}
                      // onChange={(value) => onLevelChange(record, value)}
                    />
                    <Input
                      size="small"
                      placeholder={t("marketName")}
                      className="!w-[80px]"
                    />
                    <Button
                      size="small"
                      type="primary"
                    >{t("search")}</Button>
                  </Space.Compact>
                    <Typography.Text className="!text-red-700">{t("fSTM")}:</Typography.Text>
                  <Space.Compact className="gap-2">
                    <Typography.Text>{t("bulkIncreaseDecrease")}</Typography.Text>
                    <Input
                      size="small"
                      className="!w-[50px]"
                    />
                    <Input
                      size="small"
                      className="!w-[50px]"
                    />
                    <Input
                      size="small"
                      className="!w-[50px]"
                    />
                    <Button
                      size="small"
                      type="primary"
                    >{t("apply")}</Button>
                  </Space.Compact>
                </Space>}
                className="w-full">
                <Table<MarketDataType>
                  columns={marketColumns}
                  dataSource={marketData}
                  className="w-full"
                  scroll={{x:1200}}
                />
              </Card>
            </Col>
            <Col span={8} className="px-1">
              <Card size="small"
                title={`${t("addCombinationBet")}`}
                className="w-full"
              >
                <Row className="py-1">
                  <Col span={8} className="text-right px-1">
                    <Typography.Text>{t("marketCombination")}</Typography.Text>
                  </Col>
                  <Col span={16} className="px-1">
                    <Input placeholder=""/>
                    <Typography.Text>{t("combinationHint")}</Typography.Text>
                  </Col>
                </Row>
                <Row className="py-1">
                  <Col span={8} className="text-right px-1">
                    <Typography.Text>{t("combinationDescription")}</Typography.Text>
                  </Col>
                  <Col span={16} className="px-1">
                    <Input placeholder=""/>
                  </Col>
                </Row>
                <Row className="flex gap-2">
                  <Select
                    value={"domestic"}
                    style={{ width: "30%" }}
                    options={[
                      { value: "domestic", label: t("domestic") },]}
                    // onChange={(value) =>}
                  />
                  <Select
                    value={"baseball"}
                    style={{ width: "30%" }}
                    options={[
                      { value: "baseball", label: "baseball" },]}
                    // onChange={(value) =>}
                  />
                  <Select
                    value={"sameMatchAllowed"}
                    style={{ width: "30%" }}
                    options={[
                      { value: "sameMatchAllowed", label: t("sameMatchAllowed") },]}
                    // onChange={(value) =>}
                  />
                </Row>
                <Row className="flex gap-2 justify-center py-2">
                  <Button
                    size="small"
                    type="primary"
                  >{t("add")}</Button>
                </Row>
              </Card>
              <Card size="small"
                title={`${t("combinationBettingList")}`}
                className="w-full"
                extra={<Space className="gap-2 flex justify-between !w-full py-1">
                  <Space.Compact className="gap-2">
                    <Select
                      value={"entire"}
                      style={{ width: 100 }}
                      options={[
                        { value: "entire", label: t("entire") },]}
                      // onChange={(value) =>}
                    />
                    <Button
                      size="small"
                      type="primary"
                    >{t("search")}</Button>
                    <Select
                      value={"entire"}
                      style={{ width: 100 }}
                      options={[
                        { value: "entire", label: t("entire") },]}
                      // onChange={(value) =>}
                    />
                  </Space.Compact>
                </Space>}
              >
                <Table<CombinationDataType>
                  columns={combinationColumns}
                  dataSource={combinationData}
                  className="w-full"
                />
              </Card>
            </Col>
          </Row>
        </Card>
      </Content>
    </Layout>
  );
};

export default MarketCombinedBetting;
