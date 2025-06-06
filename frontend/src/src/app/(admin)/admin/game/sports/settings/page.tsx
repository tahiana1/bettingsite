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
} from "antd";

import type { TableProps } from "antd";
import { Content } from "antd/es/layout/layout";

import { useTranslations } from "next-intl";

import { RxLetterCaseToggle } from "react-icons/rx";
import { BiBlock, BiTrash } from "react-icons/bi";
import { useQuery } from "@apollo/client";

interface DataType {
  name: string;
  showYn: Boolean;
  whetherToCheck: Boolean;
  instantMsg: string;
  orderNum: number;
}

const columns: TableProps<DataType>["columns"] = [
  {
    title: "Sports game name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Present or not",
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
    title: "Whether to check",
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
    title: "Inspection message",
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
    title: "order",
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

const data: DataType[] = [
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

const SportsSettings: React.FC = () => {
  const t = useTranslations();

  // const [countries, setCountries] = useState<any[]>([]);
  // const { countryLoading, countryData, refetch } = useQuery();
  return (
    <Layout>
      <Content className="overflow-auto h-[calc(100vh-100px)] dark:bg-black">
        <Space.Compact className="w-full gap-2">
          <Space direction="vertical" className="w-full flex-1">
            <Card
              classNames={{
                body: "!p-0",
              }}
            >
              <Space className="w-full justify-around">
                <Space className="gap-2">
                  {t("List of countries")}
                </Space>
                <Space className="gap-2">
                  <Select
                    size="small"
                    placeholder="select"
                    className="min-w-28"
                    allowClear
                  />
                  <Input.Search
                    size="small"
                    placeholder="Country Name"
                    suffix={
                      <Button
                        size="small"
                        type="text"
                        icon={<RxLetterCaseToggle />}
                      />
                    }
                    enterButton={t("search")}
                  />
                </Space>
              </Space>
              <Table<DataType>
                columns={columns}
                dataSource={data}
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
