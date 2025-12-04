"use client";

import { usePageTitle } from "@/hooks/usePageTitle";
import { formatNumber } from "@/lib";
import { Button, Card, Table, TableProps, Space, DatePicker, Input, Radio, Select, message } from "antd";
import { Content } from "antd/es/layout/layout";
import dayjs, { Dayjs } from "dayjs";
import { useTranslations } from "next-intl";
import { useState, useEffect, useCallback, useRef } from "react";
import type { RadioChangeEvent } from "antd";
import { partnerTransactionAPI, PartnerRollingHistoryTransaction } from "@/api/partnerTransactionAPI";
import { RxLetterCaseToggle } from "react-icons/rx";
import { ReloadOutlined } from "@ant-design/icons";

export default function RollingHistoryPage() {
  usePageTitle("Partner - Rolling History");
  const t = useTranslations();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  
  // Transaction data
  const [transactions, setTransactions] = useState<PartnerRollingHistoryTransaction[]>([]);
  
  // Summary data
  const [bettingAmount, setBettingAmount] = useState<number>(0);
  const [rolloverAmount, setRolloverAmount] = useState<number>(0);
  
  // Filter state
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null] | null>(null);
  const [searchValue, setSearchValue] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<string>("entire");
  const [searchByRegistrationTime, setSearchByRegistrationTime] = useState<boolean>(false);
  
  const filtersRef = useRef({ dateRange, searchValue, typeFilter, searchByRegistrationTime });
  
  useEffect(() => {
    filtersRef.current = { dateRange, searchValue, typeFilter, searchByRegistrationTime };
  }, [dateRange, searchValue, typeFilter, searchByRegistrationTime]);
  
  // Load transactions
  const loadTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const currentFilters = filtersRef.current;
      const dateFrom = currentFilters.dateRange?.[0]?.startOf('day').format('YYYY-MM-DD') || "";
      const dateTo = currentFilters.dateRange?.[1]?.endOf('day').format('YYYY-MM-DD') || "";
      
      const result = await partnerTransactionAPI.getRollingHistory({
        page: currentPage,
        perPage: pageSize,
        type: currentFilters.typeFilter !== "entire" ? currentFilters.typeFilter : undefined,
        search: currentFilters.searchValue || undefined,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
        searchByRegistrationTime: currentFilters.searchByRegistrationTime,
      });
      
      if (result.success) {
        setTransactions(result.data);
        setTotal(result.pagination.total);
        setBettingAmount(result.summary.bettingAmount);
        setRolloverAmount(result.summary.rolloverAmount);
      }
    } catch (error) {
      console.error("Error loading rolling history:", error);
      message.error("Failed to load rolling history");
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize]);
  
  // Load transactions when page or pageSize changes
  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  // Filter handlers
  const onRangerChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
    setDateRange(dates);
    setCurrentPage(1);
  };
  
  const onSearch = (value: string) => {
    setSearchValue(value);
    setCurrentPage(1);
  };

  const onTypeFilterChange = (e: RadioChangeEvent) => {
    setTypeFilter(e.target.value);
    setCurrentPage(1);
  };
  
  // Track if component has mounted to avoid double loading on initial mount
  const hasMountedRef = useRef(false);
  
  // Reload transactions when filters change (after filtersRef is updated)
  useEffect(() => {
    // Skip only the very first mount to avoid double loading
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }
    
    // Small delay to ensure filtersRef.current is updated by the previous useEffect
    const timeoutId = setTimeout(() => {
      loadTransactions();
    }, 10);
    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateRange, searchValue, typeFilter, searchByRegistrationTime]);

  const handleRefresh = () => {
    loadTransactions();
  };

  const getCurrentDateTime = () => {
    return dayjs().format("YYYY-MM-DD HH:mm:ss");
  };

  const columns: TableProps<PartnerRollingHistoryTransaction>["columns"] = [
    {
      title: t("number"),
      dataIndex: "number",
      key: "number",
      width: 80,
      render: (_, record, index) => (currentPage - 1) * pageSize + index + 1,
    },
    {
      title: t("id") + " (" + t("nickname") + ")",
      key: "idNickname",
      width: 150,
      render: (_, record) => {
        return (
          <div>
            <div>{record.user?.userid || "-"}</div>
            {record.user?.profile?.nickname && (
              <div className="text-xs text-gray-500">{record.user.profile.nickname}</div>
            )}
          </div>
        );
      },
    },
    {
      title: t("gameCompany"),
      dataIndex: "shortcut",
      key: "gameCompany",
      width: 120,
      render: (text) => {
        if (!text) return "-";
        return text.split("|")[0] || "-";
      },
    },
    {
      title: t("gameName"),
      dataIndex: "shortcut",
      key: "gameName",
      width: 120,
      render: (text) => {
        if (!text) return "-";
        return text.split("|")[1] || "-";
      },
    },
    {
      title: t("bettingAmount"),
      dataIndex: "amount",
      key: "bettingAmount",
      width: 120,
      render: (text) => {
        // For rolling history, the amount represents rolling gold, not betting amount
        // We'll use it as is for now, but this might need adjustment based on business logic
        return formatNumber(Math.abs(text || 0));
      },
    },
    {
      title: t("prizeMoney"),
      key: "prizeMoney",
      width: 120,
      render: () => {
        // Prize money is not directly available in rolling transactions
        return formatNumber(0);
      },
    },
    {
      title: t("rolling(%)"),
      key: "rollingPercent",
      width: 100,
      render: (_, record) => {
        return record.user?.live ? `${record.user.live}%` : "-";
      },
    },
    {
      title: t("rollingGold"),
      dataIndex: "amount",
      key: "rollingGold",
      width: 120,
      render: (text) => {
        return formatNumber(Math.abs(text || 0));
      },
    },
    {
      title: t("previousRollingFee"),
      dataIndex: "balanceBefore",
      key: "balanceBefore",
      width: 120,
      render: (text) => {
        return text ? formatNumber(text) : "-";
      },
    },
    {
      title: t("afterThatRollingMoney"),
      dataIndex: "balanceAfter",
      key: "balanceAfter",
      width: 150,
      render: (text) => {
        return text ? formatNumber(text) : "-";
      },
    },
    {
      title: t("type"),
      dataIndex: "type",
      key: "type",
      width: 150,
      render: (text) => {
        if (text === "Rolling") {
          return (
            <div className="text-white cursor-pointer bg-blue-500 px-2 py-1 rounded-md text-xs">
              {t("bettingRelatedRolling")}
            </div>
          );
        }
        return text;
      },
    },
    {
      title: t("explanation"),
      dataIndex: "explation",
      key: "explation",
      width: 200,
      render: (text) => text || "-",
    },
    {
      title: t("bettingTime"),
      dataIndex: "transactionAt",
      key: "transactionAt",
      width: 180,
      render: (text) => {
        return text ? dayjs(text).format("YYYY-MM-DD HH:mm:ss") : "-";
      },
    },
    {
      title: t("registrationTime"),
      dataIndex: "createdAt",
      key: "createdAt",
      width: 180,
      render: (text) => {
        return text ? dayjs(text).format("YYYY-MM-DD HH:mm:ss") : "-";
      },
    },
  ];

  return (
    <Content className="overflow-auto h-[calc(100vh-100px)] dark:bg-black">
      <Card 
        title={
          <div className="flex justify-between items-center">
            <p className="text-[15px] font-bold">{t("partner/menu/mySettlementManagement/rollingHistory")}</p>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">{getCurrentDateTime()}</span>
              <Button 
                type="text" 
                icon={<ReloadOutlined />} 
                onClick={handleRefresh}
                size="small"
              />
            </div>
          </div>
        }
        classNames={{
          body: "!p-0",
        }}
      >
        <Space className="p-2 !w-full" direction="vertical">
          {/* Type Filter Tabs */}
          <Radio.Group
            size="small"
            optionType="button"
            buttonStyle="solid"
            value={typeFilter}
            onChange={onTypeFilterChange}
            options={[
              {
                label: t("entire"),
                value: "entire",
              },
              {
                label: t("bettingRelatedRolling"),
                value: "bettingRelatedRolling",
              },
              {
                label: t("memberRollingCoversation"),
                value: "memberRollingCoversation",
              },
              {
                label: t("rollingCoversationOfDistributor"),
                value: "rollingCoversationOfDistributor",
              },
              {
                label: t("adminRollingPayments"),
                value: "adminRollingPayments",
              },
            ]}
          />

          {/* Filter Section */}
          <Space className="!w-full justify-between" wrap>
            <Space wrap>
              <DatePicker.RangePicker
                size="small"
                value={dateRange}
                onChange={onRangerChange}
                showTime
                format="YYYY-MM-DD HH:mm"
              />
              <Input.Search
                size="small"
                placeholder={t("idNicknameAccount") || "ID/Nickname/Account"}
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
                style={{ width: 300 }}
              />
              <Space>
                <input
                  type="checkbox"
                  checked={searchByRegistrationTime}
                  onChange={(e) => {
                    setSearchByRegistrationTime(e.target.checked);
                    setCurrentPage(1);
                  }}
                  id="searchByRegistrationTime"
                />
                <label htmlFor="searchByRegistrationTime" className="text-sm">
                  {t("searchByRegistrationTime") || "Search by registration time"}
                </label>
              </Space>
            </Space>
            <Space>
              <span className="text-sm">
                {t("bettingAmount")}: {formatNumber(bettingAmount)} {t("won") || "won"}, {t("rolloverAmount") || "Rollover amount"}: {formatNumber(rolloverAmount)} {t("won") || "won"}
              </span>
              <Select
                size="small"
                value={pageSize}
                onChange={(value) => {
                  setPageSize(value);
                  setCurrentPage(1);
                }}
                options={[
                  { label: "10 outputs", value: 10 },
                  { label: "20 outputs", value: 20 },
                  { label: "50 outputs", value: 50 },
                  { label: "100 outputs", value: 100 },
                ]}
                style={{ width: 120 }}
              />
            </Space>
          </Space>
        </Space>
        
        {/* Table */}
        <Table 
          dataSource={transactions} 
          columns={columns} 
          rowKey="id" 
          size="small" 
          loading={loading}
          scroll={{ x: "max-content" }} 
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: total,
            showTotal: (total, range) => 
              t("paginationLabel", {
                from: range[0],
                to: range[1],
                total: total,
              }),
            showSizeChanger: false, // Using custom selector above
            onChange: (page, size) => {
              setCurrentPage(page);
              if (size) {
                setPageSize(size);
              }
            },
          }} 
        />
      </Card>
    </Content>
  );
}
