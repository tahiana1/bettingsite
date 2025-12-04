"use client";

import { usePageTitle } from "@/hooks/usePageTitle";
import { formatNumber } from "@/lib";
import { Button, Card, Table, TableProps, Tag, Space, DatePicker, Input, Select, message, Modal, Form, InputNumber, Radio, Alert } from "antd";
import { Content } from "antd/es/layout/layout";
import dayjs, { Dayjs } from "dayjs";
import { useTranslations } from "next-intl";
import { useState, useEffect, useCallback, useRef } from "react";
import type { RadioChangeEvent } from "antd";
import api from "@/api";
import { partnerTransactionAPI, PartnerPointTransaction } from "@/api/partnerTransactionAPI";
import { RxLetterCaseToggle } from "react-icons/rx";
import { ReloadOutlined } from "@ant-design/icons";

export default function PointConversionPage() {
  usePageTitle("Partner - Point Conversion");
  const t = useTranslations();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  
  // Transaction data
  const [transactions, setTransactions] = useState<PartnerPointTransaction[]>([]);
  
  // Summary data
  const [amountHeld, setAmountHeld] = useState<number>(0);
  const [pointsHeld, setPointsHeld] = useState<number>(0);
  
  // Filter state
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null] | null>(null);
  const [searchValue, setSearchValue] = useState<string>("");
  
  // Modal state
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [amount, setAmount] = useState<number>(0);
  const [profile, setProfile] = useState<any>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  
  const filtersRef = useRef({ dateRange, searchValue });
  
  useEffect(() => {
    filtersRef.current = { dateRange, searchValue };
  }, [dateRange, searchValue]);
  
  // Load transactions
  const loadTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const currentFilters = filtersRef.current;
      const dateFrom = currentFilters.dateRange?.[0]?.startOf('day').format('YYYY-MM-DD') || "";
      const dateTo = currentFilters.dateRange?.[1]?.endOf('day').format('YYYY-MM-DD') || "";
      
      const result = await partnerTransactionAPI.getPointTransactions({
        page: currentPage,
        perPage: pageSize,
        search: currentFilters.searchValue || undefined,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
      });
      
      if (result.success) {
        setTransactions(result.data);
        setTotal(result.pagination.total);
        setAmountHeld(result.summary.amountHeld);
        setPointsHeld(result.summary.pointsHeld);
      }
    } catch (error) {
      console.error("Error loading point conversion transactions:", error);
      message.error("Failed to load point conversion transactions");
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize]);
  
  // Load transactions when page or pageSize changes
  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  // Load user profile function
  const loadProfile = useCallback(async () => {
    try {
      const res = await api("user/me");
      setProfile(res.data.profile);
    } catch (err) {
      console.log(err);
    }
  }, []);

  // Load user profile on mount
  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

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
      loadProfile();
    }, 10000); // 10 seconds

    return () => clearInterval(intervalId);
  }, [loadTransactions, loadProfile]);

  const handleApplication = () => {
    setModalOpen(true);
    setAmount(0);
    form.resetFields();
  };

  const handleModalCancel = () => {
    setModalOpen(false);
    setAmount(0);
    form.resetFields();
  };

  const onAmountChange = (e: RadioChangeEvent) => {
    const currentPoints = profile?.point || pointsHeld || 0;
    if (e.target.value === "max") {
      setAmount(currentPoints);
      form.setFieldsValue({ amount: currentPoints });
    } else {
      const value = Number(e.target.value) || 0;
      setAmount(value);
      form.setFieldsValue({ amount: value });
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const submitAmount = values.amount;

      if (!profile) {
        message.error("User profile not loaded");
        return;
      }

      if (profile.point < submitAmount) {
        message.error(t("insufficientPoint") || "Insufficient points");
        return;
      }

      if (submitAmount <= 0) {
        message.error(t("withdrawAmountError") || "Amount must be greater than 0");
        return;
      }

      if (submitAmount < 100) {
        message.error(t("TheMinimumPointsToConvertIs100Points") || "The minimum points to convert is 100 points");
        return;
      }

      setSubmitting(true);
      const userid = Number(profile.userId);
      
      api("transactions/create", {
        method: "POST",
        data: {
          userId: userid,
          amount: submitAmount,
          type: "point",
          explation: "Point conversion to balance"
        }
      })
      .then((res) => {
        if (res.data?.status) {
          message.success(t("pointConversionSuccess") || "Point conversion request submitted successfully");
          setModalOpen(false);
          setAmount(0);
          form.resetFields();
          // Refresh transactions and summary
          loadTransactions();
          // Refresh profile
          api("user/me").then((res) => {
            setProfile(res.data.profile);
          });
        } else {
          message.error(t("pointConversionFailed") || "Failed to submit point conversion request");
        }
      })
      .catch((err) => {
        console.log(err);
        message.error(t("pointConversionFailed") || "Failed to submit point conversion request");
      })
      .finally(() => {
        setSubmitting(false);
      });
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const handleRefresh = () => {
    loadTransactions();
  };

  const getCurrentDateTime = () => {
    return dayjs().format("YYYY-MM-DD HH:mm:ss");
  };

  const popupWindow = (id: number) => {
    window.open(`/partner/popup/user?id=${id}`, '_blank', 'width=screen.width,height=screen.height,toolbar=no,menubar=no,scrollbars=yes,resizable=yes,location=no,status=no');
  }

  const columns: TableProps<PartnerPointTransaction>["columns"] = [
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
      title: t("point") || "Point",
      key: "point",
      children: [
        {
          title: t("point") || "Point",
          dataIndex: "amount",
          key: "pointAmount",
          width: 120,
          render: (_, record) => formatNumber(record.amount || 0),
        },
        {
          title: t("previousPoint"),
          dataIndex: "pointBefore",
          key: "pointBefore",
          width: 120,
          render: (_, record) => formatNumber(record.pointBefore || 0),
        },
        {
          title: t("afterPoint"),
          dataIndex: "pointAfter",
          key: "pointAfter",
          width: 120,
          render: (_, record) => formatNumber(record.pointAfter || 0),
        },
      ],
    },
    {
      title: t("moneyInHand") || "Money in hand",
      key: "moneyInHand",
      children: [
        {
          title: t("previouslyHoldMoney"),
          dataIndex: "balanceBefore",
          key: "balanceBefore",
          width: 120,
          render: (_, record) => formatNumber(record.balanceBefore || 0),
        },
        {
          title: t("moneyHoldAfter"),
          dataIndex: "balanceAfter",
          key: "balanceAfter",
          width: 120,
          render: (_, record) => formatNumber(record.balanceAfter || 0),
        },
      ],
    },
    {
      title: t("explation"),
      dataIndex: "explation",
      key: "explation",
      width: 150,
      render: (_, record) => record.explation || "-",
    },
    {
      title: t("registrationTime"),
      dataIndex: "createdAt",
      key: "createdAt",
      width: 180,
      render: (_, record) => dayjs(record.createdAt).format("YYYY-MM-DD HH:mm:ss"),
    },
    {
      title: t("situation"),
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (_, record) => {
        let color = "default";
        let text = record.status;
        
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
            <p className="text-[15px] font-bold">{t("partner/menu/pointConversion") || "Point Conversion"}</p>
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
              <span className="text-gray-600">{t("amountHold")}: </span>
              <span className="font-bold text-lg">{formatNumber(amountHeld)} {t("won") || "won"}</span>
            </div>
            <div>
              <span className="text-gray-600">{t("pointsHold")}: </span>
              <span className="font-bold text-lg">{formatNumber(pointsHeld)} {t("won") || "won"}</span>
            </div>
          </div>
          <Button 
            type="primary" 
            onClick={handleApplication}
            className="bg-blue-500"
          >
            {t("application")}
          </Button>
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

        {/* Point Application Modal */}
        <Modal
          title={t("point/exchangeRequest")}
          open={modalOpen}
          onCancel={handleModalCancel}
          footer={null}
          width={600}
        >
          <Alert
            description={
              <div>
                <p>* {t("PleaseProcessAFullMoenyRecoveryBeforeApplyingForWithdrawl")}</p>
                <p>* {t("WhenYouConvertPoints,TheyWillBeMobedToYourBalance")}</p>
                <p>* {t("TheMinimumPointsToConvertIs100Points")}</p>
                <p>* {t("TheMaximumPointsToConvertIs1000000Points")}</p>
              </div>
            }
            type="info"
            style={{ marginBottom: 16 }}
          />

          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
          >
            <Form.Item label={t("profile/balance") || "Point Balance"}>
              <div style={{ fontSize: 16, fontWeight: 'bold', color: '#ff4d4f' }}>
                {formatNumber(profile?.point || pointsHeld || 0)}
              </div>
            </Form.Item>

            <Form.Item
              name="amount"
              label={t("profile/pointAmount") || "Point Amount"}
              rules={[
                { required: true, message: t("profile/pointAmount") || "Please enter point amount" },
                { type: 'number', min: 100, message: t("TheMinimumPointsToConvertIs100Points") || "Minimum is 100 points" }
              ]}
            >
              <Space.Compact style={{ width: '100%' }}>
                <InputNumber
                  value={amount}
                  onChange={(value) => {
                    setAmount(value || 0);
                    form.setFieldsValue({ amount: value || 0 });
                  }}
                  style={{ width: '100%' }}
                  min={0}
                  max={profile?.point || pointsHeld || 0}
                />
                <Button onClick={() => {
                  setAmount(0);
                  form.setFieldsValue({ amount: 0 });
                }}>
                  {t("reset") || "Reset"}
                </Button>
              </Space.Compact>
            </Form.Item>

            <Form.Item label={null}>
              <Radio.Group
                value={amount}
                buttonStyle="solid"
                onChange={onAmountChange}
                style={{ width: '100%' }}
              >
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Space wrap>
                    <Radio.Button value={1000}>{formatNumber(1000)}</Radio.Button>
                    <Radio.Button value={5000}>{formatNumber(5000)}</Radio.Button>
                    <Radio.Button value={10000}>{formatNumber(10000)}</Radio.Button>
                    <Radio.Button value={50000}>{formatNumber(50000)}</Radio.Button>
                    <Radio.Button value={100000}>{formatNumber(100000)}</Radio.Button>
                    <Radio.Button value={500000}>{formatNumber(500000)}</Radio.Button>
                    <Radio.Button value={"max"}>MAX</Radio.Button>
                  </Space>
                </Space>
              </Radio.Group>
            </Form.Item>

            <Form.Item>
              <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                <Button onClick={handleModalCancel}>
                  {t("cancel") || "Cancel"}
                </Button>
                <Button type="primary" htmlType="submit" loading={submitting}>
                  {t("profile/applyPoint") || "Apply Point"}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    </Content>
  );
}
