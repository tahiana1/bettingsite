"use client";
import React, { useEffect, useState } from "react";
import { Content } from "antd/es/layout/layout";
import {
  Layout,
  Card,
  Input,
  Table,
  Button,
  Modal,
  Form,
  Switch,
} from "antd";
import { useFormatter, useTranslations } from "next-intl";
import { useQuery, useMutation } from "@apollo/client";
import {
  FILTER_GAME_API,
  CREATE_GAME_API,
  UPDATE_GAME_API,
} from "@/actions/game_api";

const GameAPIHororLinkPage: React.FC = () => {
  const t = useTranslations();
  const f = useFormatter();
  const [activeTab, setActiveTab] = useState<"entire" | "honorEvol">("entire");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [editingRecord, setEditingRecord] = useState<any>(null);
  const [search, setSearch] = useState("");

  // Fetch GameAPI data
  const { data, loading, refetch } = useQuery(FILTER_GAME_API, {
    variables: {
      filters: search
        ? [
            {
              field: "gameCompanyName",
              value: search,
              op: "like",
            },
          ]
        : [],
      orders: [{ field: "orderNum", direction: "ASC" }],
      pagination: { limit: 100, offset: 0 },
    },
    fetchPolicy: "network-only",
  });

  const [createGameApi] = useMutation(CREATE_GAME_API);
  const [updateGameApi] = useMutation(UPDATE_GAME_API);

  const handleCreate = () => {
    setEditingRecord(null);
    setIsModalOpen(true);
  };

  const handleEdit = (record: any) => {
    setEditingRecord(record);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingRecord(null);
    form.resetFields();
  };

  const onFinish = async (values: any) => {
    const newValues = { ...values };
    // Ensure 'order' is an integer or not present if empty/invalid
    if (
      newValues.order !== null &&
      newValues.order !== undefined &&
      newValues.order !== ""
    ) {
      const parsedOrder = parseInt(newValues.order, 10);
      if (!isNaN(parsedOrder)) {
        newValues.order = parsedOrder;
      } else {
        delete newValues.order;
      }
    } else {
      delete newValues.order;
    }
    // Ensure `whetherToUse` has a boolean value
    newValues.whetherToUse = !!newValues.whetherToUse;
    try {
      if (editingRecord) {
        // For updates, only send fields that have values.
        const updateInput = Object.entries(newValues).reduce((acc, [key, value]) => {
          if (value !== "" && value !== null && value !== undefined) {
            (acc as any)[key] = value;
          }
          return acc;
        }, {});
        await updateGameApi({
          variables: { id: editingRecord.id, input: updateInput },
        });
      } else {
        await createGameApi({
          variables: { input: newValues },
        });
      }
      setIsModalOpen(false);
      setEditingRecord(null);
      form.resetFields();
      refetch();
    } catch (err) {
      console.log(err);
    }
  };

  const handleOk = () => {
    form
      .validateFields()
      .then(onFinish)
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  const handleSearch = (e: any) => {
    const value = e.target.value;
    setSearch(value);
    setTimeout(() => {
      refetch({
        filters: value
          ? [
              {
                field: "gameCompanyName",
                value: value,
                op: "like",
              },
            ]
          : [],
        orders: [{ field: "orderNum", direction: "ASC" }],
        pagination: { limit: 100, offset: 0 },
      });
    }, 300);
  };

  const handleSwitchChange = async (record: any, checked: boolean) => {
    try {
      await updateGameApi({
        variables: {
          id: record.id,
          input: { whetherToUse: checked },
        },
      });
      refetch();
    } catch (err) {
      console.error(err);
    }
  };

  const tableOptions = [
    { title: t("gameApiName"), dataIndex: "gameApiName", key: "gameApiName" },
    { title: t("apiCompanyName"), dataIndex: "apiCompanyName", key: "apiCompanyName" },
    { title: t("gameCompanyName"), dataIndex: "gameCompanyName", key: "gameCompanyName" },
    { title: t("gameType"), dataIndex: "gameType", key: "gameType" },
    {
      title: t("whetherToUse"),
      dataIndex: "whetherToUse",
      key: "whetherToUse",
      render: (use: boolean, record: any) => (
        <Switch
          checked={use}
          onChange={(checked) => handleSwitchChange(record, checked)}
        />
      ),
    },
    // { title: t("order"), dataIndex: "order", key: "order" },
    // { title: t("type"), dataIndex: "type", key: "type" },
    {
      title: "-",
      key: "action",
      // render: (_: any, record: any) => (
      //   <Button onClick={() => handleEdit(record)}>{t("edit")}</Button>
      // ),
    },
  ];

  return (
    <Layout>
      <Content className="overflow-auto h-[calc(100vh-100px)] dark:bg-black">
        <Card title={t("admin/menu/gameapi/honorlinksetting")}> 
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
                value={search}
                onChange={handleSearch}
              />
            </div>
            {/* <div>
              <Button type="primary" onClick={handleCreate}>
                {t("create")}
              </Button>
            </div> */}
          </div>
          <div className="mt-4">
            <Table
              columns={tableOptions}
              dataSource={data?.response?.gameApis || []}
              loading={loading}
              rowKey="id"
            />
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
          <Form.Item name="gameApiName" label={t("gameApiName")} rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="apiCompanyName" label={t("apiCompanyName")} rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="gameCompanyName" label={t("gameCompanyName")} rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="gameType" label={t("gameType")} rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="whetherToUse" label={t("whetherToUse")} valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item name="order" label={t("order")}>
            <Input type="number" />
          </Form.Item>
          <Form.Item name="type" label={t("type")}> <Input /> </Form.Item>
          <Form.Item name="other" label={t("other")}> <Input /> </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

export default GameAPIHororLinkPage;