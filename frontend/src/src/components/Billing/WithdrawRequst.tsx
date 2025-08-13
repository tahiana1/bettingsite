import React, { useState, useEffect } from "react";
import {
  Alert,
  Button,
  Card,
  Form,
  InputNumber,
  List,
  Radio,
  Space,  
  Table,
  Layout,
  Popconfirm,
  message,
  Tag,
} from "antd";
import type { RadioChangeEvent } from "antd";
import { useTranslations, useFormatter } from "next-intl";
import { useAtom } from "jotai";
import { betAmount, userState } from "@/state/state";
import { SiDepositphotos } from "react-icons/si";
import { BiTrash } from "react-icons/bi";
import type { TableProps } from "antd";
import { FilterDropdown } from "@refinedev/antd";
import modalImage from '@/assets/img/main/modal-head.png';
import api from "@/api";
import dayjs from "dayjs";

const WithdrawRequest: React.FC<{checkoutModal: (modal: string) => void}> = (props) => {
  const t = useTranslations();
  const f = useFormatter();
  const [amount, setAmount] = useAtom<number>(betAmount);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [timeoutState, setTimeoutState] = useState<boolean>(false);
  const [balance, setBalance] = useState<number>(0);
  const [profile, setProfile] = useState<any>(null);
  const handleDelete = (id: number) => {
    console.log('delete function not implemented');
  };
  useEffect(() => {
    api("user/me").then((res) => {
      setProfile(res.data.profile);
      const userid = String(res.data.profile?.userId);
      api("transactions/get", { 
        method: "GET",
        params: {
          userid,
          type: "withdrawal"
        }
      }).then((res) => {
        setTransactions(res.data);
        setBalance(res.balance);
        setTimeout(() => {
          setTimeoutState(!timeoutState);
        }, 60000);
      });
    }).catch((err) => {
      console.log(err);
    });    
  }, [timeoutState]);

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
        userId: profile.userId,
        amount: amount,
        type: "withdrawal",
        explation: "Withdrawal request"
      }
    })
    .then((res) => {
      if (res.data.status) {
        message.success(t("withdrawSuccess"));
        setTimeoutState(!timeoutState);
        resetForm();
      } else {
        message.error(t("withdrawFailed"));
      }
    })
    .catch((err) => {
      console.log(err);
    });
  }

  const resetForm = () => {
    setAmount(0);
  }

  const onAmountChange = (e: RadioChangeEvent) => {
    if (e.target.value == "max") {
      setAmount(profile.value);
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
      title: t("withdrawAmount"),
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
      render: (_, record) => {
        return dayjs(record.transactionAt).format("YYYY-MM-DD HH:mm:ss");
      }
    },
    {
      title: t("situation"),
      dataIndex: "status",
      key: "status",
      render: (status, record) => (
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
            description={t("deleteMessage")}
            onConfirm={() => handleDelete(record.id)}
          >
            <Button
              title={t("delete")}
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
    <Layout.Content className="w-full border-1 bg-[#160d0c] border-[#3e2e23] withdraw-section">
      <Card
        title={
            <div className="relative">
              <h2 className="text-[#edd497] text-[40px] justify-center flex pt-10 font-bold">{t("withdraw")}</h2>
              <p className="text-white text-[14px] font-[400] justify-center pb-6 flex">{t("withdraw")}</p>
              <div className="absolute bottom-2 right-0 flex gap-2">
                <button className="text-white text-[14px] font-[400] btn-modal-effect justify-center py-2 flex ">{t("myPage")}</button>
                <button className="text-white text-[14px] font-[400] btn-modal-effect justify-center py-2 flex ">{t("betHistory")}</button>
              </div>
            </div>
          }
        styles={{
          header: {
            backgroundImage: `url(${modalImage.src})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            borderBottom: '1px solid #3e2e23',
          },
          body: {
            backgroundColor: '#160d0c',
            borderTop: '1px solid #3e2e23',
            padding: '0px'
          }
        }}
        classNames={{
          actions: "!p-1",
          body: "!px-2",
        }}
        className="w-full bg-[#160d0c] border-none"
        actions={[
          <Space key={"action"} direction="vertical" className="w-full">
            <button
              onClick={() => submitWithdraw(amount)}
              key={"place"}
              className="w-1/2 btn-modal-effect"
            >
              {t("billing/applyWithdraw")}
            </button>
          </Space>,
        ]}
      >
        <div className="flex w-full mb-6 bg-gradient-to-r from-[#2a1810] to-[#3e2a1f] rounded-lg overflow-hidden border border-[#5d4a3a]">
          <button
            onClick={() => props.checkoutModal("deposit")}
            className="flex-1 flex items-center justify-center gap-2 cursor-pointer text-[15px] px-4 py-3 text-white hover:bg-[#2a1810] transition-colors border-r border-[#5d4a3a]">
            <SiDepositphotos className="text-lg" />
            {t("deposit")}
          </button>
          <button
            className="flex-1 flex items-center justify-center gap-2 cursor-pointer text-[15px] px-4 py-3 bg-[#4a3224] text-[#edd497] font-bold border-r border-[#5d4a3a] hover:bg-[#5a3a2a] transition-colors"
            onClick={() => props.checkoutModal("withdraw")}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
            </svg>
            {t("withdraw")}
          </button>
          <button 
            className="flex-1 flex items-center justify-center gap-2 cursor-pointer text-[15px] px-4 py-3 text-white hover:bg-[#2a1810] transition-colors border-r border-[#5d4a3a]"
            onClick={() => props.checkoutModal("notice")}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
            </svg>
            {t("notice")}
          </button>
          <button 
            className="flex-1 flex items-center justify-center gap-2 cursor-pointer text-[15px] px-4 py-3 text-white hover:bg-[#2a1810] transition-colors"
            onClick={() => props.checkoutModal("event")}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z"/>
            </svg>
            {t("event")}
          </button>
        </div>
        <Alert
          description={
            <p>
              * {t("withdrawMinimum")}
              <br />
              * {t("withdrawOnly")}
            </p>
          }
          type="success"
          style={{
            background: "#231b12",
            border: "1px solid #3e2e23"
          }}
        />
        <List className="!px-4">
          <List.Item className="flex gap-2 bg-[#160d0c]" style={{border: 'none'}}>
            <div className="w-full flex-3">{t("profile/balance")}</div>
            <div className="w-full text-red-500 flex-1 text-end">
              {f.number(balance)}
            </div>
          </List.Item>

          <Form onFinish={() => {}} className="w-full">
            <Form.Item
              label={t("billing/withdrawAmount")}
              rules={[{ required: true }]}
              className="!w-full"
              labelCol={{span: 24}}
            >
              <Space.Compact className="!w-full gap-2">
                <InputNumber
                  value={amount}
                  onChange={(e) => setAmount(e!)}
                  className="!w-full !flex-2 custom-white-input"
                />
                <button
                  onClick={() => setAmount(0)}
                  className="!w-full flex-1 bg-[#a34141] border-1 border-[#ff4d4d] cursor-pointer hover:bg-[#ff4d4d] text-white"
                >
                  {t("reset")}
                </button>
              </Space.Compact>
            </Form.Item>
            <Form.Item
              label={null}
              labelCol={{span: 24}}
            >
              <Radio.Group
                value={amount}
                buttonStyle="solid"
                className="w-full"
                onChange={onAmountChange}
              >
                <Space direction="vertical" className="w-full">
                  <Space.Compact className="w-full flex flex-wrap gap-2">
                    <Radio.Button value={1000} className="btn-modal-effect">
                      {f.number(1000)}
                    </Radio.Button>
                    <Radio.Button value={5000} className="btn-modal-effect">
                      {f.number(5000)}
                    </Radio.Button>
                    <Radio.Button value={10000} className="btn-modal-effect">
                      {f.number(10000)}
                    </Radio.Button>
                    <Radio.Button value={50000} className="btn-modal-effect">
                      {f.number(50000)}
                    </Radio.Button>
                    <Radio.Button value={100000} className="btn-modal-effect">
                      {f.number(100000)}
                    </Radio.Button>
                    <Radio.Button value={500000} className="btn-modal-effect">
                      {f.number(500000)}
                    </Radio.Button>
                    <Radio.Button value={"max"} className="btn-modal-effect">MAX</Radio.Button>
                  </Space.Compact>
                </Space>
              </Radio.Group>
            </Form.Item>
          </Form>
        </List>
      </Card>
      <Table<any>
        columns={columns}
        loading={false}
        dataSource={transactions}
        className="w-full mt-4 bg-[#160d0c]"
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

export default WithdrawRequest;