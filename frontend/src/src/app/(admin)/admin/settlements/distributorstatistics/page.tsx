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

const DistributorStatisticsPage: React.FC = () => {
  const t = useTranslations();
  const f = useFormatter();
  const [tableOptions, setTableOptions] = useState<any>({
  });

  const [total, setTotal] = useState<number>(0);
  const [users, setUsers] = useState<any[]>([]);
  const [treeUsers, setTreeUsers] = useState<any[]>([]);
  const { loading, data, refetch } = useQuery(GET_DISTRIBUTORS);

  const { data: childrenData, refetch: refetchChildren } = useQuery(GET_DISTRIBUTORS);

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
      dataIndex: "member_count",
      key: "member_count",
      width: 120,
      render: (_, record) => {
        // Count children in the tree or use profile comp as placeholder
        const childCount = record.children?.length || 0;
        return childCount > 0 ? childCount : (record.profile?.comp || 0);
      },
    },
    {
      title: t("domain"),
      dataIndex: "site",
      key: "site",
      width: 100,
      render: (text) => text ?? "",
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
      dataIndex: "deposit",
      key: "deposit",
      width: 80,
      render: () => 0,
    },
    {
      title: t("withdraw"),
      dataIndex: "withdrawal",
      key: "withdrawal",
      width: 80,
      render: () => 0,
    },
    {
      title: t("entry/exit"),
      key: "entry_exit",
      width: 120,
      render: (_, record) => 0,
    },
    {
      title: t("bet"),
      dataIndex: "bet",
      key: "bet",
      width: 80,
      render: () => 0,
    },
    {
      title: t("winner"),
      dataIndex: "winner",
      key: "winner",
      width: 80,
      render: () => 0,
    },
    {
      title: t("bedang"),
      dataIndex: "bedang",
      key: "bedang",
      width: 80,
      render: () => 0,
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
    {
      title: t("rollingGold"),
      key: "rollingGold",
      width: 120,
      render: (_, record) => 0,
    },
    
    {
      title: t("rollingTransaction"),
      key: "rollingTransaction",
      width: 120,
      render: (_, record) => 0,
    },

    {
      title: t("lossingRate"),
      dataIndex: "user",
      key: "user",
      width: 150,
      render: (_, record) => {
        // Use actual user losing/rolling data from the record
        const live = record.entireLosing || 0;
        const slot = record.liveLosingBeDang || 0;
        const hold = record.holdLosingBeDang || 0;
        const rate = `${live}/${slot}/${hold}/0/0/0/0/0/0`;
        return <span className="text-xs font-mono">{rate}</span>;
      },
    },

    {
      title: t("settlementAmount"),
      key: "settlementAmount",
      width: 120,
      render: (_, record) => 0,
    },

    {
      title: t("datePeriod"),
      key: "datePeriod",
      width: 120,
      render: (_, record) => 0,
    },

    {
      title: t("processStatus"),
      key: "processStatus",
      width: 120,
      render: (_, record) => t("waiting"),
    },
    {
      title: t("viewDetails"),
      key: "viewDetails",
      width: 120,
      render: (_, record) => {
        return (
          <div className="flex gap-1">
            <Button size="small" type="primary" className="bg-red-500 text-white">
              {t("rolling")}
            </Button>
            <Button size="small" type="default" className="bg-blue-500 text-white">
              {t("losing")}
            </Button>
          </div>
        );
      },
    },
    {
      title: t("losingSettlement"),
      key: "losingSettlement",
      width: 120,
      render: (_, record) => {
        return (
          <div className="flex gap-1">
            <Button size="small" type="primary" className="bg-red-500 text-white">
              {t("losingSettlement")}
            </Button>
          </div>
        );
      },
    },
  ];

  const onChange: TableProps<any>["onChange"] = (
    pagination,
    filters,
    sorter,
    extra
  ) => {
    setTableOptions(parseTableOptions(pagination, filters, sorter, extra));
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
    refetch(tableOptions ?? undefined);
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
