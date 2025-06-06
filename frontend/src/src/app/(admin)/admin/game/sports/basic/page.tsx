"use client";
import React, { useState } from "react";

import { 
  Layout, 
  Input, 
  Space, 
  Card, 
  Table,
  Select,
  Button,
  Popconfirm,
  Switch,
} from "antd";

import type { TableProps } from "antd";
import { Content } from "antd/es/layout/layout";

import { useTranslations } from "next-intl";

import { RxLetterCaseToggle } from "react-icons/rx";
import {
  CREATE_NATION,
  DELETE_NATION,
  FILTER_NATION,
  UPDATE_NATION,
} from "@/actions/nation";
import { BiBlock, BiTrash } from "react-icons/bi";
import { useMutation, useQuery } from "@apollo/client";

interface NationDataType {
  id: string;
  code: string;
  name: string;
  enName: string;
  use: Boolean;
  specialUse: Boolean;
}

interface LeagueDataType {
  id: string;
  code: string;
  name: string;
  nation: NationDataType;
  enName: string;
  event: string;
  use: Boolean;
  specialUse: Boolean;
}

const data: NationDataType[] = [
  {
    id: "1",
    code: "9",
    name: "Ghana",
    enName: "Ghana",
    use: true,
    specialUse: false,
  },
  {
    id: "2",
    code: "10",
    name: "Gabon",
    enName: "Gabon",
    use: true,
    specialUse: false,
  },
];

const SportsBasicInformation: React.FC = () => {
  const t = useTranslations();

  const [nations, setNations] = useState<any[]>([]);
  const [updateNation] = useMutation(UPDATE_NATION);
  // const { nationsLoading, nationData, refetch } = useQuery();

  const columns: TableProps<NationDataType>["columns"] = [
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Country name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "English",
      dataIndex: "enName",
      key: "enName",
    },
    {
      title: "Use",
      dataIndex: "use",
      key: "use",
      render: (val, record) => {
        console.log("test", val)
        return (
          <Switch
            size="small"
            checked={val}
            // onChange={(checked) => onStatusChange(record, checked)}
          ></Switch>
        );
      },
    },
    {
      title: "Special Use",
      dataIndex: "specialUse",
      key: "specialUse",
      render: (val, record) => {
        return (
          <Switch
            size="small"
            checked={val}
            // onChange={(checked) => onStatusChange(record, checked)}
          ></Switch>
        );
      },
    },
    {
      title: "action",
      key: "action",
      fixed: "right",
      render: (_, reid) => (
        <Space.Compact size="small" className="gap-2">
          <Button type="primary">Change</Button>
          <Button type="primary" color="cyan">League Information</Button>
        </Space.Compact>
      ),
    },
  ];

  return (
    <Layout>
      <Content className="overflow-auto h-[calc(100vh-100px)] dark:bg-black">
        <Space.Compact className="w-full gap-2">
          <Space direction="vertical" className="w-full flex-1">
            <Card
              classNames={{
                body: "!p-0",
              }}
            >
              <Space className="w-full justify-around">
                <Space className="gap-2">
                  {t("List of countries")}
                </Space>
                <Space className="gap-2">
                  <Select
                    size="small"
                    placeholder="select"
                    className="min-w-28"
                    allowClear
                  />
                  <Input.Search
                    size="small"
                    placeholder="Country Name"
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
              <Table<NationDataType>
                columns={columns}
                dataSource={data}
                className="w-full"
              />
            </Card>
            <Card
              classNames={{
                body: "!p-0",
              }}
              title={t("admin/menu/sports")}
            >
              <Table<NationDataType>
                columns={columns}
                dataSource={data ?? []}
                className="w-full"
                size="small"
              />
            </Card>  
          </Space>
          <Space direction="vertical" className="w-full flex-2">
            <Card
              classNames={{
                body: "!p-0",
              }}
            >
              <Space className="w-full justify-around">
                <Space className="gap-2">
                  {t("League List")}
                </Space>
                <Space className="gap-2">
                  <Select
                    size="small"
                    placeholder="select"
                    className="min-w-28"
                    allowClear
                  />
                  <Input.Search
                    size="small"
                    placeholder="League name"
                  />
                  <Input.Search
                    size="small"
                    placeholder="League number"
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
              <Table<NationDataType>
                columns={columns}
                dataSource={data}
                className="w-full"
              />
            </Card>
            <Card
              classNames={{
                body: "!p-0",
              }}
              title={t("admin/menu/sports")}
            >
              <Table<NationDataType>
                columns={columns}
                dataSource={data}
                className="w-full"
              />
            </Card>
          </Space>
        </Space.Compact>
      </Content>
    </Layout>
  );
};

export default SportsBasicInformation;
