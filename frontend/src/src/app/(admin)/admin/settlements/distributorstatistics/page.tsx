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
import { GET_DISTRIBUTORSDETAILS } from "@/actions/user";
import { RxLetterCaseToggle } from "react-icons/rx";
import { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { isValidDate, parseTableOptions, buildTree } from "@/lib";

const DistributorStatisticsPage: React.FC = () => {
  const t = useTranslations();
  const f = useFormatter();
  const [tableOptions, setTableOptions] = useState<any>({
    pagination: { limit: 25, offset: 0 },
  });

  const [total, setTotal] = useState<number>(0);
  const [users, setUsers] = useState<any[]>([]);
  const [treeUsers, setTreeUsers] = useState<any[]>([]);
  const { loading, data, refetch } = useQuery(GET_DISTRIBUTORSDETAILS, {
    variables: {
      filters: tableOptions?.filters || [],
      orders: tableOptions?.orders || [],
      pagination: tableOptions?.pagination || { limit: 25, offset: 0 },
    },
    fetchPolicy: "cache-and-network",
  });
  const popupWindow = (id: number) => {
    window.open(`/admin/popup/user?id=${id}`, '_blank', 'width=screen.width,height=screen.height,toolbar=no,menubar=no,scrollbars=yes,resizable=yes,location=no,status=no');
  }
  const { data: childrenData, refetch: refetchChildren } = useQuery(GET_DISTRIBUTORSDETAILS);

  const onExpand = (expanded: boolean, record: any) => {
    if (expanded) {
      refetchChildren({
        variables: {
          filters: [
            {
              field: "parent_id",
              value: record.id.toString(),
              op: "eq",
            },
          ],
          orders: tableOptions?.orders || [],
          pagination: { limit: 100, offset: 0 },
        },
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

  const columns: TableProps<any>["columns"] = [
    {
      title: t("rootDistributor"),
      dataIndex: "userid",
      key: "userid",
      fixed: "left",
      width: 150,
      render: (text, record) => text,
    },
    {
      title: t("numberOfMembers"),
      dataIndex: "numberOfMembers",
      key: "numberOfMembers",
      width: 120,
      render: (_, record) => {
        // Use numberOfMembers from the query or count children
        const memberCount = record.numberOfMembers || 0;
        const childCount = record.children?.length || 0;
        return memberCount > 0 ? memberCount : (childCount > 0 ? childCount : (record.profile?.comp || 0));
      },
    },
    {
      title: t("referral"),
      dataIndex: "referral",
      key: "referral",
      width: 100,
      render: (text, record) => record.domain || record.profile?.referral || "",
    },
    {
      title: t("situation"),
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (text) => (
        <span className={text === 'A' ? 'text-blue-500' : 'text-orange-500'}>
          {text === 'A' ? t("normal") : t("dormancy")}
        </span>
      ),
    },
    {
      title: t("depositor"),
      dataIndex: "profile.holderName",
      key: "profile.holderName",
      width: 100,
      render: (_, { profile }) => profile?.holderName || '-',
    },
    {
      title: t("allas"),
      dataIndex: "profile.nickname",
      key: "profile.nickname",
      width: 100,
      render: (_, { profile }) => profile?.nickname || '-',
    },
    {
      title: t("amountHeld"),
      dataIndex: "profile.balance",
      key: "profile.balance",
      width: 120,
      render: (_, { profile }) => f.number(profile?.balance || 0),
    },
    {
      title: t("point"),
      dataIndex: "profile.point",
      key: "profile.point",
      width: 80,
      render: (_, { profile }) => profile?.point || 0,
    },
    {
      title: t("deposit"),
      dataIndex: "membershipDeposit",
      key: "membershipDeposit",
      width: 80,
      render: (value) => f.number(value || 0),
    },
    {
      title: t("withdraw"),
      dataIndex: "membershipWithdrawal",
      key: "membershipWithdrawal",
      width: 80,
      render: (value) => f.number(value || 0),
    },
    {
      title: t("entry/exit"),
      key: "entry_exit",
      width: 120,
      render: (_, record) => {
        const deposit = record.membershipDeposit || 0;
        const withdrawal = record.membershipWithdrawal || 0;
        return f.number(deposit - withdrawal);
      },
    },
    {
      title: t("bet"),
      dataIndex: "bet",
      key: "bet",
      width: 80,
      render: (_, record) => {
        const totalBet = (record.liveBetting || 0) + 
                        (record.slotBetting || 0) + 
                        (record.miniDanpolBetting || 0) + 
                        (record.miniCombinationBetting || 0) +
                        (record.sportsDanpolBetting || 0) +
                        (record.sportsDupolBetting || 0) +
                        (record.sports3poleBetting || 0) +
                        (record.sports4poleBetting || 0) +
                        (record.sports5poleBetting || 0) +
                        (record.sportsDapolBetting || 0) +
                        (record.virtualGameBetting || 0) +
                        (record.lotusBetting || 0) +
                        (record.mgmBetting || 0) +
                        (record.touchBetting || 0) +
                        (record.holdemBetting || 0);
        return f.number(totalBet);
      },
    },
    {
      title: t("winner"),
      dataIndex: "winner",
      key: "winner",
      width: 80,
      render: (_, record) => {
        const totalWinner = (record.liveWinning || 0) + 
                           (record.slotJackpot || 0) + 
                           (record.miniDanpolWinner || 0) + 
                           (record.miniCombinationWinnings || 0) +
                           (record.sportsDanpolWinner || 0) +
                           (record.sportsDupolWinner || 0) +
                           (record.sports3poleWinner || 0) +
                           (record.sports4poleWinner || 0) +
                           (record.sports5poleWinner || 0) +
                           (record.sportsDapolWinner || 0) +
                           (record.virtualGameWinnings || 0) +
                           (record.lotusLottery || 0) +
                           (record.mgmWinning || 0) +
                           (record.touchWinning || 0) +
                           (record.holdemWinning || 0);
        return f.number(totalWinner);
      },
    },
    {
      title: t("bedang"),
      dataIndex: "losingSettlement",
      key: "bedang",
      width: 80,
      render: (value) => f.number(value || 0),
    },
    {
      title: t("settlementType"),
      dataIndex: "settlementType",
      key: "settlementType",
      width: 120,
      render: (_, { profile }) => (
        <span className="text-xs">{profile?.comp || '(input-output)*rate %'}</span>
      ),
    },
    {
      title: t("rollingRate"),
      dataIndex: "user",
      key: "user",
      width: 150,
      render: (_, record) => {
        // Use actual user losing/rolling data from the record
        const live = record.live || 0;
        const slot = record.slot || 0;
        const hold = record.hold || 0;
        const rate = `${live}/${slot}/${hold}/0/0/0/0/0/0`;
        return <span className="text-xs font-mono">{rate}</span>;
      },
    },
    // {
    //   title: t("rollingGold"),
    //   key: "rollingGold",
    //   dataIndex: "rolling",
    //   width: 120,
    //   render: (value) => f.number(value || 0),
    // },
    
    // {
    //   title: t("rollingTransaction"),
    //   key: "rollingTransaction",
    //   dataIndex: "rollingTransition",
    //   width: 120,
    //   render: (value) => f.number(value || 0),
    // },

    // {
    //   title: t("lossingRate"),
    //   dataIndex: "user",
    //   key: "user",
    //   width: 150,
    //   render: (_, record) => {
    //     // Use actual user losing/rolling data from the record
    //     const live = record.entireLosing || 0;
    //     const slot = record.liveLosingBeDang || 0;
    //     const hold = record.holdLosingBeDang || 0;
    //     const rate = `${live}/${slot}/${hold}/0/0/0/0/0/0`;
    //     return <span className="text-xs font-mono">{rate}</span>;
    //   },
    // },

    // {
    //   title: t("settlementAmount"),
    //   key: "settlementAmount",
    //   dataIndex: "losingSettlement",
    //   width: 120,
    //   render: (value) => f.number(value || 0),
    // },

    {
      title: t("datePeriod"),
      key: "datePeriod",
      width: 120,
      render: (_, record) => {
        // Show date period based on filters or created date
        const createdAt = record.createdAt;
        if (createdAt) {
          return dayjs(createdAt).format("M/D/YYYY HH:mm:ss");
        }
        return "-";
      },
    },
    // {
    //   title: t("processStatus"),
    //   key: "processStatus",
    //   width: 120,
    //   render: (_, record) => t("waiting"),
    // },
    // {
    //   title: t("viewDetails"),
    //   key: "viewDetails",
    //   width: 120,
    //   render: (_, record) => {
    //     return (
    //       <div className="flex gap-1">
    //         <Button size="small" type="primary" className="bg-red-500 text-white">
    //           {t("rolling")}
    //         </Button>
    //         <Button size="small" type="default" className="bg-blue-500 text-white">
    //           {t("losing")}
    //         </Button>
    //       </div>
    //     );
    //   },
    // },
    // {
    //   title: t("losingSettlement"),
    //   key: "losingSettlement",
    //   width: 120,
    //   render: (_, record) => {
    //     return (
    //       <div className="flex gap-1">
    //         <Button size="small" type="primary" className="bg-red-500 text-white">
    //           {t("losingSettlement")}
    //         </Button>
    //       </div>
    //     );
    //   },
    // },
  ];

  const onChange: TableProps<any>["onChange"] = (
    pagination,
    filters,
    sorter,
    extra
  ) => {
    const newTableOptions = parseTableOptions(pagination, filters, sorter, extra);
    setTableOptions({
      ...newTableOptions,
      filters: newTableOptions.filters || [],
    });
  };

  const onRangerChange = (
    dates: (Dayjs | null)[] | null,
    dateStrings: string[]
  ) => {
    let filters: { field: string; value: string; op: string }[] =
      tableOptions?.filters ?? [];
    const f = filters.filter((f) => f.field !== "created_at");
    if (dates?.at(0)) {
      filters = [
        ...f,
        {
          field: "created_at",
          value: dateStrings[0],
          op: "gt",
        },
        {
          field: "created_at",
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
    setTreeUsers(buildTree(users ?? []));
  }, [users]);

  useEffect(() => {
    refetch({
      variables: {
        filters: tableOptions?.filters || [],
        orders: tableOptions?.orders || [],
        pagination: tableOptions?.pagination || { limit: 25, offset: 0 },
      },
    });
  }, [tableOptions, refetch]);

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

          <Table
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
        </Card>
      </Content>
    </Layout>
  );
};

export default DistributorStatisticsPage;
