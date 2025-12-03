"use client";
import React, { useEffect, useState } from "react";

import {
  Layout,
  Space,
  Card,
  Table,
  Tag,
  Button,
  Input,
  DatePicker,
  Radio,
} from "antd";
import type { TableProps } from "antd";

import { Content } from "antd/es/layout/layout";

import { useFormatter, useTranslations } from "next-intl";
import { useQuery } from "@apollo/client";
import { RxLetterCaseToggle } from "react-icons/rx";

// import HighlighterComp, { HighlighterProps } from "react-highlight-words";
import { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { parseTableOptions } from "@/lib";
import { GET_LOGS } from "@/actions/log";
import { FaApple, FaLinux, FaWindows } from "react-icons/fa6";
import { usePageTitle } from "@/hooks/usePageTitle";

// const Highlighter = HighlighterComp as unknown as React.FC<HighlighterProps>;

// type LogIndex = keyof Log;

const AdminLogPage: React.FC = () => {
  usePageTitle("Admin - Admin Log Page");
  const t = useTranslations();
  const f = useFormatter();
  const [tableOptions, setTableOptions] = useState<any>(null);

  const [total, setTotal] = useState<number>(0);
  const [logs, setLogs] = useState<any[]>([]);
  const { loading, data, refetch } = useQuery(GET_LOGS, {});
  const onSearchLog = (v: string) => {
    let filters: any[] = tableOptions?.filters ?? [];
    // Remove existing search filters (both ip and phone)
    const f = filters.filter((f) => f.field !== "ip" && f.field !== "phone" && !f.or);

    filters = [...f];
    if (v && v.trim()) {
      setTableOptions({
        ...tableOptions,
        filters: [
          ...filters,
          {
            or: [
              {
                field: "ip",
                value: v.trim(),
                op: "ilike",
              },
              {
                field: "phone",
                value: v.trim(),
                op: "ilike",
              },
            ],
          },
        ],
      });
    } else {
      setTableOptions({
        ...tableOptions,
        filters: filters,
      });
    }
  };
  const onRangerChange = (
    dates: (Dayjs | null)[] | null,
    dateStrings: string[]
  ) => {
    let filters: any[] = tableOptions?.filters ?? [];
    
    // Remove any existing date filters by filtering out date-related conditions
    filters = filters.filter((f) => {
      if (f.field === "logs.created_at") {
        return false; // Remove direct date field filters
      }
      if (f.or) {
        // Remove OR groups that contain date fields
        const hasDateFields = f.or.some((orItem: any) => 
          orItem.field === "logs.created_at"
        );
        return !hasDateFields;
      }
      return true;
    });
    
    // Only add date filters if both dates are selected and valid
    if (dates?.[0] && dates?.[1]) {
      const startDate = dates[0].startOf('day').toISOString();
      const endDate = dates[1].endOf('day').toISOString();
      
      // Add date range filters as separate conditions
      filters.push(
        {
          field: "logs.created_at",
          value: startDate,
          op: "gte",
        },
        {
          field: "logs.created_at",
          value: endDate,
          op: "lte",
        }
      );
    }
    
    setTableOptions({ ...tableOptions, filters });
    refetch({ variables: { filters } });
  };

  const columns: TableProps<Log>["columns"] = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      fixed: "left",
    },
    {
      title: "IP",
      dataIndex: "ip",
      key: "ip",
    },
    {
      title: t("os"),
      dataIndex: "os",
      key: "os",
      render(value) {
        if (value.toLowerCase().includes("window")) {
          return (
            <Tag
              bordered={false}
              icon={<FaWindows />}
              color="blue"
              className="!flex items-center gap-1"
            >
              {value}
            </Tag>
          );
        } else if (value.toLowerCase().includes("linux")) {
          return (
            <Tag
              bordered={false}
              icon={<FaLinux />}
              color="orange"
              className="!flex items-center gap-1"
            >
              {value}
            </Tag>
          );
        } else {
          return (
            <Tag
              bordered={false}
              icon={<FaApple />}
              color="purple"
              className="!flex items-center gap-1"
            >
              {value}
            </Tag>
          );
        }
      },
    },
    {
      title: t("device"),
      dataIndex: "device",
      key: "device",
    },
    {
      title: t("path"),
      dataIndex: "path",
      key: "path",
      render(value, record) {
        return (
          <pre>
            <Tag color={record.status == "success" ? "success" : "red"}>
              {record.method}
            </Tag>
            {value}
          </pre>
        );
      },
    },

    {
      title: t("data"),
      dataIndex: "data",
      key: "data",
      width: 450,
    },

    {
      title: t("status"),
      dataIndex: "status",
      key: "status",
      render: (text) => <Tag color={text}>{text.toUpperCase()}</Tag>,
    },
    {
      title: t("createdAt"),
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) =>
        text
          ? dayjs(text).format("M/D/YYYY HH:mm:ss")
          : "",
    },
  ];
  const onFilterStatusChange = (v: string) => {
    let filters: any[] = tableOptions?.filters ?? [];
    const f = filters.filter((f) => f.field !== "status");

    filters = [...f];
    if (v) {
      const newFilters = [
        ...filters,
        {
          field: "status",
          value: v,
          op: "ilike",
        },
      ];
      console.log('Status filter applied:', { status: v, filters: newFilters });
      setTableOptions({
        ...tableOptions,
        filters: newFilters,
      });
    } else {
      console.log('Status filter removed:', { filters });
      setTableOptions({
        ...tableOptions,
        filters: filters,
      });
    }
  };
  const onChange: TableProps<Log>["onChange"] = (
    pagination,
    filters,
    sorter,
    extra
  ) => {
    setTableOptions({
      ...parseTableOptions(pagination, filters, sorter, extra),
      filters: tableOptions.filters,
    });
  };

  useEffect(() => {
    setLogs(
      data?.logs?.map((u: any) => {
        return { ...u, key: u.id };
      }) ?? []
    );
  }, [data]);

  useEffect(() => {
    refetch(tableOptions ?? undefined)
      .then((res) => {
        console.log({ res });
        setLogs(
          res.data?.response?.logs?.map((u: any) => {
            return { ...u, key: u.id };
          }) ?? []
        );
        setTotal(res.data?.response?.total);
      })
      .catch((err) => {
        console.log({ err });
      });
  }, [tableOptions]);
  return (
    <Layout>
      <Content className="overflow-auto h-[calc(100vh-100px)] dark:bg-black">
        <Card
          title={t("admin/menu/adminLog")}
          classNames={{
            body: "!p-0",
          }}
        >
          <Space className="p-2 !w-full" direction="vertical">
            <Radio.Group
              optionType="button"
              buttonStyle="solid"
              size="small"
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
            <Space>
              <Input.Search
                size="small"
                placeholder="IP,Phone Number"
                suffix={
                  <Button
                    size="small"
                    type="text"
                    icon={<RxLetterCaseToggle />}
                  />
                }
                enterButton={t("search")}
                onSearch={onSearchLog}
              />
              <DatePicker.RangePicker size="small" onChange={onRangerChange} />
              <Radio.Group
                optionType="button"
                buttonStyle="solid"
                size="small"
                options={[
                  {
                    label: t("all"),
                    value: "",
                  },
                  {
                    label: t("success"),
                    value: "success",
                  },
                  {
                    label: t("error"),
                    value: "error",
                  },
                ]}
                defaultValue={""}
                onChange={(e) => onFilterStatusChange(e.target.value)}
              />
            </Space>
          </Space>
          <Table<Log>
            columns={columns}
            loading={loading}
            dataSource={logs ?? []}
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
              defaultPageSize: 25,
              showSizeChanger: true,
              pageSizeOptions: [25, 50, 100, 250, 500, 1000],
            }}
          />
        </Card>
      </Content>
    </Layout>
  );
};

export default AdminLogPage;
