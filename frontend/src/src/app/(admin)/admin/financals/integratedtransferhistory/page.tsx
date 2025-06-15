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
  Divider,
  Descriptions,
  Alert,
} from "antd";
import { FilterDropdown } from "@refinedev/antd";
import type { TableProps } from "antd";

import { Content } from "antd/es/layout/layout";
import { useFormatter, useTranslations } from "next-intl";
import { useQuery } from "@apollo/client";
import {
  FILTER_TRANSACTIONS,
} from "@/actions/transaction";
import { RxLetterCaseToggle } from "react-icons/rx";
import dayjs, { Dayjs } from "dayjs";
import { isValidDate, parseTableOptions } from "@/lib";
import * as XLSX from 'xlsx';

const IntegratedTransferPage: React.FC = () => {
  const t = useTranslations();
  const f = useFormatter();
  const [tableOptions, setTableOptions] = useState<any>({});
  const [range, setRange] = useState<any[]>([]);

  const [total, setTotal] = useState<number>(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  const { loading, data, refetch } = useQuery(FILTER_TRANSACTIONS);

  const labelRenderer = (props: any) =>
    props.value.toString() == "100"
      ? "Premium"
      : (parseInt(props.value.toString()) > 100 ? "VIP " : "Level ") +
        props.value;

  const levelOption = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 101, 102, 100,
  ].map((i) => ({
    value: i,
    label: i == 100 ? "Premium" : (i > 100 ? "VIP " : "Level ") + i,
  }));

  const columns: TableProps<Transaction>["columns"] = [
    {
      title: "ID",
      dataIndex: "userid",
      key: "userid",
      render: (_, record) => {
        return record.user.id;
      },
      filterDropdown: (props) => (
        <FilterDropdown {...props}>
          <Input className="w-full" />
        </FilterDropdown>
      ),
    },
    {
      title: t("root_dist"),
      dataIndex: "root.transactionid",
      key: "root.transactionid",
      render(_, record) {
        return record.user?.root?.userid;
      },
    },
    {
      title: t("top_dist"),
      dataIndex: "top_dist",
      key: "top_dist",
      render(_, record) {
        return record.user?.parent?.userid;
      },
    },
    {
      title: t("userid"),
      dataIndex: "userid",
      key: "userid",
      render: (_, record) => {
        return <div className="flex items-center">
          <p className="w-[15px] h-[15px] flex items-center justify-center rounded-full bg-[#1677ff] text-white text-xs">{record.user?.profile?.level}</p>
          <p className="text-xs text-[white] bg-[#000] px-1 py-0.5 rounded">{record.user?.profile?.name}</p>
        </div>
      },
    },
    {
      title: t("nickname"),
      dataIndex: "profile.nickname",
      key: '"Profile"."nickname"',
      render: (_, record) => record.user?.profile?.nickname,
      filterDropdown: (props) => (
        <FilterDropdown {...props}>
          <Input className="w-full" />
        </FilterDropdown>
      ),
    },
    {
      title: t("amount"),
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: t("balanceBefore"),
      dataIndex: "balanceBefore",
      key: "balanceBefore",
    },
    {
      title: t("balanceAfter"),
      dataIndex: "balanceAfter",
      key: "balanceAfter",
    },
    {
      title: t("explation"),
      dataIndex: "explation",
      key: "explation",
      render: (_, record) => {
        return (
          <div>
            {record.type === "deposit" && (
              <span>Deposit</span>
            )}
            {record.type === "withdrawal" && (
              <span>Withdrawal</span>
            )}
            {record.type === "transfer" && (
              <span>Transfer</span>
            )}
            {record.type === "bettingSettlement" && (
              <span>Betting Settlement</span>
            )}
            {record.type === "betting/placingBet" && (
              <span>Betting Placement</span>
            )}
          </div>
        );
      },
    },
    {
      title: t("transactionAt"),
      dataIndex: "transactionAt",
      key: "transactionAt",
      render: (_, record) => {
        return dayjs(record.transactionAt).format("YYYY-MM-DD HH:mm:ss");
      }
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

  const onRangerChange = (
    dates: (Dayjs | null)[] | null,
    dateStrings: string[]
  ) => {
    setRange(dateStrings);
    let filters: { field: string; value: string; op: string }[] =
      tableOptions?.filters ?? [];
    
    // Remove any existing date filters
    filters = filters.filter((f) => f.field !== "transactions.created_at");
    
    // Only add date filters if both dates are selected and valid
    if (dates?.[0] && dates?.[1]) {
      const startDate = dates[0].startOf('day').toISOString();
      const endDate = dates[1].endOf('day').toISOString();
      
      filters = [
        ...filters,
        {
          field: "transactions.created_at",
          value: startDate,
          op: "gte",
        },
        {
          field: "transactions.created_at",
          value: endDate,
          op: "lte",
        },
      ];
    }
    
    setTableOptions({ ...tableOptions, filters });
    refetch({ options: { filters } });
  };

  const onLevelChange = (v: string = "") => {
    updateFilter(`profiles.level`, v, "eq");
  };

  const onSearch = (value: string) => {
    let filters: { field: string; value: string; op: string }[] =
      tableOptions?.filters ?? [];

    // Remove any existing search filters
    filters = filters.filter(
      (f) =>
        !f.field.startsWith("transactions.profile.nickname") &&
        !f.field.startsWith("transactions.profile.holderName") &&
        !f.field.startsWith("transactions.profile.phone")
    );

    if (value) {
      // Add new search filters
      filters = [
        ...filters,
        {
          field: "transactions.profile.nickname",
          value: value,
          op: "like",
        },
        {
          field: "transactions.profile.phone",
          value: value,
          op: "like",
        },
        {
          field: "transactions.profile.holderName",
          value: value,
          op: "like",
        }
      ];
    }

    setTableOptions({ ...tableOptions, filters });
    refetch({ options: { filters } });
  };

  const handleDownload = () => {
    // Create worksheet from transactions data
    const worksheet = XLSX.utils.json_to_sheet(
      transactions.map((transaction) => ({
        [t("number")]: transaction.id,
        [t("root_dist")]: transaction.user?.root?.userid,
        [t("top_dist")]: transaction.user?.parent?.userid,
        [t("level")]: `${transaction.user?.profile?.level} ${transaction.user?.profile?.name}`,
        [t("nickname")]: transaction.user?.profile?.nickname,
        [t("phone")]: transaction.user?.profile?.phone,
        [t("bankName")]: transaction.user?.profile?.bankName,
        [t("accountName")]: transaction.user?.profile?.accountNumber,
        [t("depositorName")]: transaction.user?.profile?.holderName,
        [t("alliance")]: "-",
        [t("balanceBefore")]: transaction.balanceBefore,
        [t("amount")]: transaction.amount,
        [t("balanceAfter")]: transaction.balanceAfter,
        [t("pointBefore")]: transaction.pointBefore,
        [t("point")]: 0,
        [t("pointAfter")]: transaction.pointAfter,
        [t("usdtDesc")]: transaction.usdtDesc,
        [t("shortcut")]: transaction.shortcut,
        [t("transactionAt")]: transaction.transactionAt ? f.dateTime(new Date(transaction.transactionAt)) : "",
        [t("approvedAt")]: transaction.approvedAt ? f.dateTime(new Date(transaction.approvedAt)) : "",
        [t("createdAt")]: transaction.createdAt ? f.dateTime(new Date(transaction.createdAt)) : "",
        [t("status")]: transaction.status,
      }))
    );

    // Create workbook and append worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");

    // Generate Excel file and trigger download
    XLSX.writeFile(workbook, "transactions.xlsx");
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
          title={t("admin/menu/totaltransferhistory")}
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
            <Space wrap>
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
                    label: t("depositApproval"),
                    value: "DA",
                  },
                  {
                    label: t("canceledDeposit"),
                    value: "CD",
                  },
                  {
                    label: t("deletedDeposit"),
                    value: "DD",
                  },
                  {
                    label: t("withdrawApproval"),
                    value: "WA",
                  },
                  {
                    label: t("canceledWithdraw"),
                    value: "CW",
                  },
                  {
                    label: t("deletedWithdraw"),
                    value: "DW",
                  },
                  {
                    label: t("pointConversion"),
                    value: "PC",
                  },
                  {
                    label: t("rollingTransition"),
                    value: "RT",
                  },
                  {
                    label: t("adminPay"),
                    value: "AP",
                  },
                  {
                    label: t("adminRecovery"),
                    value: "AR",
                  },
                  {
                    label: t("gameRecharge"),
                    value: "GR",
                  },
                  {
                    label: t("gameExchange"),
                    value: "GE",
                  },
                  {
                    label: t("wholeSalePayment"),
                    value: "WSP",
                  },
                  {
                    label: t("totalMoneyRecovery"),
                    value: "TMR",
                  },
                  {
                    label: t("settlementExchange"),
                    value: "SAE",
                  },
                ]}
                defaultValue={""}
                onChange={(e) => updateFilter("transactions.type", e.target.value)}
              />
            </Space>
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
                  onSearch={onSearch}
                />
                <Select
                  size="small"
                  placeholder="By Color"
                  className="min-w-28"
                  allowClear
                />
                <Select
                  size="small"
                  placeholder="By Level"
                  className="min-w-28"
                  allowClear
                  onClear={onLevelChange}
                  options={levelOption}
                  labelRender={labelRenderer}
                  onChange={onLevelChange}
                />
              </Space>
              <Space.Compact className="gap-1">
                <Button size="small" type="primary" onClick={handleDownload}>
                  {t("download")}
                </Button>
              </Space.Compact>
            </Space>
            <Divider className="!p-0 !m-0" />
            <Descriptions
              bordered
              layout="vertical"
              column={6}
              items={[
                {
                  key: "1",
                  label: t("depositToday"),
                  children: "0",
                },
                {
                  key: "2",
                  label: t("withdrawlToday"),
                  children: "0",
                },
                {
                  key: "3",
                  label: t("period"),
                  children: "0",
                },
                {
                  key: "4",
                  label: t("deposit"),
                  children: "0",
                },
                {
                  key: "5",
                  label: t("withdraw"),
                  children: "0",
                },
                {
                  key: "6",
                  label: t("deposit") + "/" + t("withdraw"),
                  children: "0",
                },
              ]}
            />
            <Alert
              message={
                <span>
                  <span className="text-red-600">
                    Description: Payment/recovery of distributor money
                  </span>{" "}
                  is a process in which the distributor pays/recovers money to a
                  subordinate, and{" "}
                  <span className="text-red-600">
                    payment/recovery of subordinate money
                  </span>{" "}
                  is a process in which the upper distributor pays/recovers
                  money to the distributor.
                </span>
              }
              type="warning"
            />
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

export default IntegratedTransferPage;
