"use client";
import React, { useEffect, useState } from "react";

import {
  Layout,
  Space,
  Card,
  Table,
  Button,   
  Input,
  DatePicker,
  Radio,
  Select,
  Modal,
  Form,
  Descriptions,
} from "antd";
import type { TableProps } from "antd";

import { Content } from "antd/es/layout/layout";
import { useFormatter, useTranslations } from "next-intl";
import { useMutation, useQuery } from "@apollo/client";
import {
  FILTER_TRANSACTIONS,
} from "@/actions/transaction";
import { Dayjs } from "dayjs";
import { isValidDate, parseTableOptions } from "@/lib";

const BettingLog: React.FC = () => {
  const t = useTranslations();
  const f = useFormatter();
  const [tableOptions, setTableOptions] = useState<any>(null);

  const [modal, contextHolder] = Modal.useModal();
  const [range, setRange] = useState<any[]>([]);

  const [total, setTotal] = useState<number>(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  const { loading, data, refetch } = useQuery(FILTER_TRANSACTIONS);
  const [colorModal, setColorModal] = useState<boolean>(false);

  useEffect(() => {
    const interval = setInterval(() => {
      refetch(tableOptions ?? undefined);
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const onTransactionTypeChange = (v: string = "") => {
    updateFilter("transactions.type", v, "eq");
  };

  const columns: TableProps<Transaction>["columns"] = [
    {
      title: t("gameTime"),
      dataIndex: "gameTime", 
      key: "gameTime",
      render: (_, __, index) => index + 1
    },
    {
      title: t("leagueName"),
      dataIndex: "leagueName",
      key: "leagueName",
      render: (_, record) => <p>-</p>,
    },
    {
      title: t("homeTeam"),
      dataIndex: "homeTeam",
      key: "homeTeam",
    },
    {
      title: t("radish"),
      dataIndex: "radish",
      key: "radish",
    },
    {
      title: t("awayTeam"),
      dataIndex: "awayTeam",
      key: "awayTeam",
    },
   
    {
      title: t("type"),
      dataIndex: "type",
      key: "type",
    },
    {
      title: t("result"),
      dataIndex: "result",
      key: "result",
      render: () => 0,
    },
    {
      title: t("periodScore"),
      dataIndex: "periodScore",
      key: "periodScore",
    },
    {
      title: t("matchScore"),
      dataIndex: "matchScore",
      key: "matchScore",
    },
    {
      title: t("allocation"),
      dataIndex: "allocation",
      key: "allocation"
    },
    {
      title: t("situation"),
      dataIndex: "situation",
      key: "situation",
    }
  ];

  const onChange: TableProps<Transaction>["onChange"] = (
    pagination,
    filters,
    sorter,
    extra
  ) => {
    setTableOptions(parseTableOptions(pagination, filters, sorter, extra));
  };

  const updateFilter = (field: string, v: string, op: string = "eq") => {
    let filters: { field: string; value: string; op: string }[] =
      tableOptions?.filters ?? [];
    filters = filters.filter((f) => f.field !== field);
    if (v) {
      filters = [
        ...filters,
        {
          field: field,
          value: v,
          op: op,
        },
      ];
    }
    setTableOptions({ ...tableOptions, filters });
  };

  const [colorOption, setColorOptoin] = useState<any>("new");
  const onChangeColors = async () => {
    setColorModal(false);
  };

  useEffect(() => {
    setTransactions(
      data?.response?.transactions?.map((u: any) => {
        return { ...u, key: u.id };
      }) ?? []
    );
    setTotal(data?.response?.total);
  }, [data]);

  useEffect(() => {
    refetch(tableOptions ?? undefined);
  }, [tableOptions]);

  return (
    <Layout className="p-3">
      {contextHolder}
      <Content className="overflow-auto h-[calc(100vh-100px)] dark:bg-black">
        <Card
          title={t("user/menu/betlog")}
          className="!p-0 flex align-end"
        >
          <Space className="p-2 !w-full" direction="vertical">
            <Space wrap>
              <Radio.Group
                size="small"
                optionType="button"
                buttonStyle="solid"
                options={[
                  {
                    label: t("overseasType"),
                    value: "D",
                  },
                  {
                    label: t("domesticType"),
                    value: "W",
                  },
                  {
                    label: t("inPlay"),
                    value: "AP",
                  },
                  {
                    label: t("realTime"),
                    value: "AR",
                  },
                  {
                    label: t("special"),
                    value: "TR",
                  },
                  {
                    label: t("minigame"),
                    value: "SP",
                  },
                  {
                    label: t("virtualGame"),
                    value: "LR",
                  },
                  {
                    label: t("touchGame"),
                    value: "R",
                  },
                  {
                    label: t("lotusGame"),
                    value: "E",
                  },
                  {
                    label: t("mgmGames"),
                    value: "C",
                  },
                ]}
                defaultValue={""}
                onChange={(e) => onTransactionTypeChange(e.target.value)}
              />
            </Space>
          </Space>

          <Table<Transaction>
            columns={columns}
            loading={loading}
            dataSource={transactions ?? []}
            className="w-full"
            size="small"
            scroll={{ x: "max-content" }}
            onChange={onChange}
            pagination={{
              showTotal(total, range) {
                return t("paginationLabel", {
                  from: range[0],
                  to: range[1],
                  total,
                });
              },
              total: total,
              showSizeChanger: true,
              defaultPageSize: 25,
              pageSizeOptions: [25, 50, 100, 250, 500, 1000],
            }}
          />
          <Modal
            open={colorModal}
            onCancel={() => setColorModal(false)}
            onOk={onChangeColors}
          >
            <Space direction="vertical" className="gap-2">
              <Radio.Group
                onChange={(e) => setColorOptoin(e.target.value)}
                className="!flex !flex-col gap-2"
                defaultValue={"new"}
              >
                <Radio value={"new"}>New Search Criteria</Radio>
                {colorOption == "new" ? (
                  <Form.Item>
                    <Input />
                  </Form.Item>
                ) : null}
                <Radio value={"list"}>
                  Apply the member list search conditions as is:
                </Radio>
                {colorOption == "list" ? (
                  <Form.Item>
                    <Select />
                  </Form.Item>
                ) : null}
              </Radio.Group>
              <Form.Item label="Change Color">
                <Select />
              </Form.Item>
            </Space>
          </Modal>
        </Card>
      </Content>
    </Layout>
  );
};

export default BettingLog;