import React from "react";
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
} from "antd";
import type { RadioChangeEvent } from "antd";
import { useTranslations, useFormatter } from "next-intl";
import { useAtom } from "jotai";
import { betAmount, userState } from "@/state/state";
import { SiDepositphotos } from "react-icons/si";

const PointConversion: React.FC = () => {
  const t = useTranslations();
  const f = useFormatter();

  const [profile] = useAtom<any>(userState);

  const [amount, setAmount] = useAtom<number>(betAmount);
  const onAmountChange = (e: RadioChangeEvent) => {
    if (e.target.value == "max") {
      setAmount(234353);
    } else {
      setAmount(parseInt(e.target.value));
    }
  };

  return (
    <Card
      title={
        <div className="flex gap-1 items-center">
          <SiDepositphotos className="w-8 h-8" /> {t("profile/withdrawRequest")}
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
            key={"place"}
            className="w-1/2"
          >
            {t("profile/applyPoint")}
          </Button>
        </Space>,
      ]}
    >
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
      />
      <List className="!px-4">
        <List.Item className="flex gap-2">
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
                className="!w-full flex-1"
              >
                {t("reset")}
              </Button>
            </Space.Compact>
          </Form.Item>
          <Form.Item
            label={t("profile/pointAmount")}
            rules={[{ required: true }]}
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
                    {f.number(1000)}
                  </Radio.Button>
                  <Radio.Button value={5000}>
                    {f.number(5000)}
                  </Radio.Button>
                  <Radio.Button value={10000}>
                    {f.number(10000)}
                  </Radio.Button>
                  <Radio.Button value={50000}>
                    {f.number(50000)}
                  </Radio.Button>
                  <Radio.Button value={100000}>
                    {f.number(100000)}
                  </Radio.Button>
                  <Radio.Button value={500000}>
                    {f.number(500000)}
                  </Radio.Button>
                  <Radio.Button value={"max"}>MAX</Radio.Button>
                </Space.Compact>
              </Space>
            </Radio.Group>
          </Form.Item>
        </Form>
      </List>
    </Card>
  );
};

export default PointConversion;
