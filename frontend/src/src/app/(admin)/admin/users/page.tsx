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
import {
  APPROVE_USER,
  BLOCK_USER,
  FILTER_USERS,
  UPDATE_USER,
} from "@/actions/user";
import { BiBlock, BiTrash } from "react-icons/bi";
import { PiUserCircleCheckLight } from "react-icons/pi";
import { RxLetterCaseToggle } from "react-icons/rx";
// import HighlighterComp, { HighlighterProps } from "react-highlight-words";
import dayjs, { Dayjs } from "dayjs";
import { parseTableOptions } from "@/lib";
import { USER_STATUS, USER_TYPE } from "@/constants";
import { UPDATE_PROFILE } from "@/actions/profile";

// const Highlighter = HighlighterComp as unknown as React.FC<HighlighterProps>;

// type UserIndex = keyof User;

const UserPage: React.FC = () => {
  const t = useTranslations();
  const f = useFormatter();
  const [tableOptions, setTableOptions] = useState<any>(null);

  const [modal, contextHolder] = Modal.useModal();
  const [total, setTotal] = useState<number>(0);
  const [users, setUsers] = useState<any[]>([]);
  const { loading, data, refetch } = useQuery(FILTER_USERS);
  const [updateProfile] = useMutation(UPDATE_PROFILE);
  const [colorModal, setColorModal] = useState<boolean>(false);

  const [updateUser] = useMutation(UPDATE_USER);
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
  const onUserLevelChange = (u: User, v: string = "") => {
    updateProfile({
      variables: {
        id: u.id,
        input: {
          level: v ? parseInt(v) : 0,
        },
      },
    }).then(() => {
      refetch(tableOptions);
    });
  };
  const onUserTypeChange = (u: User, v: string = "") => {
    updateUser({
      variables: {
        id: u.id,
        input: {
          type: v,
        },
      },
    }).then(() => {
      refetch(tableOptions);
    });
  };

  const onUserRoleChange = (u: User, v: string = "USER") => {
    updateUser({
      variables: {
        id: u.id,
        input: {
          role: v,
        },
      },
    }).then(() => {
      refetch(tableOptions);
    });
  };
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

  const userTypeOption = [
    {
      label: "General",
      value: "G",
    },
    {
      label: "Test",
      value: "T",
    },
    {
      label: "Interest",
      value: "I",
    },
    {
      label: "Working",
      value: "W",
    },
  ];
  const roleOption = [
    {
      label: "Admin",
      value: "ADMIN",
    },
    {
      label: "Partner",
      value: "PARTNER",
    },
    {
      label: "User",
      value: "USER",
    },
  ];
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
      title: t("level"),
      dataIndex: "profile.level",
      key: "level",
      render: (_, record) => (
        <Select
          size="small"
          placeholder="By Level"
          className="min-w-28"
          defaultValue={`${record.profile.level}`}
          allowClear
          onClear={() => onUserLevelChange(record, "")}
          labelRender={(props) => labelRenderer(props)}
          options={levelOption}
          onChange={(e) => onUserLevelChange(record, e)}
        />
      ),
    },
    {
      title: t("type"),
      dataIndex: "type",
      key: "type",
      render: (_, record) => (
        <Select
          size="small"
          placeholder="By Level"
          className="min-w-28"
          defaultValue={`${record.type}`}
          allowClear
          options={userTypeOption}
          onClear={() => onUserTypeChange(record, "")}
          labelRender={(props) => USER_TYPE[props.value]}
          onChange={(e) => onUserTypeChange(record, e)}
        />
      ),
    },
    {
      title: t("status"),
      dataIndex: "status",
      key: "status",
      render: (text, record) => {
        if (record.status == "P") {
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
              <Tag color="warning" className="mr-2">
                {USER_STATUS[text]}
              </Tag>
            </Popconfirm>
          );
        }
        return (
          <Tag color={text == "A" ? "success" : "gold"}>
            {USER_STATUS[text]}
          </Tag>
        );
      },
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
      render: (role, record) => (
        <Select
          size="small"
          placeholder="By Level"
          className="min-w-28"
          defaultValue={`${role}`}
          labelRender={(props) => USER_TYPE[props.value]}
          options={roleOption}
          onChange={(e) => onUserRoleChange(record, e)}
        />
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

  const onReferralChange = (v: string) => {
    updateFilter(
      '"Profile"."referral"',
      v,
      v == "not_null" ? "is_not_null" : "is_null"
    );
  };

  const onMemberTypeChange = (v: string) => {
    updateFilter("type", v, "eq");
  };

  const onMemberStatusChange = (v: string) => {
    updateFilter("status", v, "eq");
  };

  const onLevelChange = (v: string = "") => {
    updateFilter(`"Profile"."level"`, v, "eq");
  };

  const onResetCoupon = async () => {
    const confirmed = await modal.confirm({
      title: "Do you want to reset the number of coupons for all members to 0?",
    });
    console.log("Confirmed: ", confirmed);
  };
  const [colorOption, setColorOptoin] = useState<any>("new");
  const onChangeColors = async () => {
    setColorModal(false);
  };
  const onRangerChange = (
    dates: (Dayjs | null)[] | null,
    dateStrings: string[]
  ) => {
    let filters: { field: string; value: string; op: string }[] =
      tableOptions?.filters ?? [];
    const f = filters.filter((f) => f.field !== "users.created_at");
    if (dates?.at(0)) {
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
    }
    setTableOptions({ ...tableOptions, filters });
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
    refetch(tableOptions ?? undefined);
  }, [tableOptions]);
  return (
    <Layout>
      {contextHolder}
      <Content className="overflow-auto h-[calc(100vh-100px)] dark:bg-black">
        <Card
          title={t("admin/users")}
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
                    value: "not_null",
                  },
                  {
                    label: "Referral X",
                    value: "null",
                  },
                ]}
                defaultValue={""}
                onChange={(e) => onReferralChange(e.target.value)}
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
                    value: "true",
                  },
                  {
                    label: "Black Memo X",
                    value: "false",
                  },
                ]}
                defaultValue={""}
                onChange={(e) => onBlackMemoChange(e.target.value)}
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
                    value: "G",
                  },
                  {
                    label: "Test",
                    value: "T",
                  },
                  {
                    label: "Interest",
                    value: "I",
                  },
                  {
                    label: "Working",
                    value: "W",
                  },
                ]}
                defaultValue={""}
                onChange={(e) => onMemberTypeChange(e.target.value)}
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
                    value: "W",
                  },
                  {
                    label: "Approved",
                    value: "A",
                  },
                  {
                    label: "Suspened",
                    value: "S",
                  },
                  {
                    label: "Deleted",
                    value: "D",
                  },
                  {
                    label: "Blocked",
                    value: "B",
                  },
                  {
                    label: "Inactive",
                    value: "I",
                  },
                ]}
                defaultValue={""}
                onChange={(e) => onMemberStatusChange(e.target.value)}
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
                    label: "Reg IP Duplication",
                    value: true,
                  },
                  {
                    label: "Connected IP Duplication",
                    value: false,
                  },
                ]}
                defaultValue={""}
              />
            </Space>
            <Space className="!w-full justify-between">
              <Space>
                <Select
                  size="small"
                  placeholder="select dist"
                  className="min-w-28"
                  allowClear
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
                  options={[
                    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 101, 102, 100,
                  ].map((i) => ({
                    value: i,
                    label:
                      i == 100 ? "Premium" : (i > 100 ? "VIP " : "Level ") + i,
                  }))}
                  onChange={onLevelChange}
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
                <Button size="small" type="primary" onClick={onResetCoupon}>
                  Reset all Coupon
                </Button>
                <Button
                  size="small"
                  type="primary"
                  onClick={() => setColorModal(true)}
                >
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

export default UserPage;
