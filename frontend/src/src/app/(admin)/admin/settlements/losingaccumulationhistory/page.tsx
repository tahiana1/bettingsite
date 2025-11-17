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
} from "antd";

import { FilterDropdown } from "@refinedev/antd";
import type { TableProps } from "antd";

import { Content } from "antd/es/layout/layout";
import { useFormatter, useTranslations } from "next-intl";
import { useQuery } from "@apollo/client";
import { FILTER_TRANSACTIONS } from "@/actions/transaction";
import { RxLetterCaseToggle } from "react-icons/rx";
import { Dayjs } from "dayjs";
import { isValidDate, parseTableOptions, formatNumber } from "@/lib";

const FullPointsHistoryPage: React.FC = () => {
  const t = useTranslations();
  const f = useFormatter();
  const [tableOptions, setTableOptions] = useState<any>({
    filters: [
      {
        field: "transactions.type",
        value: "T",
        op: "eq",
      },
    ],
  });

  const [total, setTotal] = useState<number>(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  const { loading, data, refetch } = useQuery(FILTER_TRANSACTIONS);

  const columns: TableProps<Transaction>["columns"] = [
    {
      title: t("number"),
      dataIndex: "number",
      key: "number",
      fixed: "left"
    },
    {
      title: t("rootDistributor"),
      dataIndex: "rootDistributor",
      key: "rootDistributor",
      render: (text) => text ?? "rootDistributor",
    },
    {
      title: t("topDistributor"),
      dataIndex: "topDistributor",
      key: "topDistributor",
      render: (text) => text ?? "topDistributor",
    },
    {
      title: t("id"),
      dataIndex: "id",
      key: "id",
      render: (_, record) => record.user?.id,
    },
    {
      title: t("losingRelatedInformation"),
      children: [
        {
          title: t("bettingUser"),
          dataIndex: "bettingUser",
          key: "bettingUser",
        },
        {
          title: t("gameCompany"),
          dataIndex: "gameCompany",
          key: "gameCompany",
        },
        {
          title: t("gameName"),
          dataIndex: "gameName",
          key: "gameName",
        },
        {
          title: t("bettingAmount"),
          dataIndex: "bettingAmount",
          key: "bettingAmount",
          render: (value) => formatNumber(value || 0),
        },
        {
          title: t("prizeMoney"),
          dataIndex: "prizeMoney",
          key: "prizeMoney",
          render: (value) => formatNumber(value || 0),
        },
        {
          title: t("deposit"),
          dataIndex: "deposit",
          key: "deposit",
          render: (value) => formatNumber(value || 0),
        },
        {
          title: t("withdrawal"),
          dataIndex: "withdrawal",
          key: "withdrawal",
          render: (value) => formatNumber(value || 0),
        },
        {
          title: t("currentHoldings"),
          dataIndex: "currentHoldings",
          key: "currentHoldings",
          render: (value) => formatNumber(value || 0),
        },
        {
          title: t("previouslyOwned"),
          dataIndex: "previouslyOwned",
          key: "previouslyOwned",
          render: (value) => formatNumber(value || 0),
        },
        {
          title: t("point"),
          dataIndex: "point",
          key: "point",
          render: (value) => formatNumber(value || 0),
        },
        {
          title: t("rollingGold"),
          dataIndex: "rollingGold",
          key: "rollingGold",
          render: (value) => formatNumber(value || 0),
        },
        {
          title: t("rollingCoversationFund"),
          dataIndex: "rollingCoversationFund",
          key: "rollingCoversationFund",
          render: (value) => formatNumber(value || 0),
        },
        {
          title: t("losing(%)"),
          dataIndex: "losing(%)",
          key: "losing(%)",
        }
      ],
    },
    {
      title: t("losingMoney"),
      dataIndex: "losingMoney",
      key: "losingMoney",
    },
    {
      title: t("previousLoss"),
      dataIndex: "previousLoss",
      key: "previousLoss",
    },
    {
      title: t("afterThatTheLoss"),
      dataIndex: "afterThatTheLoss",
      key: "afterThatTheLoss",
    },
    {
      title: t("type"),
      dataIndex: "type",
      key: "type",
    },
    {
      title: t("settlementType"),
      dataIndex: "settlementType",
      key: "settlementType",
    },
    {
      title: t("meme"),
      dataIndex: "meme",
      key: "meme",
    },
    {
      title: t("bettingTime"),
      dataIndex: "bettingTime",
      key: "bettingTime",
    },
    {
      title: t("registrationTime"),
      dataIndex: "registrationTime",
      key: "registrationTime",
    },
  ];

  const onChange: TableProps<Transaction>["onChange"] = (
    pagination,
    filters,
    sorter,
    extra
  ) => {
    setTableOptions({
      ...parseTableOptions(pagination, filters, sorter, extra),
      filters: tableOptions?.filters,
    });
  };

  /*   const updateFilter = (field: string, v: string, op: string = "eq") => {
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
  }; */

  const onRangerChange = (
    dates: (Dayjs | null)[] | null,
    dateStrings: string[]
  ) => {
    let filters: { field: string; value: string; op: string }[] =
      tableOptions?.filters ?? [];
    const f = filters.filter((f) => f.field !== "transactions.created_at");
    if (dates?.at(0)) {
      filters = [
        ...f,
        {
          field: "transactions.created_at",
          value: dateStrings[0],
          op: "gt",
        },
        {
          field: "transactions.created_at",
          value: dateStrings[1],
          op: "lt",
        },
      ];
    }
    console.log({ filters });
    setTableOptions({ ...tableOptions, filters });
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
    <Layout>
      <Content className="overflow-auto h-[calc(100vh-100px)] dark:bg-black">
        <Card
          title={t("admin/menu/settlements/losingaccumulationhistory")}
          classNames={{
            body: "!p-0",
          }}
        >
          <Space className="p-2 !w-full" direction="vertical">
            <Radio.Group
              size="small"
              optionType="button"
              buttonStyle="solid"
              options={[
                {
                  label: t("all"),
                  value: "",
                },
                {
                  label: t("site"),
                  value: "site",
                },
              ]}
              defaultValue={""}
            />

            <Radio.Group
              size="small"
              optionType="button"
              buttonStyle="solid"
              options={[
                {
                  label: t("all"),
                  value: "",
                },
                {
                  label: t("bettingRelatedLosing"),
                  value: "bettingRelatedLosing",
                },
                {
                  label: t("entrieAndExitLosing"),
                  value: "entrieAndExitLosing",
                },
                {
                  label: t("totalLossSettlement"),
                  value: "totalLossSettlement",
                },
                {
                  label: t("adminLosingPayment"),
                  value: "adminLosingPayment",
                }
              ]}
              defaultValue={""}
            />

            <Space className="!w-full justify-between">
              <Space>
                <DatePicker.RangePicker
                  size="small"
                  onChange={onRangerChange}
                />
                <Input.Search
                  size="small"
                  placeholder="ID,Nickname,Account Holder,Phone Number"
                  suffix={
                    <Button
                      size="small"
                      type="text"
                      icon={<RxLetterCaseToggle />}
                    />
                  }
                  enterButton={t("search")}
                />
              </Space>
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
        </Card>
      </Content>
    </Layout>
  );
};

export default FullPointsHistoryPage;
