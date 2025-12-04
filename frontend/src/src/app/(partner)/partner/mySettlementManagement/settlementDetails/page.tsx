"use client";

import { usePageTitle } from "@/hooks/usePageTitle";
import { formatNumber } from "@/lib";
import { Button, Card, Table, TableProps, Tag, Space, DatePicker, Input, Select, message } from "antd";
import { Content } from "antd/es/layout/layout";
import dayjs, { Dayjs } from "dayjs";
import { useTranslations } from "next-intl";
import { useState, useEffect, useCallback, useRef } from "react";
import { RxLetterCaseToggle } from "react-icons/rx";
import { ReloadOutlined } from "@ant-design/icons";

// Settlement Details Transaction Interface
export interface SettlementDetailsTransaction {
  id: number;
  userId: number;
  user?: {
    id: number;
    userid: string;
    name?: string;
    profile?: {
      nickname?: string;
      level?: number;
    };
  };
  depositor?: string;
  dateFrom?: string;
  dateTo?: string;
  bet?: number;
  winner?: number;
  losingMoney?: number;
  settlementAmount?: number;
  applicationDate?: string;
  processingDate?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export default function SettlementDetailsPage() {
  usePageTitle("Partner - Settlement Details");
  const t = useTranslations();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  
  // Transaction data
  const [transactions, setTransactions] = useState<SettlementDetailsTransaction[]>([]);
  
  // Summary data
  const [lossAmount, setLossAmount] = useState<number>(0);
  const [accumulatedPoints, setAccumulatedPoints] = useState<number>(0);
  const [lastSettlementDate, setLastSettlementDate] = useState<string | null>(null);
  
  // Filter state
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null] | null>([
    dayjs().startOf('day'),
    dayjs().endOf('day')
  ]);
  const [searchValue, setSearchValue] = useState<string>("");
  
  const filtersRef = useRef({ dateRange, searchValue });
  
  useEffect(() => {
    filtersRef.current = { dateRange, searchValue };
  }, [dateRange, searchValue]);
  
  // Load transactions
  const loadTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const currentFilters = filtersRef.current;
      const dateFrom = currentFilters.dateRange?.[0]?.format('YYYY-MM-DD HH:mm') || "";
      const dateTo = currentFilters.dateRange?.[1]?.format('YYYY-MM-DD HH:mm') || "";
      
      // TODO: Replace with actual API call when available
      // const result = await partnerTransactionAPI.getSettlementDetails({
      //   page: currentPage,
      //   perPage: pageSize,
      //   search: currentFilters.searchValue || undefined,
      //   dateFrom: dateFrom || undefined,
      //   dateTo: dateTo || undefined,
      // });
      
      // For now, using empty data to show UI structure
      setTransactions([]);
      setTotal(0);
      setLossAmount(0);
      setAccumulatedPoints(0);
      setLastSettlementDate(null);
      
    } catch (error) {
      console.error("Error loading settlement details:", error);
      message.error("Failed to load settlement details");
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
  }, [dateRange, searchValue]);

  // Auto-refresh data every 10 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      loadTransactions();
    }, 10000); // 10 seconds

    return () => clearInterval(intervalId);
  }, [loadTransactions]);

  const handleRefresh = () => {
    loadTransactions();
  };

  const getCurrentDateTime = () => {
    return dayjs().format("YYYY-MM-DD HH:mm:ss");
  };

  const popupWindow = (id: number) => {
    window.open(`/partner/popup/user?id=${id}`, '_blank', 'width=screen.width,height=screen.height,toolbar=no,menubar=no,scrollbars=yes,resizable=yes,location=no,status=no');
  }

  const columns: TableProps<SettlementDetailsTransaction>["columns"] = [
    {
      title: t("number"),
      dataIndex: "number",
      key: "number",
      width: 80,
      render: (_, record, index) => (currentPage - 1) * pageSize + index + 1,
    },
    {
      title: t("id"),
      dataIndex: "userid",
      key: "userid",
      width: 120,
      render: (_, record) => {
        return (
          <div 
            className="flex items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity" 
            onClick={() => popupWindow(record.user?.id || 0)}
          >
            <span className="w-[15px] h-[15px] flex items-center justify-center rounded-full bg-[#1677ff] text-white text-xs font-bold">
              {record.user?.profile?.level || 0}
            </span>
            <span className="text-xs text-white bg-black px-1 py-0.5 rounded">
              {record.user?.profile?.nickname || record.user?.name || record.user?.userid || "-"}
            </span>
          </div>
        );
      },
    },
    {
      title: t("nickname"),
      dataIndex: "nickname",
      key: "nickname",
      width: 120,
      render: (_, record) => record.user?.profile?.nickname || record.user?.name || "-",
    },
    {
      title: t("depositor"),
      dataIndex: "depositor",
      key: "depositor",
      width: 120,
      render: (_, record) => record.depositor || record.user?.userid || "-",
    },
    {
      title: t("from"),
      dataIndex: "dateFrom",
      key: "dateFrom",
      width: 150,
      render: (_, record) => record.dateFrom ? dayjs(record.dateFrom).format("YYYY-MM-DD HH:mm") : "-",
    },
    {
      title: t("until"),
      dataIndex: "dateTo",
      key: "dateTo",
      width: 150,
      render: (_, record) => record.dateTo ? dayjs(record.dateTo).format("YYYY-MM-DD HH:mm") : "-",
    },
    {
      title: t("bet"),
      dataIndex: "bet",
      key: "bet",
      width: 120,
      render: (_, record) => formatNumber(record.bet || 0),
    },
    {
      title: t("winner"),
      dataIndex: "winner",
      key: "winner",
      width: 120,
      render: (_, record) => formatNumber(record.winner || 0),
    },
    {
      title: t("losingMoney"),
      dataIndex: "losingMoney",
      key: "losingMoney",
      width: 120,
      render: (_, record) => formatNumber(record.losingMoney || 0),
    },
    {
      title: t("settlementAmount"),
      dataIndex: "settlementAmount",
      key: "settlementAmount",
      width: 150,
      render: (_, record) => formatNumber(record.settlementAmount || 0),
    },
    {
      title: t("applicationDate"),
      dataIndex: "applicationDate",
      key: "applicationDate",
      width: 180,
      render: (_, record) => record.applicationDate ? dayjs(record.applicationDate).format("YYYY-MM-DD HH:mm:ss") : "-",
    },
    {
      title: t("processingDate"),
      dataIndex: "processingDate",
      key: "processingDate",
      width: 180,
      render: (_, record) => record.processingDate ? dayjs(record.processingDate).format("YYYY-MM-DD HH:mm:ss") : "-",
    },
    {
      title: t("situation"),
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (_, record) => {
        let color = "default";
        let text = record.status || "-";
        
        if (record.status === "pending" || record.status === "W") {
          color = "yellow";
          text = "Pending";
        } else if (record.status === "A") {
          color = "green";
          text = "Approved";
        } else if (record.status === "C") {
          color = "orange";
          text = "Cancelled";
        } else if (record.status === "DL" || record.status === "deleted") {
          color = "red";
          text = "Deleted";
        }
        
        return <Tag color={color}>{text}</Tag>;
      },
    },
  ];

  return (
    <Content className="overflow-auto h-[calc(100vh-100px)] dark:bg-black">
      <Card 
        title={
          <div className="flex justify-between items-center">
            <p className="text-[15px] font-bold">{t("partner/menu/settlementDetails")}</p>
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
          body: "!p-4",
        }}
      >
        {/* Summary Section */}
        <div className="mb-4 p-4 bg-white rounded-lg border border-gray-200 flex justify-between items-center">
          <div className="flex gap-8">
            <div>
              <span className="text-gray-600">{t("lossAmount")}: </span>
              <span className="font-bold text-lg">{formatNumber(lossAmount)} {t("won") || "won"}</span>
            </div>
            <div>
              <span className="text-gray-600">{t("accumulatedPoints")}: </span>
              <span className="font-bold text-lg">{formatNumber(accumulatedPoints)} {t("won") || "won"}</span>
            </div>
            <div>
              <span className="text-gray-600">{t("lastSettlementDate")}: </span>
              <span className="font-bold text-lg">
                {lastSettlementDate ? dayjs(lastSettlementDate).format("YYYY-MM-DD HH:mm:ss") : "-"}
              </span>
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <Space className="p-2 !w-full mb-4" direction="vertical">
          <Space wrap className="!w-full justify-between">
            <Space>
              <DatePicker.RangePicker
                size="small"
                value={dateRange}
                onChange={onRangerChange}
                showTime
                format="YYYY-MM-DD HH:mm"
              />
              <Input.Search
                size="small"
                placeholder={t("idNicknameAccount")}
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
            </Space>
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
        
        {/* Table */}
        <Table 
          dataSource={transactions} 
          columns={columns} 
          rowKey="id" 
          size="small" 
          loading={loading}
          scroll={{ x: "max-content" }} 
          locale={{
            emptyText: t("There is no data.")
          }}
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

