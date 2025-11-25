"use client";
import React, { useEffect, useState } from "react";

import {
  Layout,
  Space,
  Card,
  Table,
  Button,
  Popconfirm,
  Input,
  Radio,
  Modal,
  Switch,
} from "antd";
import type { TableProps } from "antd";

import { Content } from "antd/es/layout/layout";
import { useFormatter, useTranslations } from "next-intl";
import { useMutation, useQuery } from "@apollo/client";
import { BiTrash } from "react-icons/bi";
import { RxLetterCaseToggle } from "react-icons/rx";
// import HighlighterComp, { HighlighterProps } from "react-highlight-words";
import { parseTableOptions } from "@/lib";
import { DELETE_DOMAIN, GET_DOMAINS, UPDATE_DOMAIN } from "@/actions/domain";
import dayjs from "dayjs";

// const Highlighter = HighlighterComp as unknown as React.FC<HighlighterProps>;

// type DomainIndex = keyof Domain;

const PartnerDomainPage: React.FC = () => {
  const t = useTranslations();
  const f = useFormatter();
  const [tableOptions, setTableOptions] = useState<any>({
    filters: [
      {
        or: [
          {
            field: "role",
            value: "P",
            op: "eq",
          },
          {
            field: "role",
            value: "A",
            op: "eq",
          },
        ],
      },
    ],
  });

  const [, contextHolder] = Modal.useModal();
  const [total, setTotal] = useState<number>(0);
  const [domains, setDomains] = useState<any[]>([]);

  const { loading, data, refetch } = useQuery(GET_DOMAINS);
  const popupWindow = (id: number) => {
    window.open(`/partner/popup/user?id=${id}`, '_blank', 'width=screen.width,height=screen.height,toolbar=no,menubar=no,scrollbars=yes,resizable=yes,location=no,status=no');
  }
  const [updateDomain] = useMutation(UPDATE_DOMAIN);
  const [deleteDomain] = useMutation(DELETE_DOMAIN);

  const onDomainAutoRegChange = (u: Domain, v: boolean) => {
    updateDomain({
      variables: {
        id: u.id,
        input: {
          autoReg: v,
        },
      },
    }).then(() => {
      refetch(tableOptions);
    });
  };
  const onDomainStatusChange = (u: Domain, v: boolean) => {
    updateDomain({
      variables: {
        id: u.id,
        input: {
          status: v,
        },
      },
    }).then(() => {
      refetch(tableOptions);
    });
  };

  const onChange: TableProps<Domain>["onChange"] = (
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

  const onDomainFilterChange = (v: string) => {
    updateFilter("domains.status", v, "eq");
  };

  const onSearchDomain = (v: string) => {
    updateFilter("domains.name", v, "ilike");
  };

  const onDeleteDomain = (id: number) => {
    deleteDomain({
      variables: {
        id: id,
      },
    }).then(() => {
      refetch(tableOptions);
    });
  };

  const columns: TableProps<Domain>["columns"] = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      fixed: "left",
    },
    {
      title: t("site"),
      dataIndex: "site",
      key: "site",
      render: (text) => text ?? "site",
    },
    {
      title: t("userid"),
      dataIndex: "userId",
      key: "userId",
      render(_, record) {
        return <div className="flex items-center cursor-pointer" onClick={() => popupWindow(record.user?.id)}>
        {/* <p className="w-[15px] h-[15px] flex items-center justify-center rounded-full bg-[#1677ff] text-white text-xs">{record.user?.profile?.level}</p> */}
        <p className="text-xs text-[white] bg-[#000] px-1 py-0.5 rounded">{record.user?.userid}</p>
      </div>
      },
    },
    {
      title: t("domain"),
      dataIndex: "name",
      key: "name",
    },
    {
      title: t("autoReg"),
      dataIndex: "autoReg",
      key: "autoReg",
      render: (text, record) => (
        <Switch
          size="small"
          defaultChecked={text}
          onChange={(v) => onDomainAutoRegChange(record, v)}
        />
      ),
    },
    {
      title: t("status"),
      dataIndex: "status",
      key: "status",
      render: (text, record) => (
        <Switch
          size="small"
          defaultChecked={text}
          onChange={(v) => onDomainStatusChange(record, v)}
        />
      ),
    },
    {
      title: t("createdAt"),
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => (text ? dayjs(text).format("M/D/YYYY HH:mm:ss") : ""),
    },
    {
      title: t("updatedAt"),
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (text) => (text ? dayjs(text).format("M/D/YYYY HH:mm:ss") : ""),
    },
    {
      title: t("action"),
      key: "action",
      fixed: "right",
      render: (_, record) => (
        <Space.Compact size="small" className="gap-2">
          <Popconfirm
            title={t("confirmSure")}
            onConfirm={() => onDeleteDomain(record.id)}
            description={t("deleteMessage")}
          >
            <Button
              title={t("delete")}
              variant="outlined"
              color="danger"
              icon={<BiTrash />}
            />
          </Popconfirm>
        </Space.Compact>
      ),
    },
  ];
  useEffect(() => {
    setDomains(
      data?.response?.domains?.map((u: any) => {
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
      {contextHolder}
      <Content className="overflow-auto h-[calc(100vh-100px)] dark:bg-black">
        <Card
          title={t("domain")}
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
                <Input.Search
                  size="small"
                  placeholder={t("domain")}
                  suffix={
                    <Button
                      size="small"
                      type="text"
                      icon={<RxLetterCaseToggle />}
                    />
                  }
                  allowClear
                  onSearch={onSearchDomain}
                  enterButton={t("search")}
                />
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
                      label: t("active"),
                      value: "true",
                    },
                    {
                      label: t("inactive"),
                      value: "false",
                    },
                  ]}
                  defaultValue={""}
                  onChange={(e) => onDomainFilterChange(e.target.value)}
                />
              </Space>
            </Space>
          </Space>
          <Table<Domain>
            columns={columns}
            loading={loading}
            dataSource={domains ?? []}
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

export default PartnerDomainPage;
