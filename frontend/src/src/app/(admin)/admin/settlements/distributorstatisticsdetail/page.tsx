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
import { isValidDate, parseTableOptions, buildTree, formatNumber } from "@/lib";

const DistributorStatisticsDetailPage: React.FC = () => {
  const t = useTranslations();
  const f = useFormatter();
  const [tableOptions, setTableOptions] = useState<any>({
    pagination: { limit: 25, offset: 0 },
  });

  const [total, setTotal] = useState<number>(0);
  const [users, setUsers] = useState<any[]>([]);
  const [treeUsers, setTreeUsers] = useState<any[]>([]);
  const [totals, setTotals] = useState<any>({});
  const { loading, data, refetch } = useQuery(GET_DISTRIBUTORSDETAILS, {
    variables: {
      filters: tableOptions?.filters || [],
      orders: tableOptions?.orders || [],
      pagination: tableOptions?.pagination || { limit: 25, offset: 0 },
    },
    fetchPolicy: "cache-and-network",
  });

  const { data: childrenData, refetch: refetchChildren } = useQuery(GET_DISTRIBUTORSDETAILS);

  // Calculate totals function
  const calculateTotals = (data: any[]) => {
    const totals = {
      membershipDeposit: 0,
      membershipWithdrawal: 0,
      totalWithdrawal: 0,
      numberOfMembers: 0,
      moneyInHand: 0,
      rollingHoldings: 0,
      liveRolling: 0,
      slotRolling: 0,
      miniDanpolRolling: 0,
      miniCombinationRolling: 0,
      sportsDanpolRolling: 0,
      sportsDupolRolling: 0,
      sports3PoleRolling: 0,
      sports4PoleRolling: 0,
      sports5PoleRolling: 0,
      sportsDapolRolling: 0,
      virtualGameRolling: 0,
      lotusRolling: 0,
      mgmRolling: 0,
      touchRolling: 0,
      holdemRolling: 0,
      // Add betting/winning totals
      liveBetting: 0,
      liveWinning: 0,
      slotBetting: 0,
      slotJackpot: 0,
      miniDanpolBetting: 0,
      miniDanpolWinning: 0,
      miniCombinationBetting: 0,
      miniCombinationWinning: 0,
      sportsDanpolWinning: 0,
      sportsDupolWinning: 0,
      sports3PoleWinning: 0,
      sports4PoleWinning: 0,
      sports5PoleWinning: 0,
      sportsDapolWinning: 0,
      virtualGameWinning: 0,
      lotusWinning: 0,
      mgmWinning: 0,
      touchWinning: 0,
      holdemWinning: 0,
      // Add rolling totals
      rollingRate: 0,
      rollingTransition: 0,
      // Add losing totals
      losingRate: 0,
      losingSettlement: 0,
      liveLosing: 0,
      miniDanpolLosing: 0,
      sportsDanpolLosing: 0,
      sports3PoleLosing: 0,
      sports5PoleLosing: 0,
      virtualGameLosing: 0,
      lotusLosing: 0,
      mgmLosing: 0,
      touchLosing: 0,
      holdemLosing: 0,
      // Add partnership totals
      partnershipRolling: 0,
      partnershipMoneyInHand: 0,
      // Add cut reduce
      cutReduce: 0,
    };

    const processUser = (user: any) => {
      // Use distributor fields - these would map to actual distributor data
      totals.membershipDeposit += user.membershipDeposit || 0;
      totals.membershipWithdrawal += user.membershipWithdrawal || 0;
      totals.totalWithdrawal += user.totalWithdrawal || 0;
      totals.numberOfMembers += user.numberOfMembers || 1; // Each distributor counts as 1 member
      totals.moneyInHand += user.profile?.balance || 0;
      totals.rollingHoldings += user.rollingHoldings || 0;
      totals.liveRolling += user.live || 0;
      totals.slotRolling += user.slot || 0;
      totals.miniDanpolRolling += user.miniDanpolRolling || 0;
      totals.miniCombinationRolling += user.miniCombinationRolling || 0;
      totals.sportsDanpolRolling += user.sportsDanpolRolling || 0;
      totals.sportsDupolRolling += user.sportsDupolRolling || 0;
      totals.sports3PoleRolling += user.sports3PoleRolling || 0;
      totals.sports4PoleRolling += user.sports4PoleRolling || 0;
      totals.sports5PoleRolling += user.sports5PoleRolling || 0;
      totals.sportsDapolRolling += user.sportsDapolRolling || 0;
      totals.virtualGameRolling += user.virtualGameRolling || 0;
      totals.lotusRolling += user.lotusRolling || 0;
      totals.mgmRolling += user.mgmRolling || 0;
      totals.touchRolling += user.touchRolling || 0;
      totals.holdemRolling += user.hold || 0;
      
      // Add betting/winning calculations
      totals.liveBetting += user.liveBetting || 0;
      totals.liveWinning += user.liveWinning || 0;
      totals.slotBetting += user.slotBetting || 0;
      totals.slotJackpot += user.slotJackpot || 0;
      totals.miniDanpolWinning += user.miniDanpolWinner || 0;
      totals.miniCombinationWinning += user.miniCombinationWinnings || 0;
      totals.miniDanpolBetting += user.miniDanpolBetting || 0;
      totals.miniCombinationBetting += user.miniCombinationBetting || 0;
      totals.sportsDanpolWinning += user.sportsDanpolWinner || 0;
      totals.sportsDupolWinning += user.sportsDupolWinner || 0;
      totals.sports3PoleWinning += user.sports3poleWinner || 0;
      totals.sports4PoleWinning += user.sports4poleWinner || 0;
      totals.sports5PoleWinning += user.sports5poleWinner || 0;
      totals.sportsDapolWinning += user.sportsDapolWinner || 0;
      totals.virtualGameWinning += user.virtualGameWinnings || 0;
      totals.lotusWinning += user.lotusLottery || 0;
      totals.mgmWinning += user.mgmWinning || 0;
      totals.touchWinning += user.touchWinning || 0;
      totals.holdemWinning += user.holdemWinning || 0;
      
      // Add rolling calculations
      totals.rollingRate += user.rollingRate || 0;
      totals.rollingTransition += user.rollingTransition || 0;
      
      // Add losing calculations
      totals.losingRate += user.losingRate || 0;
      totals.losingSettlement += user.losingSettlement || 0;
      totals.liveLosing += user.liveLosingBeDang || 0;
      totals.miniDanpolLosing += 0; // Not available in model
      totals.sportsDanpolLosing += 0; // Not available in model
      totals.sports3PoleLosing += 0; // Not available in model
      totals.sports5PoleLosing += 0; // Not available in model
      totals.virtualGameLosing += 0; // Not available in model
      totals.lotusLosing += 0; // Not available in model
      totals.mgmLosing += 0; // Not available in model
      totals.touchLosing += 0; // Not available in model
      totals.holdemLosing += user.holdLosingBeDang || 0;
      
      // Add partnership calculations
      totals.partnershipRolling += user.partnershipRolling || 0;
      totals.partnershipMoneyInHand += user.partnershipMoneyInHand || 0;
      
      // Add cut reduce
      totals.cutReduce += user.cutReduce || 0;
      
      // Process children recursively
      if (user.children && user.children.length > 0) {
        user.children.forEach((child: any) => processUser(child));
      }
    };

    data.forEach(processUser);
    return totals;
  };

  const columns: TableProps<any>["columns"] = [
    {
      title: t("distributor"),
      dataIndex: "distributor",
      key: "distributor",
      fixed: "left",
      width: 150,
      render: (_, record) => {
        const level = record.profile?.level || 1;
        const name = record.profile?.name || record.userid || "Unknown";
        return (
          <div className="flex items-center gap-2">
            <span className="w-[20px] h-[20px] flex items-center justify-center rounded-full bg-[#1677ff] text-white text-xs">
              {level}
            </span>
            <span className="text-xs text-[white] bg-[#000] px-2 py-1 rounded">
              {name}
            </span>
          </div>
        );
      },
    },
    {
      title: t("deposit/withdraw"),
      children: [
        {
          title: t("membershipDeposit"),
          dataIndex: "membershipDeposit",
          align: "center",
          key: "membershipDeposit",
          render: (value) => formatNumber(value || 0),
        },
        {
          title: t("membershipWithdraw"),
          dataIndex: "membershipWithdrawal",
          align: "center",
          key: "membershipWithdrawal",
          render: (value) => formatNumber(value || 0),
        },
        {
          title: t("depositOfTheTotalAmount"),
          dataIndex: "membershipDeposit",
          align: "center",
          key: "depositOfTheTotalAmount",
          render: (value) => formatNumber(value || 0),
        },
        {
          title: t("totalWithdraw"),
          dataIndex: "totalWithdrawal",
          align: "center",
          key: "totalWithdrawal",
          render: (value) => formatNumber(value || 0),
        },
      ],
    },
    {
      title: t("afflllatedMember"),
      children: [
        {
          title: t("numberOfMembers"),
          dataIndex: "numberOfMembers",
          align: "center",
          key: "numberOfMembers",
          render: (value) => formatNumber(value || 1),
        },
        {
          title: t("moneyInHand"),
          align: "center",
          key: "moneyInHand",
          render: (_, record) => formatNumber(record.profile?.balance || 0),
        },
        {
          title: t("rollingholdings"),
          dataIndex: "rollingHoldings",
          align: "center",
          key: "rollingHoldings",
          render: (value) => formatNumber(value || 0),
        },
        {
          title: t("liveRolling"),
          dataIndex: "live",
          align: "center",
          key: "liveRolling",
          render: (value) => formatNumber(value || 0),
        },
        {
          title: t("slotRolling"),
          dataIndex: "slot",
          align: "center",
          key: "slot",
          render: (value) => formatNumber(value || 0),
        },
        {
          title: t("miniDanpolRolling"),
          align: "center",
          dataIndex: "miniDanpolRolling",
          key: "miniDanpolRolling",
          render: (value) => formatNumber(value || 0),
        },
        {
          title: t("minCombinationRolling"),
          dataIndex: "miniCombinationRolling",
          align: "center",
          key: "miniCombinationRolling",
          render: (value) => formatNumber(value || 0),
        },
      ],
    },
    {
      title: t("betting/winning"),
      children: [
        {
          title: t("liveBetting"),
          dataIndex: "liveBetting",
          align: "center",
          key: "liveBetting",
          render: (value) => formatNumber(value || 0),
        },
        {
          title: t("liveWinning"),
          dataIndex: "liveWinning",
          align: "center",
          key: "liveWinning",
          render: (value) => formatNumber(value || 0),
        },
        {
          title: t("slotBetting"),
          dataIndex: "slotBetting",
          align: "center",
          key: "slotBetting",
          render: (value) => formatNumber(value || 0),
        },
        {
          title: t("slotJackpot"),
          dataIndex: "slotJackpot",
          align: "center",
          key: "slotJackpot",
          render: (value) => formatNumber(value || 0),
        },
        {
          title: t("miniDanpolBetting"),
          dataIndex: "miniDanpolBetting",
          align: "center",
          key: "miniDanpolBetting",
          render: (value) => formatNumber(value || 0),
        },
        {
          title: t("miniDanpolwinner"),
          dataIndex: "miniDanpolWinner",
          align: "center",
          key: "miniDanpolWinning",
          render: (value) => formatNumber(value || 0),
        },
        {
          title: t("miniCombinationBetting"),
          dataIndex: "miniCombinationBetting",
          align: "center",
          key: "miniCombinationBetting",
          render: (value) => formatNumber(value || 0),
        },
        {
          title: t("miniCombinationWinnings"),
          dataIndex: "miniCombinationWinnings",
          align: "center",
          key: "miniCombinationWinning",
          render: (value) => formatNumber(value || 0),
        },
      ],
    },
    {
      title: t("rolling"),
      children: [
        {
          title: t("ratePercentage"),
          dataIndex: "rollingRate",
          align: "center",
          key: "rollingRate",
          render: (value) => formatNumber(value || 0),
        },
        {
          title: t("rollingtransition"),
          dataIndex: "rollingTransition",
          align: "center",
          key: "rollingTransition",
          render: (value) => formatNumber(value || 0),
        },
        {
          title: t("live"),
          dataIndex: "live",
          align: "center",
          key: "liveRolling",
          render: (value) => formatNumber(value || 0),
        },
        {
          title: t("slot"),
          dataIndex: "slot",
          align: "center",
          key: "slotRolling",
          render: (value) => formatNumber(value || 0),
        },
        {
          title: t("miniDanpol"),
          dataIndex: "miniDanpolRolling",
          align: "center",
          key: "miniDanpolRolling",
          render: (value) => formatNumber(value || 0),
        },
        {
          title: t("minicombination"),
          dataIndex: "miniCombinationRolling",
          align: "center",
          key: "miniCombinationRolling",
          render: (value) => formatNumber(value || 0),
        },
      ],
    },
    {
      title: t("partnership"),
      children: [
        {
          title: t("rolling"),
          dataIndex: "partnershipRolling",
          align: "center",
          key: "partnershipRolling",
          render: (value) => formatNumber(value || 0),
        },
        {
          title: t("moneyInHand"),
          dataIndex: "partnershipMoneyInHand",
          align: "center",
          key: "partnershipMoneyInHand",
          render: (value) => formatNumber(value || 0),
        }
      ],
    },
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

  // Add expand functionality like in distributor page
  const onExpand = (expanded: boolean, record: any) => {
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

  useEffect(() => {
    setUsers(
      data?.response?.users?.map((u: any) => {
        return { ...u, key: u.id };
      }) ?? []
    );
    setTotal(data?.response?.total);
  }, [data]);

  useEffect(() => {
    const treeData = buildTree(users ?? []);
    setTreeUsers(treeData);
    setTotals(calculateTotals(treeData));
  }, [users]);

  useEffect(() => {
    refetch({
      filters: tableOptions?.filters || [],
      orders: tableOptions?.orders || [],
      pagination: tableOptions?.pagination || { limit: 25, offset: 0 },
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

    <Table<any>
      columns={columns}
      loading={loading}
      dataSource={treeUsers ?? []}
      className="w-full"
      size="small"
      bordered
      scroll={{ x: "max-content" }}
      onChange={onChange}
      expandable={{
        onExpand,
      }}
      // summary={() => (
      //   <Table.Summary>
      //     <Table.Summary.Row style={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>
      //       <Table.Summary.Cell index={0} className="font-bold bg-gray-100 text-center">
      //         {t("total")}
      //       </Table.Summary.Cell>
      //       <Table.Summary.Cell index={1} className="font-bold bg-gray-100 text-center">
      //         {f.number(totals.membershipWithdrawal || 0)}
      //       </Table.Summary.Cell>
      //       <Table.Summary.Cell index={2} className="font-bold bg-gray-100 text-center">
      //         {f.number(totals.totalWithdrawal || 0)}
      //       </Table.Summary.Cell>
      //       <Table.Summary.Cell index={3} className="font-bold bg-gray-100 text-center">
      //         {f.number(totals.numberOfMembers || 0)}
      //       </Table.Summary.Cell>
      //       <Table.Summary.Cell index={4} className="font-bold bg-gray-100 text-center">
      //         {f.number(totals.moneyInHand || 0)}
      //       </Table.Summary.Cell>
      //       <Table.Summary.Cell index={5} className="font-bold bg-gray-100 text-center">
      //         {f.number(totals.slotRolling || 0)}
      //       </Table.Summary.Cell>
      //       <Table.Summary.Cell index={6} className="font-bold bg-gray-100 text-center">
      //         {f.number(totals.miniCombinationRolling || 0)}
      //       </Table.Summary.Cell>
      //       <Table.Summary.Cell index={7} className="font-bold bg-gray-100 text-center">
      //         {f.number(totals.sportsDupolRolling || 0)}
      //       </Table.Summary.Cell>
      //       <Table.Summary.Cell index={8} className="font-bold bg-gray-100 text-center">
      //         {f.number(totals.sports4PoleRolling || 0)}
      //       </Table.Summary.Cell>
      //       <Table.Summary.Cell index={9} className="font-bold bg-gray-100 text-center">
      //         {f.number(totals.sportsDapolRolling || 0)}
      //       </Table.Summary.Cell>
      //       <Table.Summary.Cell index={10} className="font-bold bg-gray-100 text-center">
      //         {f.number(totals.virtualGameRolling || 0)}
      //       </Table.Summary.Cell>
      //       <Table.Summary.Cell index={11} className="font-bold bg-gray-100 text-center">
      //         {f.number(totals.lotusRolling || 0)}
      //       </Table.Summary.Cell>
      //       <Table.Summary.Cell index={12} className="font-bold bg-gray-100 text-center">
      //         {f.number(totals.mgmRolling || 0)}
      //       </Table.Summary.Cell>
      //       <Table.Summary.Cell index={13} className="font-bold bg-gray-100 text-center">
      //         {f.number(totals.touchRolling || 0)}
      //       </Table.Summary.Cell>
      //       <Table.Summary.Cell index={14} className="font-bold bg-gray-100 text-center">
      //         {f.number(totals.holdemRolling || 0)}
      //       </Table.Summary.Cell>
      //       <Table.Summary.Cell index={14} className="font-bold bg-gray-100 text-center">
      //         0
      //       </Table.Summary.Cell>
      //       <Table.Summary.Cell index={14} className="font-bold bg-gray-100 text-center">
      //         0
      //       </Table.Summary.Cell>
      //       <Table.Summary.Cell index={14} className="font-bold bg-gray-100 text-center">
      //         0
      //       </Table.Summary.Cell>
      //       <Table.Summary.Cell index={14} className="font-bold bg-gray-100 text-center">
      //         0
      //       </Table.Summary.Cell>
      //       <Table.Summary.Cell index={14} className="font-bold bg-gray-100 text-center">
      //         0
      //       </Table.Summary.Cell>
      //       <Table.Summary.Cell index={14} className="font-bold bg-gray-100 text-center">
      //         0
      //       </Table.Summary.Cell>
      //       <Table.Summary.Cell index={14} className="font-bold bg-gray-100 text-center">
      //         0
      //       </Table.Summary.Cell>
      //       <Table.Summary.Cell index={14} className="font-bold bg-gray-100 text-center">
      //         0
      //       </Table.Summary.Cell>
      //       <Table.Summary.Cell index={14} className="font-bold bg-gray-100 text-center">
      //         0
      //       </Table.Summary.Cell>
      //       <Table.Summary.Cell index={14} className="font-bold bg-gray-100 text-center">
      //         0
      //       </Table.Summary.Cell>
      //       <Table.Summary.Cell index={14} className="font-bold bg-gray-100 text-center">
      //         0
      //       </Table.Summary.Cell>
      //       <Table.Summary.Cell index={14} className="font-bold bg-gray-100 text-center">
      //         0
      //       </Table.Summary.Cell>
      //       <Table.Summary.Cell index={14} className="font-bold bg-gray-100 text-center">
      //         0
      //       </Table.Summary.Cell>
      //       <Table.Summary.Cell index={14} className="font-bold bg-gray-100 text-center">
      //         0
      //       </Table.Summary.Cell>
      //       <Table.Summary.Cell index={14} className="font-bold bg-gray-100 text-center">
      //         0
      //       </Table.Summary.Cell>
      //       <Table.Summary.Cell index={14} className="font-bold bg-gray-100 text-center">
      //         0
      //       </Table.Summary.Cell>
      //       <Table.Summary.Cell index={14} className="font-bold bg-gray-100 text-center">
      //         0
      //       </Table.Summary.Cell>
      //       <Table.Summary.Cell index={14} className="font-bold bg-gray-100 text-center">
      //         0
      //       </Table.Summary.Cell>
      //       <Table.Summary.Cell index={14} className="font-bold bg-gray-100 text-center">
      //         0
      //       </Table.Summary.Cell>
      //     </Table.Summary.Row>
      //   </Table.Summary>
      // )}
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
