"use client";

import { usePageTitle } from "@/hooks/usePageTitle";
import { formatNumber } from "@/lib";
import {
  Button,
  Card,
  DatePicker,
  Input,
  Radio,
  Space,
  Table,
  TableProps,
  Tag,
} from "antd";
import { Content } from "antd/es/layout/layout";
import dayjs, { Dayjs } from "dayjs";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";
import { RxLetterCaseToggle } from "react-icons/rx";
import {
  partnerTransactionAPI,
  PartnerTransaction,
} from "@/api/partnerTransactionAPI";

export default function MoneyHistoryPage() {
  usePageTitle("Partner - Money History");
  const t = useTranslations();

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const [transactions, setTransactions] = useState<PartnerTransaction[]>([]);

  const [typeFilter, setTypeFilter] = useState<string>("entire");
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null] | null>(
    null
  );
  const [searchValue, setSearchValue] = useState<string>("");
  const [caseSensitive, setCaseSensitive] = useState<boolean>(false);

  const filtersRef = useRef({
    typeFilter,
    dateRange,
    searchValue,
  });

  useEffect(() => {
    filtersRef.current = { typeFilter, dateRange, searchValue };
  }, [typeFilter, dateRange, searchValue]);

  const loadTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const { typeFilter: tf, dateRange: dr, searchValue: sv } = filtersRef.current;

      const dateFrom =
        dr?.[0]?.startOf("day").format("YYYY-MM-DD") || undefined;
      const dateTo =
        dr?.[1]?.endOf("day").format("YYYY-MM-DD") || undefined;

      const result = await partnerTransactionAPI.getMoneyHistory({
        page: currentPage,
        perPage: pageSize,
        type: tf && tf !== "entire" ? tf : "entire",
        search: sv || undefined,
        dateFrom,
        dateTo,
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

  const onTypeChange = (value: string) => {
    setTypeFilter(value);
    setCurrentPage(1);
  };

  const onRangerChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
    setDateRange(dates);
    setCurrentPage(1);
  };

  const onSearch = (value: string) => {
    setSearchValue(value);
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
  }, [typeFilter, dateRange, searchValue, loadTransactions]);


  const popupWindow = (id: number) => {
    window.open(`/partner/popup/user?id=${id}`, '_blank', 'width=screen.width,height=screen.height,toolbar=no,menubar=no,scrollbars=yes,resizable=yes,location=no,status=no');
  }

  const columns: TableProps<PartnerTransaction>["columns"] = [
    {
      title: t("number"),
      dataIndex: "id",
      key: "id",
      render: (_: any, __: PartnerTransaction, index: number) =>
        (currentPage - 1) * pageSize + index + 1,
    },
    {
      title: t("userid"),
      dataIndex: "userid",
      key: "userid",
      render: (_: any, record: PartnerTransaction) => {
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
      title: t("amount"),
      dataIndex: "amount",
      key: "amount",
      render: (value: number) => formatNumber(value || 0),
    },
    {
      title: t("balanceBefore"),
      dataIndex: "balanceBefore",
      key: "balanceBefore",
      render: (value: number) => formatNumber(value || 0),
    },
    {
      title: t("balanceAfter"),
      dataIndex: "balanceAfter",
      key: "balanceAfter",
      render: (value: number) => formatNumber(value || 0),
    },
    {
      title: t("explation"),
      dataIndex: "type",
      key: "type",
      render: (type: string) => {
        const colorMap: Record<
          string,
          { color: string; label: string }
        > = {
          deposit: { color: "green", label: t("deposit") },
          minigame_place: { color: "orange", label: t("miniGamePlace") },
          rollingExchange: {
            color: "blue",
            label: t("rollingExchange"),
          },
          point: { color: "gold", label: t("pointExchange") },
          pointDeposit: { color: "purple", label: t("pointDeposit") },
          directDeposit: { color: "geekblue", label: t("directDeposit") },
          directWithdraw: {
            color: "volcano",
            label: t("directWithdraw"),
          },
        };

        const config =
          colorMap[type] ?? { color: "default", label: type || "-" };

        return <Tag color={config.color}>{config.label}</Tag>;
      },
    },
    {
      title: t("transactionAt"),
      dataIndex: "transactionAt",
      key: "transactionAt",
      render: (v: string) =>
        v ? dayjs(v).format("M/D/YYYY HH:mm:ss") : "",
    },
    {
      title: t("status"),
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        if (status === "pending") {
          return <Tag color="processing">{t("pending")}</Tag>;
        }
        if (status === "A") {
          return <Tag color="success">{t("approve")}</Tag>;
        }
        if (status === "C") {
          return <Tag color="error">{t("canceled")}</Tag>;
        }
        if (status === "W") {
          return <Tag color="warning">{t("waiting")}</Tag>;
        }
        return status || "-";
      },
    },
  ];

  return (
    <Content className="overflow-auto h-[calc(100vh-100px)] dark:bg-black">
      <Card
        title={t("partner/menu/moneyHistory", {
          defaultValue: "Money details",
        })}
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
              { label: t("deposit"), value: "deposit" },
              { label: t("miniGamePlace"), value: "minigame_place" },
              { label: t("rollingExchange"), value: "rollingExchange" },
              { label: t("point"), value: "point" },
              { label: t("pointDeposit"), value: "pointDeposit" },
              { label: t("directDeposit"), value: "directDeposit" },
              { label: t("directWithdraw"), value: "directWithdraw" },
            ]}
          />

          <Space className="!w-full justify-between">
            <Space>
              <DatePicker.RangePicker
                size="small"
                onChange={onRangerChange}
              />
              <Input.Search
                size="small"
                placeholder={t("idNicknameAccountHolderPhoneNumber")}
                suffix={
                  <Button
                    size="small"
                    type="text"
                    icon={<RxLetterCaseToggle />}
                    onClick={() => setCaseSensitive(!caseSensitive)}
                    style={{
                      backgroundColor: caseSensitive ? "#1677ff" : "transparent",
                      color: caseSensitive ? "white" : "inherit",
                    }}
                    title={
                      caseSensitive
                        ? t("caseSensitiveOn")
                        : t("caseSensitiveOff")
                    }
                  />
                }
                enterButton={t("search")}
                onSearch={onSearch}
              />
            </Space>
          </Space>
        </Space>

        <Table<PartnerTransaction>
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
              setPageSize(size || 10);
            },
            showTotal(totalItems, range) {
              return t("paginationLabel", {
                from: range[0],
                to: range[1],
                total: totalItems,
              });
            },
          }}
        />
      </Card>
    </Content>
  );
}

