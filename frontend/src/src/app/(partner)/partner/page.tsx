"use client";
import React, { useEffect, useState } from "react";

import { Layout, Statistic, Space, Card, Divider, Table, Tag, Button } from "antd";
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
import { formatNumber } from "@/lib";
import { usePageTitle } from "@/hooks/usePageTitle";

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



const Dashboard: React.FC = () => {
  usePageTitle("Partner - Dashboard");
  const t = useTranslations();
  const columns: TableProps<DataType>["columns"] = [
    {
      title: t("admin/division"),
      dataIndex: "division",
      key: "division",
      render: (text: string) => {
        if (text === "This month") return t("This month");
        if (text === "Last month") return t("Last month");
        return text;
      },
    },
    {
      title: t("admin/numberOfDeposit"),
      dataIndex: "numberOfDeposit",
      key: "numberOfDeposit",
      render: (value: number, record: DataType) => `${value} items - ${record.depositWithdraw > 0 ? record.depositWithdraw.toLocaleString() : 0} won`,
    },
    {
      title: t("admin/numberOfWithdraw"),
      dataIndex: "numberOfWithdraw",
      key: "numberOfWithdraw",
      render: (value: number, record: DataType) => `${value} items - ${record.depositWithdraw < 0 ? Math.abs(record.depositWithdraw).toLocaleString() : 0} won`,
    },
    {
      title: t("admin/numberOfSettlement"),
      dataIndex: "numberOfSettlement",
      key: "numberOfSettlement",
      render: (value: number) => `${value} items - 0 won`, // Adjust if you have settlement amount
    },
    {
      title: t("admin/depositWithdraw"),
      dataIndex: "depositWithdraw",
      key: "depositWithdraw",
      render: (text: number) => `${Number(text).toLocaleString()} won`,
    },
    {
      title: t("admin/numberOfBets"),
      dataIndex: "numberOfBets",
      key: "numberOfBets",
      render: (value: number, record: DataType) => `${value} items - ${record.bettingWinning > 0 ? record.bettingWinning.toLocaleString() : 0} won`,
    },
    {
      title: t("admin/numberOfWin"),
      dataIndex: "numberOfWin",
      key: "numberOfWin",
      render: (value: number, record: DataType) => `${value} pieces - ${record.bettingWinning > 0 ? record.bettingWinning.toLocaleString() : 0} won`,
    },
    {
      title: t("admin/bettingWinning"),
      dataIndex: "bettingWinning",
      key: "bettingWinning",
      render: (text: number) => `${Number(text).toLocaleString()} won`,
    },
    {
      title: t("admin/numberOfMembers"),
      dataIndex: "numberOfMembers",
      key: "numberOfMembers",
    },
    {
      title: t("admin/numberOfBettingUsers"),
      dataIndex: "numberOfBettingUsers",
      key: "numberOfBettingUsers",
    },
    {
      title: t("admin/numberOfVisiters"),
      dataIndex: "numberOfVisiters",
      key: "numberOfVisiters",
    },
  ];
  const paymentColumns: TableProps<PaymentDataType>["columns"] = [
    {
      title: t("admin/number"),
      dataIndex: "number",
      key: "number"
    },
    {
      title: t("admin/type"),
      dataIndex: "type",
      key: "type",
      render: (text: string) => {
        if (text === "withdrawal") {
          return <Button danger>{text}</Button>;
        }
        if (text === "deposit") {
          return <Button type="primary" style={{ backgroundColor: "#52c41a", borderColor: "#52c41a" }}>{text}</Button>;
        }
        return text;
      }
    },
    {
      title: t("userid"),
      dataIndex: "name",
      key: "name",
    },
    {
      title: t("admin/allas"),
      key: "allas",
      dataIndex: "allas",
      render: (text: string) => {
        return "-"
      }
    },
    {
      title: t("admin/depositor"),
      key: "allas",
      dataIndex: "allas",
    },
    {
      title: t("admin/beforeAmount"),
      key: "beforeAmount",
      dataIndex: "beforeAmount",
      render: (value) => formatNumber(value || 0),
    },
    {
      title: t("admin/processingAmount"),
      key: "processingAmount",
      dataIndex: "processingAmount",
      render: (value) => formatNumber(value || 0),
    },
    {
      title: t("admin/afterAmount"),
      key: "afterAmount",
      dataIndex: "afterAmount",
      render: (value) => formatNumber(value || 0),
    },
    {
      title: t("admin/applicationDate"),
      key: "applicationDate",
      dataIndex: "applicationDate",
    },
    // {
    //   title: t("admin/processDate"),
    //   key: "applicationDate",
    //   dataIndex: "applicationDate",
    // }
  ];
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

  const config1 = {
    data: dashboardData?.depositChart || [],
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
  };

  const config2 = {
    data: dashboardData?.bettingChart || [],
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
  };

  return mount ? (
    <Layout className="">
      <Card title={t("admin/todayStatistics")} className="!mb-2 home-admin-layout">
        <Space wrap className="w-full justify-between today-home-statistics">
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
        <Divider />
        <Space wrap className="w-full justify-between today-home-statistics">
          <Statistic
            title={t("totalSettlement")}
            value={dashboardData?.stats.totalSettlement || 0}
            prefix={<DollarCircleOutlined />}
            className="w-[200px]"
          />
          <Statistic
            prefix={<DollarCircleOutlined />}
            title={t("bettingAmount")}
            value={dashboardData?.stats.bettingAmount || 0}
            className="w-[200px]"
          />
          <Statistic
            prefix={<UserOutlined />}
            title={t("prizeAmount")}
            value={dashboardData?.stats.prizeAmount || 0}
            suffix="/ 100"
            className="w-[200px]"
          />
          <Statistic
            title={t("bettingUsers")}
            value={dashboardData?.stats.bettingUsers || 0}
            prefix={<UserAddOutlined />}
            className="w-[200px]"
          />
          <Statistic
            title={t("registeredUsers")}
            value={dashboardData?.stats.registeredUsers || 0}
            prefix={<UserSwitchOutlined />}
            className="w-[200px]"
          />
          <Statistic
            title={t("numberOfVisiters")}
            value={dashboardData?.stats.numberOfVisiters || 0}
            prefix={<UserSwitchOutlined />}
            className="w-[200px]"
          />
        </Space>
      </Card>
      <Space.Compact className="w-full gap-2 flex justify-between">
        <Space direction="vertical" className="w-full flex-1">
          <Card title={t("admin/todayDepositWithdraw")} className="home-admin-layout">
            <Column {...config1} />
          </Card>
          <Card title={t("admin/betWinning")} className="home-admin-layout">
            <Column {...config2} />
          </Card>
        </Space>
        <Space.Compact direction="vertical" className="w-full flex-2 p-0 gap-2">
          <Space wrap align="start" id="admin-dashboard-card" className="w-full flex flex-row justify-between" style={{flexWrap: "nowrap"}}>
            <Card title={t("admin/membershipBalance")} className="!bg-[#00c689] !rounded-[10px] !text-white mini-card-admin">
              <div className="flex justify-between flex-row gap-4">
                <div>
                  <p>{t("admin/membershipBalance")}</p>
                  <p>{dashboardData?.stats.totalDepositAmount || 0}</p>
                </div>
                <div>
                  <p>{t("admin/totalPoints")}</p>
                  <p>{dashboardData?.stats.totalSettlement || 0}</p>
                </div>
              </div>
            </Card>
            <Card title={t("admin/totalAmountOfDistribution")} className=" !bg-[#3da5f4] !rounded-[10px] !text-white mini-card-admin">
              <p>{t("admin/totalPoints")}</p>
              <p>{dashboardData?.stats.totalSettlement || 0}</p>
            </Card>
            <Card title={t("admin/totalLose")}  className=" !bg-[#f1536e] !rounded-[10px] !text-white mini-card-admin">
              <p>{t("admin/rollingTheTotal")}</p>
              <p>{((dashboardData?.stats.bettingAmount || 0) - (dashboardData?.stats.prizeAmount || 0))}</p>
            </Card>
            <Card title={t("admin/bettingAmount")}  className=" !bg-[#fda006] !rounded-[10px] !text-white mini-card-admin">
              <p>{t("admin/prizeAmount")}</p>
              <p>{dashboardData?.stats.prizeAmount || 0}</p>
            </Card>
            <Card title={t("admin/sportsGameCompany")}  className=" !bg-[#00c689] !rounded-[10px] !text-white mini-card-admin">
              <p>{t("admin/thisMonthIncoming")} : {dashboardData?.stats.totalDepositAmount || 0}</p>
              <p>{t("admin/thisMonthDeduction")} : {dashboardData?.stats.totalWithdrawAmount || 0}</p>
            </Card>
          </Space>
          <Space.Compact className="w-full flex">
            <Card
              title={t("admin/recentUserDepositsAndWithdrawals")}
              className="home-admin-layout"
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
      </Space.Compact>
      <Space.Compact className="w-full flex mt-3">
        <Card
          title={t("admin/summary")}
          className="home-admin-layout"
          style={{width: "100%"}}
        >
          <Table<DataType>
            columns={columns}
            dataSource={dashboardData?.divisionSummary || []}
            className="w-full"
          />
        </Card>
      </Space.Compact>
    </Layout>
  ) : null;
};

export default Dashboard;
