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
import dayjs, { Dayjs } from "dayjs";
import { isValidDate, parseTableOptions } from "@/lib";
import PopupHeader from "@/components/Admin/PopupHeader";
import SettlementRequest from "@/app/(admin)/admin/settlements/losingdetail/page";

const TotalSettlement = () => {
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
  const [caseSensitive, setCaseSensitive] = useState<boolean>(false);
  const [siteFilter, setSiteFilter] = useState<string>("");

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
    
    // Add site filter if selected
    if (siteFilter) {
      baseFilters.push({
        field: "site",
        value: siteFilter as any,
        op: "eq",
      });
    }
    
    const tableFilters = tableOptions?.filters || [];
    const allFilters = [...baseFilters, ...tableFilters, ...searchFilters];
    
    // Log filters for debugging
    console.log('All filters:', allFilters);
    
    return allFilters;
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
      render: (text) => f.number(text || 0),
    },
    {
      title: t("winner"),
      dataIndex: "totalWinner",
      key: "totalWinner",
      render: (text) => f.number(text || 0),
    },
    {
      title: t("losingMoney"),
      dataIndex: "totalLosingMoney",
      key: "totalLosingMoney",
      render: (text) => f.number(text || 0),
    },
    {
      title: t("settlementAmount"),
      dataIndex: "settlementAmount",
      key: "settlementAmount",
      render: (text) => f.number(text || 0),
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
    
    if (dates && dates[0] && dates[1]) {
      // Add start date filter (greater than or equal to start date)
      filters.push({
        field: "transactions.created_at",
        value: dateStrings[0],
        op: "gte",
      });
      
      // Add end date filter (less than or equal to end date)
      filters.push({
        field: "transactions.created_at",
        value: dateStrings[1],
        op: "lte",
      });
    }
    
    console.log({ filters });
    setSearchFilters(filters);
  };

  const onSearch = (value: string) => {
    let filters = [...searchFilters];

    // Remove any existing search filters by finding and removing the search OR condition
    filters = filters.filter((f) => {
      if (f.or) {
        // Check if this OR group contains search fields
        const hasSearchFields = f.or.some((orItem: any) => 
          orItem.field === "nickname" ||
          orItem.field === "depositor" ||
          orItem.field === "alias" ||
          orItem.field === "distributorName"
        );
        return !hasSearchFields;
      }
      return true;
    });

    if (value && value.trim()) {
      // Determine the search operator based on case sensitivity
      const searchOp = caseSensitive ? "like" : "ilike";
      
      // Create OR condition for multiple search fields
      const searchOrCondition = {
        or: [
          {
            field: "nickname",
            value: `%${value.trim()}%`,
            op: searchOp,
          },
          {
            field: "depositor",
            value: `%${value.trim()}%`,
            op: searchOp,
          },
          {
            field: "alias",
            value: `%${value.trim()}%`,
            op: searchOp,
          },
          {
            field: "distributorName",
            value: `%${value.trim()}%`,
            op: searchOp,
          }
        ]
      };

      filters = [...filters, searchOrCondition];
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
  }, [tableOptions, searchFilters, siteFilter, refetch]);
    return <div>
        <div>
            <PopupHeader title="settlementDetails" />
        </div>
        <Layout>
            <Content className="overflow-auto h-[calc(100vh-100px)] dark:bg-black">
                <Card
                title={t("settlementDetails")}
                    classNames={{
                        body: "px-5",
                    }}
                >
                {/* <Space className="p-2 !w-full" direction="vertical">
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
                    value={siteFilter}
                    onChange={(e) => setSiteFilter(e.target.value)}
                    />

                    <Space className="!w-full justify-between">
                    <Space>
                        <DatePicker.RangePicker
                        size="small"
                        onChange={onRangerChange}
                        disabledDate={(current) => {
                            return false;
                        }}
                        showTime={{
                            format: 'HH:mm:ss',
                        }}
                        format="YYYY-MM-DD HH:mm:ss"
                        />
                        <Input.Search
                        size="small"
                        placeholder={t("idNicknameAccountHolderPhoneNumber")}
                        suffix={
                            <Button
                            size="small"
                            type="text"
                            icon={<RxLetterCaseToggle />}
                            onClick={() => setCaseSensitive(!caseSensitive)}
                            style={{
                                backgroundColor: caseSensitive ? '#1677ff' : 'transparent',
                                color: caseSensitive ? 'white' : 'inherit'
                            }}
                            title={caseSensitive ? t("caseSensitiveOn") : t("caseSensitiveOff")}
                            />
                        }
                        enterButton={t("search")}
                        onSearch={onSearch}
                        />
                    </Space>
                    </Space>
                </Space> */}

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
    </div>
};

export default TotalSettlement;