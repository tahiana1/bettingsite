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
  Radio,
  Select,
  Modal,
  Form,
  Checkbox,
  Switch,
} from "antd";
import { FilterDropdown } from "@refinedev/antd";
import type { TableProps } from "antd";

import { Content } from "antd/es/layout/layout";
import { useTranslations } from "next-intl";
import { useMutation, useQuery } from "@apollo/client";
import { APPROVE_USER, BLOCK_USER, GET_DISTRIBUTORS } from "@/actions/user";
import { BiBlock, BiTrash } from "react-icons/bi";
import { PiUserCircleCheckLight } from "react-icons/pi";
import { RxLetterCaseToggle } from "react-icons/rx";
import { buildTree, parseTableOptions } from "@/lib";
import { USER_STATUS } from "@/constants";
import { GiNightSleep } from "react-icons/gi";

const PartnerPage: React.FC = () => {
  const t = useTranslations();
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

  const [regModal, setRegModal] = useState<boolean>(false);

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
      title: t("member_count"),
      dataIndex: "member_count",
      key: "member_count",
      render: (_, { profile }) => profile.comp,
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
      title: t("status"),
      dataIndex: "status",
      key: "status",
      render: (text) => USER_STATUS[text],
    },
    {
      title: t("entry/exit"),
      dataIndex: "status",
      key: "status",
      render: () => [
        <Button
          title={t("deposit/withdraw")}
          variant="outlined"
          color="blue"
          key={"deposit"}
        >
          {t("deposit/withdraw")}
        </Button>,
        <Button
          title={t("points") + "+"}
          variant="outlined"
          color="blue"
          key={"point"}
        >
          {t("points") + "+"}
        </Button>,
      ],
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
      title: t("settlementType"),
      dataIndex: "settlementType",
      key: "settlementType",
      render: (_, { profile }) => profile.comp,
    },
    {
      title: t("rollingRate"),
      dataIndex: "rollingRate",
      key: "rollingRate",
    },
    {
      title: t("rolling"),
      dataIndex: "rolling",
      key: "rolling",
    },
    {
      title: t("losingRate"),
      dataIndex: "losingRate",
      key: "losingRate",
    },
    {
      title: t("losing"),
      dataIndex: "losing",
      key: "losing",
    },

    {
      title: t("membership"),
      dataIndex: "membership",
      key: "membership",
      render: () => [
        <Button
          title={t("domainRegistration")}
          variant="outlined"
          color="blue"
          key={"domainRegistration"}
        >
          {t("domainRegistration")}
        </Button>,
        <Button
          title={t("losingRollingSetting")}
          variant="outlined"
          color="blue"
          key={"losingRollingSetting"}
        >
          {t("losingRollingSetting")}
        </Button>,
        <Button title={t("move")} variant="outlined" color="blue" key={"move"}>
          {t("move")}
        </Button>,
        <Button
          title={t("lower")}
          variant="outlined"
          color="blue"
          key={"lower"}
        >
          {t("lower")}
        </Button>,
      ],
    },
    {
      title: t("shortcut"),
      dataIndex: "shortcut",
      key: "shortcut",
      render: () => [
        <Button title={t("money")} variant="outlined" color="red" key={"money"}>
          {t("money")}
        </Button>,
        <Button title={t("bet")} variant="outlined" color="blue" key={"bet"}>
          {t("bet")}
        </Button>,
      ],
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
                color="red"
                icon={<PiUserCircleCheckLight />}
              />
            )}
          </Popconfirm>

          <Button
            title={t("dormancy")}
            variant="outlined"
            color="red"
            icon={<GiNightSleep />}
          />
          <Button
            title={t("delete")}
            variant="outlined"
            color="red"
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

  const onMemberStatusChange = (v: string) => {
    updateFilter("status", v, "eq");
  };

  const onLevelChange = (v: string = "") => {
    updateFilter(`"Profile"."level"`, v, "eq");
  };

  const [colorOption, setColorOptoin] = useState<any>("new");
  const onChangeColors = async () => {
    setRegModal(false);
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
              <Button size="small" onClick={() => setRegModal(true)}>
                {t("register")}
              </Button>
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
            title={t("register")}
            open={regModal}
            onCancel={() => setRegModal(false)}
            onOk={onChangeColors}
          >
            <Space direction="vertical" className="gap-2 text-end w-full">
              <Form component={false}>
                <Form.Item label={t("domain")}>
                  <Select />
                </Form.Item>
                <Form.Item label={t("settlementMethod")}>
                  <Select />
                </Form.Item>
                <Form.Item label={t("ID")}>
                  <Input />
                </Form.Item>
                <Form.Item label={t("password")}>
                  <Input.Password />
                </Form.Item>
                <Form.Item label={t("nickname")}>
                  <Input />
                </Form.Item>
                <Form.Item label={t("contact")}>
                  <Input />
                </Form.Item>

                <Form.Item label={t("holderName")}>
                  <Input />
                </Form.Item>
                <Form.Item label={t("bank")}>
                  <Select />
                </Form.Item>

                <Form.Item label={t("accountNumber")}>
                  <Input />
                </Form.Item>

                <Form.Item label={t("secPassword")}>
                  <Input.Password />
                </Form.Item>

                <Form.Item label={t("bettingHistoryReductionApplied")}>
                  <Radio.Group
                    optionType="button"
                    buttonStyle="solid"
                    options={[
                      {
                        label: t("live"),
                        value: "live",
                      },
                      {
                        label: t("slot"),
                        value: "slot",
                      },
                    ]}
                  />
                </Form.Item>

                <Form.Item label={t("rollingConversionAutoApprove")}>
                  <Switch />
                </Form.Item>
                <Form.Item label={t("virtualAccountAPI")}>
                  <Switch />
                </Form.Item>
                <Form.Item label={t("allowCreationSubDealers")}>
                  <Switch />
                </Form.Item>
                <Form.Item label={t("allowCreationLowerLevelDirectMembers")}>
                  <Switch />
                </Form.Item>
                <Form.Item>
                  <Button type="primary">{t("register")}</Button>
                </Form.Item>
              </Form>
            </Space>
          </Modal>
        </Card>
      </Content>
    </Layout>
  );
};

export default PartnerPage;
