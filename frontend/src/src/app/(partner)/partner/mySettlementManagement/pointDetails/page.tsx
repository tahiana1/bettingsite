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
} from "antd";
import { Content } from "antd/es/layout/layout";
import dayjs, { Dayjs } from "dayjs";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";
import { ReloadOutlined } from "@ant-design/icons";
import {
  partnerTransactionAPI,
  PartnerPointDetailTransaction,
} from "@/api/partnerTransactionAPI";

export default function PointDetailsPage() {
  usePageTitle("Partner - Point Details");
  const t = useTranslations();

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const [transactions, setTransactions] = useState<PartnerPointDetailTransaction[]>([]);

  const [typeFilter, setTypeFilter] = useState<string>("entire");
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null] | null>(
    null
  );

  const filtersRef = useRef({
    typeFilter,
    dateRange,
  });

  useEffect(() => {
    filtersRef.current = { typeFilter, dateRange };
  }, [typeFilter, dateRange]);

  const loadTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const { typeFilter: tf, dateRange: dr } = filtersRef.current;

      const dateFrom =
        dr?.[0]?.startOf("day").format("YYYY-MM-DD") || undefined;
      const dateTo =
        dr?.[1]?.endOf("day").format("YYYY-MM-DD") || undefined;

      const result = await partnerTransactionAPI.getPointDetails({
        page: currentPage,
        perPage: pageSize,
        type: tf && tf !== "entire" ? tf : undefined,
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
  }, [typeFilter, dateRange, loadTransactions]);

  const handleRefresh = () => {
    loadTransactions();
  };

  const popupWindow = (id: number) => {
    window.open(`/partner/popup/user?id=${id}`, '_blank', 'width=screen.width,height=screen.height,toolbar=no,menubar=no,scrollbars=yes,resizable=yes,location=no,status=no');
  }

  const columns: TableProps<PartnerPointDetailTransaction>["columns"] = [
    {
      title: t("number"),
      dataIndex: "id",
      key: "number",
      render: (_: any, __: PartnerPointDetailTransaction, index: number) =>
        (currentPage - 1) * pageSize + index + 1,
    },
    {
      title: t("userid"),
      dataIndex: "userid",
      key: "userid",
      render: (_: any, record: PartnerPointDetailTransaction) => {
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
      title: t("pointBefore"),
      dataIndex: "pointBefore",
      key: "pointBefore",
      render: (value: number) => formatNumber(value || 0),
    },
    {
      title: t("point"),
      dataIndex: "amount",
      key: "point",
      render: (value: number) => formatNumber(value || 0),
    },
    {
      title: t("pointAfter"),
      dataIndex: "pointAfter",
      key: "pointAfter",
      render: (value: number) => formatNumber(value || 0),
    },
    {
      title: t("type"),
      dataIndex: "type",
      key: "type",
      render: (type: string, record: PartnerPointDetailTransaction) => {
        const colorMap: Record<
          string,
          { color: string; label: string }
        > = {
          point: { color: "gold", label: t("pointConversion") },
          pointDeposit: { color: "purple", label: t("pointDeposit") },
        };

        const config =
          colorMap[type] ?? { color: "default", label: type || "-" };

        return <Tag color={config.color}>{config.label}</Tag>;
      },
    },
    {
      title: t("explation"),
      dataIndex: "explation",
      key: "explation",
      render: (value: string) => value || "-",
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
              {t("partner/menu/mySettlementManagement/pointDetails", {
                defaultValue: "Points details",
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
              { label: t("pointDeposit"), value: "pointDeposit" },
              { label: t("pointConversion"), value: "point" },
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

        <Table<PartnerPointDetailTransaction>
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
            pageSizeOptions: ["10", "20", "50", "100"],
          }}
        />
      </Card>
    </Content>
  );
}
