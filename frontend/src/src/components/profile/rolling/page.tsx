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
  Layout,
  Table,
  Popconfirm,
  message,
  Tag,
} from "antd";
import type { RadioChangeEvent } from "antd";
import type { TableProps } from "antd";
import { useTranslations, useFormatter } from "next-intl";
import { useAtom } from "jotai";
import { betAmount, userState } from "@/state/state";
import { SiDepositphotos } from "react-icons/si";
import modalImage from '@/assets/img/main/modal-head.png';
import api from "@/api";
import dayjs from "dayjs";

const RollingPage: React.FC<{checkoutModal: (modal: string) => void}> = (props) => {
  const t = useTranslations();
  const f = useFormatter();

  const [profile] = useAtom<any>(userState);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [timeoutState, setTimeoutState] = useState<boolean>(false);
  const [balance, setBalance] = useState<number>(0);
  const [pointProfile, setPointProfile] = useState<any>(null);

  const [amount, setAmount] = useAtom<number>(betAmount);

  useEffect(() => {
    api("user/me").then((res) => {
      setPointProfile(res.data.profile);
      const userid = String(res.data.profile.userId);
      api("transactions/get", { 
        method: "GET",
        params: {
          userid,
          type: "point"
        }
      }).then((res) => {
        setTransactions(res.data);
        setBalance(res.balance);
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
      setAmount(1000000);
    } else {
      setAmount(parseInt(e.target.value));
    }
  };

  const submitPointConversion = (amount: number) => {
    if (pointProfile.point < amount) {
      message.error(t("insufficientPoint"));
      return;
    }
    if (amount <= 0) {
      message.error(t("withdrawAmountError"));
      return;
    } else if (amount < 100) {
      message.error(t("TheMinimumPointsToConvertIs100Points"));
      return;
    }
    const userid = Number(pointProfile.userId);
    api("transactions/create", {
      method: "POST",
      data: {
        userId: userid,
        amount: amount,
        type: "point",
        explation: "Point conversion to balance"
      }
    })
    .then((res) => {
      if (res.data.status) {
        message.success(t("pointConversionSuccess"));
        setTimeoutState(!timeoutState);
        resetForm();
      } else {
        message.error(t("pointConversionFailed"));
      }
    })
    .catch((err) => {
      console.log(err);
    });
  }

  const resetForm = () => {
    setAmount(0);
  }

  const columns: TableProps<any>["columns"] = [
    {
      title: t("number"),
      dataIndex: "id", 
      key: "id",
      render: (_, __, index) => index + 1
    },
    {
      title: t("profile/pointAmount"),
      dataIndex: "amount",
      key: "amount",
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
      render: (_, record) => (
        <Tag color={record.status === "A" ? "green" : "red"}>
          {record.status === "pending" && "Pending"}
          {record.status === "A" && "Approved"}
          {record.status === "W" && "Waiting"}
          {record.status === "C" && "Canceled"}
          {record.status === "DL" && "Deleted"}
        </Tag>
      )
    }
  ];

  return (
    <Layout.Content className="w-full border-1 bg-[#160d0c] border-[#3e2e23] deposit-section">
      <Card
        title={
            <div className="relative">
              <h2 className="text-[#edd497] text-[40px] justify-center flex pt-10 font-bold">{t("rolling/exchangeRequest")}</h2>
              <p className="text-white text-[14px] font-[400] justify-center pb-6 flex">{t("rolling/exchangeRequest")}</p>
              <div className="absolute bottom-2 right-0 flex gap-2">
                <button onClick={() => props.checkoutModal('profile')} className="text-white text-[14px] font-[400] btn-modal-effect justify-center py-2 flex ">{t("myPage")}</button>
                <button onClick={() => props.checkoutModal('betHistory')} className="text-white text-[14px] font-[400] btn-modal-effect justify-center py-2 flex ">{t("betHistory")}</button>
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
              onClick={() => {
                submitPointConversion(amount);
              }}
              key={"place"}
              className="w-1/2 btn-modal-effect"
            >
              {t("profile/applyPoint")}
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
            className="flex-1 flex items-center justify-center gap-2 cursor-pointer text-[15px] px-4 py-3 text-white hover:bg-[#2a1810] transition-colors border-r border-[#5d4a3a]"
            onClick={() => props.checkoutModal("withdraw")}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
            </svg>
            {t("withdraw")}
          </button>
          <button 
            className="flex-1 flex items-center justify-center gap-2 cursor-pointer text-[15px] px-4 py-3 text-white hover:bg-[#2a1810] transition-colors border-r border-[#5d4a3a]"
            onClick={() => props.checkoutModal("point")}
          >
            <svg  className="w-5 h-5" fill='white' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M128 96C92.7 96 64 124.7 64 160L64 480C64 515.3 92.7 544 128 544C128 561.7 142.3 576 160 576C177.7 576 192 561.7 192 544L448 544C448 561.7 462.3 576 480 576C497.7 576 512 561.7 512 544C547.3 544 576 515.3 576 480L576 160C576 124.7 547.3 96 512 96L128 96zM320 320C320 284.7 291.3 256 256 256C220.7 256 192 284.7 192 320C192 355.3 220.7 384 256 384C291.3 384 320 355.3 320 320zM128 320C128 249.3 185.3 192 256 192C326.7 192 384 249.3 384 320C384 390.7 326.7 448 256 448C185.3 448 128 390.7 128 320zM512 272C512 289.8 502.3 305.3 488 313.6L488 392C488 405.3 477.3 416 464 416C450.7 416 440 405.3 440 392L440 313.6C425.7 305.3 416 289.8 416 272C416 245.5 437.5 224 464 224C490.5 224 512 245.5 512 272z"/></svg>
            {t("point")}
          </button>
          <button 
            className="flex-1 flex items-center justify-center gap-2 cursor-pointer text-[15px] px-4 py-3 bg-[#4a3224] text-[#edd497] font-bold border-r border-[#5d4a3a] hover:bg-[#5a3a2a] transition-colors"
            onClick={() => props.checkoutModal("rolling")}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
            </svg>
            {t("rolling")}
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
              * {t("PleaseProcessAFullMoenyRecoveryBeforeApplyingForWithdrawl")}
              <br />
              * {t("WhenYouConvertPoints,TheyWillBeMobedToYourBalance")}
              <br />* {t("TheMinimumPointsToConvertIs100Points")}
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
              {profile.value}
            </div>
          </List.Item>

          <Form onFinish={() => {}} className="w-full">
            <Form.Item
              label={t("profile/pointAmount")}
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
        className="w-full mt-4 bg-[#160d0c] px-6"
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

export default RollingPage;