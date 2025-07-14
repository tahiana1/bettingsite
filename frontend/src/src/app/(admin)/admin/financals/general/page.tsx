"use client";
import React, { useEffect, useState } from "react";
import * as XLSX from 'xlsx';

import {
  Layout,
  Space,
  Card,
  Table,
  Button,
  Input,
  DatePicker,
  Radio,
  Select,
  Modal,
  Form,
  Divider,
  Descriptions,
  Alert,
} from "antd";
import { FilterDropdown } from "@refinedev/antd";
import type { TableProps } from "antd";

import { Content } from "antd/es/layout/layout";
import { useFormatter, useTranslations } from "next-intl";
import { useMutation, useQuery } from "@apollo/client";
import {
  APPROVE_TRANSACTION,
  // BLOCK_TRANSACTION,
  FILTER_TRANSACTIONS,
  CANCEL_TRANSACTION,
  WAITING_TRANSACTION,
} from "@/actions/transaction";
import { RxLetterCaseToggle } from "react-icons/rx";
import { Dayjs } from "dayjs";
import { isValidDate, parseTableOptions } from "@/lib";

const GeneralDWPage: React.FC = () => {
  const t = useTranslations();
  const f = useFormatter();

  const [modal, contextHolder] = Modal.useModal();
  const [range, setRange] = useState<any[]>([]);

  const [total, setTotal] = useState<number>(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  const { loading, data, refetch } = useQuery(FILTER_TRANSACTIONS);
  const [colorModal, setColorModal] = useState<boolean>(false);

  const [approveTransaction] = useMutation(APPROVE_TRANSACTION);
  // const [blockTransaction] = useMutation(BLOCK_TRANSACTION);
  const [cancelTransaction] = useMutation(CANCEL_TRANSACTION);
  const [waitingTransaction] = useMutation(WAITING_TRANSACTION);

  const popupWindow = (id: number) => {
    window.open(`/admin/popup/user?id=${id}`, '_blank', 'width=1200,height=800,toolbar=no,menubar=no,scrollbars=yes,resizable=yes,location=no,status=no');
  }
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
            ],
          },
        ],
      },
    ],
  });
  useEffect(() => {
    const interval = setInterval(() => {
      refetch(tableOptions ?? undefined);
    }, 60000);
    return () => clearInterval(interval);
  }, []);
  // const onBlockTransaction = (transaction: Transaction) => {
  //   blockTransaction({ variables: { id: transaction.id } })
  //     .then((res) => {
  //       if (res.data?.success) {
  //       }
  //       refetch(tableOptions);
  //     })
  //     .catch((err) => {
  //       console.log({ err });
  //     });
  // };

  const onApproveTransaction = (transaction: Transaction) => {
    approveTransaction({ variables: { id: transaction.id } })
      .then((res) => {
        if (res.data?.success) {
          refetch(tableOptions);  
        }
      })
      .catch((err) => {
        console.error('Error approving transaction:', err);
      });
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
  const onTransactionTypeChange = (v: string = "") => {
    console.log(v, 'v');
    if (v == "entire") {
      // Clear all transaction-related filters
      let filters = tableOptions?.filters?.filter(
        (f: any) => !f.field.startsWith('transactions.')
      ) || [];
      
      setTableOptions({ ...tableOptions, filters });
      refetch({
        options: {
          filter: {
            shortcut: null,
          },
        },
      });
    } else {
      // Clear existing transaction type and status filters
      let filters = tableOptions?.filters?.filter(
        (f: any) => !f.field.startsWith('transactions.')
      ) || [];

      if (v == "C") {
        filters.push({
          field: "transactions.status",
          value: v,
          op: "eq",
        });
      } else {
        filters.push({
          field: "transactions.type",
          value: v,
          op: "eq",
        });
      }

      setTableOptions({ ...tableOptions, filters });
    }
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

  const columns: TableProps<Transaction>["columns"] = [
    {
      title: t("number"),
      dataIndex: "id", 
      key: "id",
      render: (_, __, index) => index + 1
    },
    
    {
      title: t("root_dist"),
      dataIndex: "root.transactionid",
      key: "root.transactionid",
      render(_, record) {
        return record.user?.root?.userid;
      },
    },
    {
      title: t("top_dist"),
      dataIndex: "top_dist",
      key: "top_dist",
      render(_, record) {
        return record.user?.parent?.userid;
      },
    },
    {
      title: "Level",
      dataIndex: "level",
      key: "level",
      fixed: "left",
      render: (_, record) => {
        // return (record.user?.profile?.level + " " + record.user?.profile?.name);
        return <div className="flex items-center cursor-pointer" onClick={() => popupWindow(record.user?.id)}>
          <p className="w-[15px] h-[15px] flex items-center justify-center rounded-full bg-[#1677ff] text-white text-xs">{record.user?.profile?.level}</p>
          <p className="text-xs text-[white] bg-[#000] px-1 py-0.5 rounded">{record.user?.profile?.name}</p>
        </div>
      },
    },
    {
      title: t("nickname"),
      dataIndex: "profile.nickname",
      key: '"Profile"."nickname"',
      render: (_, record) => record.user?.profile?.nickname,
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
      render: (_, record) => record.user?.profile?.phone,
      filterDropdown: (props) => (
        <FilterDropdown {...props}>
          <Input className="w-full" />
        </FilterDropdown>
      ),
    },
    {
      title: t("bankName"),
      dataIndex: "profile.bankname",
      key: "bankname",
      render: (_, record) => record.user?.profile?.bankName,
    },
    {
      title: t("accountName"),
      dataIndex: "profile.accountNumber",
      key: "accountNumber",
      render: (_, record) => record.user?.profile?.accountNumber,
    },
    {
      title: t("depositorName"),
      dataIndex: "profile.depositorName",
      key: "depositorName",
      render: (_, record) => record.user?.profile?.holderName,
    },
    {
      title: t("alliance"),
      dataIndex: "profile.alliance",
      key: "alliance",
      render: (_, record) => <p>-</p>,
    },
    {
      title: t("balanceBefore"),
      dataIndex: "balanceBefore",
      key: "balanceBefore",
    },
    {
      title: t("amount"),
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: t("balanceAfter"),
      dataIndex: "balanceAfter",
      key: "balanceAfter",
    },
   
    {
      title: t("pointBefore"),
      dataIndex: "pointBefore",
      key: "pointBefore",
    },
    {
      title: t("point"),
      dataIndex: "point",
      key: "point",
      render: () => 0,
    },
    {
      title: t("pointAfter"),
      dataIndex: "pointAfter",
      key: "pointAfter",
    },
    {
      title: t("usdtDesc"),
      dataIndex: "usdtDesc",
      key: "usdtDesc",
    },
    {
      title: t("shortcut"),
      dataIndex: "shortcut",
      width: 100,
      key: "shortcut",
      render: (_, record) => (
        record.type == "deposit" ? <div className="flex flex-column gap-1">
          <p className="text-xs bg-[red] text-white flex px-2 py-1 rounded justify-center align-center cursor-pointer">{t("deposit")}</p>
        </div> : <div className="flex flex-column gap-1">
          <p className="text-xs bg-[#1677ff] text-white flex px-2 py-1 rounded justify-center align-center cursor-pointer">{t("withdrawal")}</p>
        </div>
      ),
    },
    {
      title: t("transactionAt"),
      dataIndex: "transactionAt",
      key: "transactionAt",
      render: (v) => (isValidDate(v) ? f.dateTime(new Date(v)) : ""),
    },
    {
      title: t("approvedAt"),
      dataIndex: "profile.approvedAt",
      key: "approvedAt",
      render: (v) => (isValidDate(v) ? f.dateTime(new Date(v)) : ""),
    },
    {
      title: t("createdAt"),
      dataIndex: "createdAt",
      key: "createdAt",
      render: (v) => (isValidDate(v) ? f.dateTime(new Date(v)) : ""),
    },
    {
      title: t("status"),
      dataIndex: "status",
      key: "status",
      fixed: "right",
      render: (_, record) => {
        return <>
          {record.status == "pending" && <Button
            title={t("pending")}
            variant="outlined"
            onClick={() => onApproveTransaction(record)}
            color="blue"
          >
            {t("pending")}
          </Button>}
          {record.status == "A" ? <button className="text-xs bg-[#1677ff] text-white px-2 py-1 rounded">{t("approve")}</button> : null}
          {record.status == "B" ? <button className="text-xs bg-[#000] text-white px-2 py-1 rounded">Blocked</button> : null}
          {record.status == "C" ? <button className="text-xs bg-[#000] text-white px-2 py-1 rounded">Canceled</button> : null}
          {record.status == "W" ? <button className="text-xs bg-[orange] text-white px-2 py-1 rounded">Waiting</button> : null}
        </>
      }
    },
    {
      title: t("action"),
      key: "action",
      fixed: "right",
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

  const onLevelChange = (v: string = "") => {
    updateFilter(`profiles.level`, v, "eq");
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
    setRange(dateStrings);
    let filters: { field: string; value: string; op: string }[] =
      tableOptions?.filters ?? [];
    
    // Remove any existing date filters
    filters = filters.filter((f) => f.field !== "transactions.created_at");
    
    // Only add date filters if both dates are selected and valid
    if (dates?.[0] && dates?.[1]) {
      const startDate = dates[0].startOf('day').toISOString();
      const endDate = dates[1].endOf('day').toISOString();
      
      filters = [
        ...filters,
        {
          field: "transactions.created_at",
          value: startDate,
          op: "gte",
        },
        {
          field: "transactions.created_at",
          value: endDate,
          op: "lte",
        },
      ];
    }
    
    setTableOptions({ ...tableOptions, filters });
    refetch({ options: { filters } });
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

  const onSearch = (value: string) => {
    let filters: { field: string; value: string; op: string }[] =
      tableOptions?.filters ?? [];

    // Remove any existing search filters
    filters = filters.filter(
      (f) =>
        !f.field.startsWith("transactions.profile.nickname") &&
        !f.field.startsWith("transactions.profile.holderName")
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
      ];
    }

    setTableOptions({ ...tableOptions, filters });
    refetch({ options: { filters } });
  };

  const handleDownload = () => {
    // Create worksheet from transactions data
    const worksheet = XLSX.utils.json_to_sheet(
      transactions.map((transaction) => ({
        [t("number")]: transaction.id,
        [t("root_dist")]: transaction.user?.root?.userid,
        [t("top_dist")]: transaction.user?.parent?.userid,
        [t("level")]: `${transaction.user?.profile?.level} ${transaction.user?.profile?.name}`,
        [t("nickname")]: transaction.user?.profile?.nickname,
        [t("phone")]: transaction.user?.profile?.phone,
        [t("bankName")]: transaction.user?.profile?.bankName,
        [t("accountName")]: transaction.user?.profile?.accountNumber,
        [t("depositorName")]: transaction.user?.profile?.holderName,
        [t("alliance")]: "-",
        [t("balanceBefore")]: transaction.balanceBefore,
        [t("amount")]: transaction.amount,
        [t("balanceAfter")]: transaction.balanceAfter,
        [t("pointBefore")]: transaction.pointBefore,
        [t("point")]: 0,
        [t("pointAfter")]: transaction.pointAfter,
        [t("usdtDesc")]: transaction.usdtDesc,
        [t("shortcut")]: transaction.shortcut,
        [t("transactionAt")]: transaction.transactionAt ? f.dateTime(new Date(transaction.transactionAt)) : "",
        [t("approvedAt")]: transaction.approvedAt ? f.dateTime(new Date(transaction.approvedAt)) : "",
        [t("createdAt")]: transaction.createdAt ? f.dateTime(new Date(transaction.createdAt)) : "",
        [t("status")]: transaction.status,
      }))
    );

    // Create workbook and append worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");

    // Generate Excel file and trigger download
    XLSX.writeFile(workbook, "transactions.xlsx");
  };

  return (
    <Layout>
      {contextHolder}
      <Content className="overflow-auto h-[calc(100vh-100px)] dark:bg-black">
        <Card
          title={t("admin/menu/generaldwdetail")}
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
                    label: t("entire"),
                    value: "entire",
                  },
                  {
                    label: t("deposit"),
                    value: "deposit",
                  },
                  {
                    label: t("withdraw"),
                    value: "withdrawal",
                  },
                  {
                    label: t("adminPay"),
                    value: "AP",
                  },
                  {
                    label: t("adminRecovery"),
                    value: "AR",
                  },
                  {
                    label: t("totalRecovery"),
                    value: "TR",
                  },
                  {
                    label: t("subPay"),
                    value: "SP",
                  },
                  {
                    label: t("lowerRecover"),
                    value: "LR",
                  },
                  {
                    label: t("recharge"),
                    value: "R",
                  },
                  {
                    label: t("exchange"),
                    value: "E",
                  },
                  {
                    label: t("canceled"),
                    value: "C",
                  },
                  {
                    label: t("deleted"),
                    value: "DL",
                  },
                ]}
                defaultValue={"entire"}
                onChange={(e) => onTransactionTypeChange(e.target.value)}
              />
            </Space>
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
                  options={levelOption}
                  labelRender={labelRenderer}
                  onChange={onLevelChange}
                />
              </Space>
              <Space.Compact className="gap-1">
                <Button size="small" type="primary" onClick={handleDownload}>
                  {t("download")}
                </Button>
              </Space.Compact>
            </Space>
            <Divider className="!p-0 !m-0" />
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
                  children: range[0] ? range[0] + " ~ " + range[1] : "",
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
                  children: total,
                },
              ]}
            />
            <Alert
              message={
                <span>
                  <span className="text-red-600">
                    Description: Payment/recovery of distributor money
                  </span>{" "}
                  is a process in which the distributor pays/recovers money to a
                  subordinate, and{" "}
                  <span className="text-red-600">
                    payment/recovery of subordinate money
                  </span>{" "}
                  is a process in which the upper distributor pays/recovers
                  money to the distributor.
                </span>
              }
              type="warning"
            />
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
  );
};

export default GeneralDWPage;
