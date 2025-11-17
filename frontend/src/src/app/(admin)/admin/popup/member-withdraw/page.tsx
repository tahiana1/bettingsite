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
import { useMutation, useQuery } from "@apollo/client";
import {
  APPROVE_TRANSACTION,
  FILTER_TRANSACTIONS,
  CANCEL_TRANSACTION,
  WAITING_TRANSACTION,
} from "@/actions/transaction";
import { RxLetterCaseToggle } from "react-icons/rx";
import dayjs, { Dayjs } from "dayjs";
import { isValidDate, parseTableOptions, formatNumber } from "@/lib";
import api from "@/api";

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
                            value: "pending",
                            op: "eq",
                        },
                ],
            },
        ],
    });
    const popupWindow = (id: number) => {
        window.open(`/admin/popup/user?id=${id}`, '_blank', 'width=screen.width,height=screen.height,toolbar=no,menubar=no,scrollbars=yes,resizable=yes,location=no,status=no');
    }

    const onApproveTransaction = (transaction: Transaction) => {
        if (transaction.type == "deposit" || transaction.type == "withdrawal") {
            approveTransaction({ variables: { id: transaction.id } })
            .then((res) => {
                if (res.data?.success) {
                    refetch(tableOptions);  
                }
            })
            .catch((err) => {
                console.error('Error approving transaction:', err);
            });
        } else if (transaction.type == "point") {
            refetch(tableOptions);  
            api("admin/point/convert", {
                method: "POST",
                data: {
                    id: transaction.id,
                    amount: transaction.amount,
                    userId: transaction.user?.id
                },
            })
            .then((res) => {
                if (res.data?.success) {
                    refetch(tableOptions);  
                }
            })
            .catch((err) => {
                console.error('Error converting point:', err);
            });
        }
    };

    const onWaitingTransaction = (transaction: Transaction) => {
        waitingTransaction({ variables: { id: transaction.id } })
            .then((res) => {
                if (res.data?.success) {
                    refetch(tableOptions);
                }
            })
            .catch((err) => {
                console.error('Error waiting transaction:', err);
            });
    };

    const onCancelTransaction = (transaction: Transaction) => {
        cancelTransaction({ variables: { id: transaction.id } })
            .then((res) => {
                if (res.data?.success) {
                    refetch(tableOptions);
                }
            })
            .catch((err) => {
                console.error('Error canceling transaction:', err);
            });
    };
    const [total, setTotal] = useState<number>(0);
    const [transactions, setTransactions] = useState<any[]>([]);
    const { loading, data, refetch } = useQuery(FILTER_TRANSACTIONS);
    const [colorModal, setColorModal] = useState<boolean>(false);
    const [caseSensitive, setCaseSensitive] = useState<boolean>(false);
    const [selectedFilter, setSelectedFilter] = useState<string>("entire");

    const [approveTransaction] = useMutation(APPROVE_TRANSACTION);
    const [cancelTransaction] = useMutation(CANCEL_TRANSACTION);
    const [waitingTransaction] = useMutation(WAITING_TRANSACTION);
  
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
            render: (value) => formatNumber(value || 0),
        },
        {
            title: t("withdrawalAmount"),
            dataIndex: "amount",
            width: 130,
            key: "amount",
            render: (_, record) => {
                if (record.type === "withdrawal") {
                    return <p className="text-[red]">{formatNumber(record.amount || 0)}</p>;
                }
                if (record.type === "point") {
                    return <p className="text-[black]">{formatNumber(0)}</p>;
                }
                return null;
            }
        },
        {
            title: t("balanceAfter"),
            dataIndex: "balanceAfter",
            width: 130,
            key: "balanceAfter",
            render: (value) => formatNumber(value || 0),
        },
        {
            title: t("pointBefore"),
            dataIndex: "pointBefore",
            width: 130,
            key: "pointBefore",
            render: (value) => formatNumber(value || 0),
        },
        {
            title: t("pointAmount"),
            dataIndex: "amount",
            width: 130,
            key: "pointAmount",
            render: (_, record) => {
                if (record.type === "withdrawal") {
                    return <p className="text-[black]">{formatNumber(0)}</p>;
                }
                if (record.type === "point") {
                    return <p className="text-[red]">{formatNumber(record.amount || 0)}</p>;
                }
                return null;
            }
        },
        {
            title: t("pointAfter"),
            dataIndex: "pointAfter",
            width: 130,
            key: "pointAfter",
            render: (value) => formatNumber(value || 0),
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
                </div>
            );
            },
        },
        {
            title: t("transactionAt"),
            dataIndex: "transactionAt",
            key: "transactionAt",
            render: (_, record) => {
            return dayjs(record.transactionAt).format("M/D/YYYY HH:mm:ss");
            }
        },
        {
          title: t("action"),
          key: "action",
          fixed: "right",
          width: 130,
          render: (_, record) => (
            <Space.Compact size="small" className="gap-1">
              {(record.status == "pending" || record.status == "W") && <>
                <Button
                    title={t("approve")}
                    variant="outlined"
                    onClick={() => onApproveTransaction(record)}
                    color="blue"
                  >
                    {t("approve")}
                  </Button>
                    <Button
                    title={t("cancel")}
                    variant="outlined"
                    onClick={() => onCancelTransaction(record)}
                    color="red"
                  >
                    {t("cancel")}
                  </Button>
                  {
                    record.status != "W" && (
                      <Button
                        title={t("waiting")}
                        variant="outlined"
                        onClick={() => onWaitingTransaction(record)}
                        color="orange"
                      >
                        {t("waiting")}
                      </Button>
                    )
                  }
                </>}
            </Space.Compact>
          ),
        },
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

    const onFilterChange = (value: string) => {
      setSelectedFilter(value);
      
      // Base filters for deposit and point transactions
      const baseFilters = {
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
        ],
      };

      // Add specific filters based on selection
      switch (value) {
        case "entire":
          // Show all transactions (deposit and point) with all roles and statuses
          setTableOptions({
            ...tableOptions,
            filters: [baseFilters],
          });
          break;
          
        case "admin":
          // Filter for admin role
          setTableOptions({
            ...tableOptions,
            filters: [
              {
                ...baseFilters,
                and: [
                  ...baseFilters.and,
                  {
                    field: "users.role",
                    value: "A",
                    op: "eq",
                  },
                ],
              },
            ],
          });
          break;
          
        case "partner":
          // Filter for partner role
          setTableOptions({
            ...tableOptions,
            filters: [
              {
                ...baseFilters,
                and: [
                  ...baseFilters.and,
                  {
                    field: "users.role",
                    value: "P",
                    op: "eq",
                  },
                ],
              },
            ],
          });
          break;
          
        case "user":
          // Filter for user role
          setTableOptions({
            ...tableOptions,
            filters: [
              {
                ...baseFilters,
                and: [
                  ...baseFilters.and,
                  {
                    field: "users.role",
                    value: "U",
                    op: "eq",
                  },
                ],
              },
            ],
          });
          break;
          
        case "approved":
          // Filter for approved status
          setTableOptions({
            ...tableOptions,
            filters: [
              {
                ...baseFilters,
                and: [
                  ...baseFilters.and,
                  {
                    field: "transactions.status",
                    value: "A",
                    op: "eq",
                  },
                ],
              },
            ],
          });
          break;
          
        case "canceled":
          // Filter for canceled status
          setTableOptions({
            ...tableOptions,
            filters: [
              {
                ...baseFilters,
                and: [
                  ...baseFilters.and,
                  {
                    field: "transactions.status",
                    value: "C",
                    op: "eq",
                  },
                ],
              },
            ],
          });
          break;
          
        default:
          setTableOptions({
            ...tableOptions,
            filters: [baseFilters],
          });
      }
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

    // Auto-refetch data every 5 seconds
    useEffect(() => {
      const interval = setInterval(() => {
        refetch(tableOptions ?? undefined);
      }, 5000);

      return () => clearInterval(interval);
    }, [tableOptions, refetch]);

    return <div className="h-[100vh] bg-white">
            <div className="bg-black py-2">
                <PopupHeader title="withdrawRequest" />
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
                            <Radio.Group 
                                value={selectedFilter}
                                onChange={(e) => onFilterChange(e.target.value)}
                                buttonStyle="solid"
                                size="small"
                            >
                                <Radio.Button value="entire">{t("entire")}</Radio.Button>
                                <Radio.Button value="admin">{t("adminPayment")}</Radio.Button>
                                <Radio.Button value="partner">{t("partnerPayment")}</Radio.Button>
                                <Radio.Button value="user">{t("userPayment")}</Radio.Button>
                                <Radio.Button value="approved">{t("approvedPayment")}</Radio.Button>
                                <Radio.Button value="canceled">{t("canceledPayment")}</Radio.Button>
                            </Radio.Group>
                        </Space>
                    </Space>
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