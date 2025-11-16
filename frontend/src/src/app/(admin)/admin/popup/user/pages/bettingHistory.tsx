"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from 'next/navigation';
import * as XLSX from 'xlsx';

import {
  Layout,
  Space,
  Card,
  Table,
  Button,
  Input,
  DatePicker,
  Radio,
  Tabs,
} from "antd";
import type { TableProps } from "antd";

import { Content } from "antd/es/layout/layout";
import { useFormatter, useTranslations } from "next-intl";
import { fetchUserBettingHistory } from "@/actions/betLog";
import { RxLetterCaseToggle } from "react-icons/rx";
import { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { isValidDate } from "@/lib";

interface CasinoBet {
  id: string;
  type: string;
  userId: string;
  gameId: string;
  amount: number;
  status: string;
  gameName: string;
  transId: string;
  winningAmount: number;
  bettingTime: number;
  details: any;
  beforeAmount: number;
  afterAmount: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

interface SportsBet {
  id: string;
  userId: string;
  fixtureId: string;
  marketId: string;
  selection: string;
  odds: number;
  stake: number;
  potentialPayout: number;
  status: string;
  placedAt: string;
  settledAt?: string;
  fixture?: {
    id: string;
    homeTeam?: { name: string };
    awayTeam?: { name: string };
    league?: { name: string };
  };
  market?: {
    name: string;
  };
}

const UserBettingHistory: React.FC = () => {
  const t = useTranslations();
  const f = useFormatter();
  const searchParams = useSearchParams();
  const userId = searchParams.get('id');

  const [casinoBets, setCasinoBets] = useState<CasinoBet[]>([]);
  const [sportsBets, setSportsBets] = useState<SportsBet[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [casinoTotal, setCasinoTotal] = useState<number>(0);
  const [sportsTotal, setSportsTotal] = useState<number>(0);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");

  const loadBettingHistory = async () => {
    if (!userId) return;

    setLoading(true);
    try {
      const result = await fetchUserBettingHistory({
        user_id: Number(userId),
        limit: pageSize,
        offset: (currentPage - 1) * pageSize,
        status: statusFilter,
        date_from: dateFrom,
        date_to: dateTo,
      });

      setCasinoBets(result.casinoBets.map((bet: any) => ({ ...bet, key: bet.id })));
      setSportsBets(result.sportsBets.map((bet: any) => ({ ...bet, key: bet.id })));
      setCasinoTotal(result.casinoTotal);
      setSportsTotal(result.sportsTotal);
    } catch (error) {
      console.error("Error loading betting history:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBettingHistory();
  }, [userId, currentPage, pageSize, statusFilter, dateFrom, dateTo]);

  const onStatusChange = (v: string = "") => {
    setStatusFilter(v && v !== "entire" ? v : "");
    setCurrentPage(1);
  };

  const onRangerChange = (
    dates: (Dayjs | null)[] | null,
    dateStrings: string[]
  ) => {
    if (dates?.[0] && dates?.[1]) {
      const startDate = dates[0].startOf('day').toISOString();
      const endDate = dates[1].endOf('day').toISOString();
      
      setDateFrom(startDate);
      setDateTo(endDate);
    } else {
      setDateFrom("");
      setDateTo("");
    }
    
    setCurrentPage(1);
  };

  const casinoColumns: TableProps<CasinoBet>["columns"] = [
    {
      title: t("number"),
      dataIndex: "id", 
      key: "id",
      render: (_, __, index) => (currentPage - 1) * pageSize + index + 1
    },
    {
      title: "Game ID",
      dataIndex: "gameId",
      key: "gameId",
    },
    {
      title: "Game Name",
      dataIndex: "gameName",
      key: "gameName",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Transaction ID",
      dataIndex: "transId",
      key: "transId",
    },
    {
      title: t("amount"),
      dataIndex: "amount",
      key: "amount",
      render: (v) => f.number(v),
    },
    {
      title: "Winning Amount",
      dataIndex: "winningAmount",
      key: "winningAmount",
      render: (v) => f.number(v),
    },
    {
      title: "Before Amount",
      dataIndex: "beforeAmount",
      key: "beforeAmount",
      render: (v) => f.number(v),
    },
    {
      title: "After Amount",
      dataIndex: "afterAmount",
      key: "afterAmount",
      render: (v) => f.number(v),
    },
    {
      title: t("createdAt"),
      dataIndex: "createdAt",
      key: "createdAt",
      render: (v) => (isValidDate(v) ? dayjs(v).format("M/D/YYYY HH:mm:ss") : ""),
    },
    {
      title: t("status"),
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const colors: Record<string, string> = {
          won: "bg-green-500",
          lost: "bg-red-500", 
          pending: "bg-yellow-500",
          cancelled: "bg-gray-500"
        };
        return (
          <span className={`${colors[status] || "bg-blue-500"} text-white px-2 py-1 rounded text-xs`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        );
      }
    },
  ];

  const sportsColumns: TableProps<SportsBet>["columns"] = [
    {
      title: t("number"),
      dataIndex: "id", 
      key: "id",
      render: (_, __, index) => (currentPage - 1) * pageSize + index + 1
    },
    {
      title: "Fixture",
      dataIndex: "fixture",
      key: "fixture",
      render: (_, record) => {
        if (record.fixture) {
          return `${record.fixture.homeTeam?.name || 'Home'} vs ${record.fixture.awayTeam?.name || 'Away'}`;
        }
        return 'N/A';
      },
    },
    {
      title: "Selection",
      dataIndex: "selection",
      key: "selection",
    },
    {
      title: "Odds",
      dataIndex: "odds",
      key: "odds",
      render: (v) => f.number(v, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
    },
    {
      title: "Stake",
      dataIndex: "stake",
      key: "stake",
      render: (v) => f.number(v),
    },
    {
      title: "Potential Payout",
      dataIndex: "potentialPayout",
      key: "potentialPayout",
      render: (v) => f.number(v),
    },
    {
      title: "Placed At",
      dataIndex: "placedAt",
      key: "placedAt",
      render: (v) => (isValidDate(v) ? dayjs(v).format("M/D/YYYY HH:mm:ss") : ""),
    },
    {
      title: t("status"),
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const colors: Record<string, string> = {
          won: "bg-green-500",
          lost: "bg-red-500", 
          pending: "bg-yellow-500",
          cancelled: "bg-gray-500"
        };
        return (
          <span className={`${colors[status] || "bg-blue-500"} text-white px-2 py-1 rounded text-xs`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        );
      }
    },
  ];

  const onTableChange: TableProps<any>["onChange"] = (pagination) => {
    if (pagination) {
      const newPage = pagination.current || 1;
      const newPageSize = pagination.pageSize || 25;
      
      setCurrentPage(newPage);
      setPageSize(newPageSize);
    }
  };

  const handleCasinoDownload = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      casinoBets.map((bet) => ({
        ID: bet.id,
        "Game ID": bet.gameId,
        "Game Name": bet.gameName,
        Type: bet.type,
        "Transaction ID": bet.transId,
        Amount: bet.amount,
        "Winning Amount": bet.winningAmount,
        Status: bet.status,
        [t("createdAt")]: bet.createdAt ? dayjs(bet.createdAt).format("M/D/YYYY HH:mm:ss") : "",
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Casino Bets");
    XLSX.writeFile(workbook, `user_${userId}_casino_bets.xlsx`);
  };

  const handleSportsDownload = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      sportsBets.map((bet) => ({
        ID: bet.id,
        Fixture: bet.fixture ? `${bet.fixture.homeTeam?.name || 'Home'} vs ${bet.fixture.awayTeam?.name || 'Away'}` : 'N/A',
        Selection: bet.selection,
        Odds: bet.odds,
        Stake: bet.stake,
        "Potential Payout": bet.potentialPayout,
        Status: bet.status,
        "Placed At": bet.placedAt ? dayjs(bet.placedAt).format("M/D/YYYY HH:mm:ss") : "",
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sports Bets");
    XLSX.writeFile(workbook, `user_${userId}_sports_bets.xlsx`);
  };

  const tabItems = [
    {
      key: "casino",
      label: `Casino Bets (${casinoTotal})`,
      children: (
        <div>
          <Space className="p-2 !w-full" direction="vertical">
            <Space wrap>
              <Radio.Group
                size="small"
                optionType="button"
                buttonStyle="solid"
                options={[
                  { label: t("entire"), value: "entire" },
                  { label: "Won", value: "won" },
                  { label: "Lost", value: "lost" },
                  { label: "Pending", value: "pending" },
                  { label: "Cancelled", value: "cancelled" },
                ]}
                defaultValue={"entire"}
                onChange={(e) => onStatusChange(e.target.value)}
              />
            </Space>
            <Space className="!w-full justify-between">
              <Space>
                <DatePicker.RangePicker
                  size="small"
                  onChange={onRangerChange}
                />
              </Space>
              <Space.Compact className="gap-1">
                <Button size="small" type="primary" onClick={handleCasinoDownload}>
                  {t("download")}
                </Button>
              </Space.Compact>
            </Space>
          </Space>

          <Table<CasinoBet>
            columns={casinoColumns}
            loading={loading}
            dataSource={casinoBets}
            className="w-full"
            size="small"
            scroll={{ x: "max-content" }}
            onChange={onTableChange}
            pagination={{
              showTotal(total, range) {
                return t("paginationLabel", {
                  from: range[0],
                  to: range[1],
                  total,
                });
              },
              total: casinoTotal,
              current: currentPage,
              pageSize: pageSize,
              showSizeChanger: true,
              pageSizeOptions: [25, 50, 100, 250, 500, 1000],
            }}
          />
        </div>
      ),
    },
    {
      key: "sports",
      label: `Sports Bets (${sportsTotal})`,
      children: (
        <div>
          <Space className="p-2 !w-full" direction="vertical">
            <Space wrap>
              <Radio.Group
                size="small"
                optionType="button"
                buttonStyle="solid"
                options={[
                  { label: t("entire"), value: "entire" },
                  { label: "Won", value: "won" },
                  { label: "Lost", value: "lost" },
                  { label: "Pending", value: "pending" },
                  { label: "Cancelled", value: "cancelled" },
                ]}
                defaultValue={"entire"}
                onChange={(e) => onStatusChange(e.target.value)}
              />
            </Space>
            <Space className="!w-full justify-between">
              <Space>
                <DatePicker.RangePicker
                  size="small"
                  onChange={onRangerChange}
                />
              </Space>
              <Space.Compact className="gap-1">
                <Button size="small" type="primary" onClick={handleSportsDownload}>
                  {t("download")}
                </Button>
              </Space.Compact>
            </Space>
          </Space>

          <Table<SportsBet>
            columns={sportsColumns}
            loading={loading}
            dataSource={sportsBets}
            className="w-full"
            size="small"
            scroll={{ x: "max-content" }}
            onChange={onTableChange}
            pagination={{
              showTotal(total, range) {
                return t("paginationLabel", {
                  from: range[0],
                  to: range[1],
                  total,
                });
              },
              total: sportsTotal,
              current: currentPage,
              pageSize: pageSize,
              showSizeChanger: true,
              pageSizeOptions: [25, 50, 100, 250, 500, 1000],
            }}
          />
        </div>
      ),
    },
  ];

  if (!userId) {
    return (
      <Card>
        <p>No user ID provided</p>
      </Card>
    );
  }

  return (
    <Card
    //   title={`User Betting History (ID: ${userId})`}
      classNames={{
        body: "!p-0",
      }}
    >
      <Tabs items={tabItems} className="p-4" />
    </Card>
  );
};

export default UserBettingHistory;
