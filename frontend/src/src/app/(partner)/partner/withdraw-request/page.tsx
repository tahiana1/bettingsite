"use client";

import { usePageTitle } from "@/hooks/usePageTitle";
import { formatNumber } from "@/lib";
import { Button, Card, Table, TableProps, Tag, Space, Form, InputNumber, Radio, Alert, message, Modal, DatePicker, Input, Select } from "antd";
import { Content } from "antd/es/layout/layout";
import dayjs, { Dayjs } from "dayjs";
import { useTranslations } from "next-intl";
import { useState, useEffect, useRef } from "react";
import type { RadioChangeEvent } from "antd";
import api from "@/api";
import { ReloadOutlined } from "@ant-design/icons";
import { RxLetterCaseToggle } from "react-icons/rx";

export default function WithdrawRequestPage() {
  usePageTitle("Partner - Withdraw Request");
  const t = useTranslations();
  const [amount, setAmount] = useState<number>(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [timeoutState, setTimeoutState] = useState<boolean>(false);
  const [balance, setBalance] = useState<number>(0);
  const [profile, setProfile] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null] | null>(null);
  const [searchValue, setSearchValue] = useState<string>("");

  const filtersRef = useRef({ dateRange, searchValue });

  useEffect(() => {
    filtersRef.current = { dateRange, searchValue };
  }, [dateRange, searchValue]);

  useEffect(() => {
    api("user/me").then((res) => {
      setProfile(res.data.profile);
      setBalance(res.data.profile?.balance || 0);
      const userid = String(res.data.profile?.userId);
      api("transactions/get", { 
        method: "GET",
        params: {
          userid,
          type: "withdrawal"
        }
      }).then((res) => {
        setTransactions(res.data);
        setBalance(res.balance || res.data.profile?.balance || 0);
        setTimeout(() => {
          setTimeoutState(!timeoutState);
        }, 6000);
      });
    }).catch((err) => {
      console.log(err);
    });    
  }, [timeoutState]);

  const onAmountChange = (e: RadioChangeEvent) => {
    if (e.target.value == "max") {
      setAmount(balance);
      form.setFieldsValue({ amount: balance });
    } else {
      const value = Number(e.target.value) || 0;
      setAmount(value);
      form.setFieldsValue({ amount: value });
    }
  };

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

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const submitAmount = values.amount;

      if (submitAmount <= 0) {
        message.error(t("withdrawAmountError"));
        return;
      }
      if (submitAmount < 10000) {
        message.error(t("minimumWithdrawError"));
        return;
      }

      setSubmitting(true);
      api("transactions/create", {
        method: "POST",
        data: {
          userId: profile.userId,
          amount: submitAmount,
          type: "withdrawal",
          explation: "Withdrawal request"
        }
      })
      .then((res) => {
        if (res.data?.status) {
          message.success(t("withdrawSuccess"));
          setModalOpen(false);
          setAmount(0);
          form.resetFields();
          setTimeoutState(!timeoutState);
          api("user/me").then((res) => {
            setProfile(res.data.profile);
            setBalance(res.data.profile?.balance || 0);
          });
        } else {
          message.error(t("withdrawFailed"));
        }
      })
      .catch((err) => {
        console.log(err);
        message.error(t("withdrawFailed"));
      })
      .finally(() => {
        setSubmitting(false);
      });
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const handleRefresh = () => {
    setTimeoutState(!timeoutState);
  };

  const getCurrentDateTime = () => {
    return dayjs().format("YYYY-MM-DD HH:mm:ss");
  };

  const onRangerChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
    setDateRange(dates);
    setCurrentPage(1);
  };
  
  const onSearch = (value: string) => {
    setSearchValue(value);
    setCurrentPage(1);
  };

  // Filter transactions based on date range and search
  const filteredTransactions = transactions.filter((transaction) => {
    if (dateRange && dateRange[0] && dateRange[1]) {
      const transactionDate = dayjs(transaction.transactionAt);
      if (transactionDate.isBefore(dateRange[0]) || transactionDate.isAfter(dateRange[1])) {
        return false;
      }
    }
    if (searchValue) {
      const searchLower = searchValue.toLowerCase();
      return (
        String(transaction.id).toLowerCase().includes(searchLower) ||
        String(transaction.amount).toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const columns: TableProps<any>["columns"] = [
    {
      title: t("number"),
      dataIndex: "id", 
      key: "id",
      width: 80,
      render: (_, __, index) => (currentPage - 1) * pageSize + index + 1
    },
    {
      title: t("withdrawAmount"),
      dataIndex: "amount",
      key: "amount",
      render: (value) => formatNumber(value || 0),
    },
    {
      title: t("applicationDate"),
      dataIndex: "transactionAt", 
      key: "transactionAt",
      render: (_, record) => {
        return dayjs(record.transactionAt).format("YYYY-MM-DD HH:mm:ss");
      }
    },
    {
      title: t("situation"),
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
        } else if (record.status === "DL" || record.status === "deleted") {
          color = "red";
          text = "Deleted";
        }
        
        return <Tag color={color}>{text}</Tag>;
      }
    }
  ];

  return (
    <Content className="overflow-auto h-[calc(100vh-100px)] dark:bg-black">
      <Card 
        title={
          <div className="flex justify-between items-center">
            <p className="text-[15px] font-bold">{t("withdrawRequest") || "Withdraw Request"}</p>
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
              <span className="text-gray-600">{t("profile/balance") || "Balance"}: </span>
              <span className="font-bold text-lg">{formatNumber(balance)} {t("won") || "won"}</span>
            </div>
          </div>
          <Button 
            type="primary" 
            onClick={handleApplication}
            className="bg-blue-500"
          >
            {t("application") || "Application"}
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
          dataSource={paginatedTransactions} 
          columns={columns} 
          rowKey="id" 
          size="small" 
          loading={false}
          scroll={{ x: "max-content" }} 
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: filteredTransactions.length,
            showTotal: (total, range) => 
              t("paginationLabel", {
                from: range[0],
                to: range[1],
                total: total,
              }),
            showSizeChanger: false,
            onChange: (page, size) => {
              setCurrentPage(page);
              if (size) {
                setPageSize(size);
              }
            },
          }} 
        />

        {/* Withdraw Application Modal */}
        <Modal
          title={t("withdraw") || "Withdraw Request"}
          open={modalOpen}
          onCancel={handleModalCancel}
          footer={null}
          width={600}
        >
          <Alert
            description={
              <div>
                <p>* {t("withdrawMinimum")}</p>
                <p>* {t("withdrawOnly")}</p>
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
            <Form.Item label={t("profile/balance") || "Balance"}>
              <div style={{ fontSize: 16, fontWeight: 'bold', color: '#ff4d4f' }}>
                {formatNumber(balance)}
              </div>
            </Form.Item>

            <Form.Item
              name="amount"
              label={t("billing/withdrawAmount") || "Withdraw Amount"}
              rules={[
                { required: true, message: t("withdrawAmountError") || "Please enter withdraw amount" },
                { type: 'number', min: 10000, message: t("minimumWithdrawError") || "Minimum is 10000" }
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
                  max={balance}
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
                  {t("billing/applyWithdraw") || "Apply Withdraw"}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    </Content>
  );
}
