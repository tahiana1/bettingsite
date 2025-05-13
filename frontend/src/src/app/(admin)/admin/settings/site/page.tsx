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
  Radio,
  Select,
  InputNumber,
  TimePicker,
  Button,
  Switch,
} from "antd";

import { Content } from "antd/es/layout/layout";

import { useTranslations } from "next-intl";

const SiteSettingPage: React.FC = () => {
  const t = useTranslations();
  const opt = [
    {
      label: "WIN",
      value: "win",
    },
    {
      label: "SPORTS",
      value: "sports",
    },
    {
      label: "CUP",
      value: "cup",
    },
    {
      label: "OLEBET",
      value: "olebet",
    },
    {
      label: "SOUL",
      value: "soul",
    },
    {
      label: "DNINE",
      value: "dnine",
    },
    {
      label: "CHOCO",
      value: "choco",
    },
    {
      label: "COK",
      value: "cok",
    },
    {
      label: "OSAKA",
      value: "osaka",
    },
    {
      label: "BELLY",
      value: "belly",
    },
    {
      label: "HOUSE",
      value: "house",
    },
    {
      label: "BLUE",
      value: "blue",
    },
    {
      label: "vlvaldl",
      value: "vlvaldl",
    },
  ];
  const [checked, setChecked] = useState<any[]>([]);
  return (
    <Layout>
      <Content className="overflow-auto h-[calc(100vh-100px)] dark:bg-black">
        <Card>
          <Row className="w-full gap-1 justify-between">
            <Col span={12}>
              <Card title={t("defaultSetting")} type="inner">
                <Form layout="vertical">
                  <Form.Item>
                    <Radio.Group
                      options={[
                        {
                          label: t("underMaintenance"),
                          value: false,
                        },
                        {
                          label: t("normal"),
                          value: true,
                        },
                      ]}
                    />
                  </Form.Item>
                  <Form.Item>
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
                            setChecked([
                              ...checked.filter((c) => c != o.value),
                            ]);
                          }
                        }}
                      >
                        {o.label}
                      </Tag.CheckableTag>
                    ))}
                  </Form.Item>
                  <Form.Item label={t("title")}>
                    <Input />
                  </Form.Item>
                  <Form.Item label={t("desc")}>
                    <Input.TextArea />
                  </Form.Item>
                  <Form.Item label={t("headOffice")}>
                    <Select />
                  </Form.Item>
                  <Form.Item label={t("primaryDomain")}>
                    <InputNumber className="w-full" min={0} defaultValue={5} />
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary">{t("submit")}</Button>
                  </Form.Item>
                </Form>
              </Card>
            </Col>
            <Col span={11}>
              <Card
                type="inner"
                title={t("totalExLimit")}
                extra={<Switch defaultChecked size="small" />}
              >
                <Form>
                  <Form.Item>
                    <TimePicker.RangePicker format={"HH:mm"} />
                  </Form.Item>
                  <Form.Item>
                    <Input.TextArea />
                  </Form.Item>
                  <Form.Item>
                    <Button color="danger" variant="outlined">
                      {t("delete")}
                    </Button>
                  </Form.Item>
                </Form>
              </Card>
              <Card
                type="inner"
                title={t("totalReLimit")}
                extra={<Switch defaultChecked size="small" />}
              >
                <Form>
                  <Form.Item>
                    <TimePicker.RangePicker format={"HH:mm"} />
                  </Form.Item>
                  <Form.Item>
                    <Input.TextArea />
                  </Form.Item>
                  <Form.Item>
                    <Button color="danger" variant="outlined">
                      {t("delete")}
                    </Button>
                  </Form.Item>
                </Form>
              </Card>
              <Card
                type="inner"
                title={t("userExLimit")}
                extra={<Switch defaultChecked size="small" />}
              >
                <Form>
                  <Form.Item>
                    <TimePicker.RangePicker format={"HH:mm"} />
                  </Form.Item>
                  <Form.Item>
                    <Input.TextArea />
                  </Form.Item>
                  <Form.Item>
                    <Button color="danger" variant="outlined">
                      {t("delete")}
                    </Button>
                  </Form.Item>
                </Form>
              </Card>
              <Card
                type="inner"
                title={t("userReLimit")}
                extra={<Switch defaultChecked size="small" />}
              >
                <Form>
                  <Form.Item>
                    <TimePicker.RangePicker format={"HH:mm"} />
                  </Form.Item>
                  <Form.Item>
                    <Input.TextArea />
                  </Form.Item>
                  <Form.Item>
                    <Button color="danger" variant="outlined">
                      {t("delete")}
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

export default SiteSettingPage;
