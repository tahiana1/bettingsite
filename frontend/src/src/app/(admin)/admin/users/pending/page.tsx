"use client";
import React, { useEffect, useState } from "react";

import {
  Layout,
  Space,
  Card,
  Table,
  Tag,
  Button,
  Popconfirm,
  Input,
  DatePicker,
  Radio,
  Select,
  Modal,
  Form,
} from "antd";
import { FilterDropdown } from "@refinedev/antd";
import type { TableProps } from "antd";

import { Content } from "antd/es/layout/layout";

import { useFormatter, useTranslations } from "next-intl";
import { useMutation, useQuery } from "@apollo/client";
import { APPROVE_USER, BLOCK_USER, FILTER_USERS } from "@/actions/user";
import { BiTrash } from "react-icons/bi";
import { PiUserCircleCheckLight } from "react-icons/pi";
import { RxLetterCaseToggle } from "react-icons/rx";
// import HighlighterComp, { HighlighterProps } from "react-highlight-words";
import dayjs, { Dayjs } from "dayjs";
import { parseTableOptions } from "@/lib";
import { USER_STATUS } from "@/constants";

// const Highlighter = HighlighterComp as unknown as React.FC<HighlighterProps>;

// type UserIndex = keyof User;

const PendingUserPage: React.FC = () => {
  const t = useTranslations();
  const f = useFormatter();
  const [tableOptions, setTableOptions] = useState<any>({
    filters: [
      {
        field: "status",
        value: "P",
        op: "eq",
      },
    ],
  });

  const [total, setTotal] = useState<number>(0);
  const [users, setUsers] = useState<any[]>([]);
  const { loading, error, data, refetch } = useQuery(FILTER_USERS, {
    variables: {
      filters: [
        {
          field: "status",
          value: "P",
          op: "eq",
        },
      ],
    },
  });
  const [colorModal, setColorModal] = useState<boolean>(false);

  const [approveUser] = useMutation(APPROVE_USER);
  const [blockUser] = useMutation(BLOCK_USER);

  const onBlockUser = (user: User) => {
    blockUser({ variables: { id: user.id } })
      .then((res) => {
        if (res.data?.success) {
        }
        refetch(tableOptions);
      })
      .catch((err) => {
        console.log({ err });
      });
  };

  const onApproveUser = (user: User) => {
    approveUser({ variables: { id: user.id } })
      .then((res) => {
        console.log({ res });
        if (res.data?.success) {
        }
        refetch();
      })
      .catch((err) => {
        console.log({ err });
      });
  };

  const columns: TableProps<User>["columns"] = [
    {
      title: "ID",
      dataIndex: "userid",
      key: "userid",
      fixed: "left",
      sorter: {
        compare: (a, b) => {
          return a.userid > b.userid ? -1 : 1;
        },
        multiple: 1,
      },
      render: (text, record) => {
        if (!record.status) {
          return (
            <Popconfirm
              title={t("confirmSure")}
              onConfirm={
                record.status
                  ? () => onBlockUser(record)
                  : () => onApproveUser(record)
              }
              description={t("approveMessage")}
            >
              <Button type="link" size="small">
                {text}
              </Button>
            </Popconfirm>
          );
        }
        return text;
      },
      filterDropdown: (props) => (
        <FilterDropdown {...props}>
          <Input className="w-full" />
        </FilterDropdown>
      ),
    },
    {
      title: t("site"),
      dataIndex: "site",
      key: "site",
      render: (text) => text ?? "site",
    },
    {
      title: t("root_dist"),
      dataIndex: "root_dist",
      key: "root_dist",
    },
    {
      title: t("top_dist"),
      dataIndex: "top_dist",
      key: "top_dist",
    },
    {
      title: t("nickname"),
      dataIndex: "profile.nickname",
      key: '"Profile"."nickname"',
      render: (_, { profile }) => profile.nickname,
      filterDropdown: (props) => (
        <FilterDropdown {...props}>
          <Input className="w-full" />
        </FilterDropdown>
      ),
    },
    {
      title: t("holderName"),
      dataIndex: "profile.holderName",
      key: '"Profile"."holder_name"',
      render: (_, { profile }) => profile.holderName,
      filterDropdown: (props) => (
        <FilterDropdown {...props}>
          <Input className="w-full" />
        </FilterDropdown>
      ),
    },
    {
      title: t("phone"),
      dataIndex: "profile.phone",
      key: '"Profile"."phone"',
      render: (_, { profile }) => profile.phone,
      filterDropdown: (props) => (
        <FilterDropdown {...props}>
          <Input className="w-full" />
        </FilterDropdown>
      ),
    },
    {
      title: t("birthday"),
      dataIndex: "profile.birthday",
      key: "birthday",
      render: (_, { profile }) =>
        f.dateTime(new Date(profile.birthday) ?? null),
    },
    {
      title: t("status"),
      dataIndex: "status",
      key: "status",
      render: (text) => <Tag color={"gold"}>{USER_STATUS[text]}</Tag>,
    },
    {
      title: t("balance"),
      dataIndex: "balance",
      key: "balance",
      render: (_, { profile }) => profile.balance,
    },
    {
      title: t("point"),
      dataIndex: "point",
      key: "point",
      render: (_, { profile }) => profile.point,
    },
    {
      title: t("comp"),
      dataIndex: "comp",
      key: "comp",
      render: (_, { profile }) => profile.comp,
    },
    {
      title: t("usdtAddress"),
      dataIndex: "usdtAddress",
      key: "usdtAddress",
    },
    {
      title: t("currentIP"),
      dataIndex: "currentIP",
      key: "currentIP",
    },
    {
      title: "IP",
      dataIndex: "IP",
      key: "IP",
    },
    {
      title: "Coupon",
      dataIndex: "profile.coupon",
      key: "profile.coupon",
      render: (_, { profile }) => profile.coupon,
    },
    {
      title: "Last Deposit",
      dataIndex: "profile.lastDeposit",
      key: "lastDeposit",
      render: (_, { profile }) =>
        profile.lastDeposit ? f.dateTime(new Date(profile.lastDeposit)) : null,
    },
    {
      title: "Last Withdraw",
      dataIndex: "profile.lastWithdraw",
      key: "lastWithdraw",
      render: (_, { profile }) =>
        profile.lastWithdraw
          ? f.dateTime(new Date(profile.lastWithdraw))
          : null,
    },
    {
      title: t("role"),
      key: "role",
      dataIndex: "role",
    },
    {
      title: t("lastLogin"),
      dataIndex: "updatedAt",
      key: "updatedAt",
      sorter: {
        compare: (a, b) => {
          return new Date(a.updatedAt) > new Date(b.updatedAt) ? -1 : 1;
        },
        multiple: 2,
      },
      render: (text) => f.dateTime(new Date(text) ?? null),
      // defaultFilteredValue: getDefaultFilter("updatedAt"),
      filterDropdown: (props) => (
        <FilterDropdown
          {...props}
          mapValue={(selectedKeys, event) => {
            if (event === "value") {
              return selectedKeys?.map((key) => {
                if (typeof key === "string") {
                  return dayjs(key);
                }

                return key;
              });
            }

            if (event === "onChange") {
              if (selectedKeys.every(dayjs.isDayjs)) {
                return selectedKeys?.map((date: any) =>
                  dayjs(date).toISOString()
                );
              }
            }

            return selectedKeys;
          }}
        >
          <DatePicker.RangePicker />
        </FilterDropdown>
      ),
    },
    {
      title: t("createdAt"),
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => (text ? f.dateTime(new Date(text) ?? null) : ""),
    },
    {
      title: t("action"),
      key: "action",
      fixed: "right",
      render: (_, record) => (
        <Space.Compact size="small" className="gap-2">
          <Popconfirm
            title={t("confirmSure")}
            onConfirm={() => onApproveUser(record)}
            description={t("approveMessage")}
          >
            <Button
              title={t("approve")}
              variant="outlined"
              color="blue"
              icon={<PiUserCircleCheckLight />}
            />
          </Popconfirm>

          <Button
            title={t("delete")}
            variant="outlined"
            color="danger"
            icon={<BiTrash />}
          />
        </Space.Compact>
      ),
    },
  ];

  const onChange: TableProps<User>["onChange"] = (
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
    if (v) {
      const f = filters.filter((f) => f.field == field);
      filters = [
        ...f,
        {
          field: field,
          value: v,
          op: op,
        },
      ];
      setTableOptions({ ...tableOptions, filters });
    } else {
      const f = filters.filter((f) => f.field == field);

      setTableOptions({ ...tableOptions, filters: f });
    }
  };

  const onRangerChange = (
    dates: (Dayjs | null)[] | null,
    dateStrings: string[]
  ) => {
    let filters: { field: string; value: string; op: string }[] =
      tableOptions?.filters ?? [];
    const f = filters.filter((f) => f.field !== "users.created_at");

    filters = [
      ...f,
      {
        field: "users.created_at",
        value: dateStrings[0],
        op: "gt",
      },
      {
        field: "users.created_at",
        value: dateStrings[1],
        op: "lt",
      },
    ];
    setTableOptions({ ...tableOptions, filters });
  };
  const onMemberStatusChange = (v: string) => {
    updateFilter("status", v, "eq");
  };
  const [colorOption, setColorOptoin] = useState<any>("new");
  const onChangeColors = async () => {
    setColorModal(false);
  };

  useEffect(() => {
    console.log({ loading, error, data });
    console.log({ data });
    setUsers(
      data?.users?.map((u: any) => {
        return { ...u, key: u.id };
      }) ?? []
    );
  }, [data]);

  useEffect(() => {
    refetch(tableOptions ?? undefined)
      .then((res) => {
        console.log({ res });
        setUsers(
          res.data?.response?.users?.map((u: any) => {
            return { ...u, key: u.id };
          }) ?? []
        );
        setTotal(res.data?.response?.total);
      })
      .catch((err) => {
        console.log({ err });
      });
  }, [tableOptions]);
  return (
    <Layout>
      <Content className="overflow-auto h-[calc(100vh-100px)] dark:bg-black">
        <Card
          title={t("pendingUsers")}
          classNames={{
            body: "!p-0",
          }}
        >
          <Space className="p-2 !w-full" direction="vertical">
            <Radio.Group
              optionType="button"
              buttonStyle="solid"
              size="small"
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
                <Select
                  size="small"
                  placeholder="select dist"
                  className="min-w-28"
                  allowClear
                />

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
                  enterButton="Search"
                />
              </Space>
              <Space.Compact className="gap-1">
                <Radio.Group
                  size="small"
                  optionType="button"
                  buttonStyle="solid"
                  options={[
                    {
                      label: t("waiting_approval"),
                      value: "pending",
                    },
                    {
                      label: t("joined_today"),
                      value: "today",
                    },
                  ]}
                  defaultValue={""}
                  onChange={(e) => onMemberStatusChange(e.target.value)}
                />
              </Space.Compact>
            </Space>
          </Space>
          <Table<User>
            columns={columns}
            loading={loading}
            dataSource={users ?? []}
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
              showSizeChanger: true,
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

export default PendingUserPage;
