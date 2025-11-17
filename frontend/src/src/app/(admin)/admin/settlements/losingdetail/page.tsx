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
import { FILTER_TRANSACTIONS, GET_WEEK_LOSING_DATA } from "@/actions/transaction";
import { RxLetterCaseToggle } from "react-icons/rx";
import { Dayjs } from "dayjs";
import { isValidDate, parseTableOptions, formatNumber } from "@/lib";

const LosingDeailsPage: React.FC = () => {
  const t = useTranslations();
  const f = useFormatter();
  const [tableOptions, setTableOptions] = useState<any>({
    filters: [
      {
        field: "transactions.amount",
        value: 0,
        op: "lt",
      },
    ],
    pagination: { limit: 25, offset: 0 },
  });

  const [searchFilters, setSearchFilters] = useState<any[]>([]);

  const [total, setTotal] = useState<number>(0);
  const [weeklyData, setWeeklyData] = useState<any[]>([]);

  // Combine search filters with table options filters
  const getAllFilters = () => {
    const baseFilters = [
      {
        field: "transactions.amount",
        value: 0,
        op: "lt",
      },
    ];
    const tableFilters = tableOptions?.filters || [];
    return [...baseFilters, ...tableFilters, ...searchFilters];
  };

  const { loading, data, refetch } = useQuery(GET_WEEK_LOSING_DATA, {
    variables: {
      filters: getAllFilters(),
      orders: tableOptions?.orders || [],
      pagination: tableOptions?.pagination || { limit: 25, offset: 0 },
    },
    fetchPolicy: "cache-and-network",
  });

  const columns: TableProps<any>["columns"] = [
    {
      title: t("number"),
      dataIndex: "number",
      key: "number",
      fixed: "left",
      render: (text, record, index) => index + 1,
    },
    {
      title: t("site"),
      dataIndex: "site",
      key: "site",
      render: (text) => text ?? "site",
    },
    {
      title: t("distributorID"),
      dataIndex: "distributorID",
      key: "distributorID",
      render: (_, record) => {
        return <div className="flex items-center">
          <p className="w-[15px] h-[15px] flex items-center justify-center rounded-full bg-[#1677ff] text-white text-xs">{record.distributorLevel}</p>
          <p className="text-xs text-[white] bg-[#000] px-1 py-0.5 rounded">{record.distributorName}</p>
        </div>
      },
    },
    {
      title: t("nickname"),
      dataIndex: "nickname",
      key: "nickname",
      render: (_, record) => {
        return record.nickname;
      },
    },
    {
      title: t("depositor"),
      dataIndex: "depositor",
      key: "depositor",
    },
    {
      title: t("alias"),
      dataIndex: "alias",
      key: "alias",
    },
    {
      title: t("from"),
      dataIndex: "weekStart",
      key: "weekStart",
      render: (text) => text ? new Date(text).toLocaleDateString() : "",
    },
    {
      title: t("until"),
      dataIndex: "weekEnd",
      key: "weekEnd",
      render: (text) => text ? new Date(text).toLocaleDateString() : "",
    },
    {
      title: t("bet"),
      dataIndex: "totalBet",
      key: "totalBet",
      render: (text) => formatNumber(text || 0),
    },
    {
      title: t("winner"),
      dataIndex: "totalWinner",
      key: "totalWinner",
      render: (text) => formatNumber(text || 0),
    },
    {
      title: t("losingMoney"),
      dataIndex: "totalLosingMoney",
      key: "totalLosingMoney",
      render: (text) => formatNumber(text || 0),
    },
    {
      title: t("settlementAmount"),
      dataIndex: "settlementAmount",
      key: "settlementAmount",
      render: (text) => formatNumber(text || 0),
    },
    {
      title: t("applicationDate"),
      dataIndex: "applicationDate",
      key: "applicationDate",
      render: (text) => text ? new Date(text).toLocaleDateString() : "",
    },
    {
      title: t("processingDate"),
      dataIndex: "processingDate",
      key: "processingDate",
      render: (text) => text ? new Date(text).toLocaleDateString() : "",
    },
    {
      title: t("situlation"),
      dataIndex: "situation",
      key: "situation",
      render: (text) => (
        <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">
          {text}
        </span>
      ),
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
    let filters = [...searchFilters];
    
    // Remove existing date filters
    filters = filters.filter((f) => f.field !== "transactions.created_at");
    
    if (dates?.at(0)) {
      filters = [
        ...filters,
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
    
    setSearchFilters(filters);
  };

  const onSearch = (value: string) => {
    let filters = [...searchFilters];
    
    // Remove existing search filters
    filters = filters.filter((f) => 
      !["nickname", "depositor", "alias", "distributorName"].includes(f.field)
    );
    
    if (value.trim()) {
      // Add search filters for multiple fields using ilike for case-insensitive search
      const searchFiltersArray = [
        {
          field: "nickname",
          value: `%${value.trim()}%`,
          op: "ilike",
        },
        {
          field: "depositor",
          value: `%${value.trim()}%`,
          op: "ilike",
        },
        {
          field: "alias",
          value: `%${value.trim()}%`,
          op: "ilike",
        },
        {
          field: "distributorName",
          value: `%${value.trim()}%`,
          op: "ilike",
        },
      ];
      filters = [...filters, ...searchFiltersArray];
    }
    
    setSearchFilters(filters);
  };

  useEffect(() => {
    setWeeklyData(
      data?.response?.weeklyLosingData?.map((u: any, index: number) => {
        return { ...u, key: index };
      }) ?? []
    );
    setTotal(data?.response?.total);
  }, [data]);

  useEffect(() => {
    refetch({
      filters: getAllFilters(),
      orders: tableOptions?.orders || [],
      pagination: tableOptions?.pagination || { limit: 25, offset: 0 },
    });
  }, [tableOptions, searchFilters, refetch]);
  return (
    <Layout>
      <Content className="overflow-auto h-[calc(100vh-100px)] dark:bg-black">
        <Card
          title={t("admin/menu/settlements/losingdetail")}
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
                  onSearch={onSearch}
                />
              </Space>
            </Space>
          </Space>

          <Table<any>
            columns={columns}
            loading={loading}
            dataSource={weeklyData ?? []}
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
        </Card>
      </Content>
    </Layout>
  );
};

export default LosingDeailsPage;
