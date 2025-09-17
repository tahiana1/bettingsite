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

const MemberDeposit = () => {
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
                                    value: "deposit",
                                    op: "eq",
                                },
                                {
                                    field: "transactions.type",
                                    value: "point",
                                    op: "eq",
                                },
                                {
                                    field: "transactions.type",
                                    value: "rollingExchange",
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
    const [colorOption, setColorOptoin] = useState<any>("new");
  
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
            width: 100,
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
            width: 100,
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
            render: (_, record) => <p className="text-[red]">{record.amount}</p>,
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
            render: (_, record) => <p className="text-[red]">{record.amount}</p>,
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
                {record.type === "deposit" && (
                    <span>Deposit</span>
                )}
                {record.type === "point" && (
                    <span>Point</span>
                )}
                {record.type === "rollingExchange" && (
                    <span>rollExchange</span>
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
            <PopupHeader title="depositRequest" />
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
                    </Space>
                    {/* <Space.Compact className="gap-1">
                        <Button size="small" type="primary">
                        {t("download")}
                        </Button>
                    </Space.Compact> */}
                    </Space>
                    {/* <Divider className="!p-0 !m-0" />
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
                            {t("admin/description/distributorMoney")}
                        </span>{" "}
                        {t("admin/description/distributorMoneyDesc")}
                        {t("admin/description/distributorMoneyDesc2")}
                        <span className="text-red-600">
                            {t("admin/description/subordinateMoney")}
                        </span>{" "}{t("admin/description/subordinateMoneyDesc")}
                        </span>
                    }
                    type="warning"
                    /> */}
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
    </div>
};

export default MemberDeposit;