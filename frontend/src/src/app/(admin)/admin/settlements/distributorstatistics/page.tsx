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

const DistributorStatisticsPage: React.FC = () => {
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
      title: t("rootDistributor"),
      dataIndex: "user.id",
      fixed: "left",
      key: "id",
      render: (_, record) => record.user?.id,
    },
    {
      title: t("numberOfMembers"),
      dataIndex: "user.root.userid",
      key: "root.userid",
      render: (_, record) => record.user?.root?.userid,
    },  
    {
      title: t("domain"),
      dataIndex: "profile.comp",
      key: "member_count",
      render: (_, record) => record.user?.profile?.comp,
    },
    {
      title: t("situation"),
      dataIndex: "site",
      key: "site",
      render: (text) => text ?? "site",
    },
    {
      title: t("depositor"),
      dataIndex: "status",
      key: "status",
    },
    {
      title: t("allas"),
      dataIndex: "user.profile.holderName",
      key: "holderName",
      render: (_, record) => record.user?.profile?.holderName,
    },
    {
      title: t("amountHeld"),
      dataIndex: "user.profile.nickname",
      key: "nickname",
      render: (_, record) => record.user?.profile?.nickname,
    },
    {
      title: t("point"),
      dataIndex: "user.profile.point",
      key: "point",
      render: (_, record) => record.user?.profile?.point,
    },
    {
      title: t("deposit"),
      dataIndex: "deposit",
      key: "deposit",
      render: () => "-",
    },
    {
      title: t("withdraw"),
      dataIndex: "withdraw",
      key: "withdraw",
      render: () => "-",
    },
    {
      title: t("entry/exit"),
      key: "entry_exit",
      render: (_, record) => [
        <Button key="deposit" size="small">{t("deposit/withdraw")}</Button>,
        <Button key="point" size="small">{t("points") + "+"}</Button>,
      ],
    },
    {
      title: t("bet"),
      dataIndex: "bet",
      key: "bet",
      render: () => "-",
    },
    {
      title: t("winner"),
      dataIndex: "winner",
      key: "winner",
      render: () => "-",
    },
    {
      title: t("bedang"),
      dataIndex: "bedang",
      key: "bedang",
      render: () => "-",
    },
    {
      title: t("settlementType"),
      dataIndex: "user.profile.comp",
      key: "settlementType",
      render: (_, record) => record.user?.profile?.comp,
    },
    {
      title: t("rollingRate"),
      dataIndex: "rollingRate",
      key: "rollingRate",
      render: () => "-", // TODO: Implement logic if available
    },
    {
      title: t("rollingGold"),
      dataIndex: "rolling",
      key: "rolling",
      render: () => "-", // TODO: Implement logic if available
    },
    {
      title: t("rollingTransition"),
      dataIndex: "rollingTransition",
      key: "rollingTransition",
      render: () => "-", // TODO: Implement logic if available
    },
    {
      title: t("losingRate"),
      dataIndex: "losingRate",
      key: "losingRate",
      render: () => "-", // TODO: Implement logic if available
    },
    {
      title: t("losingMoney"),
      dataIndex: "losing",
      key: "losing",
      render: () => "-", // TODO: Implement logic if available
    },
    {
      title: t("settlementAmount"),
      dataIndex: "settlementAmount",
      key: "settlementAmount",
      render: () => "-",
    },
    {
      title: t("datePeriod"),
      dataIndex: "transactionAt",
      key: "transactionAt",
      render: (v) => (isValidDate(v) ? f.dateTime(new Date(v)) : ""),
    },
    {
      title: t("processingStatus"),
      dataIndex: "status",
      key: "processingStatus",
      render: (_, record) => record.status,
    },
    {
      title: t("viewDetails"),
      key: "viewDetails",
      render: (_, record) => <div>
        <Button size="small" className="bg-blue-500 text-white">{t("rolling")}</Button>
        <Button size="small" className="bg-red-500 text-white">{t("losing")}</Button>
      </div>,
    },
    {
      title: t("losingSettlement"),
      dataIndex: "losingSettlement",
      key: "losingSettlement",
      render: () => <div>
        <Button size="small" className="bg-blue-300 text-white">{t("losing settlement")}</Button>
      </div>,
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
          title={t("admin/menu/settlements/distributorStatistics")}
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

export default DistributorStatisticsPage;
