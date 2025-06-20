"use client";
import React, { useEffect, useState } from "react";
import { Content } from "antd/es/layout/layout";
import {
  Layout,
  Card,
  Tabs,
  Input,
  Table,
  Button,
  Modal,
  Form,
  Switch,
} from "antd";
import { useFormatter, useTranslations } from "next-intl";

const GameAPIHororLinkPage: React.FC = () => {
  const t = useTranslations();
  const f = useFormatter();
  const [activeTab, setActiveTab] = useState<"entire" | "honorEvol">("entire");
  const [tableData, setTableData] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const handleCreate = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onFinish = (values: any) => {
    console.log("Success:", values);
    const newData = {
      ...values,
      whetherToUse: values.whetherToUse ?? false,
      key: new Date().toISOString(),
    };
    setTableData((prev) => [...prev, newData]);
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        onFinish(values);
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  const tableOptions = [
    {
      title: t("gameApiName"),
      dataIndex: "gameApiName",
      key: "gameApiName",
    },
    {
      title: t("apiCompanyName"),
      dataIndex: "apiCompanyName",
      key: "apiCompanyName",
    },
    {
      title: t("gameCompanyName"),
      dataIndex: "gameCompanyName",
      key: "gameCompanyName",
    },
    {
      title: t("gameType"),
      dataIndex: "gameType",
      key: "gameType",
    },
    {
      title: t("whetherToUse"),
      dataIndex: "whetherToUse",
      key: "whetherToUse",
      render: (use: boolean) => (use ? t("use") : t("notInUse")),
    },
    {
      title: t("action"),
      dataIndex: "action",
      key: "action",
    },
  ];
  return (
    <Layout>
      <Content className="overflow-auto h-[calc(100vh-100px)] dark:bg-black">
        <Card title={t("admin/menu/gameapi/hororlinksetting")}>
          <div className="flex flex-row justify-between">
            <div className="gap-2 flex ">
              <Button
                type={activeTab === "entire" ? "primary" : "default"}
                onClick={() => setActiveTab("entire")}
              >
                {t("entire")}
              </Button>
              <Button
                type={activeTab === "honorEvol" ? "primary" : "default"}
                onClick={() => setActiveTab("honorEvol")}
              >
                {t("honorEvol")}
              </Button>
            </div>
            <div>
              <Button type="primary">{t("exchangeAllGameMoney")}</Button>
            </div>
          </div>
          <div className="mt-4 flex justify-between">
            <div>
              <Input
                placeholder={t("gameCompanySearch")}
                className="max-w-[180px]"
              />
            </div>
            <div>
              <Button type="primary" onClick={handleCreate}>
                {t("create")}
              </Button>
            </div>
          </div>
          <div className="mt-4">
            <Table columns={tableOptions} dataSource={tableData} />
          </div>
        </Card>
      </Content>
      <Modal
        title={t("create")}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical" name="create_form">
          <Form.Item
            name="gameApiName"
            label={t("gameApiName")}
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="apiCompanyName"
            label={t("apiCompanyName")}
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="gameCompanyName"
            label={t("gameCompanyName")}
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="gameType"
            label={t("gameType")}
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="whetherToUse"
            label={t("whetherToUse")}
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

export default GameAPIHororLinkPage;