"use client";

import {
  Button,
  Col,
  Flex,
  Form,
  Input,
  InputNumber,
  Select,
  Space,
  Switch,
} from "antd";
import { useTranslations } from "next-intl";
import React from "react";

type BasicInformationProps = {
  user: User;
};
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 14 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 10 },
  },
};

const BasicInformation: React.FC<BasicInformationProps> = ({ user }) => {
  const t = useTranslations();
  const onSubmitData = (v: any) => {
    console.log({ v });
  };
  return (
    <div>
      {t("deposit")} 0 + {t("withdraw")} + 0 = 0
      <Form initialValues={user} {...formItemLayout} onFinish={onSubmitData}>
        <Flex>
          <Col>
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
            <Form.Item
              name={"residentRegNumber"}
              label={t("residentRegNumber")}
            >
              <Input />
            </Form.Item>
            <Form.Item name={"useUsdtAddress"} label={t("usdtAddress")}>
              <Switch />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item name={["profile", "balance"]} label={t("balance")}>
              <Input />
            </Form.Item>
            <Form.Item name={"handlingBalance"} label={t("handlingBalance")}>
              <Input />
            </Form.Item>
            <Form.Item name={["profile", "point"]} label={t("point")}>
              <Input />
            </Form.Item>
            <Form.Item name={"pointProcessing"} label={t("pointProcessing")}>
              <Input />
            </Form.Item>
            <Form.Item name={["profile", "coupon"]} label={t("coupon")}>
              <Input />
            </Form.Item>
            <Form.Item name={"couponProcessing"} label={t("couponProcessing")}>
              <Input />
            </Form.Item>
            <Form.Item name={["profile", "totalLoss"]} label={t("totalLoss")}>
              <Input />
            </Form.Item>
            <Form.Item
              name={"totalLossProcessing"}
              label={t("totalLossProcessing")}
            >
              <Input />
            </Form.Item>
            <Form.Item name={"rollingGold"} label={t("rollingGold")}>
              <Input />
            </Form.Item>
            <Form.Item
              name={"rollingGoldProcessing"}
              label={t("rollingGoldProcessing")}
            >
              <Input />
            </Form.Item>
            <Form.Item name={"signUpPath"} label={t("signUpPath")}>
              <Input />
            </Form.Item>
            <Form.Item
              name={"subscribedDomains"}
              label={t("subscribedDomains")}
            >
              <Input />
            </Form.Item>
            <Form.Item name={"regDate"} label={t("regDate")}>
              <Input />
            </Form.Item>
            <Form.Item name={"ip"} label={t("subscribeIP")}>
              <Input />
            </Form.Item>
            <Form.Item
              name={"frequentlyUsedGames"}
              label={t("frequentlyUsedGames")}
            >
              <Input />
            </Form.Item>
            <Form.Item name={"currentIP"} label={t("currentIP")}>
              <Input />
            </Form.Item>
            <Form.Item
              name={"recentAccessDomain"}
              label={t("recentAccessDomain")}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name={"recentConnectedDevices"}
              label={t("recentConnectedDevices")}
            >
              <Input />
            </Form.Item>
            <Space direction="vertical">
              <Space.Compact>
                <Form.Item
                  layout="vertical"
                  name={"live"}
                  label={t("live")}
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                >
                  <InputNumber defaultValue={0} />
                </Form.Item>
                <Form.Item
                  layout="vertical"
                  name={"slot"}
                  label={t("slot")}
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                >
                  <InputNumber defaultValue={0} />
                </Form.Item>
                <Form.Item
                  layout="vertical"
                  name={"holdem"}
                  label={t("holdem")}
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                >
                  <InputNumber defaultValue={0} />
                </Form.Item>
                <Form.Item
                  layout="vertical"
                  name={"virtualGame"}
                  label={t("virtualGame")}
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                >
                  <InputNumber defaultValue={0} />
                </Form.Item>
              </Space.Compact>
              <Space.Compact>
                <Form.Item
                  layout="vertical"
                  name={"lotusHole"}
                  label={t("lotusHole")}
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                >
                  <InputNumber defaultValue={0} />
                </Form.Item>

                <Form.Item
                  layout="vertical"
                  name={"lotusBaccarat"}
                  label={t("lotusBaccarat")}
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                >
                  <InputNumber defaultValue={0} />
                </Form.Item>
                <Form.Item
                  layout="vertical"
                  name={"mgmHalljak"}
                  label={t("mgmHalljak")}
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                >
                  <InputNumber defaultValue={0} />
                </Form.Item>
                <Form.Item
                  layout="vertical"
                  name={"mgmBaccarat"}
                  label={t("mgmBaccarat")}
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                >
                  <InputNumber defaultValue={0} />
                </Form.Item>
              </Space.Compact>
            </Space>
          </Col>{" "}
          <Col>
            <Form.Item
              name={"webLoginAvailable"}
              label={t("webLoginAvailable")}
            >
              <Select
                options={[
                  {
                    label: t("allowance"),
                    value: true,
                  },
                ]}
              />
            </Form.Item>
            <Form.Item name={"signUpCode"} label={t("signUpCode")}>
              <Input />
            </Form.Item>
            <Form.Item
              name={"codeSignUpAvailable"}
              label={t("codeSignUpAvailable")}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name={"displayMembershipCodeInRegWindow"}
              label={t("displayMembershipCodeInRegWindow")}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name={"initialLevelofAcquaintanceReg"}
              label={t("initialLevelofAcquaintanceReg")}
            >
              <Select
                options={[
                  {
                    label: t("allowance"),
                    value: true,
                  },
                ]}
              />
            </Form.Item>

            <Form.Item
              name={"memberPageAlarmSound"}
              label={t("memberPageAlarmSound")}
            >
              <Select
                options={[
                  {
                    label: t("turnOff"),
                    value: "off",
                  },
                ]}
              />
            </Form.Item>

            <Form.Item
              name={"useAttendanceCheck"}
              label={t("useAttendanceCheck")}
            >
              <Select
                options={[
                  {
                    label: t("use"),
                    value: true,
                  },
                ]}
              />
            </Form.Item>

            <Form.Item name={"useRoulette"} label={t("useRoulette")}>
              <Select
                options={[
                  {
                    label: t("use"),
                    value: true,
                  },
                ]}
              />
            </Form.Item>
            <Form.Item
              name={"customerCenterInquiryAvailable"}
              label={t("customerCenterInquiryAvailable")}
            >
              <Select
                options={[
                  {
                    label: t("allowance"),
                    value: true,
                  },
                ]}
              />
            </Form.Item>

            <Form.Item name={"createPost"} label={t("createPost")}>
              <Select
                options={[
                  {
                    label: t("allowance"),
                    value: true,
                  },
                ]}
              />
            </Form.Item>
            <Form.Item
              name={"writeCommentOnPost"}
              label={t("writeCommentOnPost")}
            >
              <Select
                options={[
                  {
                    label: t("allowance"),
                    value: true,
                  },
                ]}
              />
            </Form.Item>
            <Form.Item
              name={"pointsAwardedForEachPost"}
              label={t("pointsAwardedForEachPost")}
            >
              <Select
                options={[
                  {
                    label: t("allowance"),
                    value: true,
                  },
                ]}
              />
            </Form.Item>
            <Form.Item
              name={"usingVirtualAccountAPI"}
              label={t("usingVirtualAccountAPI")}
            >
              <Select
                options={[
                  {
                    label: t("notInUse"),
                    value: false,
                  },
                  {
                    label: t("use"),
                    value: true,
                  },
                ]}
              />
            </Form.Item>
            <Form.Item
              name={"useOfWinningPoints"}
              label={t("useOfWinningPoints")}
            >
              <Select
                options={[
                  {
                    label: t("notInUse"),
                    value: false,
                  },
                  {
                    label: t("use"),
                    value: true,
                  },
                ]}
              />
            </Form.Item>
            <Form.Item
              name={"usePaybackPayment"}
              label={t("usePaybackPayment")}
            >
              <Select
                options={[
                  {
                    label: t("prohibition"),
                    value: "P",
                  },
                ]}
              />
            </Form.Item>
            <Form.Item name={"useRefundList"} label={t("useRefundList")}>
              <Select
                options={[
                  {
                    label: t("notInUse"),
                    value: false,
                  },
                  {
                    label: t("use"),
                    value: true,
                  },
                ]}
              />
            </Form.Item>
            <Form.Item
              name={"dailyFirstDepositBonusLimit"}
              label={t("dailyFirstDepositBonusLimit")}
            >
              <Select
                options={[
                  {
                    label: t("noRestriction"),
                    value: false,
                  },
                  {
                    label: t("use"),
                    value: true,
                  },
                ]}
              />
            </Form.Item>

            <Form.Item
              name={"signUpFirstDepositBonusLimit"}
              label={t("signUpFirstDepositBonusLimit")}
            >
              <Select
                options={[
                  {
                    label: t("noRestriction"),
                    value: false,
                  },
                  {
                    label: t("use"),
                    value: true,
                  },
                ]}
              />
            </Form.Item>
            <Form.Item
              name={"replenishmentBonusLimit"}
              label={t("replenishmentBonusLimit")}
            >
              <Select
                options={[
                  {
                    label: t("noRestriction"),
                    value: false,
                  },
                  {
                    label: t("use"),
                    value: true,
                  },
                ]}
              />
            </Form.Item>
            <Form.Item
              name={"surpriseBonusLimit"}
              label={t("surpriseBonusLimit")}
            >
              <Select
                options={[
                  {
                    label: t("noRestriction"),
                    value: false,
                  },
                  {
                    label: t("use"),
                    value: true,
                  },
                ]}
              />
            </Form.Item>
            <Form.Item name={"ignoreOption"} label={t("ignoreOption")}>
              <Select
                options={[
                  {
                    label: t("dontIgnore"),
                    value: false,
                  },
                  {
                    label: t("ignore"),
                    value: true,
                  },
                ]}
              />
            </Form.Item>
          </Col>
        </Flex>

        <Form.Item
          labelCol={{
            sm: {
              span: 10,
            },
          }}
        >
          <Button type="primary" htmlType="submit">
            {t("submit")}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default BasicInformation;
