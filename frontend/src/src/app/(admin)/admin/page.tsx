"use client";
import React, { useEffect, useState } from "react";

import { Layout, Statistic, Space, Card, Divider, Table, Tag } from "antd";
import type { TableProps } from "antd";

import { Content } from "antd/es/layout/layout";

import {
  DollarCircleOutlined,
  UserAddOutlined,
  UserOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";
import { useTranslations } from "next-intl";

import { Column } from "@ant-design/charts";

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
  tags: string[];
}

const columns: TableProps<DataType>["columns"] = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    render: (text) => <a>{text}</a>,
  },
  {
    title: "Age",
    dataIndex: "age",
    key: "age",
  },
  {
    title: "Address",
    dataIndex: "address",
    key: "address",
  },
  {
    title: "Tags",
    key: "tags",
    dataIndex: "tags",
    render: (_, { tags }) => (
      <>
        {tags.map((tag) => {
          let color = tag.length > 5 ? "geekblue" : "green";
          if (tag === "loser") {
            color = "volcano";
          }
          return (
            <Tag color={color} key={tag}>
              {tag.toUpperCase()}
            </Tag>
          );
        })}
      </>
    ),
  },
  {
    title: "Action",
    key: "action",
    render: (_, record) => (
      <Space size="middle">
        <a>Invite {record.name}</a>
        <a>Delete</a>
      </Space>
    ),
  },
];

const data: DataType[] = [
  {
    key: "1",
    name: "John Brown",
    age: 32,
    address: "New York No. 1 Lake Park",
    tags: ["nice", "developer"],
  },
  {
    key: "2",
    name: "Jim Green",
    age: 42,
    address: "London No. 1 Lake Park",
    tags: ["loser"],
  },
  {
    key: "3",
    name: "Joe Black",
    age: 32,
    address: "Sydney No. 1 Lake Park",
    tags: ["cool", "teacher"],
  },
];

const Dashboard: React.FC = () => {
  const t = useTranslations();
  const [mount, setMount] = useState<boolean>(false);
  const config1 = {
    data: [
      { name: "04/21", action: "Deposit", pv: 2030 },
      { name: "04/21", action: "Withdraw", pv: 2500 },
      { name: "04/22", action: "Deposit", pv: 2030 },
      { name: "04/22", action: "Withdraw", pv: 2500 },
      { name: "04/23", action: "Deposit", pv: 3030 },
      { name: "04/23", action: "Withdraw", pv: 3500 },
      { name: "Today", action: "Deposit", pv: 2300 },
      { name: "Today", action: "Withdraw", pv: 2500 },
    ],
    group: true,
    xField: "name",
    yField: "pv",
    colorField: "action",
    label: {
      text: (d: any) => d.pv,
      textBaseline: "bottom",
    },
    height: 200,
    style: {
      inset: 5,
      maxWidth: 30,
    },
    // conversionTag: {
    //   size: 40,
    //   spacing: 4,
    //   text: {
    //     formatter: (prev: number, next: number) =>
    //       `${((next / prev) * 100).toFixed(1)}%`,
    //   },
    // },
  };
  const config2 = {
    data: [
      { name: "04/21", action: "Betting", pv: 2030 },
      { name: "04/21", action: "Win", pv: 2500 },
      { name: "04/22", action: "Betting", pv: 2030 },
      { name: "04/22", action: "Win", pv: 2500 },
      { name: "04/23", action: "Betting", pv: 3030 },
      { name: "04/23", action: "Win", pv: 3500 },
      { name: "Today", action: "Betting", pv: 2300 },
      { name: "Today", action: "Win", pv: 2500 },
    ],
    group: true,
    xField: "name",
    yField: "pv",
    colorField: "action",
    label: {
      text: (d: any) => d.pv,
      textBaseline: "bottom",
    },
    height: 200,
    style: {
      inset: 5,
      maxWidth: 30,
    },
    // conversionTag: {
    //   size: 40,
    //   spacing: 4,
    //   text: {
    //     formatter: (prev: number, next: number) =>
    //       `${((next / prev) * 100).toFixed(1)}%`,
    //   },
    // },
  };
  useEffect(() => {
    setMount(true);
  }, []);
  return mount ? (
    <Layout>
      <Content className="overflow-auto h-[calc(100vh-100px)] dark:bg-black">
        <Card title={t("admin/todayStatistics")} className="!mb-2">
          <Space wrap className="w-full justify-between">
            <Statistic
              title="Withdraw"
              value={1128}
              prefix={<DollarCircleOutlined />}
            />
            <Statistic
              title="User Deposit"
              value={93}
              prefix={<DollarCircleOutlined />}
            />
            <Statistic
              title="User Withdraw"
              value={1128}
              prefix={<DollarCircleOutlined />}
            />
            <Statistic
              prefix={<DollarCircleOutlined />}
              title="Total Deposit"
              value={93}
            />
            <Statistic
              title="Total Withdraw"
              value={1128}
              prefix={<DollarCircleOutlined />}
            />
          </Space>
          <Divider />
          <Space wrap className="w-full justify-between">
            <Statistic
              title="Betting"
              value={1128}
              prefix={<DollarCircleOutlined />}
            />
            <Statistic
              prefix={<DollarCircleOutlined />}
              title="Prize"
              value={93}
            />
            <Statistic
              prefix={<UserOutlined />}
              title="Betting Users"
              value={93}
              suffix="/ 100"
            />
            <Statistic
              title="Registered Users"
              value={1128}
              prefix={<UserAddOutlined />}
            />
            <Statistic
              title="Number of visiters"
              value={1128}
              prefix={<UserSwitchOutlined />}
            />
          </Space>
        </Card>
        <Space.Compact className="w-full gap-2">
          <Space direction="vertical" className="w-full flex-1">
            <Card title={t("admin/todayDepositWithdraw")}>
              <Column {...config1} />
            </Card>
            <Card title={t("admin/todayDepositWithdraw")}>
              <Column {...config2} />
            </Card>
          </Space>
          <Space.Compact
            direction="vertical"
            className="w-full flex-2 p-0 gap-2"
          >
            <Space wrap align="start" className="w-full">
              <Card title={t("admin/todayDepositWithdraw")}>
                membership point
              </Card>
              <Card title={t("admin/todayDepositWithdraw")}>total points</Card>
              <Card title={t("admin/todayDepositWithdraw")}>
                Rolling the total
              </Card>
              <Card title={t("admin/todayDepositWithdraw")}>Prize amount</Card>
            </Space>
            <Space.Compact className="w-full">
              <Card
                title={t("Recent user deposits and withdrawals")}
                classNames={{
                  body: "!p-0",
                }}
              >
                <Table<DataType>
                  columns={columns}
                  dataSource={data}
                  className="w-full"
                />
              </Card>
            </Space.Compact>
          </Space.Compact>
        </Space.Compact>
      </Content>
    </Layout>
  ) : null;
};

export default Dashboard;
