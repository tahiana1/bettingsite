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
import { fetchUserBettingHistoryV2 } from "@/actions/betLog";
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

interface MiniGameBet {
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
}

const UserBettingHistory: React.FC = () => {
  const t = useTranslations();
  const f = useFormatter();
  const searchParams = useSearchParams();
  const userId = searchParams.get('id');

  const [casinoBets, setCasinoBets] = useState<CasinoBet[]>([]);
  const [slotBets, setSlotBets] = useState<CasinoBet[]>([]);
  const [miniGameBets, setMiniGameBets] = useState<MiniGameBet[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [casinoTotal, setCasinoTotal] = useState<number>(0);
  const [slotTotal, setSlotTotal] = useState<number>(0);
  const [miniGameTotal, setMiniGameTotal] = useState<number>(0);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");

  const loadBettingHistory = async () => {
    if (!userId) return;

    setLoading(true);
    try {
      const result = await fetchUserBettingHistoryV2({
        user_id: Number(userId),
        limit: pageSize,
        offset: (currentPage - 1) * pageSize,
        status: statusFilter,
        date_from: dateFrom,
        date_to: dateTo,
      });

      setCasinoBets(result.casinoBets.map((bet: any) => ({ ...bet, key: bet.id })));
      setSlotBets(result.slotBets.map((bet: any) => ({ ...bet, key: bet.id })));
      setMiniGameBets(result.miniGameBets.map((bet: any) => ({ ...bet, key: bet.id })));
      setCasinoTotal(result.casinoTotal);
      setSlotTotal(result.slotTotal);
      setMiniGameTotal(result.miniGameTotal);
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
      render: (_, record) => {
        const gameName = record.gameName || "";
        return gameName.split("|")[0];
      },
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
      render: (v) => f.number(Math.abs(v)),
    },
    {
      title: t("beforeAmount"),
      dataIndex: "beforeAmount",
      key: "beforeAmount",
      render: (v) => f.number(v),
    },
    {
      title: t("afterAmount"),
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

  const slotColumns: TableProps<CasinoBet>["columns"] = [
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
      render: (_, record) => {
        const gameName = record.gameName || "";
        return gameName.split("|")[0];
      },
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
      render: (v) => f.number(Math.abs(v)),
    },
    {
      title: t("beforeAmount"),
      dataIndex: "beforeAmount",
      key: "beforeAmount",
      render: (v) => f.number(v),
    },
    {
      title: t("afterAmount"),
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

  const miniGameColumns: TableProps<MiniGameBet>["columns"] = [
    {
      title: t("number"),
      dataIndex: "id", 
      key: "id",
      render: (_, __, index) => (currentPage - 1) * pageSize + index + 1
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
      render: (v) => f.number(Math.abs(v)),
    },
    {
      title: t("beforeAmount"),
      dataIndex: "beforeAmount",
      key: "beforeAmount",
      render: (v) => f.number(v),
    },
    {
      title: t("afterAmount"),
      dataIndex: "afterAmount",
      key: "afterAmount",
      render: (v) => f.number(v),
    },
    {
      title: t("bettingTime"),
      dataIndex: "bettingTime",
      key: "bettingTime",
      render: (v) => {
        if (!v) return "-";
        const date = dayjs(v * 1000);
        return date.format("M/D/YYYY HH:mm:ss");
      },
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

  const onTableChange: TableProps<any>["onChange"] = (pagination) => {
    if (pagination) {
      const newPage = pagination.current || 1;
      const newPageSize = pagination.pageSize || 25;
      
      setCurrentPage(newPage);
      setPageSize(newPageSize);
    }
  };

  const handleCasinoDownload = async () => {
    setLoading(true);
    try {
      // Fetch all casino bets without pagination
      const result = await fetchUserBettingHistoryV2({
        user_id: Number(userId),
        limit: 10000,
        offset: 0,
        status: statusFilter,
        date_from: dateFrom,
        date_to: dateTo,
      });

      const allBets = result.casinoBets;
      const worksheet = XLSX.utils.json_to_sheet(
        allBets.map((bet: any) => ({
          ID: bet.id,
          "Game ID": bet.gameId,
          "Game Name": bet.gameName ? bet.gameName.split("|")[0] : bet.gameName,
          Type: bet.type,
          "Transaction ID": bet.transId,
          Amount: Math.abs(bet.amount),
          "Winning Amount": bet.winningAmount,
          "Before Amount": bet.beforeAmount,
          "After Amount": bet.afterAmount,
          Status: bet.status,
          [t("createdAt")]: bet.createdAt ? dayjs(bet.createdAt).format("M/D/YYYY HH:mm:ss") : "",
        }))
      );

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Casino Bets");
      XLSX.writeFile(workbook, `user_${userId}_casino_bets.xlsx`);
    } catch (error) {
      console.error("Error downloading casino bets:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSlotDownload = async () => {
    setLoading(true);
    try {
      // Fetch all slot bets without pagination
      const result = await fetchUserBettingHistoryV2({
        user_id: Number(userId),
        limit: 10000,
        offset: 0,
        status: statusFilter,
        date_from: dateFrom,
        date_to: dateTo,
      });

      const allBets = result.slotBets;
      const worksheet = XLSX.utils.json_to_sheet(
        allBets.map((bet: any) => ({
          ID: bet.id,
          "Game ID": bet.gameId,
          "Game Name": bet.gameName ? bet.gameName.split("|")[0] : bet.gameName,
          Type: bet.type,
          "Transaction ID": bet.transId,
          Amount: Math.abs(bet.amount),
          "Winning Amount": bet.winningAmount,
          "Before Amount": bet.beforeAmount,
          "After Amount": bet.afterAmount,
          Status: bet.status,
          [t("createdAt")]: bet.createdAt ? dayjs(bet.createdAt).format("M/D/YYYY HH:mm:ss") : "",
        }))
      );

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Slot Bets");
      XLSX.writeFile(workbook, `user_${userId}_slot_bets.xlsx`);
    } catch (error) {
      console.error("Error downloading slot bets:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMiniGameDownload = async () => {
    setLoading(true);
    try {
      // Fetch all mini game bets without pagination
      const result = await fetchUserBettingHistoryV2({
        user_id: Number(userId),
        limit: 10000,
        offset: 0,
        status: statusFilter,
        date_from: dateFrom,
        date_to: dateTo,
      });

      const allBets = result.miniGameBets;
      const worksheet = XLSX.utils.json_to_sheet(
        allBets.map((bet: any) => ({
          ID: bet.id,
          "Transaction ID": bet.transId,
          Amount: Math.abs(bet.amount),
          "Winning Amount": bet.winningAmount,
          "Before Amount": bet.beforeAmount,
          "After Amount": bet.afterAmount,
          "Betting Time": bet.bettingTime ? dayjs(bet.bettingTime * 1000).format("M/D/YYYY HH:mm:ss") : "",
          Status: bet.status,
          [t("createdAt")]: bet.createdAt ? dayjs(bet.createdAt).format("M/D/YYYY HH:mm:ss") : "",
        }))
      );

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Mini Game Bets");
      XLSX.writeFile(workbook, `user_${userId}_mini_game_bets.xlsx`);
    } catch (error) {
      console.error("Error downloading mini game bets:", error);
    } finally {
      setLoading(false);
    }
  };

  const tabItems = [
    {
      key: "casino",
      label: `Casino (${casinoTotal})`,
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
                <Button size="small" type="primary" onClick={handleCasinoDownload} loading={loading}>
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
      key: "slot",
      label: `Slot (${slotTotal})`,
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
                <Button size="small" type="primary" onClick={handleSlotDownload} loading={loading}>
                  {t("download")}
                </Button>
              </Space.Compact>
            </Space>
          </Space>

          <Table<CasinoBet>
            columns={slotColumns}
            loading={loading}
            dataSource={slotBets}
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
              total: slotTotal,
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
      key: "mini",
      label: `Mini (${miniGameTotal})`,
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
                <Button size="small" type="primary" onClick={handleMiniGameDownload} loading={loading}>
                  {t("download")}
                </Button>
              </Space.Compact>
            </Space>
          </Space>

          <Table<MiniGameBet>
            columns={miniGameColumns}
            loading={loading}
            dataSource={miniGameBets}
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
              total: miniGameTotal,
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
      classNames={{
        body: "!p-0",
      }}
    >
      <Tabs items={tabItems} className="p-4" />
    </Card>
  );
};

export default UserBettingHistory;
