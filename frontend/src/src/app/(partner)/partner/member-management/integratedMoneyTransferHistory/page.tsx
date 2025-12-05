"use client";

import { usePageTitle } from "@/hooks/usePageTitle";
import { formatNumber } from "@/lib";
import {
  Button,
  Card,
  DatePicker,
  Space,
  Table,
  TableProps,
  Tag,
  Radio,
  Input,
} from "antd";
import { Content } from "antd/es/layout/layout";
import dayjs, { Dayjs } from "dayjs";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";
import { ReloadOutlined } from "@ant-design/icons";
import {
  partnerTransactionAPI,
  PartnerIntegratedMoneyTransferHistoryTransaction,
} from "@/api/partnerTransactionAPI";

export default function IntegratedMoneyTransferHistoryPage() {
  usePageTitle("Partner - Integrated Money Transfer History");
  const t = useTranslations();

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const [transactions, setTransactions] = useState<PartnerIntegratedMoneyTransferHistoryTransaction[]>([]);

  const [typeFilter, setTypeFilter] = useState<string>("entire");
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null] | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filtersRef = useRef({
    typeFilter,
    dateRange,
    searchQuery,
  });

  useEffect(() => {
    filtersRef.current = { typeFilter, dateRange, searchQuery };
  }, [typeFilter, dateRange, searchQuery]);

  const loadTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const { typeFilter: tf, dateRange: dr, searchQuery: sq } = filtersRef.current;

      const dateFrom =
        dr?.[0]?.startOf("day").format("YYYY-MM-DD HH:mm") || undefined;
      const dateTo =
        dr?.[1]?.endOf("day").format("YYYY-MM-DD HH:mm") || undefined;

      const result = await partnerTransactionAPI.getIntegratedMoneyTransferHistory({
        page: currentPage,
        perPage: pageSize,
        type: tf && tf !== "entire" ? tf : undefined,
        dateFrom,
        dateTo,
        search: sq || undefined,
      });

      if (result.success) {
        setTransactions(result.data);
        setTotal(result.pagination.total);
      }
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize]);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  // Auto-refresh every 10 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      loadTransactions();
    }, 10000); // 10 seconds

    return () => clearInterval(intervalId);
  }, [loadTransactions]);

  const onTypeChange = (value: string) => {
    setTypeFilter(value);
    setCurrentPage(1);
  };

  const onRangerChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
    setDateRange(dates);
    setCurrentPage(1);
  };

  const onSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const hasMountedRef = useRef(false);

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }

    const timeoutId = setTimeout(() => {
      loadTransactions();
    }, 10);

    return () => clearTimeout(timeoutId);
  }, [typeFilter, dateRange, searchQuery, loadTransactions]);

  const handleRefresh = () => {
    loadTransactions();
  };

  const popupWindow = (id: number) => {
    window.open(`/partner/popup/user?id=${id}`, '_blank', 'width=screen.width,height=screen.height,toolbar=no,menubar=no,scrollbars=yes,resizable=yes,location=no,status=no');
  }

  const getTypeColor = (type: string) => {
    const colorMap: { [key: string]: { bg: string; text: string } } = {
      deposit: { bg: "#10b981", text: "#ffffff" }, // green
      withdrawal: { bg: "#ef4444", text: "#ffffff" }, // red
      DepositCasino: { bg: "#06b6d4", text: "#ffffff" }, // cyan
      WithdrawalCasino: { bg: "#ec4899", text: "#ffffff" }, // pink
      point: { bg: "#84cc16", text: "#ffffff" }, // lime
      rollingExchange: { bg: "#f97316", text: "#ffffff" }, // orange
      pointDeposit: { bg: "#14b8a6", text: "#ffffff" }, // teal
      Rolling: { bg: "#a855f7", text: "#ffffff" }, // violet
      bet: { bg: "#dc2626", text: "#ffffff" }, // red-600
      win: { bg: "#16a34a", text: "#ffffff" }, // green-600
      directDeposit: { bg: "#059669", text: "#ffffff" }, // emerald-600
      directWithdraw: { bg: "#be123c", text: "#ffffff" }, // rose-700
      minigame_place: { bg: "#ea580c", text: "#ffffff" }, // orange-600
      minigame_Win: { bg: "#65a30d", text: "#ffffff" }, // lime-600
    };
    return colorMap[type] || { bg: "#6b7280", text: "#ffffff" }; // default gray
  };

  const getTypeLabel = (type: string) => {
    const labelMap: { [key: string]: string } = {
      deposit: t("deposit"),
      withdrawal: t("withdrawal"),
      DepositCasino: t("depositCasino"),
      WithdrawalCasino: t("withdrawalCasino"),
      point: t("pointConversion"),
      rollingExchange: t("rollingExchange"),
      pointDeposit: t("pointDeposit"),
      Rolling: t("rolling"),
      bet: t("casinoBet"),
      win: t("casinoWin"),
      directDeposit: t("directDeposit"),
      directWithdraw: t("directWithdraw"),
      minigame_place: t("miniGamePlace"),
      minigame_Win: t("miniGameWin"),
    };
    return labelMap[type] || type;
  };

  const columns: TableProps<PartnerIntegratedMoneyTransferHistoryTransaction>["columns"] = [
    {
      title: t("number"),
      dataIndex: "id",
      key: "number",
      render: (_: any, __: PartnerIntegratedMoneyTransferHistoryTransaction, index: number) =>
        (currentPage - 1) * pageSize + index + 1,
    },
    {
      title: t("userid"),
      dataIndex: "userid",
      key: "userid",
      render: (_: any, record: PartnerIntegratedMoneyTransferHistoryTransaction) => {
        return (
          <div
            className="flex items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => popupWindow(record.user?.id || 0)}
          >
            <span className="w-[15px] h-[15px] flex items-center justify-center rounded-full bg-[#1677ff] text-white text-xs font-bold">
              {record.user?.profile?.level || 0}
            </span>
            <span className="text-xs text-white bg-black px-1 py-0.5 rounded">
              {record.user?.userid || "-"}
            </span>
          </div>
        );
      },
    },
    {
      title: t("nickname"),
      dataIndex: "nickname",
      key: "nickname",
      render: (_: any, record: PartnerIntegratedMoneyTransferHistoryTransaction) => {
        return record.user?.profile?.nickname || "-";
      },
    },
    {
      title: t("type"),
      dataIndex: "type",
      key: "type",
      render: (type: string) => {
        const color = getTypeColor(type);
        const label = getTypeLabel(type);
        return (
          <span style={{ backgroundColor: color.bg, color: color.text }} className="px-2 py-1 rounded text-xs font-medium">
            {label}
          </span>
        );
      },
    },
    {
      title: t("explation"),
      dataIndex: "explation",
      key: "explation",
      render: (value: string) => value || "-",
    },
    {
      title: t("amount"),
      dataIndex: "amount",
      key: "amount",
      render: (value: number) => formatNumber(value || 0),
    },
    {
      title: t("beforeMoney"),
      dataIndex: "balanceBefore",
      key: "balanceBefore",
      render: (value: number) => formatNumber(value || 0),
    },
    {
      title: t("afterMoney"),
      dataIndex: "balanceAfter",
      key: "balanceAfter",
      render: (value: number) => formatNumber(value || 0),
    },
    {
      title: t("transactionAt"),
      dataIndex: "transactionAt",
      key: "transactionAt",
      render: (v: string) =>
        v ? dayjs(v).format("YYYY-MM-DD HH:mm:ss") : "",
    },
  ];

  return (
    <Content className="overflow-auto h-[calc(100vh-100px)] dark:bg-black">
      <Card
        title={
          <div className="flex items-center justify-between">
            <span>
              {t("partner/menu/memberManagement/integratedMoneyTransferHistory", {
                defaultValue: "Integrated money transfer history",
              })}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">
                {dayjs().format("YYYY-MM-DD HH:mm:ss")}
              </span>
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
          <Radio.Group
            size="small"
            optionType="button"
            buttonStyle="solid"
            value={typeFilter}
            onChange={(e) => onTypeChange(e.target.value)}
            options={[
              { label: t("entire"), value: "entire" },
              { label: t("bet"), value: "bet" },
              { label: t("deposit"), value: "deposit" },
              { label: t("withdrawal"), value: "withdrawal" },
              { label: t("pointConversion"), value: "point" },
              { label: t("rollingExchange"), value: "rollingExchange" },
              { label: t("gameRecharge"), value: "DepositCasino" },
              { label: t("gameExchange"), value: "WithdrawalCasino" },
              { label: t("totalLoss"), value: "win" },
              { label: t("recalculationAndRecovery"), value: "Rolling" },
              { label: t("miniGamePlace"), value: "minigame_place" },
              { label: t("miniGameWin"), value: "minigame_Win" },
            ]}
          />

          <Space className="!w-full justify-between">
            <Space>
              <DatePicker.RangePicker
                size="small"
                showTime
                format="YYYY-MM-DD HH:mm"
                onChange={onRangerChange}
                value={dateRange}
              />
              <Input
                size="small"
                placeholder={t("ID/Nickname/Account") || "ID/Nickname/Account"}
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                style={{ width: 200 }}
              />
              <Button
                type="primary"
                size="small"
                onClick={() => {
                  setCurrentPage(1);
                  loadTransactions();
                }}
              >
                {t("search")}
              </Button>
            </Space>
            <Space>
              <span className="text-sm">
                {t("total")}: {total}
              </span>
            </Space>
          </Space>
        </Space>

        <Table<PartnerIntegratedMoneyTransferHistoryTransaction>
          columns={columns}
          loading={loading}
          dataSource={transactions ?? []}
          rowKey="id"
          className="w-full"
          size="small"
          scroll={{ x: "max-content" }}
          pagination={{
            current: currentPage,
            pageSize,
            total,
            showSizeChanger: true,
            onChange: (page, size) => {
              setCurrentPage(page);
              setPageSize(size || 25);
            },
            showTotal(totalItems, range) {
              return t("paginationLabel", {
                from: range[0],
                to: range[1],
                total: totalItems,
              });
            },
            pageSizeOptions: ["25", "50", "100", "250", "500", "1000"],
          }}
        />
      </Card>
    </Content>
  );
}
