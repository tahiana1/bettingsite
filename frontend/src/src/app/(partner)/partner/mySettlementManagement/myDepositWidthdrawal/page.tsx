"use client";

import { usePageTitle } from "@/hooks/usePageTitle";
import { formatNumber } from "@/lib";
import { Button, Card, Table, TableProps, Tag, Form, InputNumber, Radio, Select, Space, Alert, message, DatePicker, Input } from "antd";
import { Content } from "antd/es/layout/layout";
import dayjs, { Dayjs } from "dayjs";
import { useTranslations } from "next-intl";
import { useState, useEffect, useCallback, useRef } from "react";
import type { RadioChangeEvent } from "antd";
import api from "@/api";
import { partnerTransactionAPI, PartnerTransaction } from "@/api/partnerTransactionAPI";
import { RxLetterCaseToggle } from "react-icons/rx";

export default function MyDepositWidthdrawalPage() {
  const t = useTranslations();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  
  // Transaction data
  const [transactions, setTransactions] = useState<PartnerTransaction[]>([]);
  
  // Filter state
  const [statusFilter, setStatusFilter] = useState<string>("entire");
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null] | null>(null);
  const [searchValue, setSearchValue] = useState<string>("");
  
  // Deposit state
  const [depositAmount, setDepositAmount] = useState<number>(0);
  const [rechargeBonus, setRechargeBonus] = useState<string>("");
  const [depositBalance, setDepositBalance] = useState<number>(0);
  const [depositProfile, setDepositProfile] = useState<any>(null);
  
  // Withdrawal state
  const [withdrawAmount, setWithdrawAmount] = useState<number>(0);
  const [withdrawBalance, setWithdrawBalance] = useState<number>(0);
  const [withdrawProfile, setWithdrawProfile] = useState<any>(null);
  
  const filtersRef = useRef({ statusFilter, dateRange, searchValue });
  
  useEffect(() => {
    filtersRef.current = { statusFilter, dateRange, searchValue };
  }, [statusFilter, dateRange, searchValue]);
  
  // Fetch user profile and balance
  useEffect(() => {
    api("user/me").then((res) => {
      setDepositProfile(res.data.profile);
      setWithdrawProfile(res.data.profile);
      setDepositBalance(res.balance || 0);
      setWithdrawBalance(res.balance || 0);
    }).catch((err) => {
      console.log(err);
    });
  }, []);
  
  // Load transactions
  const loadTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const currentFilters = filtersRef.current;
      const dateFrom = currentFilters.dateRange?.[0]?.startOf('day').format('YYYY-MM-DD') || "";
      const dateTo = currentFilters.dateRange?.[1]?.endOf('day').format('YYYY-MM-DD') || "";
      
      const result = await partnerTransactionAPI.getTransactions({
        page: currentPage,
        perPage: pageSize,
        type: currentFilters.statusFilter && currentFilters.statusFilter !== "entire" ? currentFilters.statusFilter : undefined,
        search: currentFilters.searchValue || undefined,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
      });
      
      if (result.success) {
        setTransactions(result.data);
        setTotal(result.pagination.total);
      }
    } catch (error) {
      console.error("Error loading transactions:", error);
      message.error("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize]);
  
  // Load transactions when page or pageSize changes
  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);
  
  // Refresh transactions after deposit/withdrawal
  const refreshTransactions = () => {
    loadTransactions();
  };
  
  // Filter handlers - these will trigger reloads via useEffect watching filter states
  const onStatusChange = (value: string) => {
    setStatusFilter(value);
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
  }, [statusFilter, dateRange, searchValue]);
  
  // Deposit functions
  const submitDeposit = (amount: number, rechargeBonus: string) => {
    if (amount <= 0) {
      message.error(t("depositAmountError"));
      return;
    } else if (rechargeBonus == "") {
      message.error(t("rechargeBonusError"));
      return;
    }
    const userid = Number(depositProfile?.userId);
    api("transactions/create", {
      method: "POST",
      data: {
        userId: userid,
        amount: amount,
        type: "deposit",
        explation: rechargeBonus
      }
    })
    .then((res) => {
      if (res.data.status) {
        message.success(t("depositSuccess"));
        setDepositAmount(0);
        setRechargeBonus("");
        // Refresh balance
        api("user/me").then((res) => {
          setDepositBalance(res.balance || 0);
          setWithdrawBalance(res.balance || 0);
        });
        // Refresh transactions
        refreshTransactions();
      } else {
        message.error(t("depositFailed"));
      }
    })
    .catch((err) => {
      console.log(err);
      message.error(t("depositFailed"));
    });
  };
  
  const onDepositAmountChange = (e: RadioChangeEvent) => {
    if (e.target.value === "max") {
      setDepositAmount(234353);
    } else {
      setDepositAmount(Number(e.target.value) || 0);
    }
  };
  
  const rechargeOptions = [
    {
      value: "Domestic/European/Minigame 10% test",
      label: "Domestic/European/Minigame 10% test"
    },
    {
      value: "European/Minigame 5% test",
      label: "European/Minigame 5% test"
    },
    {
      value: "Unpaid",
      label: "Unpaid"
    }
  ];
  
  // Withdrawal functions
  const submitWithdraw = (amount: number) => {
    if (amount <= 0) {
      message.error(t("withdrawAmountError"));
      return;
    }
    if (amount < 10000) {
      message.error(t("minimumWithdrawError"));
      return;
    }
    api("transactions/create", {
      method: "POST",
      data: {
        userId: withdrawProfile?.userId,
        amount: amount,
        type: "withdrawal",
        explation: "Withdrawal request"
      }
    })
    .then((res) => {
      if (res.data.status) {
        message.success(t("withdrawSuccess"));
        setWithdrawAmount(0);
        // Refresh balance
        api("user/me").then((res) => {
          setDepositBalance(res.balance || 0);
          setWithdrawBalance(res.balance || 0);
        });
        // Refresh transactions
        refreshTransactions();
      } else {
        message.error(t("withdrawFailed"));
      }
    })
    .catch((err) => {
      console.log(err);
      message.error(t("withdrawFailed"));
    });
  };
  
  const onWithdrawAmountChange = (e: RadioChangeEvent) => {
    if (e.target.value === "max") {
      setWithdrawAmount(withdrawBalance);
    } else {
      setWithdrawAmount(Number(e.target.value) || 0);
    }
  };

  const popupWindow = (id: number) => {
    window.open(`/partner/popup/user?id=${id}`, '_blank', 'width=screen.width,height=screen.height,toolbar=no,menubar=no,scrollbars=yes,resizable=yes,location=no,status=no');
  }

  const columns: TableProps<PartnerTransaction>["columns"] = [
    {
      title: t("number"),
      dataIndex: "number",
      key: "number",
      width: 80,
      render: (_, record, index) => (currentPage - 1) * pageSize + index + 1,
    },
    {
      title: t("userid"),
      dataIndex: "userid",
      key: "userid",
      width: 150,
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
      render: (_, record) => record.user?.profile?.nickname || record.user?.name || record.user?.userid || "-",
    },
    {
      title: t("depositor"),
      dataIndex: "depositor",
      key: "depositor",
      render: (_, record) => record.user?.userid || "-",
    },
    {
      title: t("balanceBefore"),
      dataIndex: "balanceBefore",
      key: "balanceBefore",
      render: (_, record) => formatNumber(record.balanceBefore || 0),
    },
    {
      title: t("amount"),
      dataIndex: "amount",
      key: "amount",
      render: (_, record) => formatNumber(record.amount || 0),
    },
    {
      title: t("balanceAfter"),
      dataIndex: "balanceAfter",
      key: "balanceAfter",
      render: (_, record) => formatNumber(record.balanceAfter || 0),
    },
    {
      title: t("applicationDate"),
      dataIndex: "createdAt",
      key: "createdAt",
      render: (_, record) => dayjs(record.createdAt).format("M/D/YYYY HH:mm:ss"),
    },
    {
      title: t("processedDate"),
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (_, record) => record.approvedAt ? dayjs(record.approvedAt).format("M/D/YYYY HH:mm:ss") : "-",
    },
    {
      title: t("type"),
      dataIndex: "type",
      key: "type",
      render: (_, record) => (
        <Tag color={record.type === "deposit" ? "green" : "red"}>
          {record.type === "deposit" ? t("deposit") : record.type === "withdrawal" ? t("withdrawal") : record.type}
        </Tag>
      ),
    },
    {
      title: t("status"),
      dataIndex: "status",
      key: "status",
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
        } else if (record.status === "DL" || record.deletedAt) {
          color = "red";
          text = "Deleted";
        }
        
        return <Tag color={color}>{text}</Tag>;
      },
    },
  ];
  return (
    <Content className="overflow-auto h-[calc(100vh-100px)] dark:bg-black">
      <Card title={t("partner/menu/mySettlementManagement/myDepositWidthdrawal")} classNames={{
        body: "!p-2",
      }}>
        <div className="flex gap-2 justify-start">
          {/* deposit card */}
            <Card title={t("deposit")} classNames={{
              body: "!p-4",
            }} style={{ marginBottom: 16 }}>
              <Alert
                message={t("depositUnderName")}
                description={
                  <div>
                    <div>{t("depositDelay")}</div>
                  </div>
                }
                type="info"
                style={{ marginBottom: 16 }}
              />
              
              <Form layout="vertical" onFinish={() => submitDeposit(depositAmount, rechargeBonus)}>
                <Form.Item label={t("profile/balance")}>
                  <div style={{ fontSize: 16, fontWeight: 'bold', color: '#ff4d4f' }}>
                    {formatNumber(depositBalance)}
                  </div>
                </Form.Item>
                
                <Form.Item
                  label={t("billing/depositAmount")}
                  rules={[{ required: true, message: t("depositAmountError") }]}
                >
                  <Space.Compact style={{ width: '100%' }}>
                    <InputNumber
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e || 0)}
                      style={{ width: '100%' }}
                      min={0}
                    />
                    <Button onClick={() => setDepositAmount(0)}>
                      {t("reset")}
                    </Button>
                  </Space.Compact>
                </Form.Item>
                
                <Form.Item label={null}>
                  <Radio.Group
                    value={depositAmount}
                    buttonStyle="solid"
                    onChange={onDepositAmountChange}
                  >
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <Space wrap>
                        <Radio.Button value={5000}>{formatNumber(5000)}</Radio.Button>
                        <Radio.Button value={10000}>{formatNumber(10000)}</Radio.Button>
                        <Radio.Button value={50000}>{formatNumber(50000)}</Radio.Button>
                        <Radio.Button value={100000}>{formatNumber(100000)}</Radio.Button>
                        <Radio.Button value={500000}>{formatNumber(500000)}</Radio.Button>
                      </Space>
                    </Space>
                  </Radio.Group>
                </Form.Item>
                
                <Form.Item
                  label={t("billing/rechargeBonus")}
                  rules={[{ required: true, message: t("rechargeBonusError") }]}
                >
                  <Select
                    options={rechargeOptions}
                    onChange={(e) => setRechargeBonus(e)}
                    placeholder={t("billing/rechargeBonus")}
                  />
                </Form.Item>
                
                <Form.Item>
                  <Button type="primary" htmlType="submit" block>
                    {t("billing/applyDeposit")}
                  </Button>
                </Form.Item>
              </Form>
            </Card>
            
            {/* withdrawal card */}
            <Card title={t("withdrawal")} classNames={{
              body: "!p-4",
            }} style={{ marginBottom: 16 }}>
              <Alert
                message={t("withdrawMinimum")}
                description={t("withdrawOnly")}
                type="info"
                style={{ marginBottom: 16 }}
              />
              
              <Form layout="vertical" onFinish={() => submitWithdraw(withdrawAmount)}>
                <Form.Item label={t("profile/balance")}>
                  <div style={{ fontSize: 16, fontWeight: 'bold', color: '#ff4d4f' }}>
                    {formatNumber(withdrawBalance)}
                  </div>
                </Form.Item>
                
                <Form.Item
                  label={t("billing/withdrawAmount")}
                  rules={[{ required: true, message: t("withdrawAmountError") }]}
                >
                  <Space.Compact style={{ width: '100%' }}>
                    <InputNumber
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e || 0)}
                      style={{ width: '100%' }}
                      min={0}
                    />
                    <Button onClick={() => setWithdrawAmount(0)}>
                      {t("reset")}
                    </Button>
                  </Space.Compact>
                </Form.Item>
                
                <Form.Item label={null}>
                  <Radio.Group
                    value={withdrawAmount}
                    buttonStyle="solid"
                    onChange={onWithdrawAmountChange}
                  >
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <Space wrap>
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
                  <Button type="primary" htmlType="submit" block>
                    {t("billing/applyWithdraw")}
                  </Button>
                </Form.Item>
              </Form>
            </Card>
        </div>
        
        {/* filter */}

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
                    label: t("deposit"),
                    value: "deposit",
                  },
                  {
                    label: t("withdrawal"),
                    value: "withdrawal",
                  },
                  {
                    label: t("cancelled"),
                    value: "cancellation",
                  },
                  {
                    label: t("delete") || "Delete",
                    value: "delete",
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
            </Space>
          </Space>
        
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
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50", "100"],
            onChange: (page, size) => {
              setCurrentPage(page);
              setPageSize(size);
            },
          }} 
        />
      </Card>
    </Content>
  );
}
