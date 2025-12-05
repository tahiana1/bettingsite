"use client";
import React, { useEffect, useState } from "react";

import { Layout, Card, Table, Button, Space } from "antd";
import type { TableProps } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import { useTranslations } from "next-intl";

import api from "@/api";
import { formatNumber } from "@/lib";
import { usePageTitle } from "@/hooks/usePageTitle";

interface DataType {
  division: string;
  numberOfDeposit: number;
  numberOfWithdraw: number;
  numberOfSettlement: number;
  depositWithdraw: number;
  numberOfBets: number;
  numberOfWin: number;
  bettingWinning: number;
  numberOfMembers: number;
  numberOfBettingUsers: number;
  numberOfVisiters: number;
}

interface AdminNoteType {
  number: number;
  title: string;
  timeOfWriting: string;
  situation: string;
}

interface ContactAdminType {
  number: number;
  title: string;
  timeOfWriting: string;
  situation: string;
}

interface DashboardResponse {
  wallet: {
    amountHeld: number;
    point: number;
    rollingGold: number;
    losingMoney: number;
  };
  todayStats: {
    depositAmount: number;
    withdrawalAmount: number;
    depositWithdrawal: number;
    bettingAmount: number;
    winningAmount: number;
    betWin: number;
  };
  summary: DataType[];
  adminNotes: AdminNoteType[];
  contactAdmin: ContactAdminType[];
}

const Dashboard: React.FC = () => {
  usePageTitle("Partner - Dashboard");
  const t = useTranslations();
  const [mount, setMount] = useState<boolean>(false);
  const [dashboardData, setDashboardData] = useState<DashboardResponse | null>(null);
  const [currentDateTime, setCurrentDateTime] = useState<string>("");

  useEffect(() => {
    setMount(true);
    fetchInfo();
    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const updateDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    setCurrentDateTime(`${year}-${month}-${day} ${hours}:${minutes}:${seconds}`);
  };

  const fetchInfo = () => {
    api("partner/dashboard/get-data", {
      method: "GET",
    }).then((res) => {
      if (res && res.success) {
        setDashboardData(res);
      }
    }).catch((err) => {
      console.error("Error fetching dashboard data:", err);
    });
  };

  const summaryColumns: TableProps<DataType>["columns"] = [
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
      render: (value: number, record: DataType) => {
        const amount = record.depositWithdraw > 0 ? record.depositWithdraw : 0;
        return `${value} items - ${formatNumber(amount)} won`;
      },
    },
    {
      title: t("admin/numberOfWithdraw"),
      dataIndex: "numberOfWithdraw",
      key: "numberOfWithdraw",
      render: (value: number, record: DataType) => {
        const amount = record.depositWithdraw < 0 ? Math.abs(record.depositWithdraw) : 0;
        return `${value} items - ${formatNumber(amount)} won`;
      },
    },
    {
      title: t("admin/depositWithdraw"),
      dataIndex: "depositWithdraw",
      key: "depositWithdraw",
      render: (text: number) => `${formatNumber(text)} won`,
    },
    {
      title: t("admin/numberOfSettlement"),
      dataIndex: "numberOfSettlement",
      key: "numberOfSettlement",
      render: (value: number) => `${value} items - 0 won`,
    },
    {
      title: t("admin/depositWithdraw") + "-" + t("admin/numberOfSettlement"),
      key: "depositWithdrawSettlement",
      render: (_: any, record: DataType) => {
        const settlementAmount = record.depositWithdraw; // Adjust if you have separate settlement amount
        return `${formatNumber(settlementAmount)} won`;
      },
    },
    {
      title: t("admin/numberOfBets"),
      dataIndex: "numberOfBets",
      key: "numberOfBets",
      render: (value: number, record: DataType) => {
        const amount = record.bettingWinning > 0 ? record.bettingWinning : 0;
        return `${value} items - ${formatNumber(amount)} won`;
      },
    },
    {
      title: t("admin/numberOfWin"),
      dataIndex: "numberOfWin",
      key: "numberOfWin",
      render: (value: number, record: DataType) => {
        const amount = record.bettingWinning > 0 ? record.bettingWinning : 0;
        return `${value} pieces - ${formatNumber(amount)} won`;
      },
    },
    {
      title: t("admin/bettingWinning"),
      dataIndex: "bettingWinning",
      key: "bettingWinning",
      render: (text: number) => `${formatNumber(text)} won`,
    },
  ];

  const adminNoteColumns: TableProps<AdminNoteType>["columns"] = [
    {
      title: t("admin/number"),
      dataIndex: "number",
      key: "number",
    },
    {
      title: t("admin/title"),
      dataIndex: "title",
      key: "title",
    },
    {
      title: t("admin/timeOfWriting"),
      dataIndex: "timeOfWriting",
      key: "timeOfWriting",
    },
    {
      title: t("admin/situation"),
      dataIndex: "situation",
      key: "situation",
    },
  ];

  const contactAdminColumns: TableProps<ContactAdminType>["columns"] = [
    {
      title: t("admin/number"),
      dataIndex: "number",
      key: "number",
    },
    {
      title: t("admin/title"),
      dataIndex: "title",
      key: "title",
    },
    {
      title: t("admin/timeOfWriting"),
      dataIndex: "timeOfWriting",
      key: "timeOfWriting",
    },
    {
      title: t("admin/situation"),
      dataIndex: "situation",
      key: "situation",
    },
  ];

  return mount ? (
    <Layout className="">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="text-lg font-semibold">{t("home")}</div>
        <div className="flex items-center gap-2">
          <span>{currentDateTime}</span>
          <Button
            icon={<ReloadOutlined />}
            onClick={fetchInfo}
            type="text"
            size="small"
          />
        </div>
      </div>

      {/* My Wallet Section */}
      <Card
        title={t("partner/myWallet") || "My Wallet"}
        className="!mb-4 home-admin-layout"
      >
        <Table
          columns={[
            {
              title: t("partner/testDistributor") || "Test distributor",
              key: "distributor",
              render: () => (
                <Button type="link" size="small">
                  {t("partner/viewMyInformation") || "View my information"}
                </Button>
              ),
            },
            {
              title: t("partner/amountHeld") || "Amount held",
              key: "amountHeld",
              render: () => formatNumber(dashboardData?.wallet?.amountHeld || 0) + " won",
            },
            {
              title: t("point") || "point",
              key: "point",
              render: () => formatNumber(dashboardData?.wallet?.point || 0) + " P",
            },
            {
              title: t("partner/rollingGold") || "Rolling gold",
              key: "rollingGold",
              render: () => formatNumber(dashboardData?.wallet?.rollingGold || 0) + " won",
            },
            {
              title: t("partner/losingMoney") || "Losing money",
              key: "losingMoney",
              render: () => formatNumber(dashboardData?.wallet?.losingMoney || 0) + " won",
            },
          ]}
          dataSource={[{ key: "1" }]}
          pagination={false}
          className="w-full"
        />
      </Card>

      {/* Today's Statistics Section */}
      <Card
        title={t("admin/todayStatistics") || "Today's Statistics"}
        className="!mb-4 home-admin-layout"
      >
        <Table
          columns={[
            {
              title: t("depositAmount") || "Deposit amount",
              key: "depositAmount",
              render: () => formatNumber(dashboardData?.todayStats?.depositAmount || 0) + " won",
            },
            {
              title: t("withdrawAmount") || "Withdrawal amount",
              key: "withdrawalAmount",
              render: () => formatNumber(dashboardData?.todayStats?.withdrawalAmount || 0) + " won",
            },
            {
              title: t("admin/depositWithdraw") || "Deposit-Withdrawal",
              key: "depositWithdrawal",
              render: () => formatNumber(dashboardData?.todayStats?.depositWithdrawal || 0) + " won",
            },
            {
              title: t("bettingAmount") || "Betting amount",
              key: "bettingAmount",
              render: () => formatNumber(dashboardData?.todayStats?.bettingAmount || 0) + " won",
            },
            {
              title: t("prizeAmount") || "Winning amount",
              key: "winningAmount",
              render: () => formatNumber(dashboardData?.todayStats?.winningAmount || 0) + " won",
            },
            {
              title: t("admin/bettingWinning") || "Bet-Win",
              key: "betWin",
              render: () => formatNumber(dashboardData?.todayStats?.betWin || 0) + " won",
            },
          ]}
          dataSource={[{ key: "1" }]}
          pagination={false}
          className="w-full"
        />
      </Card>

      {/* Summary Section */}
      <Card
        title={t("admin/summary") || "Summary"}
        className="!mb-4 home-admin-layout"
      >
        <Table<DataType>
          columns={summaryColumns}
          dataSource={dashboardData?.summary || []}
          className="w-full"
          pagination={false}
        />
      </Card>

      {/* Admin Note and Contact the administrator Sections */}
      <div className="flex gap-4">
        <Card
          title={t("partner/adminNote") || "Admin Note"}
          className="flex-1 home-admin-layout"
        >
          <Table<AdminNoteType>
            columns={adminNoteColumns}
            dataSource={dashboardData?.adminNotes || []}
            className="w-full"
            pagination={false}
            locale={{
              emptyText: t("admin/noData") || "There is no data.",
            }}
          />
        </Card>
        <Card
          title={t("partner/contactAdministrator") || "Contact the administrator"}
          className="flex-1 home-admin-layout"
        >
          <Table<ContactAdminType>
            columns={contactAdminColumns}
            dataSource={dashboardData?.contactAdmin || []}
            className="w-full"
            pagination={false}
            locale={{
              emptyText: t("admin/noData") || "There is no data.",
            }}
          />
        </Card>
      </div>
    </Layout>
  ) : null;
};

export default Dashboard;
