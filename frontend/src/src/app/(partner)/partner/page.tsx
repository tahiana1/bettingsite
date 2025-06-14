"use client";
import React, { useEffect, useState } from "react";

import { Layout, Statistic, Space, Card, Divider, Table, Tag } from "antd";
import type { TableProps } from "antd"; 

import {
  DollarCircleOutlined,
  UserAddOutlined,
  UserOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";
import { useTranslations } from "next-intl";

import { Column } from "@ant-design/charts";
import api from "@/api";

interface DataType {
  division: string,
  numberOfDeposit: number,
  numberOfWithdraw: number,
  numberOfSettlement: number,
  depositWithdraw : number,
  numberOfBets: number,
  numberOfWin: number,
  bettingWinning: number,
  numberOfMembers: number,
  numberOfBettingUsers: number,
  numberOfVisiters: number,
}

interface PaymentDataType {
  number : number,
  type : string,
  name : string,
  allas : string,
  depositor: string,
  beforeAmount : number,
  processingAmount : number,
  afterAmount : number,
  applicationDate : Date,
  processDate : Date,
}

interface DashboardResponse {
  stats: {
    depositAmount: number;
    withdrawAmount: number;
    memberDepositAmount: number;
    memberWithdrawAmount: number;
    totalDepositAmount: number;
    totalWithdrawAmount: number;
    totalSettlement: number;
    bettingAmount: number;
    prizeAmount: number;
    bettingUsers: number;
    registeredUsers: number;
    numberOfVisiters: number;
  };
  divisionSummary: DataType[];
  recentPayments: PaymentDataType[];
  depositChart: {
    name: string;
    action: string;
    pv: number;
  }[];
  bettingChart: {
    name: string;
    action: string;
    pv: number;
  }[];
}

const columns: TableProps<DataType>["columns"] = [
  {
    title: "Division",
    dataIndex: "division",
    key: "division"
  },
  {
    title: "Number of Deposit",
    dataIndex: "numberOfDeposit",
    key: "numberOfDeposit",
  },
  {
    title: "Number of Withdraw",
    dataIndex: "numberOfWithdraw",
    key: "numberOfWithdraw",
  },
  {
    title: "Number of Settlement",
    dataIndex: "numberOfSettlement",
    key: "numberOfSettlement",
  },
  {
    title: "Deposit/Withdraw",
    dataIndex: "depositWithdraw",
    key: "depositWithdraw",
    render: (text: number) => {
      return Number(text).toFixed(2)
    }
  },
  {
    title: "Number of Bets",
    dataIndex: "numberOfBets",
    key: "numberOfBets",
  },
  {
    title: "Number of Win",
    dataIndex: "numberOfWin",
    key: "numberOfWin",
  },
  {
    title: "Betting Winning",
    dataIndex: "bettingWinning",
    key: "bettingWinning",
  },
  {
    title: "Number of Members",
    dataIndex: "numberOfMembers",
    key: "numberOfMembers",
  },
  {
    title: "Number of Betting Users",
    dataIndex: "numberOfBettingUsers",
    key: "numberOfBettingUsers",
  },
  {
    title: "Number of Visiters",
    dataIndex: "numberOfVisiters",
    key: "numberOfVisiters",
  },
];
const paymentColumns: TableProps<PaymentDataType>["columns"] = [
  {
    title: "Number",
    dataIndex: "number",
    key: "number"
  },
  {
    title: "Type",
    dataIndex: "type",
    key: "type"
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Allas",
    key: "allas",
    dataIndex: "allas",
    render: (text: string) => {
      return "-"
    }
  },
  {
    title: "Depositor",
    key: "allas",
    dataIndex: "allas",
  },
  {
    title: "Before Amount",
    key: "beforeAmount",
    dataIndex: "beforeAmount",
  },
  {
    title: "Processing Amount",
    key: "processingAmount",
    dataIndex: "processingAmount",
  },
  {
    title: "After Amount",
    key: "afterAmount",
    dataIndex: "afterAmount",
  },
  {
    title: "Application Date",
    key: "applicationDate",
    dataIndex: "applicationDate",
  },
  {
    title: "Process Date",
    key: "applicationDate",
    dataIndex: "applicationDate",
  }
];

const Dashboard: React.FC = () => {
  const t = useTranslations();
  const [mount, setMount] = useState<boolean>(false);
  const [dashboardData, setDashboardData] = useState<DashboardResponse | null>(null);

  useEffect(() => {
    setMount(true);
    fetchInfo();
  }, []);

  const fetchInfo = () => {
    api("admin/dashboard/get-data", {
      method: "GET",
    }).then((res) => {
      if (res) {
        setDashboardData(res);
        // Uncomment if you want to refresh data every 15 seconds
        // setTimeout(() => {
        //   fetchInfo();
        // }, 15000);
      }
    });
  };
  return mount ? (
    <Layout>
        <Card title={t("admin/todayStatistics")} className="!mb-2">
            <Space wrap className="w-full justify-between">
           
            <Statistic
                title={t("withdrawAmount")}
                value={dashboardData?.stats.withdrawAmount || 0}
                prefix={<DollarCircleOutlined />}
                className="w-[200px]"
            />
            <Statistic
                title={t("memberDepositAmount")}
                value={dashboardData?.stats.memberDepositAmount || 0}
                prefix={<DollarCircleOutlined />}
                className="w-[200px]"
            />
            <Statistic
                title={t("memberWithdrawAmount")}
                value={dashboardData?.stats.memberWithdrawAmount || 0}
                prefix={<DollarCircleOutlined />}
                className="w-[200px]"
            />
            <Statistic
                prefix={<DollarCircleOutlined />}
                title={t("totalDepositAmount")}
                value={dashboardData?.stats.totalDepositAmount || 0}
                className="w-[200px]"
            />
            <Statistic
                title={t("totalWithdrawAmount")}
                value={dashboardData?.stats.totalWithdrawAmount || 0}
                prefix={<DollarCircleOutlined />}
                className="w-[200px]"
            />
            </Space>
        </Card>
      <Card title={t("admin/todayStatistics")} className="!mb-2">
      <Space wrap className="w-full justify-between">
            <Statistic
                title={t("depositAmount")}
                value={dashboardData?.stats.depositAmount || 0}
                prefix={<DollarCircleOutlined />}
                className="w-[200px]"
            />
            <Statistic
                title={t("withdrawAmount")}
                value={dashboardData?.stats.withdrawAmount || 0}
                prefix={<DollarCircleOutlined />}
                className="w-[200px]"
            />
            <Statistic
                title={t("memberDepositAmount")}
                value={dashboardData?.stats.memberDepositAmount || 0}
                prefix={<DollarCircleOutlined />}
                className="w-[200px]"
            />
            <Statistic
                title={t("memberWithdrawAmount")}
                value={dashboardData?.stats.memberWithdrawAmount || 0}
                prefix={<DollarCircleOutlined />}
                className="w-[200px]"
            />
            <Statistic
                prefix={<DollarCircleOutlined />}
                title={t("totalDepositAmount")}
                value={dashboardData?.stats.totalDepositAmount || 0}
                className="w-[200px]"
            />
            <Statistic
                title={t("totalWithdrawAmount")}
                value={dashboardData?.stats.totalWithdrawAmount || 0}
                prefix={<DollarCircleOutlined />}
                className="w-[200px]"
            />
            </Space>
      </Card>
      <Space.Compact className="w-full flex mt-3">
        <Card
          title={t("admin/summary")}
          classNames={{
            body: "!p-0",
          }}
          style={{width: "100%"}}
        >
          <Table<DataType>
            columns={columns}
            dataSource={dashboardData?.divisionSummary || []}
            className="w-full"
          />
        </Card>
      </Space.Compact>
      <div className="w-full flex justify-between gap-3 mt-3">
        <Space.Compact className="w-full gap-2 flex justify-between">
            <Space.Compact className="w-full flex">
                <Card
                title={t("admin/recentUserDepositsAndWithdrawals")}
                classNames={{
                    body: "!p-0",
                }}
                style={{width: "100%"}}
                >
                <Table<PaymentDataType>
                    key="recentPayments"
                    columns={paymentColumns}
                    dataSource={dashboardData?.recentPayments || []}
                    className="w-full"
                />
                </Card>
            </Space.Compact>
        </Space.Compact>
        <Space.Compact className="w-full gap-2 flex justify-between">
            <Space.Compact className="w-full flex">
                <Card
                title={t("admin/recentUserDepositsAndWithdrawals")}
                classNames={{
                    body: "!p-0",
                }}
                style={{width: "100%"}}
                >
                <Table<PaymentDataType>
                    key="recentPayments"
                    columns={paymentColumns}
                    dataSource={dashboardData?.recentPayments || []}
                    className="w-full"
                />
                </Card>
            </Space.Compact>
        </Space.Compact>
      </div>
    </Layout>
  ) : null;
};

export default Dashboard;
