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
import { FaWindows, FaLinux, FaApple } from "react-icons/fa";
// import HighlighterComp, { HighlighterProps } from "react-highlight-words";
import { Dayjs } from "dayjs";
import { parseTableOptions } from "@/lib";
import { GET_LOGS } from "@/actions/log";

// const Highlighter = HighlighterComp as unknown as React.FC<HighlighterProps>;

// type LogIndex = keyof Log;

const LogStatusPage: React.FC = () => {
  const t = useTranslations();
  const f = useFormatter();
  const [tableOptions, setTableOptions] = useState<any>(null);

  const [total, setTotal] = useState<number>(0);
  const [logs, setLogs] = useState<any[]>([]);
  const { loading, data, refetch } = useQuery(GET_LOGS, {
    variables: {
      filters: [
        {
          field: "type",
          value: "R",
          op: "eq",
        },
      ],
    },
  });

  const popupWindow = (id: number) => {
    window.open(`/admin/popup/user?id=${id}`, '_blank', 'width=1200,height=800,toolbar=no,menubar=no,scrollbars=yes,resizable=yes,location=no,status=no');
  }
  const onSearchLog = (v: string) => {
    let filters: { field: string; value: string; op: string }[] =
      tableOptions?.filters ?? [];
    const f = filters.filter((f) => f.field !== "ip");

    filters = [...f];
    setTableOptions({
      ...tableOptions,
      filters: [
        ...filters,
        {
          or: [
            {
              field: "ip",
              value: v,
              op: "ilike",
            },
            {
              field: "phone",
              value: v,
              op: "ilike",
            },
          ],
        },
      ],
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
    } else {
      filters = f;
    }
    setTableOptions({ ...tableOptions, filters });
  };

  const columns: TableProps<Log>["columns"] = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      fixed: "left",
    },
    {
      title: t("userid"),
      dataIndex: "user.userid",
      key: "user.userid",
      render: (text, record) => {
        if (record.user?.id) {
          const userId = record.user.id;
          return <div className="flex items-center cursor-pointer" onClick={() => popupWindow(userId)}>
            <p className="w-[15px] h-[15px] flex items-center justify-center rounded-full bg-[#1677ff] text-white text-xs">{record.user?.profile?.level || 'N/A'}</p>
            <p className="text-xs text-[white] bg-[#000] px-1 py-0.5 rounded">{text || record.user?.userid || "unknown"}</p>
          </div>
        }
        return text || record.user?.userid || "unknown";
      },
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
      title: "IP",
      dataIndex: "ip",
      key: "ip",
    },
    {
      title: t("path"),
      dataIndex: "path",
      key: "path",
      render(value, record) {
        return (
          <pre>
            <Tag
              color={record.status == "success" ? "success" : "red"}
            >
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
      width: 400,
    },
    {
      title: t("status"),
      dataIndex: "status",
      key: "status",
      render: (text) => (
        <Tag bordered={false} color={text == "success" ? "success" : "red"}>
          {text.toUpperCase() || "UNKNOWN"}
        </Tag>
      ),
    },
    {
      title: t("createdAt"),
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) =>
        text
          ? f.dateTime(new Date(text) ?? null, {
              year: "numeric",
              month: "numeric",
              day: "numeric",
              hour: "numeric",
              minute: "numeric",
            })
          : "",
    },
  ];
  const onFilterStatusChange = (v: string) => {
    let filters: { field: string; value: string; op: string }[] =
      tableOptions?.filters ?? [];
    const f = filters.filter((f) => f.field !== "status");

    filters = [...f];
    setTableOptions({
      ...tableOptions,
      filters: [
        ...filters,
        {
          field: "status",
          value: v,
          op: "ilike",
        },
      ],
    });
  };
  const onChange: TableProps<Log>["onChange"] = (
    pagination,
    filters,
    sorter,
    extra
  ) => {
    console.log({
      ...parseTableOptions(pagination, filters, sorter, extra),
      filters: tableOptions?.filters,
    });
    setTableOptions({
      ...parseTableOptions(pagination, filters, sorter, extra),
      filters: tableOptions?.filters,
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
          title={t("logs")}
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
                placeholder="IP,Phone"
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
                    label: t("failure"),
                    value: "fail",
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

export default LogStatusPage;
