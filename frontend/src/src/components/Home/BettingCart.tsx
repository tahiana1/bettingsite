import React from "react";
import {
  Alert,
  Button,
  Card,
  Form,
  InputNumber,
  List,
  Radio,
  Space,
} from "antd";
import type { RadioChangeEvent } from "antd";
import { CiShoppingCart } from "react-icons/ci";
import { useTranslations, useFormatter } from "next-intl";
import { useAtom } from "jotai";
import { expectedWinningAmount, betAmount, rateState } from "@/state/state";

const BettingCart: React.FC = () => {
  const t = useTranslations();
  const f = useFormatter();
  const items = [
    {
      key: "1",
      label: t("betting/singleMaxBettingAmount"),
      value: f.number(5000000),
    },
    {
      key: "2",
      label: t("betting/singleMaxWinningAmount"),
      value: f.number(10000000),
    },
    {
      key: "3",
      label: t("betting/multiMaxBettingAmount"),
      value: f.number(3000000),
    },
    {
      key: "4",
      label: t("betting/multiMaxWinningAmount"),
      value: f.number(10000000),
    },
  ];
  const [amount, setAmount] = useAtom<number>(betAmount);
  const [expectedAmount] = useAtom<Promise<number>>(expectedWinningAmount);
  const [currentRates, setCurrentRates] = useAtom<any[]>(rateState);
  const onAmountChange = (e: RadioChangeEvent) => {
    if (e.target.value == "max") {
      setAmount(234353);
    } else {
      setAmount(parseInt(e.target.value));
    }
  };

  const onRateCancel = (r: any) => {
    console.log({ r });
    setCurrentRates(currentRates.filter((cr) => cr.id != r.id));
  };
  return (
    <Card
      title={
        <div className="flex gap-1 items-center">
          <CiShoppingCart className="w-8 h-8" /> {t("betting/cart")}
        </div>
      }
      classNames={{
        actions: "!p-1",
        body: "!px-2",
      }}
      className="w-full"
      actions={[
        <Space key={"action"} direction="vertical" className="w-full">
          <Button key={"place"} className="w-full" color="red" variant="solid">
            {t("betting/placeBet")}
          </Button>
          <Space.Compact className="w-full flex gap-2">
            <Button className="w-full" variant="solid" color="blue">
              {/* {t("divided_renewal")} */}
              Dividend Renewal
            </Button>
            <Button className="w-full" variant="solid" color="geekblue">
              {t("deleteAll")}
            </Button>
          </Space.Compact>
        </Space>,
      ]}
    >
      <Space direction="vertical" className="w-full !p-0">
        {currentRates?.map((cr) => {
          return (
            <Alert
              key={cr.id}
              closable
              onClose={() => onRateCancel(cr)}
              message={cr.title}
              description={
                <Space className="w-full justify-between">
                  <div className="text-left w-full">
                    {cr.market.type == "handicap"
                      ? cr.selection == cr.homePickName
                        ? `${cr.homeTeam.name}(${cr.homeLine})`
                        : cr.selection == cr.awayPickName
                        ? `${cr.awayTeam.name}(${cr.awayLine})`
                        : ""
                      : cr.selection == cr.homePickName
                      ? `${cr.homeTeam.name}`
                      : cr.selection == cr.awayPickName
                      ? `${cr.awayTeam.name}`
                      : cr.selection == cr.drawPickName
                      ? "Draw"
                      : ""}
                  </div>
                  <div className="text-end w-full">
                    {cr.selection == cr.homePickName
                      ? cr.homeRate
                      : cr.selection == cr.awayPickName
                      ? cr.awayRate
                      : cr.selection == cr.drawPickName
                      ? cr.drawRate
                      : ""}
                  </div>
                </Space>
              }
              type="warning"
              className="!p-2"
            />
          );
        })}
      </Space>
      <List
        className="!px-0"
        dataSource={items}
        renderItem={(item: any) => (
          <List.Item className="flex gap-2 !py-1">
            <div className="w-full flex-3">{item.label} </div>
            <div className="w-full text-red-500 flex-1 text-end">
              {item.value}
            </div>
          </List.Item>
        )}
        footer={
          <List.Item className="flex gap-2">
            <div className="w-full flex-3">
              {t("betting/expectedWinningAmount")}{" "}
            </div>
            <div className="w-full text-red-500 flex-1 text-end">
              {f.number(expectedAmount, {
                currencyDisplay: "narrowSymbol",
                style: "currency",
                currency: "EUR",
              })}
            </div>
          </List.Item>
        }
      />

      <Form onFinish={() => {}}>
        <Form.Item label={t("betting/amount")} rules={[{ required: true }]}>
          <InputNumber
            value={amount}
            onChange={(e) => setAmount(e!)}
            className="w-full"
          />
        </Form.Item>
        <Form.Item rules={[{ required: true }]}>
          <Radio.Group
            value={amount}
            buttonStyle="solid"
            className="w-full"
            onChange={onAmountChange}
          >
            <Space direction="vertical" className="w-full">
              <Space.Compact className="w-full flex gap-2">
                <Radio.Button className="w-full" value={5000}>
                  {f.number(5000)}
                </Radio.Button>
                <Radio.Button className="w-full" value={10000}>
                  {f.number(10000)}
                </Radio.Button>
              </Space.Compact>

              <Space.Compact className="w-full flex gap-2">
                <Radio.Button className="w-full" value={50000}>
                  {f.number(50000)}
                </Radio.Button>
                <Radio.Button className="w-full" value={100000}>
                  {f.number(100000)}
                </Radio.Button>
              </Space.Compact>

              <Space.Compact className="w-full flex gap-2">
                <Radio.Button className="w-full" value={500000}>
                  {f.number(500000)}
                </Radio.Button>
                <Radio.Button className="w-full" value={"max"}>
                  MAX
                </Radio.Button>
              </Space.Compact>
            </Space>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default BettingCart;
