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
import { isValidDate, parseTableOptions } from "@/lib";

const RollingAccumulationPage: React.FC = () => {
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
      title: t("ID(Nickname)"),
      dataIndex: "profile.nickname",
      key: "nickname",
      render: (text) => text ?? "nickname",
    },
    {
      title: t("bettingInformation"),
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
        },
        {
          title: t("prizeMoney"),
          dataIndex: "prizeMoney",
          key: "prizeMoney",
        },
        {
          title: t("bettingTime"),
          dataIndex: "bettingTime",
          key: "bettingTime",
        }, 
        {
          title: t("rolling(%)"),
          dataIndex: "rolling(%)",
          key: "rolling(%)",
        }
      ],
    },
    {
      title: t("rollingGold"),
      dataIndex: "rollingGold",
      key: "rollingGold"
    },
    {
      title: t("previousRollingFee"),
      dataIndex: "previousRollingFee",
      key: "previousRollingFee"
    },
    {
      title: t("afterThatRollingMoney"),
      dataIndex: "afterThatRollingMoney",
      key: "afterThatRollingMoney",
    },
    {
      title: t("type"),
      dataIndex: "type",
      key: "type",
    },
    {
      title: t("explanation"),
      dataIndex: "explanation",
      key: "explanation",
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
          title={t("admin/menu/settlements/rollingaccumulationhistory")}
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
                  label: t("bettingRelatedRolling"),
                  value: "bettingRelatedRolling",
                },
                {
                  label: t("memberRollingCoversation"),
                  value: "memberRollingCoversation",
                },
                {
                  label: t("rollingCoversationOfDistributor"),
                  value: "rollingCoversationOfDistributor",
                },
                {
                  label: t("adminRollingPayments"),
                  value: "adminRollingPayments",
                }
              ]}
              defaultValue={""}
            />
          
            <Space className="!w-full">
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
              <div className="ml-3"><span className="text-sm">{t("rollingPrice")}:</span> <span>1000</span></div>
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

export default RollingAccumulationPage;
