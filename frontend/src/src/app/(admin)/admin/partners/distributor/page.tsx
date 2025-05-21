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
  InputNumber,
  Tabs,
} from "antd";
import { FilterDropdown } from "@refinedev/antd";
import type { RadioChangeEvent, TableProps } from "antd";

import { Content } from "antd/es/layout/layout";
import { useFormatter, useTranslations } from "next-intl";
import { useMutation, useQuery } from "@apollo/client";
import {
  APPROVE_USER,
  BLOCK_USER,
  CREATE_USER,
  GET_DISTRIBUTORS,
} from "@/actions/user";
import { BiBlock, BiTrash } from "react-icons/bi";
import { PiUserCircleCheckLight } from "react-icons/pi";
import { RxLetterCaseToggle } from "react-icons/rx";
import { buildTree, parseTableOptions } from "@/lib";
import { USER_STATUS } from "@/constants";
import { GiNightSleep } from "react-icons/gi";
import { GET_DOMAINS } from "@/actions/domain";
import { FILTER_BANK } from "@/actions/bank";
import BasicInformation from "@/components/Admin/Distributor/Basic";

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

const PartnerPage: React.FC = () => {
  const t = useTranslations();
  const f = useFormatter();
  const [form] = Form.useForm();
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
  const [currentUser, setCurrentUser] = useState<User | null | undefined>(null);
  const { loading, data, refetch } = useQuery(GET_DISTRIBUTORS);

  const { data: bankData } = useQuery(FILTER_BANK);
  const { data: childrenData, refetch: refetchChildren } =
    useQuery(GET_DISTRIBUTORS);

  const { data: domainData } = useQuery(GET_DOMAINS);
  const [domains, setDomains] = useState<any[]>([]);

  const [regModal, setRegModal] = useState<boolean>(false);
  const [domainModal, setDomainModal] = useState<boolean>(false);
  const [moneyModal, setMoneyModal] = useState<boolean>(false);
  const [userModal, setUserModal] = useState<boolean>(false);

  const [createUser] = useMutation(CREATE_USER);
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

  const onDomainRegister = (record: User) => {
    setCurrentUser(record);
    setDomainModal(true);
  };

  const onUpdateDomain = (v: any) => {
    console.log({ v });

    setDomainModal(false);
  };

  const onRegisterUser = (v: any) => {
    console.log({ v });
    createUser({
      variables: {
        input: { ...v, role: "P", type: "G", status: "P" },
      },
    }).then((result) => {
      console.log({ result });
    });
    setRegModal(false);
  };

  const onPayment = (record: User) => {
    setCurrentUser(record);
    setMoneyModal(true);
  };

  const onAmountChange = (e: RadioChangeEvent) => {
    if (e.target.value == "max") {
      form.setFieldValue("amount", 232323);
    } else {
      form.setFieldValue("amount", parseInt(e.target.value));
    }
  };
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
      }).then(() => {
        setUsers([
          ...(users ?? []),
          ...(childrenData?.response?.users?.map((u: any) => {
            return { ...u, key: u.id };
          }) ?? []),
        ]);
      });
    }
  };

  const onViewCurrentMember = (u: User) => {
    console.log({ u });
    setCurrentUser(u);
    setUserModal(true);
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
      render: (text, record) => (
        <Button
          type="link"
          size="small"
          onClick={() => onViewCurrentMember(record)}
        >
          {text}
        </Button>
      ),
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
      render: (_, record) => [
        <Button
          title={t("deposit/withdraw")}
          variant="outlined"
          color="blue"
          key={"deposit"}
          onClick={() => onPayment(record)}
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
      render: (_, record) => [
        <Button
          title={t("domainRegistration")}
          variant="outlined"
          color="blue"
          key={"domainRegistration"}
          onClick={() => onDomainRegister(record)}
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

  const tabItems = [
    {
      label: t("basicInformation"),
      key: "basic",
      children: <BasicInformation user={currentUser!} />,
    },
    {
      label: t("blackSearch"),
      key: "blackSearch",
      children: (
        <div>
          <Input />
        </div>
      ),
    },
    {
      label: t("bettingSettings"),
      key: "bettingSettings",
      children: (
        <div>
          <Input />
        </div>
      ),
    },
    {
      label: t("deposit/withdraw"),
      key: "deposit/withdraw",
      children: (
        <div>
          <Input />
        </div>
      ),
    },
    {
      label: t("noteList"),
      key: "noteList",
      children: (
        <div>
          <Input />
        </div>
      ),
    },
    {
      label: t("serviceCenter"),
      key: "serviceCenter",
      children: (
        <div>
          <Input />
        </div>
      ),
    },
    {
      label: t("accountInquirySetting"),
      key: "accountInquirySetting",
      children: (
        <div>
          <Input />
        </div>
      ),
    },
    {
      label: t("subscriptionSetting"),
      key: "subscriptionSetting",
      children: (
        <div>
          <Input />
        </div>
      ),
    },
    {
      label: t("directMemberList"),
      key: "directMemberList",
      children: (
        <div>
          <Input />
        </div>
      ),
    },
    {
      label: t("recommendedMembers"),
      key: "recommendedMembers",
      children: (
        <div>
          <Input />
        </div>
      ),
    },
    {
      label: t("subMembers"),
      key: "subMembers",
      children: (
        <div>
          <Input />
        </div>
      ),
    },
    {
      label: t("integratedMoneyDetail"),
      key: "integratedMoneyDetail",
      children: (
        <div>
          <Input />
        </div>
      ),
    },
    {
      label: t("pointDetail"),
      key: "pointDetail",
      children: (
        <div>
          <Input />
        </div>
      ),
    },
    {
      label: t("couponDetail"),
      key: "couponDetail",
      children: (
        <div>
          <Input />
        </div>
      ),
    },
    {
      label: t("losingHistory"),
      key: "losingHistory",
      children: (
        <div>
          <Input />
        </div>
      ),
    },
    {
      label: t("rollingHistory"),
      key: "rollingHistory",
      children: (
        <div>
          <Input />
        </div>
      ),
    },
    {
      label: t("bettingHistory"),
      key: "bettingHistory",
      children: (
        <div>
          <Input />
        </div>
      ),
    },
    {
      label: t("activityHistory"),
      key: "activityHistory",
      children: (
        <div>
          <Input />
        </div>
      ),
    },
    {
      label: t("informationChangeHistory"),
      key: "informationChangeHistory",
      children: (
        <div>
          <Input />
        </div>
      ),
    },
    {
      label: t("generalStatistics"),
      key: "generalStatistics",
      children: (
        <div>
          <Input />
        </div>
      ),
    },
  ];

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
    setDomains(
      domainData?.response?.domains?.map((d: Domain) => ({
        ...d,
        key: d.id,
        label: d.name,
        value: d.id,
      }))
    );
  }, [domainData]);

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
            width={800}
            footer={null}
          >
            <Space direction="vertical" className="gap-2 w-full">
              <Form {...formItemLayout} onFinish={onRegisterUser}>
                <Form.Item name="domainId" label={t("domain")}>
                  <Select options={domains} />
                </Form.Item>
                <Form.Item name="settlementId" label={t("settlementMethod")}>
                  <Select
                    options={[
                      {
                        label: "(Be-Dang)*Rate%-Rolling-Rolling Conversion",
                        value: 1,
                      },
                      {
                        label: "(Be-Dang-Rolling-Rolling Conversion)*Rate%",
                        value: 2,
                      },
                      {
                        label:
                          "[(input-output)-(current money previous money)]*rate%-rolling",
                        value: 3,
                      },
                      {
                        label:
                          "[(deposit-withdrawal)-(current money-previous money)-rolling]*rate%",
                        value: 4,
                      },
                      {
                        label: "(input-output)*rate%",
                        value: 5,
                      },
                      {
                        label:
                          "[(input-output)-(current money-previous money)]*rate%",
                        value: 6,
                      },
                      {
                        label: "(Be-dang-Total Rolling)*Rate%",
                        value: 7,
                      },
                      {
                        label: "(B-Dang-orignal Rollling)*Rate%",
                        value: 8,
                      },
                      {
                        label:
                          "[(Be-dang)*Rate%-Rolling-RollingConversion]*0.9",
                        value: 9,
                      },
                    ]}
                  />
                </Form.Item>{" "}
                <Form.Item name="name" label={t("name")}>
                  <Input />
                </Form.Item>
                <Form.Item name="userid" label={t("userid")}>
                  <Input />
                </Form.Item>
                <Form.Item name="password" label={t("password")}>
                  <Input.Password />
                </Form.Item>
                <Form.Item name={"nickname"} label={t("nickname")}>
                  <Input />
                </Form.Item>
                <Form.Item name={"phone"} label={t("contact")}>
                  <Input />
                </Form.Item>
                <Form.Item name={"holderName"} label={t("holderName")}>
                  <Input />
                </Form.Item>
                <Form.Item name={"bankId"} label={t("bank")}>
                  <Select
                    options={bankData?.response?.banks?.map((b: Bank) => ({
                      label: b.name,
                      value: b.id,
                    }))}
                  />
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
                <Form.Item {...tailFormItemLayout}>
                  <Button type="primary" htmlType="submit">
                    {t("register")}
                  </Button>
                </Form.Item>
              </Form>
            </Space>
          </Modal>

          <Modal
            title={t("domain")}
            open={domainModal}
            onCancel={() => setDomainModal(false)}
            footer={null}
          >
            <Space direction="vertical" className="gap-2 w-full">
              <Form
                initialValues={{
                  userId: currentUser?.userid,
                }}
                onFinish={onUpdateDomain}
              >
                <Form.Item label={t("site")}>
                  <Select
                    options={[
                      {
                        label: "site2",
                        value: "site2",
                      },
                    ]}
                  />
                </Form.Item>
                <Form.Item name={"userId"} label={t("domain")}>
                  <Input disabled />
                </Form.Item>
                <Form.Item name={"domainId"} label={t("domain")}>
                  <Select mode="multiple" options={domains} />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    {t("register")}
                  </Button>
                </Form.Item>
              </Form>
            </Space>
          </Modal>

          <Modal
            title={t("payment")}
            open={moneyModal}
            onCancel={() => setMoneyModal(false)}
            footer={null}
          >
            <Space direction="vertical" className="gap-2 w-full">
              <Form
                initialValues={{
                  userId: currentUser?.userid,
                  balance: currentUser?.profile?.balance,
                }}
                form={form}
                onFinish={() => {
                  setMoneyModal(false);
                }}
              >
                <Form.Item name={"balance"} label={t("balance")}>
                  <Input disabled />
                </Form.Item>
                <Space>
                  <Form.Item
                    name={"amount"}
                    label={t("amount")}
                    className="!flex !w-full !p-0 !m-0"
                  >
                    <InputNumber min={0} />
                  </Form.Item>
                  <Button type="primary">{t("pay")}</Button>
                  <Button color="danger" variant="outlined">
                    {t("cancel")}
                  </Button>
                </Space>

                <Form.Item>
                  <Radio.Group
                    buttonStyle="solid"
                    className="w-full"
                    onChange={onAmountChange}
                  >
                    <Space.Compact className="w-full flex flex-wrap gap-2">
                      <Radio.Button value={1000}>
                        {f.number(1000, { style: "currency", currency: "USD" })}
                      </Radio.Button>
                      <Radio.Button value={5000}>
                        {f.number(5000, { style: "currency", currency: "USD" })}
                      </Radio.Button>
                      <Radio.Button value={10000}>
                        {f.number(10000, {
                          style: "currency",
                          currency: "USD",
                        })}
                      </Radio.Button>
                      <Radio.Button value={50000}>
                        {f.number(50000, {
                          style: "currency",
                          currency: "USD",
                        })}
                      </Radio.Button>
                      <Radio.Button value={100000}>
                        {f.number(100000, {
                          style: "currency",
                          currency: "USD",
                        })}
                      </Radio.Button>
                      <Radio.Button value={500000}>
                        {f.number(500000, {
                          style: "currency",
                          currency: "USD",
                        })}
                      </Radio.Button>
                      <Radio.Button value={"max"}>MAX</Radio.Button>
                    </Space.Compact>
                  </Radio.Group>
                </Form.Item>
                <Form.Item>
                  <Button type="default" htmlType="submit">
                    {t("close")}
                  </Button>
                </Form.Item>
              </Form>
            </Space>
          </Modal>

          <Modal
            title={t("user")}
            open={userModal}
            onCancel={() => setUserModal(false)}
            footer={null}
            width={"98%"}
          >
            <Tabs items={tabItems} />
          </Modal>
        </Card>
      </Content>
    </Layout>
  );
};

export default PartnerPage;
