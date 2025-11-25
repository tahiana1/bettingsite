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
  Switch,
  Popconfirm,
  Image,
  Row,
  Col,
  Typography,
} from "antd";

import type { TableProps } from "antd";
import { Content } from "antd/es/layout/layout";

import { useTranslations } from "next-intl";

import { RxLetterCaseToggle } from "react-icons/rx";
import { BiBlock, BiTrash } from "react-icons/bi";
import { useQuery } from "@apollo/client";
import { FILTER_NATION } from "@/actions/nation";


interface NationDataType {
  id: string;
  code: string;
  name: string;
  enName: string;
  use: Boolean;
  specialUse: Boolean;
}

interface SportsDataType {
  id: string;
  code: string;
  name: string;
  enName: string;
  preBookmaker: string;
  liveBookmaker: string;
  specialUse: Boolean;
  useSettings: Boolean;
  resultsByScore: Boolean;
}

const nationData: NationDataType[] = [
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

const sportsData: SportsDataType[] = [
  {
    id: "1",
    code: "9",
    name: "soccer",
    enName: "soccer",
    preBookmaker: "stm",
    liveBookmaker: "stm",
    specialUse: true,
    useSettings: true,
    resultsByScore: false,
  },
  {
    id: "2",
    code: "943",
    name: "Baseball",
    enName: "Baseball",
    preBookmaker: "stm",
    liveBookmaker: "stm",
    specialUse: true,
    useSettings: true,
    resultsByScore: false,
  },
];

const CountryOrderSettings: React.FC = () => {
  const t = useTranslations();

  const sportsColumns: TableProps<SportsDataType>["columns"] = [
    {
      title: t("code"),
      dataIndex: "code",
      key: "code",
    },
    {
      title: t("event"),
      dataIndex: "name",
      key: "name",
    },
    {
      title: t("englishName"),
      dataIndex: "enName",
      key: "enName",
    },
    {
      title: t("prematchBookmarker"),
      dataIndex: "preBookmaker",
      key: "preBookmaker",
    },
    {
      title: t("liveBookmarker"),
      dataIndex: "liveBookmaker",
      key: "liveBookmaker",
    },
    {
      title: "action",
      key: "action",
      fixed: "right",
      render: (_, reid) => (
        <Space.Compact size="small" className="gap-2">
          <Button type="primary">{t("listDisplay")}</Button>
        </Space.Compact>
      ),
    },
  ];

  const nationColumns: TableProps<NationDataType>["columns"] = [
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
    },
    {
      title: t("countryName"),
      dataIndex: "name",
      key: "name",
    },
    {
      title: t("englishName"),
      dataIndex: "enName",
      key: "enName",
    },
    {
      title: t("order"),
      dataIndex: "orderNum", 
      key: "orderNum",
      render: (text, record) => {
        const options = Array.from({length: 3}, (_, i) => ({
          value: i + 1,
          label: i + 1
        }));
        return (
          <Select
            value={text}
            style={{ width: 100 }}
            options={options}
            // onChange={(value) => onLevelChange(record, value)}
          />
        );
      }
    },
  ];

  return (
    <Layout>
      <Content className="overflow-auto h-[calc(100vh-100px)] dark:bg-black">
        <Card
          title={t("admin/menu/sportsCountryOrder")}
        >
          <Space className="w-full justify-around">
            <Space className="gap-2">
            </Space>
          </Space>
          <Row>
            <Col span={12} className="px-1">
              <Card size="small"
                title={`${t("sportsList")}`}
                className="w-full">
                <Table<SportsDataType>
                  columns={sportsColumns}
                  dataSource={sportsData}
                  className="w-full"
                />
              </Card>
            </Col>
            <Col span={12} className="px-1">
              <Card size="small"
                title={`${t("listCountries")}`}
                className="w-full"
                extra={<Space className="gap-2">
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
                </Space>}
              >
                <Table<NationDataType>
                  columns={nationColumns}
                  dataSource={nationData}
                  className="w-full"
                />
              </Card>
            </Col>
          </Row>
        </Card>
      </Content>
    </Layout>
  );
};

export default CountryOrderSettings;
