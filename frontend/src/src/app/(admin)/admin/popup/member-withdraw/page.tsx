"use client";

import PopupHeader from "@/components/Admin/PopupHeader";
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
    Modal,
    Form,
    Select,
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

const MemberWithdraw = () => {
    const t = useTranslations();
    const f = useFormatter();
    const [tableOptions, setTableOptions] = useState<any>({
        filters: [
            {
                and: [
                    {
                        or: [
                                {
                                    field: "transactions.type",
                                    value: "withdrawal",
                                    op: "eq",
                                },
                            ],
                        },
                        {
                            or: [
                                    {
                                        field: "users.role",
                                        value: "A",
                                        op: "eq",
                                    },  
                                    {
                                        field: "users.role",
                                        value: "P",
                                        op: "eq",
                                    },
                                    {
                                        field: "users.role",
                                        value: "U",
                                        op: "eq",
                                    },
                                ],
                        },
                        {
                            field: "transactions.status",
                            value: "A",
                            op: "eq",
                        },
                ],
            },
        ],
    });
    const popupWindow = (id: number) => {
        window.open(`/admin/popup/user?id=${id}`, '_blank', 'width=screen.width,height=screen.height,toolbar=no,menubar=no,scrollbars=yes,resizable=yes,location=no,status=no');
    }
    const [total, setTotal] = useState<number>(0);
    const [transactions, setTransactions] = useState<any[]>([]);
    const { loading, data, refetch } = useQuery(FILTER_TRANSACTIONS);
    const [colorModal, setColorModal] = useState<boolean>(false);
    const [caseSensitive, setCaseSensitive] = useState<boolean>(false);
  
    const columns: TableProps<Transaction>["columns"] = [
        {
            title: t("number"),
            dataIndex: "userid",
            key: "userid",
            width: 60,
            render: (_, record, index) => {
                return index + 1;
            },
        },
        {
            title: t("root_dist"),
            dataIndex: "root.transactionid",
            key: "root.transactionid",
            width: 130,
            render(_, record, index) {
                const colors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-orange-500'];
                const colorClass = colors[index % colors.length];
                return record.user?.root?.userid ? <p className={`text-xs text-white ${colorClass} px-1 py-0.5 cursor-pointer rounded inline-block`} onClick={() => popupWindow(record.user?.root?.id)}>{record.user?.root?.userid}</p> : ""
            },
        },
        {
            title: t("top_dist"),
            dataIndex: "top_dist",
            key: "top_dist",
            width: 130,
            render(_, record, index) {
                const colors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-orange-500'];
                const colorClass = colors[index % colors.length];
                return record.user?.parent?.userid ? <p className={`text-xs text-white ${colorClass} px-1 py-0.5 cursor-pointer rounded inline-block`} onClick={() => popupWindow(record.user?.parent?.id)}>{record.user?.parent?.userid}</p> : ""
            },
        },
        {
            title: t("id"),
            dataIndex: "userid",
            key: "userid",
            width: 100,
            render: (_, record) => {
            return <div className="flex items-center cursor-pointer" onClick={() => popupWindow(record.user?.id)}>
                <p className="w-[15px] h-[15px] flex items-center justify-center rounded-full bg-[#1677ff] text-white text-xs">{record.user?.profile?.level}</p>
                <p className="text-xs text-[white] bg-[#000] px-1 py-0.5 rounded">{record.user?.profile?.name}</p>
            </div>
            },
        },
        {
            title: t("nickname"),
            dataIndex: "profile.nickname",
            width: 130,
            key: '"Profile"."nickname"',
            render: (_, record) => record.user?.profile?.nickname,
        },
        {
            title: t("level"),
            dataIndex: "profile.level",
            width: 60,
            key: '"Profile"."level"',
            render: (_, record) => record.user?.profile?.level,
        },
        {
            title: t("cellphone"),
            dataIndex: "profile.phone",
            width: 130,
            key: '"Profile"."phone"',
            render: (_, record) => record.user?.profile?.phone,
        },
        {
            title: t("bankName"),
            dataIndex: "profile.bankName",
            width: 130,
            key: '"Profile"."bankName"',
            render: (_, record) => <b className="text-[red]">{record.user?.profile?.bankName}</b>,
        },
        {
            title: t("accountNumber"),
            dataIndex: "accountNumber",
            key: "accountNumber",
            width: 150,
            render: (_, record) => record.user?.profile?.accountNumber
        },
        {
            title: t("balanceBefore"),
            dataIndex: "balanceBefore",
            width: 130,
            key: "balanceBefore",
        },
        {
            title: t("depositAmount"),
            dataIndex: "amount",
            width: 130,
            key: "amount",
            render: (_, record) => {
                if (record.type === "withdrawal") {
                    return <p className="text-[red]">{record.amount}</p>;
                }
                if (record.type === "point") {
                    return <p className="text-[black]">0</p>;
                }
                return null;
            }
        },
        {
            title: t("balanceAfter"),
            dataIndex: "balanceAfter",
            width: 130,
            key: "balanceAfter",
        },
        {
            title: t("pointBefore"),
            dataIndex: "pointBefore",
            width: 130,
            key: "pointBefore",
        },
        {
            title: t("pointAmount"),
            dataIndex: "amount",
            width: 130,
            key: "pointAmount",
            render: (_, record) => {
                if (record.type === "withdrawal") {
                    return <p className="text-[black]">0</p>;
                }
                if (record.type === "point") {
                    return <p className="text-[red]">{record.amount}</p>;
                }
                return null;
            }
        },
        {
            title: t("pointAfter"),
            dataIndex: "pointAfter",
            width: 130,
            key: "pointAfter",
        },
        {
            title: t("explation"),
            dataIndex: "explation",
            key: "explation",
            render: (_, record) => {
            return (
                <div>
                {record.type === "withdrawal" && (
                    <span>{t("withdrawal")}</span>
                )}
                {record.type === "point" && (
                    <span>{t("point")}</span>
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
  
    const onSearch = (value: string) => {
      let filters: any[] = tableOptions?.filters ?? [];
  
      // Remove any existing search filters by finding and removing the search OR condition
      filters = filters.filter((f) => {
        if (f.and) {
          // Remove search OR conditions from AND groups
          f.and = f.and.filter((andItem: any) => {
            if (andItem.or) {
              // Check if this OR group contains search fields
              const hasSearchFields = andItem.or.some((orItem: any) => 
                orItem.field === "profiles.nickname" ||
                orItem.field === "profiles.holder_name" ||
                orItem.field === "profiles.phone" ||
                orItem.field === "users.userid" ||
                orItem.field === "profiles.name"
              );
              return !hasSearchFields;
            }
            return true;
          });
          return f.and.length > 0; // Keep the AND group only if it has remaining conditions
        }
        return true;
      });
  
      if (value) {
        // Determine the search operator based on case sensitivity
        const searchOp = caseSensitive ? "like" : "ilike";
        
        // Create OR condition for multiple search fields
        const searchOrCondition = {
          or: [
            {
              field: "profiles.nickname",
              value: value,
              op: searchOp,
            },
            {
              field: "profiles.phone",
              value: value,
              op: searchOp,
            },
            {
              field: "profiles.holder_name",
              value: value,
              op: searchOp,
            },
            {
              field: "users.userid",
              value: value,
              op: searchOp,
            },
            {
              field: "profiles.name",
              value: value,
              op: searchOp,
            }
          ]
        };

        // Add the search condition to the first AND group
        if (filters.length > 0 && filters[0].and) {
          filters[0].and.push(searchOrCondition);
        } else {
          // Create a new AND group with the search condition
          filters = [
            {
              and: [
                ...(filters.length > 0 ? filters[0].and || [] : []),
                searchOrCondition
              ]
            }
          ];
        }
      }
  
      setTableOptions({ ...tableOptions, filters });
      refetch({ options: { filters } });
    };
  
    const onLevelChange = (v: string = "") => {
      updateFilter(`profiles.level`, v, "eq");
    };
  
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

    return <div className="h-[100vh] bg-white">
            <div className="bg-black py-2">
                <PopupHeader title="depositWithdraw" />
            </div>
            <Layout>
                <Content className="overflow-auto">
                    <Card
                        title={null}
                        classNames={{
                            body: "px-5",
                        }}
                    >
                    <Space className="!w-full my-3" direction="vertical">
                        <Space className="!w-full justify-between">
                            <Space>
                                <DatePicker.RangePicker
                                    size="small"
                                    onChange={onRangerChange}
                                    disabledDate={(current) => {
                                        return false;
                                    }}
                                    showTime={{
                                        format: 'HH:mm:ss',
                                    }}
                                    format="YYYY-MM-DD HH:mm:ss"
                                />
                                <Input.Search
                                    size="small"
                                    placeholder={t("idNicknameAccountHolderPhoneNumber")}
                                    suffix={
                                        <Button
                                            size="small"
                                            type="text"
                                            icon={<RxLetterCaseToggle />}
                                            onClick={() => setCaseSensitive(!caseSensitive)}
                                            style={{
                                                backgroundColor: caseSensitive ? '#1677ff' : 'transparent',
                                                color: caseSensitive ? 'white' : 'inherit'
                                            }}
                                            title={caseSensitive ? t("caseSensitiveOn") : t("caseSensitiveOff")}
                                        />
                                    }
                                    enterButton={t("search")}
                                    onSearch={onSearch}
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
                            defaultPageSize: 25,
                            pageSizeOptions: [25, 50, 100, 250, 500, 1000],
                        }}
                    />              
                </Card>
            </Content>
        </Layout>
    </div>
};

export default MemberWithdraw;  