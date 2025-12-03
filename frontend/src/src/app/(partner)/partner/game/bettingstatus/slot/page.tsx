"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
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
  Select,
} from "antd";
import type { TableProps } from "antd";

import { Content } from "antd/es/layout/layout";
import { useTranslations } from "next-intl";
import { RxLetterCaseToggle } from "react-icons/rx";
import { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { isValidDate, formatNumber } from "@/lib";
import { partnerBettingAPI, PartnerCasinoBet } from "@/api/partnerBettingAPI";

const Slot: React.FC = () => {
  const t = useTranslations();

  const [total, setTotal] = useState<number>(0);
  const [casinoBets, setCasinoBets] = useState<PartnerCasinoBet[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("entire");
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null] | null>(null);
  const [caseSensitive, setCaseSensitive] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);

  const filtersRef = useRef({ statusFilter, dateRange, searchValue });

  useEffect(() => {
    filtersRef.current = { statusFilter, dateRange, searchValue };
  }, [statusFilter, dateRange, searchValue]);

  const popupWindow = (id: number) => {
    window.open(`/partner/popup/user?id=${id}`, '_blank', 'width=screen.width,height=screen.height,toolbar=no,menubar=no,scrollbars=yes,resizable=yes,location=no,status=no');
  }

  const loadCasinoBets = useCallback(async () => {
    setLoading(true);
    try {
      const currentFilters = filtersRef.current;
      const dateFrom = currentFilters.dateRange?.[0]?.startOf('day').toISOString() || "";
      const dateTo = currentFilters.dateRange?.[1]?.endOf('day').toISOString() || "";
      
      const result = await partnerBettingAPI.getCasinoBets({
        limit: pageSize,
        offset: (currentPage - 1) * pageSize,
        game_name_filter: "slot", // Slot games only
        status: currentFilters.statusFilter && currentFilters.statusFilter !== "entire" ? currentFilters.statusFilter : "",
        date_from: dateFrom,
        date_to: dateTo,
        search: currentFilters.searchValue || "",
      });

      if (result.status) {
        setCasinoBets(result.data.map((bet: PartnerCasinoBet) => ({ ...bet, key: bet.id })));
        setTotal(result.total);
      }
    } catch (error) {
      console.error("Error loading slot bets:", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize]);

  useEffect(() => {
    loadCasinoBets();
  }, [loadCasinoBets]);

  // Auto-refresh data every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      loadCasinoBets();
    }, 10000);
    return () => clearInterval(interval);
  }, [loadCasinoBets]);

  const onStatusChange = (v: string = "") => {
    setStatusFilter(v);
    setCurrentPage(1);
  };

  const columns: TableProps<PartnerCasinoBet>["columns"] = [
    {
      title: t("number"),
      dataIndex: "id", 
      key: "id",
      render: (_, __, index) => (currentPage - 1) * pageSize + index + 1
    },
    {
      title: t("userid"),
      dataIndex: "level",
      key: "level",
      fixed: "left",
      render: (_, record) => {
        return (
          <div className="flex items-center cursor-pointer" onClick={() => popupWindow(record.user?.id || 0)}>
            <p className="w-[15px] h-[15px] flex items-center justify-center rounded-full bg-[#1677ff] text-white text-xs">
              {record.user?.profile?.level || 0}
            </p>
            <p className="text-xs text-[white] bg-[#000] px-1 py-0.5 rounded">
              {record.user?.profile?.name || ""}
            </p>
          </div>
        );
      },
    },
    {
      title: t("nickname"),
      dataIndex: "profile.nickname",
      key: "profile.nickname",
      render: (_, record) => record.user?.profile?.nickname || "",
    },
    {
      title: t("phone"),
      dataIndex: "profile.phone",
      key: "profile.phone",
      render: (_, record) => record.user?.profile?.phone || "",
    },
    {
      title: t("gameName"),
      dataIndex: "gameName",
      key: "gameName",
      render: (_, record) => {
        const gameName = record.gameName || "";
        return gameName.split("|")[0];
      },
    },
    {
      title: t("transId"),
      dataIndex: "transId",
      key: "transId",
      render: (_, record) => record.transId,
    },
    {
      title: t("betAmount"),
      dataIndex: "betAmount",
      key: "betAmount",
      render: (_, record) => (
        <span className="text-red-500">{formatNumber(Math.abs(record.betAmount))}</span>
      ),
    },
    {
      title: t("winAmount"),
      dataIndex: "winAmount",
      key: "winAmount",
      render: (_, record) => (
        <span className={record.winAmount > 0 ? "text-green-500" : "text-gray-500"}>
          {formatNumber(record.winAmount)}
        </span>
      ),
    },
    {
      title: t("netAmount"),
      dataIndex: "netAmount",
      key: "netAmount",
      render: (_, record) => (
        <span className={record.netAmount > 0 ? "text-green-500" : record.netAmount < 0 ? "text-red-500" : "text-gray-500"}>
          {formatNumber(record.netAmount)}
        </span>
      ),
    },
    {
      title: t("beforeAmount"),
      dataIndex: "beforeAmount",
      key: "beforeAmount",
      render: (_, record) => formatNumber(record.beforeAmount),
    },
    {
      title: t("afterAmount"),
      dataIndex: "afterAmount",
      key: "afterAmount",
      render: (_, record) => formatNumber(record.afterAmount),
    },
    {
      title: t("bettingTime"),
      dataIndex: "bettingTime",
      key: "bettingTime",
      render: (_, record) => {
        if (!record.bettingTime) return "-";
        const date = dayjs(record.bettingTime * 1000);
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
      title: t("updatedAt"),
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (v) => (isValidDate(v) ? dayjs(v).format("M/D/YYYY HH:mm:ss") : ""),
    },
    {
      title: t("status"),
      dataIndex: "resultStatus",
      key: "resultStatus",
      fixed: "right",
      render: (_, record) => {
        return (
          <div className="text-xs">
            {record.resultStatus === "won" && (
              <span className="bg-green-500 text-white px-2 py-1 rounded">{t("won")}</span>
            )}
            {record.resultStatus === "lost" && (
              <span className="bg-red-500 text-white px-2 py-1 rounded">{t("lost")}</span>
            )}
            {record.resultStatus === "pending" && (
              <span className="bg-yellow-500 text-white px-2 py-1 rounded">{t("pending")}</span>
            )}
            {record.status === "cancelled" && (
              <span className="bg-gray-500 text-white px-2 py-1 rounded">{t("cancelled")}</span>
            )}
            {!["won", "lost", "pending"].includes(record.resultStatus) && record.status !== "cancelled" && (
              <span className="bg-blue-500 text-white px-2 py-1 rounded">{record.resultStatus || record.status}</span>
            )}
          </div>
        );
      }
    },
  ];

  const onChange: TableProps<PartnerCasinoBet>["onChange"] = (
    pagination,
    filters,
    sorter,
    extra
  ) => {
    if (pagination.current) {
      setCurrentPage(pagination.current);
    }
    if (pagination.pageSize) {
      setPageSize(pagination.pageSize);
    }
  };

  const onRangerChange = (
    dates: (Dayjs | null)[] | null,
    dateStrings: string[]
  ) => {
    setDateRange(dates ? [dates[0], dates[1]] : null);
    setCurrentPage(1);
  };

  const onSearch = (value: string) => {
    setSearchValue(value);
    setCurrentPage(1);
  };

  const handleDownload = async () => {
    setLoading(true);
    try {
      const currentFilters = filtersRef.current;
      const dateFrom = currentFilters.dateRange?.[0]?.startOf('day').toISOString() || "";
      const dateTo = currentFilters.dateRange?.[1]?.endOf('day').toISOString() || "";
      
      const result = await partnerBettingAPI.getCasinoBets({
        limit: 10000,
        offset: 0,
        game_name_filter: "slot",
        status: currentFilters.statusFilter && currentFilters.statusFilter !== "entire" ? currentFilters.statusFilter : "",
        date_from: dateFrom,
        date_to: dateTo,
        search: currentFilters.searchValue || "",
      });

      const allBets = result.data || [];

      const worksheet = XLSX.utils.json_to_sheet(
        allBets.map((bet: any) => ({
          [t("number")]: bet.id,
          [t("level")]: `${bet.user?.profile?.level || 0} ${bet.user?.profile?.name || ""}`,
          [t("nickname")]: bet.user?.profile?.nickname || "",
          [t("phone")]: bet.user?.profile?.phone || "",
          [t("gameName")]: bet.gameName?.split("|")[0] || bet.gameName,
          [t("transId")]: bet.transId,
          [t("betAmount")]: Math.abs(bet.betAmount),
          [t("winAmount")]: bet.winAmount,
          [t("netAmount")]: bet.netAmount,
          "Result Status": bet.resultStatus,
          [t("beforeAmount")]: bet.beforeAmount,
          [t("afterAmount")]: bet.afterAmount,
          [t("bettingTime")]: bet.bettingTime ? dayjs(bet.bettingTime * 1000).format("M/D/YYYY HH:mm:ss") : "",
          Status: bet.status,
        }))
      );

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Slot Bets");

      XLSX.writeFile(workbook, "slot_bets.xlsx");
    } catch (error) {
      console.error("Error downloading slot bets:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Content className="overflow-auto h-[calc(100vh-100px)] dark:bg-black">
        <Card
          title={t("casinoSlotBettingStatus")}
          classNames={{
            body: "!p-0",
          }}
        >
          <Space className="p-2 !w-full" direction="vertical">
            <Space wrap>
              <Radio.Group
                size="small"
                optionType="button"
                buttonStyle="solid"
                value={statusFilter}
                options={[
                  {
                    label: t("entire"),
                    value: "entire",
                  },
                  {
                    label: t("won"),
                    value: "won",
                  },
                  {
                    label: t("lost"),
                    value: "lost",
                  },
                  {
                    label: t("pending"),
                    value: "pending",
                  },
                  {
                    label: t("cancelled"),
                    value: "cancelled",
                  },
                ]}
                onChange={(e) => onStatusChange(e.target.value)}
              />
            </Space>
            <Space className="!w-full justify-between">
              <Space>
                <DatePicker.RangePicker
                  size="small"
                  value={dateRange}
                  onChange={onRangerChange}
                />
                <Input.Search
                  size="small"
                  placeholder="Nickname, Phone, Transaction ID"
                  value={searchValue}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSearchValue(value);
                    if (!value) {
                      onSearch("");
                    }
                  }}
                  suffix={
                    <Button
                      size="small"
                      type="text"
                      icon={<RxLetterCaseToggle />}
                    />
                  }
                  enterButton={t("search")}
                  onSearch={onSearch}
                  allowClear
                />
              </Space>
              <Space.Compact className="gap-1">
                <Button size="small" type="primary" onClick={handleDownload} loading={loading}>
                  {t("download")}
                </Button>
              </Space.Compact>
            </Space>
          </Space>

          <Table<PartnerCasinoBet>
            columns={columns}
            loading={loading}
            dataSource={casinoBets ?? []}
            className="w-full"
            size="small"
            scroll={{ x: "max-content" }}
            onChange={onChange}
            pagination={{
              current: currentPage,
              pageSize: pageSize,
              showTotal(total, range) {
                return t("paginationLabel", {
                  from: range[0],
                  to: range[1],
                  total,
                });
              },
              total: total,
              showSizeChanger: true,
              defaultPageSize: 25,
              pageSizeOptions: [25, 50, 100, 250, 500, 1000],
            }}
          />
        </Card>
      </Content>
    </Layout>
  );
};

export default Slot;
