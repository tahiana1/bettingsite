"use client";

import React, { useEffect, useState, useRef } from "react";
import { Badge, Button, Dropdown, Space, Tag, Typography, notification } from "antd";
import { BellOutlined } from "@ant-design/icons";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import apiCall, { wsURL } from "@/api";
import dayjs from "dayjs";

const { Text } = Typography;

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

const NotificationButton: React.FC = () => {
  const t = useTranslations();
  const router = useRouter();
  const [api, contextHolder] = notification.useNotification();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const ws = useRef<WebSocket | null>(null);
  const retryTimeout = useRef<NodeJS.Timeout | null>(null);
  const previousUnreadCount = useRef<number>(0);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const params: any = { limit: "10", pageSize: "10", page: "1", isRead: "false" };
      console.log("Fetching alerts from: admin/alerts with params:", params);
      const response = await apiCall("admin/alerts", {
        method: "GET",
        params,
      });
      console.log("Alerts response:", response);
      
      // Handle different response structures
      let alertsData: Alert[] = [];
      if (Array.isArray(response)) {
        alertsData = response;
      } else if (response?.data && Array.isArray(response.data)) {
        alertsData = response.data;
      } else if (response?.status && response?.data && Array.isArray(response.data)) {
        alertsData = response.data;
      }
      
      console.log("Parsed alerts data:", alertsData, "Length:", alertsData.length);
      setAlerts(alertsData);
    } catch (error: any) {
      console.error("Error fetching alerts - full error:", error);
      // Don't throw - just log and continue with empty array
      setAlerts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await apiCall("admin/alerts/unread-count", {
        method: "GET",
      });
      console.log("Unread count response:", response);
      if (response && response.status && response.count !== undefined) {
        setUnreadCount(response.count);
      } else if (response && typeof response.count === "number") {
        setUnreadCount(response.count);
      }
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  };

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
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Error marking alert as read:", error);
    }
  };

  const handleAlertClick = async (alert: Alert) => {
    // Close dropdown first
    setDropdownOpen(false);
    // Mark as read first if unread
    if (!alert.isRead) {
      await markAsRead(alert.id);
    }
    // Navigate to redirect URL if available
    if (alert.redirectUrl) {
      router.push(alert.redirectUrl);
    }
  };

  const connectWebSocket = () => {
    if (ws.current?.readyState === WebSocket.OPEN) return;

    try {
      // Connect to admin alerts channel via WebSocket
      // wsURL format: ws://host:port/api/v1/ws
      // We need: ws://host:port/api/v1/ws/info?userId=admin
      const wsUrl = wsURL.endsWith('/ws') 
        ? `${wsURL}/info?userId=admin` 
        : wsURL.includes('/ws/info') 
        ? `${wsURL}?userId=admin`
        : `${wsURL}/info?userId=admin`;
      console.log("Connecting to WebSocket:", wsUrl);
      ws.current = new WebSocket(wsUrl);

      ws.current.onopen = () => {
        console.log("WebSocket connected for alerts");
      };

      ws.current.onmessage = (event) => {
        try {
          let data: any;
          try {
            data = JSON.parse(event.data);
          } catch {
            // If event.data is already an object
            data = event.data;
          }
          
          // Check if it's an alert notification from Redis
          if (data && data.type && data.id && (data.type === "deposit" || data.type === "withdrawal" || data.type === "qna" || data.type === "point" || data.type === "rollingExchange" || data.type === "signup")) {
            const newAlert: Alert = {
              id: data.id,
              type: data.type,
              title: data.title || "New Alert",
              message: data.message || "",
              entityId: data.entityId || 0,
              isRead: false,
              readAt: null,
              createdAt: data.createdAt || new Date().toISOString(),
              redirectUrl: data.redirectUrl || data.redirect_url,
            };
            
            setAlerts((prev) => [newAlert, ...prev]);
            setUnreadCount((prev) => prev + 1);
            
            // Show notification popup
            api.info({
              message: newAlert.title,
              description: newAlert.message,
              placement: "topRight",
              duration: 5,
            });
          }
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };

      ws.current.onclose = () => {
        console.log("WebSocket closed, reconnecting...");
        retryTimeout.current = setTimeout(() => {
          connectWebSocket();
        }, 3000);
      };

      ws.current.onerror = (error) => {
        console.error("WebSocket error:", error);
      };
    } catch (error) {
      console.error("Error connecting WebSocket:", error);
    }
  };

  useEffect(() => {
    fetchAlerts();
    fetchUnreadCount().then(() => {
      previousUnreadCount.current = unreadCount;
    });
    connectWebSocket();

    // Poll for updates every 5 seconds as fallback
    const interval = setInterval(async () => {
      const oldCount = unreadCount;
      await fetchUnreadCount();
      await fetchAlerts();
      
      // Check if unread count increased (new alerts arrived)
      if (oldCount > 0 && unreadCount > oldCount) {
        // Fetch latest alerts to show notification
        const latestAlerts = alerts.filter(a => !a.isRead);
        if (latestAlerts.length > 0) {
          const latestAlert = latestAlerts[0];
          api.info({
            message: latestAlert.title,
            description: latestAlert.message,
            placement: "topRight",
            duration: 5,
          });
        }
      }
      previousUnreadCount.current = unreadCount;
    }, 5000);

    return () => {
      if (ws.current) {
        ws.current.close();
      }
      if (retryTimeout.current) {
        clearTimeout(retryTimeout.current);
      }
      clearInterval(interval);
    };
  }, []);

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

  console.log("Current alerts state:", alerts.length, "unread count:", unreadCount, "alerts:", alerts);
  
  // Use alerts if available, otherwise show message
  const dropdownItems = alerts.length > 0
    ? [
        ...alerts.slice(0, 10).map((alert) => ({
          key: alert.id.toString(),
          label: (
            <div
              onClick={async (e) => {
                e.stopPropagation();
                await handleAlertClick(alert);
              }}
              style={{
                padding: "8px",
                cursor: "pointer",
                backgroundColor: alert.isRead ? "transparent" : "#f0f0f0",
              }}
            >
              <Space direction="vertical" size="small" style={{ width: "100%" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Tag color={getAlertTypeColor(alert.type)}>
                    {getAlertTypeLabel(alert.type)}
                  </Tag>
                  {!alert.isRead && <Badge status="processing" />}
                </div>
                <Text strong style={{ fontSize: "12px" }}>
                  {alert.title}
                </Text>
                <Text type="secondary" style={{ fontSize: "11px" }}>
                  {alert.message.length > 50
                    ? `${alert.message.substring(0, 50)}...`
                    : alert.message}
                </Text>
                <Text type="secondary" style={{ fontSize: "10px" }}>
                  {dayjs(alert.createdAt).format("YYYY-MM-DD HH:mm:ss")}
                </Text>
              </Space>
            </div>
          ),
        })),
        {
          key: "view-all",
          label: (
            <div style={{ padding: "8px", borderTop: "1px solid #f0f0f0", textAlign: "center" }}>
              <Button
                type="link"
                onClick={() => router.push("/admin/alert")}
                style={{ width: "100%" }}
              >
                {t("viewAll") || "View All"}
              </Button>
            </div>
          ),
        },
      ]
    : unreadCount > 0
    ? [
        {
          key: "loading",
          label: (
            <div style={{ padding: "16px", textAlign: "center" }}>
              <Text type="secondary">{t("loadingNotifications") || "Loading notifications..."}</Text>
            </div>
          ),
        },
        {
          key: "view-all",
          label: (
            <div style={{ padding: "8px", borderTop: "1px solid #f0f0f0", textAlign: "center" }}>
              <Button
                type="link"
                onClick={() => router.push("/admin/alert")}
                style={{ width: "100%" }}
              >
                {t("viewAll") || "View All"}
              </Button>
            </div>
          ),
        },
      ]
    : [
        {
          key: "no-alerts",
          label: (
            <div style={{ padding: "16px", textAlign: "center" }}>
              <Text type="secondary">{t("noNewNotifications") || "No new notifications"}</Text>
            </div>
          ),
        },
        {
          key: "view-all",
          label: (
            <div style={{ padding: "8px", borderTop: "1px solid #f0f0f0", textAlign: "center" }}>
              <Button
                type="link"
                onClick={() => router.push("/admin/alert")}
                style={{ width: "100%" }}
              >
                {t("viewAll") || "View All"}
              </Button>
            </div>
          ),
        },
      ];

  return (
    <>
      {contextHolder}
      <Dropdown
        menu={{
          items: dropdownItems,
        }}
        open={dropdownOpen}
        onOpenChange={setDropdownOpen}
        className="!mb-[8px]"
        trigger={["click"]}
        placement="bottomRight"
        dropdownRender={(menu) => (
          <div style={{ minWidth: 350, maxWidth: 400 }}>
            {menu}
          </div>
        )}
      >
        <Badge count={unreadCount} size="small">
          <Button
            type="text"
            icon={<BellOutlined />}
            style={{ fontSize: "18px" }}
          />
        </Badge>
      </Dropdown>
    </>
  );
};

export default NotificationButton;

