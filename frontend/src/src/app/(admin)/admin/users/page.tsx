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
  Badge,
  Input,
  DatePicker,
  Radio,
  Select,
} from "antd";
import { FilterDropdown } from "@refinedev/antd";
import type { TableProps } from "antd";

import { Content } from "antd/es/layout/layout";

import { useFormatter, useTranslations } from "next-intl";
import { useMutation, useQuery } from "@apollo/client";
import { APPROVE_USER, BLOCK_USER, FILTER_USERS } from "@/actions/user";
import { BiBlock, BiTrash } from "react-icons/bi";
import { PiUserCircleCheckLight } from "react-icons/pi";
import { RxLetterCaseToggle } from "react-icons/rx";
// import HighlighterComp, { HighlighterProps } from "react-highlight-words";
import dayjs from "dayjs";
import { parseTableOptions } from "@/lib";

// const Highlighter = HighlighterComp as unknown as React.FC<HighlighterProps>;

// type UserIndex = keyof User;

const UserPage: React.FC = () => {
  const t = useTranslations();
  const f = useFormatter();
  const [tableOptions, setTableOptions] = useState<any>(null);

  const [total, setTotal] = useState<number>(0);
  const [users, setUsers] = useState<any[]>([]);
  const { loading, error, data, refetch } = useQuery(FILTER_USERS);

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
      title: "",
      dataIndex: "status",
      key: "status",
      fixed: "left",
      render: (text, record) => {
        console.log({ record });
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
              <Badge status="warning" className="mr-2"></Badge>
            </Popconfirm>
          );
        }
        return text;
      },
    },
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
      title: t("level"),
      dataIndex: "profile.level",
      key: "level",
      render: (_, { profile }) => profile.level,
    },
    {
      title: t("status"),
      dataIndex: "status",
      key: "status",
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
      render: (_, { role }) => (
        <Tag color={role == "ADMIN" ? "red" : "green"} key={role}>
          {role.toUpperCase()}
        </Tag>
      ),
      filters: [
        {
          text: "Admin",
          value: "ADMIN",
        },
        {
          text: "Partner",
          value: "PARTNER",
        },
        {
          text: "User",
          value: "USER",
        },
      ],
      filterDropdown: (props) => (
        <FilterDropdown {...props}>
          <Radio.Group className="!w-full !flex flex-col">
            {props.filters?.map((f, i) => (
              <Radio key={i} value={f.value}>
                {f.text}
              </Radio>
            ))}
          </Radio.Group>
        </FilterDropdown>
      ),
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
            onConfirm={
              record.status
                ? () => onBlockUser(record)
                : () => onApproveUser(record)
            }
            description={
              record.status ? t("blockMessage") : t("approveMessage")
            }
          >
            {record.status ? (
              <Button
                title={t("block")}
                icon={<BiBlock />}
                variant="outlined"
                color="orange"
              />
            ) : (
              <Button
                title={t("approve")}
                variant="outlined"
                color="blue"
                icon={<PiUserCircleCheckLight />}
              />
            )}
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
  useEffect(() => {
    console.log({ loading, error, data });
    console.log({ data });
    setUsers(
      data?.users?.map((u: any) => {
        console.log({ u });
        // u.key = u.id;
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
            console.log({ u });
            // u.key = u.id;
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
          title={t("admin/users")}
          classNames={{
            body: "!p-0",
          }}
        >
          <Space className="p-2 !w-full" direction="vertical">
            <Radio.Group
              optionType="button"
              buttonStyle="solid"
              options={[
                {
                  label: "All",
                  value: "",
                },
                {
                  label: "Site",
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
                    label: "Mem",
                    value: "member",
                  },
                  {
                    label: "Dist",
                    value: "dist",
                  },
                  {
                    label: "Mem + Dist",
                    value: "",
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
                    label: "All",
                    value: "",
                  },
                  {
                    label: "Referral O",
                    value: true,
                  },
                  {
                    label: "Referral X",
                    value: false,
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
                    label: "All",
                    value: "",
                  },
                  {
                    label: "Black Memo O",
                    value: true,
                  },
                  {
                    label: "Black Memo X",
                    value: false,
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
                    label: "All",
                    value: "",
                  },
                  {
                    label: "General",
                    value: "general",
                  },
                  {
                    label: "Test",
                    value: "test",
                  },
                  {
                    label: "Interest",
                    value: "interest",
                  },
                  {
                    label: "Working",
                    value: "work",
                  },
                ]}
                defaultValue={""}
              />
              <Radio.Group
                className="flex-nowrap"
                size="small"
                optionType="button"
                buttonStyle="solid"
                options={[
                  {
                    label: "All",
                    value: "",
                  },
                  {
                    label: "Withdrawn",
                    value: "withdrawn",
                  },
                  {
                    label: "Approved",
                    value: "approved",
                  },
                  {
                    label: "Suspened",
                    value: "suspended",
                  },
                  {
                    label: "Deleted",
                    value: "deleted",
                  },
                  {
                    label: "Blocked",
                    value: "blocked",
                  },
                  {
                    label: "Inactive",
                    value: "inactive",
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
                    label: "All",
                    value: "",
                  },
                  {
                    label: "Reg IP",
                    value: true,
                  },
                  {
                    label: "Duplicated IP",
                    value: false,
                  },
                ]}
                defaultValue={""}
              />
            </Space>
            <Space className="!w-full justify-between">
              <Select
                size="small"
                placeholder="select dist"
                className="min-w-28"
              />
              <Select
                size="small"
                placeholder="By Color"
                className="min-w-28"
              />
              <Select
                size="small"
                placeholder="By Level"
                className="min-w-28"
              />
              <DatePicker.RangePicker size="small" />
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
              <Space className="!w-full"></Space>
              <Space.Compact className="gap-1">
                <Button size="small" type="primary">
                  Reset all Coupon
                </Button>
                <Button size="small" type="primary">
                  Change Color in batches
                </Button>
                <Button size="small" type="primary">
                  Change Password in bulk
                </Button>
                <Button size="small" type="primary">
                  Point multi-payment
                </Button>
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
                return `${range[0]} to ${range[1]} in Total ${total} `;
              },
              total: total,
              showSizeChanger: true,
              pageSizeOptions: [10, 20, 50],
            }}
          />
        </Card>
      </Content>
    </Layout>
  );
};

export default UserPage;
