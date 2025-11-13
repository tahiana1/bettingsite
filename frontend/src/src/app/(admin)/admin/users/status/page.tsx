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
  message,
} from "antd";
import { FilterDropdown } from "@refinedev/antd";
import type { TableProps } from "antd";

import { Content } from "antd/es/layout/layout";

import { useFormatter, useTranslations } from "next-intl";
import { useQuery } from "@apollo/client";
import { CONNECTED_USERS } from "@/actions/user";
import { RxLetterCaseToggle } from "react-icons/rx";
import { AiOutlineDisconnect } from "react-icons/ai";
import api from "@/api";

// import HighlighterComp, { HighlighterProps } from "react-highlight-words";
import dayjs from "dayjs";
import { parseTableOptions } from "@/lib";
import { USER_STATUS } from "@/constants";

// const Highlighter = HighlighterComp as unknown as React.FC<HighlighterProps>;

// type UserIndex = keyof User;

const UserStatusPage: React.FC = () => {
  const t = useTranslations();
  const f = useFormatter();
  const [searchValue, setSearchValue] = useState<string>("");
  const [tableOptions, setTableOptions] = useState<any>({
    filters: [
      {
        field: "role",
        value: "U",
        op: "eq",
      },
      {
        field: "online_status",
        value: "true",
        op: "eq",
      },
    ],
  });

  const [total, setTotal] = useState<number>(0);
  const [users, setUsers] = useState<any[]>([]);
  const { loading, error, data, refetch } = useQuery(CONNECTED_USERS);
  const [colorModal, setColorModal] = useState<boolean>(false);

  const popupWindow = (id: number) => {
    window.open(`/admin/popup/user?id=${id}`, '_blank', 'width=screen.width,height=screen.height,toolbar=no,menubar=no,scrollbars=yes,resizable=yes,location=no,status=no');
  }

  const onDisconnect = async (user: User) => {
    try {
      const response = await api(`admin/basic-information/${user.userid}/update`, {
        method: "PUT",
        data: {
          field: "onlineStatus",
          value: "false",
        },
      });
      
      if (response.message) {
        message.success(response.message);
        // Refresh the table data
        refetch(tableOptions ?? undefined)
          .then((res) => {
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
      }
    } catch (error: any) {
      console.error("Failed to disconnect user:", error);
      message.error(`Failed to disconnect user: ${error.message || 'Unknown error'}`);
    }
  };

  const onDisconnectAll = async () => {
    // Get all users that match the criteria (role == "U" and online_status == true)
    // These are already filtered in the current users array
    const usersToDisconnect = users.filter(
      (u: any) => u.role === "U" && u.onlineStatus === true
    );

    if (usersToDisconnect.length === 0) {
      message.info("No users to disconnect");
      return;
    }

    try {
      // Show loading message
      const hide = message.loading(`Disconnecting ${usersToDisconnect.length} user(s)...`, 0);
      
      // Disconnect all users in parallel
      const disconnectPromises = usersToDisconnect.map((user: User) =>
        api(`admin/basic-information/${user.userid}/update`, {
          method: "PUT",
          data: {
            field: "onlineStatus",
            value: "false",
          },
        }).catch((error: any) => {
          console.error(`Failed to disconnect user ${user.userid}:`, error);
          return { error: true, userid: user.userid, errorMessage: error.message };
        })
      );

      const results = await Promise.all(disconnectPromises);
      hide();

      // Count successes and failures
      const successes = results.filter((r) => !r.error).length;
      const failures = results.filter((r) => r.error).length;

      if (failures === 0) {
        message.success(`Successfully disconnected ${successes} user(s)`);
      } else {
        message.warning(`Disconnected ${successes} user(s), ${failures} failed`);
      }

      // Refresh the table data
      refetch(tableOptions ?? undefined)
        .then((res) => {
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
    } catch (error: any) {
      console.error("Failed to disconnect all users:", error);
      message.error(`Failed to disconnect all users: ${error.message || 'Unknown error'}`);
    }
  };

  const columns: TableProps<User>["columns"] = [
    {
      title: "ID",
      dataIndex: "userid",
      key: "userid",
      fixed: "left",
      render: (_, record) => {
        return <div className="flex items-center cursor-pointer" onClick={() => popupWindow(record.id)}> 
          <p className="w-[15px] h-[15px] flex items-center justify-center rounded-full bg-[#1677ff] text-white text-xs">{record.profile?.level}</p>
          <p className="text-xs text-[white] bg-[#000] px-1 py-0.5 rounded">{record.userid}</p>
        </div>
      },
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
      render(_, record) {
        return record.root?.userid ? <div className="flex items-center cursor-pointer" onClick={() => popupWindow(record.root.id)}> 
          <p className="text-xs text-[white] bg-[#000] px-1 py-0.5 rounded">{record.root?.userid}</p>
        </div> : "";
      },
    },
    {
      title: t("top_dist"),
      dataIndex: "top_dist",
      key: "top_dist",
      render(_, record) {
        return record.parent?.userid ? <div className="flex items-center cursor-pointer" onClick={() => popupWindow(record.parent.id)}> 
          <p className="text-xs text-[white] bg-[#000] px-1 py-0.5 rounded">{record.parent?.userid}</p>
        </div> : "";
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
      render: (_, { usdtAddress }) => usdtAddress,
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
      render: (text) =>
        f.dateTime(new Date(text) ?? null, {
          year: "numeric",
          day: "numeric",
          month: "numeric",
          hour: "numeric",
          minute: "numeric",
        }),
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
            onConfirm={() => onDisconnect(record)}
            description={t("disconnectMessage")}
            icon={<AiOutlineDisconnect className="w-4 h-4 !text-red-500" />}
          >
            <Button
              title={t("disconnect")}
              variant="outlined"
              color="danger"
              icon={<AiOutlineDisconnect />}
            />
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
    const parsedOptions = parseTableOptions(pagination, filters, sorter, extra);
    // Always preserve base filters (role and online_status)
    const baseFilters = [
      {
        field: "role",
        value: "U",
        op: "eq",
      },
      {
        field: "online_status",
        value: "true",
        op: "eq",
      },
    ];
    // Merge base filters with parsed filters, avoiding duplicates
    const mergedFilters = [
      ...baseFilters,
      ...(parsedOptions.filters || []).filter((f: any) => 
        f.field !== "role" && f.field !== "online_status"
      ),
    ];
    setTableOptions({
      ...parsedOptions,
      filters: mergedFilters,
    });
  };

  const onSearchUser = (v: string) => {
    let filters: any[] = tableOptions?.filters ?? [];
    // Remove existing search filters (userid, nickname, holderName, phone)
    // Keep role and online_status filters
    const f = filters.filter((f) => 
      f.field !== "userid" && 
      f.field !== '"Profile"."nickname"' && 
      f.field !== '"Profile"."holder_name"' && 
      f.field !== '"Profile"."phone"' && 
      !f.or
    );

    filters = [...f];
    if (v && v.trim()) {
      setTableOptions({
        ...tableOptions,
        filters: [
          ...filters,
          {
            or: [
              {
                field: "userid",
                value: v.trim(),
                op: "ilike",
              },
              {
                field: '"Profile"."nickname"',
                value: v.trim(),
                op: "ilike",
              },
              {
                field: '"Profile"."holder_name"',
                value: v.trim(),
                op: "ilike",
              },
              {
                field: '"Profile"."phone"',
                value: v.trim(),
                op: "ilike",
              },
            ],
          },
        ],
      });
    } else {
      setTableOptions({
        ...tableOptions,
        filters: filters,
      });
    }
  };

  const [colorOption, setColorOptoin] = useState<any>("new");
  const onChangeColors = async () => {
    setColorModal(false);
  };

  useEffect(() => {
    setUsers(
      data?.response?.users?.map((u: any) => {
        return { ...u, key: u.id };
      }) ?? []
    );
  }, [data]);

  useEffect(() => {
    refetch(tableOptions ?? undefined)
      .then((res) => {
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
          title={t("userStatus")}
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
            <Space>
              <Space.Compact size="small">
                <Input
                  size="small"
                  placeholder="ID,Nickname,Account Holder,Phone Number"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onPressEnter={() => onSearchUser(searchValue)}
                />
                <Button
                  size="small"
                  type="text"
                  icon={<RxLetterCaseToggle />}
                />
                <Button
                  size="small"
                  type="primary"
                  onClick={() => onSearchUser(searchValue)}
                >
                  {t("search")}
                </Button>
              </Space.Compact>
              <Popconfirm
                title={t("confirmSure")}
                description={`Are you sure you want to disconnect all ${users.filter((u: any) => u.role === "U" && u.onlineStatus === true).length} online user(s)?`}
                onConfirm={onDisconnectAll}
                okText="Yes"
                cancelText="No"
              >
                <Button size="small" color="danger" variant="outlined">
                  {t("disconnectAll")}
                </Button>
              </Popconfirm>
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
                <Select />1
              </Form.Item>
            </Space>
          </Modal>
        </Card>
      </Content>
    </Layout>
  );
};

export default UserStatusPage;
