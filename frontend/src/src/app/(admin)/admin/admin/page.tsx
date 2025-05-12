"use client";
import React, { useEffect, useState } from "react";

import {
  Layout,
  Space,
  Card,
  Table,
  Button,
  Popconfirm,
  Input,
  DatePicker,
  Radio,
  Select,
  Modal,
  Form,
  Checkbox,
} from "antd";
import { FilterDropdown } from "@refinedev/antd";
import type { TableProps } from "antd";

import { Content } from "antd/es/layout/layout";
import { useFormatter, useTranslations } from "next-intl";
import { useMutation, useQuery } from "@apollo/client";
import { APPROVE_USER, BLOCK_USER, GET_DISTRIBUTORS } from "@/actions/user";
import { BiBlock } from "react-icons/bi";
import { PiUserCircleCheckLight } from "react-icons/pi";
import { RxLetterCaseToggle } from "react-icons/rx";
// import HighlighterComp, { HighlighterProps } from "react-highlight-words";
import dayjs from "dayjs";
import { buildTree, parseTableOptions } from "@/lib";
import { USER_STATUS, USER_TYPE } from "@/constants";

// const Highlighter = HighlighterComp as unknown as React.FC<HighlighterProps>;

// type UserIndex = keyof User;

const PartnerPage: React.FC = () => {
  const t = useTranslations();
  const f = useFormatter();
  const [tableOptions, setTableOptions] = useState<any>({
    filters: [
      {
        or: [
          {
            field: "role",
            value: "P",
            op: "eq",
          },
          {
            field: "role",
            value: "A",
            op: "eq",
          },
        ],
      },
    ],
  });

  const [, contextHolder] = Modal.useModal();
  const [total, setTotal] = useState<number>(0);
  const [users, setUsers] = useState<any[]>([]);
  const [treeUsers, setTreeUsers] = useState<any[]>([]);

  const { loading, data, refetch } = useQuery(GET_DISTRIBUTORS);

  const { data: childrenData, refetch: refetchChildren } =
    useQuery(GET_DISTRIBUTORS);

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
      dataIndex: "root.userid",
      key: "root.userid",
      render(_, record) {
        return record.root?.userid;
      },
    },
    {
      title: t("top_dist"),
      dataIndex: "top_dist",
      key: "top_dist",
      render(_, record) {
        return record.parent?.userid;
      },
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
    },
    {
      title: t("type"),
      dataIndex: "type",
      key: "type",
      render: (text) => USER_TYPE[text],
    },
    {
      title: t("status"),
      dataIndex: "status",
      key: "status",
      render: (text) => USER_STATUS[text],
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
      title: t("coupon"),
      dataIndex: "profile.coupon",
      key: "profile.coupon",
      render: (_, { profile }) => profile.coupon,
    },
    {
      title: t("lastDeposit"),
      dataIndex: "profile.lastDeposit",
      key: "lastDeposit",
      render: (_, { profile }) =>
        profile.lastDeposit ? f.dateTime(new Date(profile.lastDeposit)) : null,
    },
    {
      title: t("lastWithdraw"),
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

  const onBlackMemoChange = (v: string) => {
    updateFilter("black_memo", v, "eq");
  };

  const onMemberStatusChange = (v: string) => {
    updateFilter("status", v, "eq");
  };

  const onLevelChange = (v: string = "") => {
    updateFilter(`"Profile"."level"`, v, "eq");
  };

  const [colorOption, setColorOptoin] = useState<any>("new");
  const onChangeColors = async () => {
    setColorModal(false);
  };
  const onExpand = (expanded: boolean, record: User) => {
    if (expanded) {
      refetchChildren({
        filters: [
          {
            field: "parent_id",
            value: record.id,
            op: "eq",
          },
        ],
      }).then((res) => {
        console.log({ res });
        setUsers([
          ...(users ?? []),
          ...(childrenData?.response?.users?.map((u: any) => {
            return { ...u, key: u.id };
          }) ?? []),
        ]);
      });
    }
  };
  useEffect(() => {
    setUsers(
      data?.response?.users?.map((u: any) => {
        return { ...u, key: u.id };
      }) ?? []
    );
    setTotal(data?.response?.total);
  }, [data]);

  useEffect(() => {
    console.log(buildTree(users ?? []));
    setTreeUsers(buildTree(users ?? []));
    // setTotal(data?.response?.total);
  }, [users]);

  useEffect(() => {
    refetch(tableOptions ?? undefined);
  }, [tableOptions]);
  return (
    <Layout>
      {contextHolder}
      <Content className="overflow-auto h-[calc(100vh-100px)] dark:bg-black">
        <Card
          title={t("admin/menu/partners")}
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
                    label: t("blackMemo") + " O",
                    value: "true",
                  },
                  {
                    label: t("blackMemo") + " X",
                    value: "false",
                  },
                ]}
                defaultValue={""}
                onChange={(e) => onBlackMemoChange(e.target.value)}
              />

              <Radio.Group
                className="flex-nowrap"
                size="small"
                optionType="button"
                buttonStyle="solid"
                options={[
                  {
                    label: t("all"),
                    value: "",
                  },
                  {
                    label: t("approved"),
                    value: "A",
                  },
                  {
                    label: t("suspened"),
                    value: "S",
                  },
                  {
                    label: t("deleted"),
                    value: "D",
                  },
                  {
                    label: t("blocked"),
                    value: "B",
                  },
                  {
                    label: t("inactive"),
                    value: "I",
                  },
                ]}
                defaultValue={""}
                onChange={(e) => onMemberStatusChange(e.target.value)}
              />
            </Space>
            <Space className="!w-full justify-between">
              <Space>
                <Select
                  size="small"
                  placeholder="By Level"
                  className="min-w-28"
                  allowClear
                  onClear={onLevelChange}
                  options={[
                    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 101, 102, 100,
                  ].map((i) => ({
                    value: i,
                    label:
                      i == 100 ? "Premium" : (i > 100 ? "VIP " : "Level ") + i,
                  }))}
                  onChange={onLevelChange}
                />
                <Select
                  size="small"
                  placeholder="By Field"
                  className="min-w-28"
                  allowClear
                  options={[
                    { label: t("all"), value: "" },
                    { label: t("userid"), value: "id" },
                    { label: t("nickname"), value: `"Profile"."nickname"` },
                    { label: t("phone"), value: `"Profile"."phone"` },
                    { label: t("holderName"), value: `"Profile"."holderName"` },
                    {
                      label: t("accountNumber"),
                      value: `"Profile"."accountNumber"`,
                    },
                    { label: t("usdtAddress"), value: `usdtAddress` },
                  ]}
                />
                <Input.Search
                  size="small"
                  placeholder="ID,Nickname,AccountHolder,Phone"
                  suffix={
                    <Button
                      size="small"
                      type="text"
                      icon={<RxLetterCaseToggle />}
                    />
                  }
                  enterButton={t("search")}
                />
                <Button size="small">{t("only_root_distributor")}</Button>
                <Checkbox> {t("only_direct_member")}</Checkbox>
              </Space>
            </Space>
          </Space>
          <Table<User>
            columns={columns}
            loading={loading}
            dataSource={treeUsers ?? []}
            className="w-full"
            size="small"
            scroll={{ x: "max-content" }}
            expandable={{
              onExpand,
            }}
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
  );
};

export default PartnerPage;
