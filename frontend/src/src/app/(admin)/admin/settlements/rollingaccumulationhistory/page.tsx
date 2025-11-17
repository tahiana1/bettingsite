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
import dayjs, { Dayjs } from "dayjs";
import { isValidDate, parseTableOptions, formatNumber } from "@/lib";

const RollingAccumulationPage: React.FC = () => {
  const t = useTranslations();
  const f = useFormatter();
  const [tableOptions, setTableOptions] = useState<any>({
    filters: [
      {
        field: "transactions.type",
        value: "Rolling",
        op: "eq",
      },
    ],
  });

  const [total, setTotal] = useState<number>(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  const { loading, data, refetch } = useQuery(FILTER_TRANSACTIONS);
  const popupWindow = (id: number) => {
    window.open(`/admin/popup/user?id=${id}`, '_blank', 'width=screen.width,height=screen.height,toolbar=no,menubar=no,scrollbars=yes,resizable=yes,location=no,status=no');
  }
  const columns: TableProps<Transaction>["columns"] = [
    {
      title: t("number"),
      dataIndex: "number",
      key: "number",
      fixed: "left",
      render: (text, record, index) => {
        return index + 1;
      }
    },
    {
      title: t("rootDistributor"),
      dataIndex: ["user", "root", "userid"],
      key: "rootDistributor",
      render: (text) => text ?? "-",
    },
    {
      title: t("topDistributor"),
      dataIndex: ["user", "parent", "userid"],
      key: "topDistributor",
      render: (text) => text ?? "-",
    },
    {
      title: t("userid"),
      dataIndex: ["user", "userid"],
      key: '"User"."userid"',
      render(_, record) {
        return <div className="flex items-center cursor-pointer" onClick={() => popupWindow(record.user?.id)}>
          <p className="w-[15px] h-[15px] flex items-center justify-center rounded-full bg-[#1677ff] text-white text-xs">{record.user?.profile?.level}</p>
          <p className="text-xs text-[white] bg-[#000] px-1 py-0.5 rounded">{record.user?.userid}</p>
        </div>
         
      },
    },
    {
      title: t("bettingInformation"),
      children: [
        {
          title: t("bettingUser"),
          dataIndex: ["user", "profile", "nickname"],
          key: "bettingUser",
          render: (text, record) => {
            return record.user?.profile?.nickname || "-";
          },
        },
        {
          title: t("gameCompany"),
          dataIndex: "shortcut",
          key: "shortcut",
          render: (text, record) => {
            return record.shortcut.split("|")[0] || "-";
          },
        },
        {
          title: t("gameName"),
          dataIndex: "shortcut",
          key: "shortcut",
          render: (text, record) => {
            return record.shortcut.split("|")[1] || "-";
          },
        },
        {
          title: t("bettingAmount"),
          dataIndex: "amount",
          key: "amount",
          render: (text, record) => {
            return formatNumber(Math.abs(record.amount || 0));
          },
        },
        {
          title: t("prizeMoney"),
          dataIndex: "prizeMoney",
          key: "prizeMoney",
          render: (text, record) => {
            return formatNumber(0);
          },
        },
                  {
            title: t("rolling(%)"),
            dataIndex: 'user.live',
            key: "live",
            render: (text, record) => {
              return (record.user as any)?.live + "%" || "-";
            },
          }
      ],
    },
    {
      title: t("rollingGold"),
      dataIndex: ["balanceBefore", "balanceAfter"],
      key: "amount",
      render: (text, record) => {
        return formatNumber((record.balanceAfter || 0) - (record.balanceBefore || 0));
      },
    },
    {
      title: t("previousRollingFee"),
      dataIndex: "balanceBefore",
      key: "balanceBefore",
      render: (text) => {
        return text ? formatNumber(text) : "-";
      },
    },
    {
      title: t("afterThatRollingMoney"),
      dataIndex: "balanceAfter",
      key: "balanceAfter",
      render: (text) => {
        return text ? formatNumber(text) : "-";
      },
    },
    {
      title: t("type"),
      dataIndex: "type",
      key: "type",
      render: (text) => {
       
        if (text === "Rolling") {
          return <div className="text-white cursor-pointer bg-blue-500 px-2 py-1 rounded-md">{t("bettingRelatedRolling")}</div>;
        }
        return text;
      },
    },
    {
      title: t("explanation"),
      dataIndex: "explanation",
      key: "explanation",
    },
    {
      title: t("registrationTime"),
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => {
        return text ? dayjs(text).format("M/D/YYYY HH:mm:ss") : "-";
      },
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

  const onSearch = (searchTerm: string) => {
    let filters: { field: string; value: string; op: string }[] =
      tableOptions?.filters ?? [];
    
    // Remove existing search filters
    const baseFilters = filters.filter((f) => 
      !["users.userid", "profiles.nickname", "profiles.holder_name"].includes(f.field)
    );
    
    if (searchTerm.trim()) {
      filters = [
        ...baseFilters,
        {
          field: "users.userid",
          value: searchTerm,
          op: "ilike",
        },
        {
          field: "profiles.nickname", 
          value: searchTerm,
          op: "ilike",
        },
        {
          field: "profiles.holder_name",
          value: searchTerm,
          op: "ilike",
        },
      ];
    } else {
      filters = baseFilters;
    }
    
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
            

            {/* <Radio.Group
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
            /> */}
          
            <Space className="!w-full">
              <Space>
                <DatePicker.RangePicker
                  size="small"
                  onChange={onRangerChange}
                />
                <Input.Search
                  size="small"
                  placeholder="ID,Nickname,Account Holder"
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
              </Space>
              {/* <div className="ml-3"><span className="text-sm">{t("rollingPrice")}:</span> <span>1000</span></div> */}
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
