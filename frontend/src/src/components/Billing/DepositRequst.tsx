import React, { useState, useEffect } from "react";
import {
  Alert,
  Button,
  Card,
  Form,
  InputNumber,
  List,
  Radio,
  Select,
  Space,
  Table,
  Layout,
  Input,
  Switch,
  Popconfirm,
  message,
  DatePicker,
  Tag,
} from "antd";
import type { RadioChangeEvent } from "antd";
import { useTranslations, useFormatter } from "next-intl";
import { useAtom } from "jotai";
import { betAmount, userState } from "@/state/state";
import { BiTrash } from "react-icons/bi";
import { SiDepositphotos } from "react-icons/si";
import type { TableProps } from "antd";
import { parseTableOptions } from "@/lib";
import { FilterDropdown } from "@refinedev/antd";
import { useMutation } from "@apollo/client";

import api from "@/api";

const DepositRequest: React.FC = () => {
  const t = useTranslations();
  const f = useFormatter();
  const [tableOptions, setTableOptions] = useState<any>(null);
  const [profile] = useAtom<any>(userState);
  const [rechargeBonus, setRechargeBonus] = useState<string>("");
  const [transactions, setTransactions] = useState<any[]>([]);
  const [timeoutState, setTimeoutState] = useState<boolean>(false);
  const [balance, setBalance] = useState<number>(0);
  useEffect(() => {
    const userid = String(profile.id);
    api("transactions/get", { 
      method: "GET",
      params: {
        userid,
        type: "deposit"
      }
    }).then((res) => {
      setTransactions(res.data);
      setBalance(res.balance);
      setTimeout(() => {
        setTimeoutState(!timeoutState);
      }, 60000);
    });
  }, [profile, timeoutState]);

  const submitDeposit = (amount: number, rechargeBonus: string) => {
    if (amount <= 0) {
      message.error(t("depositAmountError"));
      return;
    } else if (rechargeBonus == "") {
      message.error(t("rechargeBonusError"));
      return;
    }
    api("transactions/create", {
      method: "POST",
      data: {
        userId: profile.id,
        amount: amount,
        type: "deposit",
        explation: rechargeBonus
      }
    })
    .then((res) => {
      if (res.data.status) {
        message.success(t("depositSuccess"));
        setTimeoutState(!timeoutState);
        resetForm();
      } else {
        message.error(t("depositFailed"));
      }
    })
    .catch((err) => {
      console.log(err);
    });
  }

  const resetForm = () => {
    setAmount(0);
    setRechargeBonus("");
  }

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
  ]

  const [amount, setAmount] = useAtom<number>(betAmount);
  const onAmountChange = (e: RadioChangeEvent) => {
    if (e.target.value == "max") {
      setAmount(234353);
    } else {
      setAmount(parseInt(e.target.value));
    }
  };

  const columns: TableProps<any>["columns"] = [
    {
      title: t("number"),
      dataIndex: "id", 
      key: "id",
      render: (text, record, index) => index + 1
    },
    {
      title: t("depositAmount"),
      dataIndex: "amount",
      key: "amount",
      filterDropdown: (props) => (
        <FilterDropdown {...props}>
          <InputNumber min={0} className="w-full" />
        </FilterDropdown>
      ),
    },
    {
      title: t("applicationDate"),
      dataIndex: "transactionAt", 
      key: "transactionAt",
    },
    {
      title: t("situation"),
      dataIndex: "status",
      key: "status",
      render: (_, record) => (
        <Tag color={record.status === "A" ? "green" : "red"}>
          {record.status === "pending" && "Pending"}
          {record.status === "A" && "Approved"}
          {record.status === "W" && "Waiting"}
          {record.status === "C" && "Canceled"}
          {record.status === "DL" && "Deleted"}
        </Tag>
      )
    },
    {
      title: t("action"),
      key: "action",
      fixed: "right",
      render: (_, record) => (
        <Space.Compact size="small" className="gap-2">
          <Popconfirm
            title={t("confirmSure")}
            // onConfirm={() => onDeleteNoti(record)}
            description={t("deleteMessage")}
          >
            <Button
              title={t("delete")}
              // loading={loadingDelete}
              variant="outlined"
              color="danger"
              icon={<BiTrash />}
            />
          </Popconfirm>
        </Space.Compact>
      ),
    },
  ];
  return (
    <Layout.Content className="w-full">
      <Card
        title={
          <div className="flex gap-1 items-center">
            <SiDepositphotos className="w-8 h-8" /> {t("billing/depositRequest")}
          </div>
        }
        classNames={{
          actions: "!p-1",
          body: "!px-2",
        }}
        className="w-full"
        actions={[
          <Space key={"action"} direction="vertical" className="w-full">
            <Button
              variant="outlined"
              color="green"
              onClick={() => {
                submitDeposit(amount, rechargeBonus);
              }}
              key={"place"}
              className="w-1/2"
            >
              {t("billing/applyDeposit")}
            </Button>
          </Space>,
        ]}
      >
        <Alert
          description={
            <p>
              * You must deposit under the name you entered when signing up for
              processing
              <br />
              * Deposits maybe delayed during bank inspection times.
              <br />* You can check the account information below or through the
              cusomter center.
            </p>
          }
          type="success"
        />
        <List className="!px-4">
          <List.Item className="flex gap-2">
            <div className="w-full flex-3">{t("profile/balance")}</div>
            <div className="w-full text-red-500 flex-1 text-end">
              {f.number(balance, { style: "currency", currency: "USD" })}
            </div>
          </List.Item>

          <Form onFinish={() => {}} className="w-full">
            <Form.Item
              label={t("billing/depositAmount")}
              rules={[{ required: true }]}
              className="!w-full"
            >
              <Space.Compact className="!w-full gap-2">
                <InputNumber
                  value={amount}
                  onChange={(e) => setAmount(e!)}
                  className="!w-full !flex-2"
                />
                <Button
                  variant="outlined"
                  color="green"
                  type="primary"
                  onClick={() => setAmount(0)}
                  className="!w-full flex-1"
                >
                  {t("reset")}
                </Button>
              </Space.Compact>
            </Form.Item>
            <Form.Item
              label={t("billing/rechargeAmount")}
            >
              <Radio.Group
                value={amount}
                buttonStyle="solid"
                className="w-full"
                onChange={onAmountChange}
              >
                <Space direction="vertical" className="w-full">
                  <Space.Compact className="w-full flex flex-wrap gap-2">
                    <Radio.Button value={1000}>
                      {f.number(1000, { style: "currency", currency: "USD" })}
                    </Radio.Button>
                    <Radio.Button value={5000}>
                      {f.number(5000, { style: "currency", currency: "USD" })}
                    </Radio.Button>
                    <Radio.Button value={10000}>
                      {f.number(10000, { style: "currency", currency: "USD" })}
                    </Radio.Button>
                    <Radio.Button value={50000}>
                      {f.number(50000, { style: "currency", currency: "USD" })}
                    </Radio.Button>
                    <Radio.Button value={100000}>
                      {f.number(100000, { style: "currency", currency: "USD" })}
                    </Radio.Button>
                    <Radio.Button value={500000}>
                      {f.number(500000, { style: "currency", currency: "USD" })}
                    </Radio.Button>
                  </Space.Compact>
                </Space>
              </Radio.Group>
            </Form.Item>
            <Form.Item
              label={t("billing/rechargeBonus")}
              rules={[{ required: true }]}
              className="!w-full"
            >
              <Space.Compact className="!w-full gap-2">
                <Select options={rechargeOptions} onChange={(e) => setRechargeBonus(e)}/>
              </Space.Compact>
            </Form.Item>
          </Form>
        </List>
      </Card>
      <Table<any>
        columns={columns}
        loading={false}
        dataSource={transactions}
        className="w-full mt-4"
        size="small"
        scroll={{ x: "max-content" }}
        onChange={() => {}}
        pagination={{
          showTotal(total, range) {
            return t(`paginationLabel`, {
              from: range[0],
              to: range[1],
              total: total,
            });
          },
          total: 0,
          showSizeChanger: true,
          pageSizeOptions: [10, 20, 50],
        }}
      />
    </Layout.Content>
    
  );
};

export default DepositRequest;
