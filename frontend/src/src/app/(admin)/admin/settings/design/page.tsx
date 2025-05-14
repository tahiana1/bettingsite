"use client";
import React, { useState } from "react";

import {
  Layout,
  Card,
  Tag,
  Row,
  Col,
  Form,
  Input,
  InputNumber,
  Button,
  Switch,
  Divider,
  Space,
} from "antd";

import { Content } from "antd/es/layout/layout";

import { useTranslations } from "next-intl";

const DesignSettingPage: React.FC = () => {
  const t = useTranslations();
  const opt = [
    {
      label: t("all"),
      value: "",
    },
    {
      label: t("rolling/losing"),
      value: "rl",
    },
    {
      label: t("recommendedMember"),
      value: "recommend",
    },
    {
      label: t("interest"),
      value: "interest",
    },
    {
      label: t("partnerSub"),
      value: "partnersub",
    },
    {
      label: t("autoSleep"),
      value: "autosleep",
    },
    {
      label: t("memberPage"),
      value: "memberPage",
    },
    {
      label: t("sportGame"),
      value: "sport",
    },
    {
      label: t("allInCoupon"),
      value: "allincoupon",
    },
    {
      label: t("freeBulletinBoard"),
      value: "freebulletin",
    },
    {
      label: t("etc"),
      value: "etc",
    },
  ];
  const [checked, setChecked] = useState<any[]>([]);
  return (
    <Layout>
      <Content className="overflow-auto h-[calc(100vh-100px)] dark:bg-black">
        <Card>
          <Row className="w-full gap-1 justify-between">
            <Col span={12}>
              <Card title={t("globalSetting")} type="inner">
                <Space wrap>
                  {opt.map((o) => (
                    <Tag.CheckableTag
                      checked={checked.indexOf(o.value) > -1}
                      key={o.value}
                      onChange={(e) => {
                        if (e) {
                          setChecked([
                            ...checked.filter((c) => c != o.value),
                            o.value,
                          ]);
                        } else {
                          setChecked([...checked.filter((c) => c != o.value)]);
                        }
                      }}
                    >
                      {o.label}
                    </Tag.CheckableTag>
                  ))}
                </Space>
                <Form layout="horizontal" className="text-end">
                  <Divider orientation="left">
                    {t("whetherToUseRollingLosing")}
                  </Divider>
                  <Form.Item label={t("whetherToUseRolling")}>
                    <Switch defaultChecked size="small" />
                  </Form.Item>
                  <Form.Item label={t("whetherToUsePartnerRolling")}>
                    <Switch defaultChecked size="small" />
                  </Form.Item>
                  <Form.Item label={t("whetherToUseLosing")}>
                    <Switch defaultChecked size="small" />
                  </Form.Item>
                  <Form.Item label={t("whetherToUsePartnerLosing")}>
                    <Switch defaultChecked size="small" />
                  </Form.Item>
                  <Form.Item label={t("whetherToUseRollingOption")}>
                    <Switch defaultChecked size="small" />
                  </Form.Item>
                  <Form.Item label={t("rollingAppliedOnlyWhenFloatNotHit")}>
                    <Switch defaultChecked size="small" />
                  </Form.Item>
                  <Form.Item label={t("rollingPaymentsToMembersOnly")}>
                    <Switch defaultChecked size="small" />
                  </Form.Item>
                  <Form.Item label={t("whetherToReduceWinnings")}>
                    <Switch defaultChecked size="small" />
                  </Form.Item>
                  <Form.Item label={t("rollingAccumulationLimitedTo0OrMore")}>
                    <Switch defaultChecked size="small" />
                  </Form.Item>

                  <Divider orientation="left">
                    {t("excludingRecommendedMemberRolling")}
                  </Divider>
                  <Form.Item label={t("rollingAccumulationLimitedTo0OrMore")}>
                    <Switch defaultChecked size="small" />
                  </Form.Item>
                  <Divider orientation="left">
                    {t("interestedMemberBettingAlert")}
                  </Divider>
                  <Form.Item label={t("rollingAccumulationLimitedTo0OrMore")}>
                    <Switch defaultChecked size="small" />
                  </Form.Item>

                  <Form.Item label={t("rollingAccumulationLimitedTo0OrMore")}>
                    <InputNumber size="small" />
                  </Form.Item>
                  <Form.Item label={t("rollingAccumulationLimitedTo0OrMore")}>
                    <InputNumber size="small" />
                  </Form.Item>
                  <Divider orientation="left">
                    {t("partnerSubManagementRelatedSettings")}
                  </Divider>

                  <Form.Item label={t("rollingAccumulationLimitedTo0OrMore")}>
                    <Switch defaultChecked size="small" />
                  </Form.Item>

                  <Form.Item label={t("rollingAccumulationLimitedTo0OrMore")}>
                    <Switch defaultChecked size="small" />
                  </Form.Item>

                  <Form.Item label={t("rollingAccumulationLimitedTo0OrMore")}>
                    <Switch defaultChecked size="small" />
                  </Form.Item>
                </Form>
              </Card>
            </Col>
            <Col span={11}>
              <Card type="inner" title={t("loginFailureSetting")}>
                <Form className="text-end">
                  <Form.Item label={t("accountWillBlockWithFailure")}>
                    <InputNumber suffix={t("times")} />
                  </Form.Item>
                  <Form.Item label={t("ipWillBlockWithFailure")}>
                    <InputNumber suffix={t("times")} />
                  </Form.Item>
                  <Form.Item label={t("messageWhileBlocked")}>
                    <Input.TextArea />
                  </Form.Item>
                  <Form.Item>
                    <Button color="danger" variant="outlined">
                      {t("submit")}
                    </Button>
                  </Form.Item>
                </Form>
              </Card>
              <Card type="inner" title={t("setupBettingAlert")}>
                <Form className="text-end">
                  <Form.Item label={t("ipWillBlockWithFailure")}>
                    <Switch defaultChecked size="small" />
                  </Form.Item>
                  <Form.Item label={t("ipWillBlockWithFailure")}>
                    <InputNumber />
                  </Form.Item>
                  <Form.Item label={t("ipWillBlockWithFailure")}>
                    <InputNumber />
                  </Form.Item>
                  <Form.Item label={t("ipWillBlockWithFailure")}>
                    <InputNumber />
                  </Form.Item>
                  <Form.Item label={t("ipWillBlockWithFailure")}>
                    <InputNumber />
                  </Form.Item>
                  <Form.Item label={t("ipWillBlockWithFailure")}>
                    <InputNumber />
                  </Form.Item>
                  <Form.Item label={t("ipWillBlockWithFailure")}>
                    <InputNumber />
                  </Form.Item>
                  <Form.Item>
                    <Button color="danger" variant="outlined">
                      {t("submit")}
                    </Button>
                  </Form.Item>
                </Form>
              </Card>
            </Col>
          </Row>
        </Card>
      </Content>
    </Layout>
  );
};

export default DesignSettingPage;
