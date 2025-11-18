"use client";

import React, { useEffect, useState } from "react";
import {
  Layout,
  Card,
  Table,
  Button,
  Space,
  Tag,
  Badge,
  Typography,
  Select,
  App,
} from "antd";
import type { TableProps } from "antd";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import apiCall from "@/api";
import dayjs from "dayjs";

const { Text } = Typography;
const { Option } = Select;

interface Alert {
  id: number;
  type: string;
  title: string;
  message: string;
  entityId: number;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
  redirectUrl?: string;
}

const AlertsPageContent: React.FC = () => {
  const t = useTranslations();
  const router = useRouter();
  const { message } = App.useApp();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);
  const [filterType, setFilterType] = useState<string>("");
  const [filterRead, setFilterRead] = useState<string>("");

  const fetchAlerts = async (page: number = 1, size: number = 20) => {
    try {
      setLoading(true);
      const params: any = {
        page: page.toString(),
        pageSize: size.toString(),
      };
      
      if (filterType) {
        params.type = filterType;
      }
      
      if (filterRead !== "") {
        params.isRead = filterRead;
      }

      const response = await apiCall("admin/alerts", {
        method: "GET",
        params,
      });

      let alertsData: Alert[] = [];
      let totalCount = 0;

      if (response?.status && response?.data && Array.isArray(response.data)) {
        alertsData = response.data;
        totalCount = response.total || 0;
      } else if (Array.isArray(response)) {
        alertsData = response;
        totalCount = response.length;
      } else if (response?.data && Array.isArray(response.data)) {
        alertsData = response.data;
        totalCount = response.total || response.data.length;
      }

      setAlerts(alertsData);
      setTotal(totalCount);
    } catch (error: any) {
      console.error("Error fetching alerts:", error);
      message.error("Failed to fetch alerts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts(currentPage, pageSize);
  }, [currentPage, pageSize, filterType, filterRead]);

  const markAsRead = async (alertId: number) => {
    try {
      await apiCall("admin/alerts/mark-read", {
        method: "POST",
        data: { id: alertId },
      });
      setAlerts((prev) =>
        prev.map((alert) =>
          alert.id === alertId ? { ...alert, isRead: true } : alert
        )
      );
      message.success("Alert marked as read");
      fetchAlerts(currentPage, pageSize);
    } catch (error) {
      console.error("Error marking alert as read:", error);
      message.error("Failed to mark alert as read");
    }
  };

  const markAllAsRead = async () => {
    try {
      await apiCall("admin/alerts/mark-all-read", {
        method: "POST",
      });
      message.success("All alerts marked as read");
      fetchAlerts(currentPage, pageSize);
    } catch (error) {
      console.error("Error marking all alerts as read:", error);
      message.error("Failed to mark all alerts as read");
    }
  };

  const handleAlertClick = (alert: Alert) => {
    if (!alert.isRead) {
      markAsRead(alert.id);
    }
    // Navigate to redirect URL if available
    if (alert.redirectUrl) {
      router.push(alert.redirectUrl);
    }
  };

  const getAlertTypeColor = (type: string) => {
    switch (type) {
      case "deposit":
        return "green";
      case "withdrawal":
        return "orange";
      case "qna":
        return "blue";
      case "point":
        return "purple";
      case "rollingExchange":
        return "cyan";
      case "signup":
        return "gold";
      default:
        return "default";
    }
  };

  const getAlertTypeLabel = (type: string) => {
    switch (type) {
      case "deposit":
        return "Deposit";
      case "withdrawal":
        return "Withdrawal";
      case "qna":
        return "QNA";
      case "point":
        return "Point";
      case "rollingExchange":
        return "Rolling";
      case "signup":
        return "Signup";
      default:
        return type;
    }
  };

  const columns: TableProps<Alert>["columns"] = [
    {
      title: t("number") || "No.",
      key: "index",
      width: 80,
      render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,
    },
    {
      title: t("type") || "Type",
      dataIndex: "type",
      key: "type",
      width: 120,
      render: (type: string) => (
        <Tag color={getAlertTypeColor(type)}>{getAlertTypeLabel(type)}</Tag>
      ),
    },
    {
      title: t("title") || "Title",
      dataIndex: "title",
      key: "title",
      ellipsis: true,
    },
    {
      title: t("desc") || "Description",
      dataIndex: "message",
      key: "message",
      ellipsis: true,
      render: (text: string) => (
        <Text ellipsis style={{ maxWidth: 600 }}>
          {text}
        </Text>
      ),
    },
    {
      title: t("status") || "Status",
      dataIndex: "isRead",
      key: "isRead",
      width: 100,
      render: (isRead: boolean) => (
        <Badge
          status={isRead ? "default" : "processing"}
          text={isRead ? "Read" : "Unread"}
        />
      ),
    },
    {
      title: t("applicationDate") || "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 180,
      render: (date: string) => dayjs(date).format("YYYY-MM-DD HH:mm:ss"),
    },
    {
      title: t("action") || "Action",
      key: "action",
      width: 150,
      render: (_, record: Alert) => (
        <Space>
          {!record.isRead && (
            <Button
              size="small"
              onClick={() => markAsRead(record.id)}
            >
              Mark Read
            </Button>
          )}
          {record.redirectUrl && (
            <Button
              size="small"
              type="primary"
              onClick={() => handleAlertClick(record)}
            >
              View
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <Layout.Content className="w-full p-2">
      <Card
        title={
          <div className="flex justify-between items-center">
            <span className="text-[16px]">{t("alerts")}</span>
            <Space>
              <Select
                placeholder={t("filterByType") || "Filter by Type"}
                allowClear
                style={{ width: 150 }}
                value={filterType || undefined}
                onChange={(value) => setFilterType(value || "")}
              >
                <Option value="deposit">Deposit</Option>
                <Option value="withdrawal">Withdrawal</Option>
                <Option value="qna">QNA</Option>
                <Option value="point">Point</Option>
                <Option value="rollingExchange">Rolling</Option>
                <Option value="signup">Signup</Option>
              </Select>
              <Select
                placeholder={t("filterByStatus") || "Filter by Status"}
                allowClear
                style={{ width: 150 }}
                value={filterRead || undefined}
                onChange={(value) => setFilterRead(value || "")}
              >
                <Option value="false">Unread</Option>
                <Option value="true">Read</Option>
              </Select>
              <Button onClick={markAllAsRead}>{t("markAllAsRead") || "Mark All as Read"}</Button>
            </Space>
          </div>
        }
      >
        <Table<Alert>
          columns={columns}
          dataSource={alerts}
          loading={loading}
          rowKey="id"
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: total,
            showSizeChanger: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} ${t("of")} ${total} ${t("alerts")}`,
            pageSizeOptions: ["10", "20", "50", "100"],
            onChange: (page, size) => {
              setCurrentPage(page);
              setPageSize(size);
            },
          }}
          onRow={(record) => ({
            onClick: () => handleAlertClick(record),
            style: {
              cursor: record.redirectUrl ? "pointer" : "default",
              backgroundColor: record.isRead ? "transparent" : "#f0f7ff",
            },
          })}
        />
      </Card>
    </Layout.Content>
  );
};

const AlertsPage: React.FC = () => {
  return (
    <App>
      <AlertsPageContent />
    </App>
  );
};

export default AlertsPage;

