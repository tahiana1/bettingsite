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
} from "antd";

import type { TableProps } from "antd";
import { Content } from "antd/es/layout/layout";

import { useTranslations } from "next-intl";

import { RxLetterCaseToggle } from "react-icons/rx";
import { BiBlock, BiTrash } from "react-icons/bi";
import { useQuery } from "@apollo/client";

interface CategorySettingsDataType {
  name: string;
  showYn: Boolean;
  whetherToCheck: Boolean;
  instantMsg: string;
  orderNum: number;
}

interface GameSettingsDataType {
  name: string;
  showYn: Boolean;
  whetherToCheck: Boolean;
  loginYn: Boolean;
  useInquiry: Boolean;
  InstantMsg: string;
  matchesNum: number;
  startSetTime: number;
  matchScheduleYn: Boolean;
  orderNum: number;
  image: string
}

interface LSportsDataType {
  name: string;
  realtime: Boolean;
  freeMatch: Boolean;
  live: Boolean;
}

interface RealtimeAPIDataType {
  name: string;
  whetherToUse: Boolean;
  gameURL: string;
  resultURL: string;
}

interface BettingLimitsDataType {
  name: string;
  
  // whetherToUse: Boolean;
  // gameURL: string;
  // resultURL: string;
}

const categoryData: CategorySettingsDataType[] = [
  {
    name: "baseball",
    showYn: true,
    whetherToCheck: false,
    instantMsg: "We are currently checking. Please try again later.",
    orderNum: 1,
  },
  {
    name: "soccer",
    showYn: true,
    whetherToCheck: false,
    instantMsg: "We are currently checking. Please try again later.",
    orderNum: 2,
  },
  {
    name: "basketball",
    showYn: true,
    whetherToCheck: false,
    instantMsg: "We are currently checking. Please try again later.",
    orderNum: 3,
  },
];

const gameSettingsData: GameSettingsDataType[] = [
  {
    name: "Foreign",
    showYn: true,
    whetherToCheck: false,
    loginYn: false,
    useInquiry: false,
    InstantMsg: "We are currently checking. Please try again later.",
    matchesNum: 1,
    startSetTime: 1,
    matchScheduleYn: false,
    orderNum: 1,
    image: "https://example.com/image1.png",
  },
  {
    name: "Foreign",
    showYn: true,
    whetherToCheck: false,
    loginYn: false,
    useInquiry: false,
    InstantMsg: "We are currently checking. Please try again later.",
    matchesNum: 1,
    startSetTime: 1,
    matchScheduleYn: false,
    orderNum: 1,
    image: "https://example.com/image1.png",
  },
  {
    name: "Foreign",
    showYn: true,
    whetherToCheck: false,
    loginYn: false,
    useInquiry: false,
    InstantMsg: "We are currently checking. Please try again later.",
    matchesNum: 1,
    startSetTime: 1,
    matchScheduleYn: false,
    orderNum: 1,
    image: "https://example.com/image1.png",
  },
];

const SportsSettings: React.FC = () => {
  const t = useTranslations();

  // const [countries, setCountries] = useState<any[]>([]);
  // const { countryLoading, countryData, refetch } = useQuery();

  const categoryColumns: TableProps<CategorySettingsDataType>["columns"] = [
    {
      title: t("sportsGameName"),
      dataIndex: "name",
      key: "name",
    },
    {
      title: t("presentOrNot"),
      dataIndex: "showYn",
      key: "showYn",
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
    {
      title: t("whetherToCheck"),
      dataIndex: "whetherToCheck",
      key: "whetherToCheck",
      render: (text, record) => {
        console.log("test", text)
        return (
          <Switch
            size="small"
            checked={text}
            // onChange={(checked) => onStatusChange(record, checked)}
          ></Switch>
        );
      },
    },
    {
      title: t("inspectionMessage"),
      key: "instantMsg",
      dataIndex: "instantMsg",
      fixed: "right",
      render: (msg, record) => {
        return(
        <Space.Compact>
          <Input defaultValue={msg} />
          <Button type="primary">change</Button>
        </Space.Compact>
      )},
    },
    {
      title: t("order"),
      dataIndex: "orderNum", 
      key: "orderNum",
      render: (text, record) => {
        const options = Array.from({length: 3}, (_, i) => ({
          value: i + 1,
          label: i + 1
        }));
        return (
          <Select
            value={text}
            style={{ width: 100 }}
            options={options}
            // onChange={(value) => onLevelChange(record, value)}
          />
        );
      }
    },
  ];

  const gameSettingsColumns: TableProps<GameSettingsDataType>["columns"] = [
    {
      title: t("name"),
      dataIndex: "name",
      key: "name",
    },
    {
      title: t("presentOrNot"),
      dataIndex: "showYn",
      key: "showYn",
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
    {
      title: t("whetherToCheck"),
      dataIndex: "whetherToCheck",
      key: "whetherToCheck",
      render: (text, record) => {
        console.log("test", text)
        return (
          <Switch
            size="small"
            checked={text}
            // onChange={(checked) => onStatusChange(record, checked)}
          ></Switch>
        );
      },
    },
    {
      title: t("loginYn"),
      dataIndex: "loginYn",
      key: "loginYn",
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
    {
      title: t("useInquiry"),
      dataIndex: "useInquiry",
      key: "useInquiry",
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
    {
      title: t("inspectionMessage"),
      key: "instantMsg",
      dataIndex: "instantMsg",
      fixed: "right",
      render: (msg, record) => {
        console.log("ddd", msg)
        return(
        <Space.Compact>
          <Input defaultValue={msg} />
          <Button type="primary">change</Button>
        </Space.Compact>
      )},
    },
    {
      title: t("matchesNum"),
      key: "matchesNum",
      dataIndex: "matchesNum",
      fixed: "left",
      render: (num, record) => {
        return(
        <Space.Compact>
          <Input defaultValue={num} />
          <Button type="primary">change</Button>
        </Space.Compact>
      )},
    },
    {
      title: t("startSetTime"),
      key: "startSetTime",
      dataIndex: "startSetTime",
      fixed: "left",
      render: (num, record) => {
        return(
        <Space.Compact>
          <Input defaultValue={num} />
          <Button type="primary">change</Button>
        </Space.Compact>
      )},
    },
    {
      title: t("matchScheduleYn"),
      dataIndex: "matchScheduleYn",
      key: "matchScheduleYn",
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
    {
      title: "order",
      dataIndex: "orderNum", 
      key: "orderNum",
      render: (text, record) => {
        const options = Array.from({length: 5}, (_, i) => ({
          value: i + 1,
          label: i + 1
        }));
        return (
          <Select
            value={text}
            style={{ width: 100 }}
            options={options}
            // onChange={(value) => onLevelChange(record, value)}
          />
        );
      }
    },
    {
      title: t("image"),
      dataIndex: "image",
      key: "image",
      render: (text, record) => {
        return (
          <Image
            width={50}
            height={50}
            src={text}
            alt={record.name}
            fallback="/images/default.png"
          />
        );
      },
    },
  ];

  return (
    <Layout>
      <Content className="overflow-auto h-[calc(100vh-100px)] dark:bg-black">
        <Space.Compact className="w-full gap-2">
          <Space direction="vertical" className="w-full flex-1">
            <Card
              classNames={{
                body: "!p-0",
              }}
              title={t("sportsCategorySettings")}
            >
              <Space className="w-full justify-around">
                <Space className="gap-2">
                </Space>
                <Space className="gap-2">
                </Space>
              </Space>
              <Table<CategorySettingsDataType>
                columns={categoryColumns}
                dataSource={categoryData}
                className="w-full"
              />
            </Card>
          </Space>
        </Space.Compact>
        <Space.Compact className="w-full gap-2">
          <Space direction="vertical" className="w-full flex-1">
            <Card
              classNames={{
                body: "!p-0",
              }}
              title={t("sportsGameSettings")}
            >
              <Space className="w-full justify-around">
                <Space className="gap-2">
                </Space>
                <Space className="gap-2">
                </Space>
              </Space>
              <Table<GameSettingsDataType>
                columns={gameSettingsColumns}
                dataSource={gameSettingsData}
                className="w-full"
              />
            </Card>
          </Space>
        </Space.Compact>
      </Content>
    </Layout>
  );
};

export default SportsSettings;
