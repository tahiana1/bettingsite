"use client";
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
} from "antd";

import { FilterDropdown } from "@refinedev/antd";
import type { TableProps } from "antd";

import { Content } from "antd/es/layout/layout";
import { useFormatter, useTranslations } from "next-intl";
import { useQuery } from "@apollo/client";
import { FILTER_TRANSACTIONS } from "@/actions/transaction";
import { RxLetterCaseToggle } from "react-icons/rx";
import { Dayjs } from "dayjs";
import { isValidDate, parseTableOptions } from "@/lib";

const DistributorStatisticsDetailPage: React.FC = () => {
  const t = useTranslations();
  const f = useFormatter();
  const [tableOptions, setTableOptions] = useState<any>({
    filters: [
      {
        field: "transactions.type",
        value: "T",
        op: "eq",
      },
    ],
  });

  const [total, setTotal] = useState<number>(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  const { loading, data, refetch } = useQuery(FILTER_TRANSACTIONS);

  const columns: TableProps<Transaction>["columns"] = [
    {
      title: t("distributor"),
      dataIndex: "userid",
      key: "userid",
      fixed: "left",
      render: (_, record) => {
        return record.user.id;
      }
    },
    {
      title: t("deposit/withdraw"),
      children: [
        {
          title: t("membershipDeposit"),
          align: "center",
          children: [
            {
              title: t("membershipWithdraw"),
              dataIndex: "amount",
              align: "center",
              key: "amount",
            },
          ],
        },
        {
          title: t("depositOfTheTotalAmount"),
          align: "center",
          children: [
            {
              title: t("totalWithdraw"),
              dataIndex: "amount",
              align: "center",
              key: "amount",
            },
          ],
        },
      ],
    },
    {
      title: t("afflllatedMember"),
      children: [
        {
          title: t("numberOfMembers"),
          dataIndex: "amount",
          align: "center",
          key: "amount",
        },
        {
          title: t("moneyInHand"),
          align: "center",
          children: [
            {
              title: t("rollingholdings"),
              dataIndex: "amount",
              align: "center",
              key: "amount",
            },
          ],
        },
        {
          title: t("liveRolling"),
          align: "center",
          children: [
            {
              title: t("slotRolling"),
              dataIndex: "amount",
              align: "center",
              key: "amount",
            },
          ],
        },
        {
          title: t("miniDanpolRolling"),
          align: "center",
          children: [
            {
              title: t("minCombinationRolling"),
              dataIndex: "amount",
              align: "center",
              key: "amount",
            },
          ],
        },
        {
          title: t("sportsDanpololRolling"),
          align: "center",
          children: [
            {
              title: t("sportsDupolRolling"),
              dataIndex: "amount",
              align: "center",
              key: "amount",
            },
          ],
        },
        {
          title: t("sports3PoleRolling"),
          align: "center",
          children: [
            {
              title: t("sports4PoleRolling"),
              dataIndex: "amount",
              align: "center",
              key: "amount",
            },
          ],
        },
        {
          title: t("sports5PoleRolling"),
          align: "center",
          children: [
            {
              title: t("sportsDapololling"),
              dataIndex: "amount",
              align: "center",
              key: "amount",
            },
          ],
        },
        {
          title: t("virtualGameRolling"),
          dataIndex: "amount",
          align: "center",
          key: "amount",
        },
        {
          title: t("lotusRolling"),
          dataIndex: "amount",
          align: "center",
          key: "amount",
        },
        {
          title: t("mgmRolling"),
          dataIndex: "amount",
          align: "center",
          key: "amount",
        },
        {
          title: t("touchRolling"),
          dataIndex: "amount",
          align: "center",
          key: "amount",
        },
        {
          title: t("holdemRolling"),
          dataIndex: "amount",
          align: "center",
          key: "amount",
        },
      ],
    },
    {
      title: t("betting/winning"),
      children: [
        {
          title: t("liveBetting"),
          align: "center",
          children: [
            {
              title: t("liveWinning"),
              dataIndex: "amount",
              align: "center",
              key: "amount",
            },
          ],
        },
        {
          title: t("slotBetting"),
          align: "center",
          children: [
            {
              title: t("slotJackpot"),
              dataIndex: "amount",
              align: "center",
              key: "amount",
            },
          ],
        },
        {
          title: t("miniDanpolBetting"),
          align: "center",
          children: [
            {
              title: t("miniDanpolwinner"),
              dataIndex: "amount",
              align: "center",
              key: "amount",
            },
          ],
        },
        {
          title: t("miniCombinationBetting"),
          align: "center",
          children: [
            {
              title: t("miniCombinationWinnings"),
              dataIndex: "amount",
              align: "center",
              key: "amount",
            },
          ],
        },
        {
          title: t("sportsDanpolBetting"),
          align: "center",
          children: [
            {
              title: t("sportsDanpolWinner"),
              dataIndex: "amount",
              align: "center",
              key: "amount",
            },
          ],
        },
        {
          title: t("sportsDupolBetting"),
          align: "center",
          children: [
            {
              title: t("sportsDupolWinner"),
              dataIndex: "amount",
              align: "center",
              key: "amount",
            },
          ],
        },
        {
          title: t("sports3poleBetting"),
          align: "center",
          children: [
            {
              title: t("sports3poleWinner"),
              dataIndex: "amount",
              align: "center",
              key: "amount",
            },
          ],
        },
        {
          title: t("sports4poleBetting"),
          align: "center",
          children: [
            {
              title: t("sports4poleWinner"),
              dataIndex: "amount",
              align: "center",
              key: "amount",
            },
          ],
        },
        {
          title: t("sports5poleBetting"),
          align: "center",
          children: [
            {
              title: t("sports5poleWinner"),
              dataIndex: "amount",
              align: "center",
              key: "amount",
            },
          ],
        },
        {
          title: t("sportsDapolBetting"),
          align: "center",
          children: [
            {
              title: t("sportsDapolWinner"),
              dataIndex: "amount",
              align: "center",
              key: "amount",
            },
          ],
        },
        {
          title: t("virtualGameBetting"),
          align: "center",
          children: [
            {
              title: t("virtualGameWinnings"),
              dataIndex: "amount",
              align: "center",
              key: "amount",
            },
          ],
        },
        {
          title: t("lotusBetting"),
          align: "center",
          children: [
            {
              title: t("lotusLottery"),
              dataIndex: "amount",
              align: "center",
              key: "amount",
            },
          ],
        },
        {
          title: t("mgmBetting"),
          align: "center",
          children: [
            {
              title: t("mgmWinning"),
              dataIndex: "amount",
              align: "center",
              key: "amount",
            },
          ],
        },
        {
          title: t("touchBetting"),
          align: "center",
          children: [
            {
              title: t("touchWinning"),
              dataIndex: "amount",
              align: "center",
              key: "amount",
            },
          ],
        },
        {
          title: t("holdemBetting"),
          align: "center",
          children: [
            {
              title: t("holdemWinning"),
              dataIndex: "amount",
              align: "center",
              key: "amount",
            },
          ],
        },
      ],
    },
    {
      title: t("rolling"),
      children: [
        {
          title: t("ratePercentage"),
          align: "center",
          children: [
            {
              title: t("rollingtransition"),
              dataIndex: "amount",
              align: "center",
              key: "amount",
            },
          ],
        },
        {
          title: t("live"),
          align: "center",
          children: [
            {
              title: t("slot"),
              dataIndex: "amount",
              align: "center",
              key: "amount",
            },
          ],
        },
        {
          title: t("miniDanpol"),
          align: "center",
          children: [
            {
              title: t("minicombination"),
              dataIndex: "amount",
              align: "center",
              key: "amount",
            },
          ],
        },
        {
          title: t("sportsDanpol"),
          align: "center",
          children: [
            {
              title: t("sportsDupol"),
              dataIndex: "amount",
              align: "center",
              key: "amount",
            },
          ],
        },
        {
          title: t("sports3Pole"),
          align: "center",
          children: [
            {
              title: t("sports4Pole"),
              dataIndex: "amount",
              align: "center",
              key: "amount",
            },
          ],
        },
        {
          title: t("sports5Pole"),
          align: "center",
          children: [
            {
              title: t("sportsDapol"),
              dataIndex: "amount",
              align: "center",
              key: "amount",
            },
          ],
        },
        {
          title: t("virtualGame"),
          dataIndex: "amount",
          align: "center",
          key: "amount",
        },
        {
          title: t("lotus"),
          dataIndex: "amount",
          align: "center",
          key: "amount",
        },
        {
          title: t("mgm"),
          dataIndex: "amount",
          align: "center",
          key: "amount",
        },
        {
          title: t("touch"),
          dataIndex: "amount",
          align: "center",
          key: "amount",
        },
        {
          title: t("holdem"),
          dataIndex: "amount",
          align: "center",
          key: "amount",
        },
        {
          title: t("cutReduce"),
          align: "center",
          dataIndex: "amount",
          key: "amount",
        },
       
      ],
    },
    {
      title: t("losing"),
      children: [
        {
          title: t("ratePercentage"),
          align: "center",
          children: [
            {
              title: t("loadingSettlement"),
              dataIndex: "amount",
              align: "center",
              key: "amount",
            },
          ],
        },
        {
          title: t("live"),
          align: "center",
          children: [
            {
              title: t("slot"),
              dataIndex: "amount",
              align: "center",
              key: "amount",
            },
          ],
        },
        {
          title: t("miniDanpol"),
          align: "center",
          children: [
            {
              title: t("minicombination"),
              dataIndex: "amount",
              align: "center",
              key: "amount",
            },
          ],
        },
        {
          title: t("sportsDanpol"),
          align: "center",
          children: [
            {
              title: t("sportsDupol"),
              dataIndex: "amount",
              align: "center",
              key: "amount",
            },
          ],
        },
        {
          title: t("sports3Pole"),
          align: "center",
          children: [
            {
              title: t("sports4Pole"),
              dataIndex: "amount",
              align: "center",
              key: "amount",
            },
          ],
        },
        {
          title: t("sports5Pole"),
          align: "center",
          children: [
            {
              title: t("sportsDapol"),
              dataIndex: "amount",
              align: "center",
              key: "amount",
            },
          ],
        },
        {
          title: t("virtualGame"),
          dataIndex: "amount",
          align: "center",
          key: "amount",
        },
        {
          title: t("lotus"),
          dataIndex: "amount",
          align: "center",
          key: "amount",
        },
        {
          title: t("mgm"),
          dataIndex: "amount",
          align: "center",
          key: "amount",
        },
        {
          title: t("touch"),
          dataIndex: "amount",
          align: "center",
          key: "amount",
        },
        {
          title: t("holdem"),
          dataIndex: "amount",
          align: "center",
          key: "amount",
        },
        
      ],
    },
    {
      title: t("partnership"),
      children: [
        {
          title: t("rolling"),
          align: "center",
          children: [
            {
              title: t("moneyInHand"),
              dataIndex: "amount",
              align: "center",
              key: "amount",
            },
          ],
        }
      ],
    },
   
  ];

  const onChange: TableProps<Transaction>["onChange"] = (
    pagination,
    filters,
    sorter,
    extra
  ) => {
    setTableOptions({
      ...parseTableOptions(pagination, filters, sorter, extra),
      filters: tableOptions?.filters,
    });
  };

  /*   const updateFilter = (field: string, v: string, op: string = "eq") => {
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
  }; */

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
  return (
    <Layout>
      <Content className="overflow-auto h-[calc(100vh-100px)] dark:bg-black">
        <Card
          title={t("admin/menu/settlements/distributorStatistics")}
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
            bordered
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
        </Card>
      </Content>
    </Layout>
  );
};

export default DistributorStatisticsDetailPage;
