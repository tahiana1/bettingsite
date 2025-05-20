"use client";

import { Flex, Form, Input, Row, Select, Switch } from "antd";
import { useTranslations } from "next-intl";
import React from "react";

type BasicInformationProps = {
  user: User;
};
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 },
  },
};

const BasicInformation: React.FC<BasicInformationProps> = ({ user }) => {
  const t = useTranslations();
  return (
    <div>
      {t("deposit")} 0 + {t("withdraw")} + 0 = 0
      <Form initialValues={user} {...formItemLayout}>
        <Row>
          <Flex>
            <Form.Item name={"userid"} label={t("userid")}>
              <Input />
            </Form.Item>
            <Form.Item name={["profile", "nickname"]} label={t("nickname")}>
              <Input />
            </Form.Item>
            <Form.Item name={"password"} label={t("password")}>
              <Input.Password />
            </Form.Item>
            <Form.Item name={"exchangePassword"} label={t("exchangePassword")}>
              <Input.Password />
            </Form.Item>
            <Form.Item name={"alias"} label={t("alias")}>
              <Input />
            </Form.Item>
            <Form.Item name={["profile", "holderName"]} label={t("holderName")}>
              <Input />
            </Form.Item>
            <Form.Item name={["profile", "bank"]} label={t("bank")}>
              <Input />
            </Form.Item>
            <Form.Item
              name={["profile", "accountNumber"]}
              label={t("accountNumber")}
            >
              <Input />
            </Form.Item>
            <Form.Item name={["profile", "phone"]} label={t("phone")}>
              <Input />
            </Form.Item>
            <Form.Item name={["parent", "id"]} label={t("top_dist")}>
              <Input />
            </Form.Item>
            <Form.Item name={"level"} label={t("level")}>
              <Select />
            </Form.Item>
            <Form.Item name={"type"} label={t("type")}>
              <Select />
            </Form.Item>
            <Form.Item name={"status"} label={t("status")}>
              <Select />
            </Form.Item>
            <Form.Item name={["profile", "color"]} label={t("color")}>
              <Select />
            </Form.Item>
            <Form.Item name={"status"} label={t("block")}>
              <Select />
            </Form.Item>
            <Form.Item name={"residentRegNumber"} label={t("residentRegNumber")}>
              <Input />
            </Form.Item>
            <Form.Item name={"useUsdtAddress"} label={t("usdtAddress")}>
              <Switch />
            </Form.Item>
          </Flex>
          <Flex>
            <Form.Item name={["profile", "balance"]} label={t("balance")}>
              <Input />
            </Form.Item>
            <Form.Item name={"handlingBalance"} label={t("handlingBalance")}>
              <Input />
            </Form.Item>
          </Flex>
        </Row>
      </Form>
      {JSON.stringify(user)}
    </div>
  );
};

export default BasicInformation;
