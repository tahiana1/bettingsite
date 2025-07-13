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
import { GET_DISTRIBUTORS } from "@/actions/user";
import { RxLetterCaseToggle } from "react-icons/rx";
import { Dayjs } from "dayjs";
import { isValidDate, parseTableOptions, buildTree } from "@/lib";

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
  const { loading, data, refetch } = useQuery(GET_DISTRIBUTORS, {
    variables: {
      filters: tableOptions?.filters || [],
      orders: tableOptions?.orders || [],
      pagination: tableOptions?.pagination || { limit: 25, offset: 0 },
    },
    fetchPolicy: "cache-and-network",
  });

  const { data: childrenData, refetch: refetchChildren } = useQuery(GET_DISTRIBUTORS);

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
      miniDanpolWinning: 0,
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
      totals.miniDanpolWinning += user.miniDanpolWinning || 0;
      totals.miniCombinationWinning += user.miniCombinationWinning || 0;
      totals.sportsDanpolWinning += user.sportsDanpolWinning || 0;
      totals.sportsDupolWinning += user.sportsDupolWinning || 0;
      totals.sports3PoleWinning += user.sports3PoleWinning || 0;
      totals.sports4PoleWinning += user.sports4PoleWinning || 0;
      totals.sports5PoleWinning += user.sports5PoleWinning || 0;
      totals.sportsDapolWinning += user.sportsDapolWinning || 0;
      totals.virtualGameWinning += user.virtualGameWinning || 0;
      totals.lotusWinning += user.lotusWinning || 0;
      totals.mgmWinning += user.mgmWinning || 0;
      totals.touchWinning += user.touchWinning || 0;
      totals.holdemWinning += user.holdemWinning || 0;
      
      // Add rolling calculations
      totals.rollingRate += user.rollingRate || 0;
      totals.rollingTransition += user.rollingTransition || 0;
      
      // Add losing calculations
      totals.losingRate += user.losingRate || 0;
      totals.losingSettlement += user.losingSettlement || 0;
      totals.liveLosing += user.liveLosing || 0;
      totals.miniDanpolLosing += user.miniDanpolLosing || 0;
      totals.sportsDanpolLosing += user.sportsDanpolLosing || 0;
      totals.sports3PoleLosing += user.sports3PoleLosing || 0;
      totals.sports5PoleLosing += user.sports5PoleLosing || 0;
      totals.virtualGameLosing += user.virtualGameLosing || 0;
      totals.lotusLosing += user.lotusLosing || 0;
      totals.mgmLosing += user.mgmLosing || 0;
      totals.touchLosing += user.touchLosing || 0;
      totals.holdemLosing += user.holdemLosing || 0;
      
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
          align: "center",
          children: [
            {
              title: t("membershipWithdraw"),
              dataIndex: "membershipWithdrawal",
              align: "center",
              key: "membershipWithdrawal",
              render: (value) => f.number(value || 0),
            },
          ],
        },
        {
          title: t("depositOfTheTotalAmount"),
          align: "center",
          children: [
            {
              title: t("totalWithdraw"),
              dataIndex: "totalWithdrawal",
              align: "center",
              key: "totalWithdrawal",
              render: (value) => f.number(value || 0),
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
          dataIndex: "numberOfMembers",
          align: "center",
          key: "numberOfMembers",
          render: (value) => f.number(value || 1),
        },
        {
          title: t("moneyInHand"),
          align: "center",
          children: [
            {
              title: t("rollingholdings"),
              dataIndex: "profile",
              align: "center",
              key: "balance",
              render: (profile) => f.number(profile?.balance || 0),
            },
          ],
        },
        {
          title: t("liveRolling"),
          align: "center",
          children: [
            {
              title: t("slotRolling"),
              dataIndex: "slot",
              align: "center",
              key: "slot",
              render: (value) => f.number(value || 0),
            },
          ],
        },
        {
          title: t("miniDanpolRolling"),
          align: "center",
          children: [
            {
              title: t("minCombinationRolling"),
              dataIndex: "miniCombinationRolling",
              align: "center",
              key: "miniCombinationRolling",
              render: (value) => f.number(value || 0),
            },
          ],
        },
        {
          title: t("sportsDanpololRolling"),
          align: "center",
          children: [
            {
              title: t("sportsDupolRolling"),
              dataIndex: "sportsDupolRolling",
              align: "center",
              key: "sportsDupolRolling",
              render: (value) => f.number(value || 0),
            },
          ],
        },
        {
          title: t("sports3PoleRolling"),
          align: "center",
          children: [
            {
              title: t("sports4PoleRolling"),
              dataIndex: "sports4PoleRolling",
              align: "center",
              key: "sports4PoleRolling",
              render: (value) => f.number(value || 0),
            },
          ],
        },
        {
          title: t("sports5PoleRolling"),
          align: "center",
          children: [
            {
              title: t("sportsDapololling"),
              dataIndex: "sportsDapolRolling",
              align: "center",
              key: "sportsDapolRolling",
              render: (value) => f.number(value || 0),
            },
          ],
        },
        {
          title: t("virtualGameRolling"),
          dataIndex: "virtualGameRolling",
          align: "center",
          key: "virtualGameRolling",
          render: (value) => f.number(value || 0),
        },
        {
          title: t("lotusRolling"),
          dataIndex: "lotusRolling",
          align: "center",
          key: "lotusRolling",
          render: (value) => f.number(value || 0),
        },
        {
          title: t("mgmRolling"),
          dataIndex: "mgmRolling",
          align: "center",
          key: "mgmRolling",
          render: (value) => f.number(value || 0),
        },
        {
          title: t("touchRolling"),
          dataIndex: "touchRolling",
          align: "center",
          key: "touchRolling",
          render: (value) => f.number(value || 0),
        },
                  {
            title: t("holdemRolling"),
            dataIndex: "hold",
            align: "center",
            key: "hold",
            render: (value) => f.number(value || 0),
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
              dataIndex: "liveWinning",
              align: "center",
              key: "liveWinning",
              render: (value) => f.number(value || 0),
            },
          ],
        },
        {
          title: t("slotBetting"),
          align: "center",
          children: [
            {
              title: t("slotJackpot"),
              dataIndex: "slotJackpot",
              align: "center",
              key: "slotJackpot",
              render: (value) => f.number(value || 0),
            },
          ],
        },
        {
          title: t("miniDanpolBetting"),
          align: "center",
          children: [
            {
              title: t("miniDanpolwinner"),
              dataIndex: "miniDanpolWinning",
              align: "center",
              key: "miniDanpolWinning",
              render: (value) => f.number(value || 0),
            },
          ],
        },
        {
          title: t("miniCombinationBetting"),
          align: "center",
          children: [
            {
              title: t("miniCombinationWinnings"),
              dataIndex: "miniCombinationWinning",
              align: "center",
              key: "miniCombinationWinning",
              render: (value) => f.number(value || 0),
            },
          ],
        },
        {
          title: t("sportsDanpolBetting"),
          align: "center",
          children: [
            {
              title: t("sportsDanpolWinner"),
              dataIndex: "sportsDanpolWinning",
              align: "center",
              key: "sportsDanpolWinning",
              render: (value) => f.number(value || 0),
            },
          ],
        },
        {
          title: t("sportsDupolBetting"),
          align: "center",
          children: [
            {
              title: t("sportsDupolWinner"),
              dataIndex: "sportsDupolWinning",
              align: "center",
              key: "sportsDupolWinning",
              render: (value) => f.number(value || 0),
            },
          ],
        },
        {
          title: t("sports3poleBetting"),
          align: "center",
          children: [
            {
              title: t("sports3poleWinner"),
              dataIndex: "sports3PoleWinning",
              align: "center",
              key: "sports3PoleWinning",
              render: (value) => f.number(value || 0),
            },
          ],
        },
        {
          title: t("sports4poleBetting"),
          align: "center",
          children: [
            {
              title: t("sports4poleWinner"),
              dataIndex: "sports4PoleWinning",
              align: "center",
              key: "sports4PoleWinning",
              render: (value) => f.number(value || 0),
            },
          ],
        },
        {
          title: t("sports5poleBetting"),
          align: "center",
          children: [
            {
              title: t("sports5poleWinner"),
              dataIndex: "sports5PoleWinning",
              align: "center",
              key: "sports5PoleWinning",
              render: (value) => f.number(value || 0),
            },
          ],
        },
        {
          title: t("sportsDapolBetting"),
          align: "center",
          children: [
            {
              title: t("sportsDapolWinner"),
              dataIndex: "sportsDapolWinning",
              align: "center",
              key: "sportsDapolWinning",
              render: (value) => f.number(value || 0),
            },
          ],
        },
        {
          title: t("virtualGameBetting"),
          align: "center",
          children: [
            {
              title: t("virtualGameWinnings"),
              dataIndex: "virtualGameWinning",
              align: "center",
              key: "virtualGameWinning",
              render: (value) => f.number(value || 0),
            },
          ],
        },
        {
          title: t("lotusBetting"),
          align: "center",
          children: [
            {
              title: t("lotusLottery"),
              dataIndex: "lotusWinning",
              align: "center",
              key: "lotusWinning",
              render: (value) => f.number(value || 0),
            },
          ],
        },
        {
          title: t("mgmBetting"),
          align: "center",
          children: [
            {
              title: t("mgmWinning"),
              dataIndex: "mgmWinning",
              align: "center",
              key: "mgmWinning",
              render: (value) => f.number(value || 0),
            },
          ],
        },
        {
          title: t("touchBetting"),
          align: "center",
          children: [
            {
              title: t("touchWinning"),
              dataIndex: "touchWinning",
              align: "center",
              key: "touchWinning",
              render: (value) => f.number(value || 0),
            },
          ],
        },
        {
          title: t("holdemBetting"),
          align: "center",
          children: [
            {
              title: t("holdemWinning"),
              dataIndex: "holdemWinning",
              align: "center",
              key: "holdemWinning",
              render: (value) => f.number(value || 0),
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
              dataIndex: "rollingTransition",
              align: "center",
              key: "rollingTransition",
              render: (value) => f.number(value || 0),
            },
          ],
        },
        {
          title: t("live"),
          align: "center",
          children: [
            {
              title: t("slot"),
              dataIndex: "liveRolling",
              align: "center",
              key: "liveRolling",
              render: (value) => f.number(value || 0),
            },
          ],
        },
        {
          title: t("miniDanpol"),
          align: "center",
          children: [
            {
              title: t("minicombination"),
              dataIndex: "miniDanpolRolling",
              align: "center",
              key: "miniDanpolRolling",
              render: (value) => f.number(value || 0),
            },
          ],
        },
        {
          title: t("sportsDanpol"),
          align: "center",
          children: [
            {
              title: t("sportsDupol"),
              dataIndex: "sportsDanpolRolling",
              align: "center",
              key: "sportsDanpolRolling",
              render: (value) => f.number(value || 0),
            },
          ],
        },
        {
          title: t("sports3Pole"),
          align: "center",
          children: [
            {
              title: t("sports4Pole"),
              dataIndex: "sports3PoleRolling",
              align: "center",
              key: "sports3PoleRolling",
              render: (value) => f.number(value || 0),
            },
          ],
        },
        {
          title: t("sports5Pole"),
          align: "center",
          children: [
            {
              title: t("sportsDapol"),
              dataIndex: "sports5PoleRolling",
              align: "center",
              key: "sports5PoleRolling",
              render: (value) => f.number(value || 0),
            },
          ],
        },
        {
          title: t("virtualGame"),
          dataIndex: "virtualGameRolling",
          align: "center",
          key: "virtualGameRolling",
          render: (value) => f.number(value || 0),
        },
        {
          title: t("lotus"),
          dataIndex: "lotusRolling",
          align: "center",
          key: "lotusRolling",
          render: (value) => f.number(value || 0),
        },
        {
          title: t("mgm"),
          dataIndex: "mgmRolling",
          align: "center",
          key: "mgmRolling",
          render: (value) => f.number(value || 0),
        },
        {
          title: t("touch"),
          dataIndex: "touchRolling",
          align: "center",
          key: "touchRolling",
          render: (value) => f.number(value || 0),
        },
        {
          title: t("holdem"),
          dataIndex: "holdemRolling",
          align: "center",
          key: "holdemRolling",
          render: (value) => f.number(value || 0),
        },
        {
          title: t("cutReduce"),
          align: "center",
          dataIndex: "cutReduce",
          key: "cutReduce",
          render: (value) => f.number(value || 0),
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
              dataIndex: "losingSettlement",
              align: "center",
              key: "losingSettlement",
              render: (value) => f.number(value || 0),
            },
          ],
        },
        {
          title: t("live"),
          align: "center",
          children: [
            {
              title: t("slot"),
              dataIndex: "liveLosing",
              align: "center",
              key: "liveLosing",
              render: (value) => f.number(value || 0),
            },
          ],
        },
        {
          title: t("miniDanpol"),
          align: "center",
          children: [
            {
              title: t("minicombination"),
              dataIndex: "miniDanpolLosing",
              align: "center",
              key: "miniDanpolLosing",
              render: (value) => f.number(value || 0),
            },
          ],
        },
        {
          title: t("sportsDanpol"),
          align: "center",
          children: [
            {
              title: t("sportsDupol"),
              dataIndex: "sportsDanpolLosing",
              align: "center",
              key: "sportsDanpolLosing",
              render: (value) => f.number(value || 0),
            },
          ],
        },
        {
          title: t("sports3Pole"),
          align: "center",
          children: [
            {
              title: t("sports4Pole"),
              dataIndex: "sports3PoleLosing",
              align: "center",
              key: "sports3PoleLosing",
              render: (value) => f.number(value || 0),
            },
          ],
        },
        {
          title: t("sports5Pole"),
          align: "center",
          children: [
            {
              title: t("sportsDapol"),
              dataIndex: "sports5PoleLosing",
              align: "center",
              key: "sports5PoleLosing",
              render: (value) => f.number(value || 0),
            },
          ],
        },
        {
          title: t("virtualGame"),
          dataIndex: "virtualGameLosing",
          align: "center",
          key: "virtualGameLosing",
          render: (value) => f.number(value || 0),
        },
        {
          title: t("lotus"),
          dataIndex: "lotusLosing",
          align: "center",
          key: "lotusLosing",
          render: (value) => f.number(value || 0),
        },
        {
          title: t("mgm"),
          dataIndex: "mgmLosing",
          align: "center",
          key: "mgmLosing",
          render: (value) => f.number(value || 0),
        },
        {
          title: t("touch"),
          dataIndex: "touchLosing",
          align: "center",
          key: "touchLosing",
          render: (value) => f.number(value || 0),
        },
        {
          title: t("holdem"),
          dataIndex: "holdemLosing",
          align: "center",
          key: "holdemLosing",
          render: (value) => f.number(value || 0),
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
              dataIndex: "partnershipMoneyInHand",
              align: "center",
              key: "partnershipMoneyInHand",
              render: (value) => f.number(value || 0),
            },
          ],
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
      summary={() => (
        <Table.Summary>
          <Table.Summary.Row style={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>
            <Table.Summary.Cell index={0} className="font-bold bg-gray-100 text-center">
              {t("total")}
            </Table.Summary.Cell>
            <Table.Summary.Cell index={1} className="font-bold bg-gray-100 text-center">
              {f.number(totals.membershipWithdrawal || 0)}
            </Table.Summary.Cell>
            <Table.Summary.Cell index={2} className="font-bold bg-gray-100 text-center">
              {f.number(totals.totalWithdrawal || 0)}
            </Table.Summary.Cell>
            <Table.Summary.Cell index={3} className="font-bold bg-gray-100 text-center">
              {f.number(totals.numberOfMembers || 0)}
            </Table.Summary.Cell>
            <Table.Summary.Cell index={4} className="font-bold bg-gray-100 text-center">
              {f.number(totals.moneyInHand || 0)}
            </Table.Summary.Cell>
            <Table.Summary.Cell index={5} className="font-bold bg-gray-100 text-center">
              {f.number(totals.slotRolling || 0)}
            </Table.Summary.Cell>
            <Table.Summary.Cell index={6} className="font-bold bg-gray-100 text-center">
              {f.number(totals.miniCombinationRolling || 0)}
            </Table.Summary.Cell>
            <Table.Summary.Cell index={7} className="font-bold bg-gray-100 text-center">
              {f.number(totals.sportsDupolRolling || 0)}
            </Table.Summary.Cell>
            <Table.Summary.Cell index={8} className="font-bold bg-gray-100 text-center">
              {f.number(totals.sports4PoleRolling || 0)}
            </Table.Summary.Cell>
            <Table.Summary.Cell index={9} className="font-bold bg-gray-100 text-center">
              {f.number(totals.sportsDapolRolling || 0)}
            </Table.Summary.Cell>
            <Table.Summary.Cell index={10} className="font-bold bg-gray-100 text-center">
              {f.number(totals.virtualGameRolling || 0)}
            </Table.Summary.Cell>
            <Table.Summary.Cell index={11} className="font-bold bg-gray-100 text-center">
              {f.number(totals.lotusRolling || 0)}
            </Table.Summary.Cell>
            <Table.Summary.Cell index={12} className="font-bold bg-gray-100 text-center">
              {f.number(totals.mgmRolling || 0)}
            </Table.Summary.Cell>
            <Table.Summary.Cell index={13} className="font-bold bg-gray-100 text-center">
              {f.number(totals.touchRolling || 0)}
            </Table.Summary.Cell>
            <Table.Summary.Cell index={14} className="font-bold bg-gray-100 text-center">
              {f.number(totals.holdemRolling || 0)}
            </Table.Summary.Cell>
            <Table.Summary.Cell index={14} className="font-bold bg-gray-100 text-center">
              0
            </Table.Summary.Cell>
            <Table.Summary.Cell index={14} className="font-bold bg-gray-100 text-center">
              0
            </Table.Summary.Cell>
            <Table.Summary.Cell index={14} className="font-bold bg-gray-100 text-center">
              0
            </Table.Summary.Cell>
            <Table.Summary.Cell index={14} className="font-bold bg-gray-100 text-center">
              0
            </Table.Summary.Cell>
            <Table.Summary.Cell index={14} className="font-bold bg-gray-100 text-center">
              0
            </Table.Summary.Cell>
            <Table.Summary.Cell index={14} className="font-bold bg-gray-100 text-center">
              0
            </Table.Summary.Cell>
            <Table.Summary.Cell index={14} className="font-bold bg-gray-100 text-center">
              0
            </Table.Summary.Cell>
            <Table.Summary.Cell index={14} className="font-bold bg-gray-100 text-center">
              0
            </Table.Summary.Cell>
            <Table.Summary.Cell index={14} className="font-bold bg-gray-100 text-center">
              0
            </Table.Summary.Cell>
            <Table.Summary.Cell index={14} className="font-bold bg-gray-100 text-center">
              0
            </Table.Summary.Cell>
            <Table.Summary.Cell index={14} className="font-bold bg-gray-100 text-center">
              0
            </Table.Summary.Cell>
            <Table.Summary.Cell index={14} className="font-bold bg-gray-100 text-center">
              0
            </Table.Summary.Cell>
            <Table.Summary.Cell index={14} className="font-bold bg-gray-100 text-center">
              0
            </Table.Summary.Cell>
            <Table.Summary.Cell index={14} className="font-bold bg-gray-100 text-center">
              0
            </Table.Summary.Cell>
            <Table.Summary.Cell index={14} className="font-bold bg-gray-100 text-center">
              0
            </Table.Summary.Cell>
            <Table.Summary.Cell index={14} className="font-bold bg-gray-100 text-center">
              0
            </Table.Summary.Cell>
            <Table.Summary.Cell index={14} className="font-bold bg-gray-100 text-center">
              0
            </Table.Summary.Cell>
            <Table.Summary.Cell index={14} className="font-bold bg-gray-100 text-center">
              0
            </Table.Summary.Cell>
            <Table.Summary.Cell index={14} className="font-bold bg-gray-100 text-center">
              0
            </Table.Summary.Cell>
            <Table.Summary.Cell index={14} className="font-bold bg-gray-100 text-center">
              0
            </Table.Summary.Cell>
            <Table.Summary.Cell index={14} className="font-bold bg-gray-100 text-center">
              0
            </Table.Summary.Cell>
            
            <Table.Summary.Cell index={14} className="font-bold bg-gray-100 text-center">
              0
            </Table.Summary.Cell>
            <Table.Summary.Cell index={14} className="font-bold bg-gray-100 text-center">
              0
            </Table.Summary.Cell>
            <Table.Summary.Cell index={14} className="font-bold bg-gray-100 text-center">
              0
            </Table.Summary.Cell>
            <Table.Summary.Cell index={14} className="font-bold bg-gray-100 text-center">
              0
            </Table.Summary.Cell>
            <Table.Summary.Cell index={14} className="font-bold bg-gray-100 text-center">
              0
            </Table.Summary.Cell>
            <Table.Summary.Cell index={14} className="font-bold bg-gray-100 text-center">
              0
            </Table.Summary.Cell>
            <Table.Summary.Cell index={14} className="font-bold bg-gray-100 text-center">
              0
            </Table.Summary.Cell>
            <Table.Summary.Cell index={14} className="font-bold bg-gray-100 text-center">
              0
            </Table.Summary.Cell>
            <Table.Summary.Cell index={14} className="font-bold bg-gray-100 text-center">
              0
            </Table.Summary.Cell>
            <Table.Summary.Cell index={14} className="font-bold bg-gray-100 text-center">
              0
            </Table.Summary.Cell>
            <Table.Summary.Cell index={14} className="font-bold bg-gray-100 text-center">
              0
            </Table.Summary.Cell>
            <Table.Summary.Cell index={14} className="font-bold bg-gray-100 text-center">
              0
            </Table.Summary.Cell>
            <Table.Summary.Cell index={14} className="font-bold bg-gray-100 text-center">
              0
            </Table.Summary.Cell>
            <Table.Summary.Cell index={14} className="font-bold bg-gray-100 text-center">
              0
            </Table.Summary.Cell>
            <Table.Summary.Cell index={14} className="font-bold bg-gray-100 text-center">
              0
            </Table.Summary.Cell>
            <Table.Summary.Cell index={14} className="font-bold bg-gray-100 text-center">
              0
            </Table.Summary.Cell>
            <Table.Summary.Cell index={14} className="font-bold bg-gray-100 text-center">
              0
            </Table.Summary.Cell>
            <Table.Summary.Cell index={14} className="font-bold bg-gray-100 text-center">
              0
            </Table.Summary.Cell>
          </Table.Summary.Row>
        </Table.Summary>
      )}
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
