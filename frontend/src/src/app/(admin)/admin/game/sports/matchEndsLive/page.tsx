"use client";
import React, { useState } from "react";

import { 
  Layout, 
  Input, 
  Space, 
  Card, 
  Table,
  Button,
  Switch,
  Tag,
  DatePicker,
  Typography,
  Select,
  Tooltip,
  Popconfirm,
} from "antd";

import type { TableProps } from "antd";
import { Content } from "antd/es/layout/layout";

import { useTranslations } from "next-intl";
import { BiCheck, BiDotsHorizontalRounded, BiEdit, BiPlus, BiRefresh, BiTrash } from "react-icons/bi";
import dayjs from "dayjs";


interface DataType {
  key: React.Key;
  id: string;
  matchNumber: string;
  event: string;
  nation: string;
  league: string;
  homeTeam: string;
  homeTeamScore: string;
  vsScore: string;
  awayTeam: string;
  awayTeamScore: string;
  score: string;
  gameTime: string;
  registrationTime: string;
  endTime: string;
  status: string;
}

const data: DataType[] = [
  {
    key: "1",
    id: "1",
    matchNumber: "14848558",
    event: "soccer",
    nation: "Lebanon",
    league: "Lebanon 01",
    homeTeam: "team111",
    homeTeamScore: "0",
    vsScore: "0",
    awayTeam: "team222",
    awayTeamScore: "0",
    score: "team111",
    gameTime: "2025-05-31 09:02:32",
    registrationTime: "2025-05-31 09:02:32",
    endTime: "2025-05-31 09:02:32",
    status: "inProgress",
  },
  {
    key: "2",
    id: "2",
    matchNumber: "14848558",
    event: "soccer",
    nation: "Lebanon",
    league: "Lebanon 01",
    homeTeam: "team111",
    homeTeamScore: "0",
    vsScore: "0",
    awayTeam: "team111",
    awayTeamScore: "0",
    score: "team111",
    gameTime: "2025-05-31 09:02:32",
    registrationTime: "2025-05-31 09:02:32",
    endTime: "2025-05-31 09:02:32",
    status: "inProgress",
  },
  {
    key: "3",
    id: "3",
    matchNumber: "14848558",
    event: "soccer",
    nation: "Lebanon",
    league: "Lebanon 01",
    homeTeam: "team111",
    homeTeamScore: "0",
    vsScore: "0",
    awayTeam: "team111",
    awayTeamScore: "0",
    score: "team111",
    gameTime: "2025-05-31 09:02:32",
    registrationTime: "2025-05-31 09:02:32",
    endTime: "2025-05-31 09:02:32",
    status: "inProgress",
  },
];

const MatchEndsLive: React.FC = () => {
  const t = useTranslations();

  const columns: TableProps<DataType>["columns"] = [
    {
      title: t("number"),
      dataIndex: "number",
      key: "number",
      render: (_, __, index) => index + 1,
      width: 50,
    },
    {
      title: t("matchNumber"),
      dataIndex: "matchNumber",
      key: "matchNumber",
    },
    {
      title: t("event"),
      dataIndex: "event",
      key: "event",
    },
    {
      title: t("nation"),
      dataIndex: "nation",
      key: "nation",
    },
    {
      title: t("league"),
      dataIndex: "league",
      key: "league",
      width: 250
    },
    {
      title: t("homeTeam"),
      dataIndex: "homeTeam",
      key: "homeTeam",
      minWidth: 100,
      render: (val, record) => (
        <Space direction="vertical" align="center">
          <Space.Compact block size="small">
            <Input value={val}/>
            <Button type="primary" icon={<BiEdit />}></Button>
          </Space.Compact>
          <Space.Compact block size="small">
            <Typography.Link underline>0(0)</Typography.Link>
          </Space.Compact>
        </Space>
      ),
    },
    {
      title: t("VS"),
      dataIndex: "vsScore",
      key: "vsScore",
      minWidth: 50,
      width: 50,
      render: (val, record) => (
        <Space direction="vertical" align="center">
          <Space.Compact block size="small">
            -
          </Space.Compact>
          <Space.Compact block size="small">
            <Typography.Link underline>0(0)</Typography.Link>
          </Space.Compact>
        </Space>
      ),
    },
    {
      title: t("awayTeam"),
      dataIndex: "awayTeam",
      key: "awayTeam",
      minWidth: 100,
      render: (val, record) => (
        <Space direction="vertical" align="center">
          <Space.Compact block size="small">
            <Input value={val}/>
            <Button type="primary" icon={<BiEdit />}></Button>
          </Space.Compact>
          <Space.Compact block size="small">
            <Typography.Link underline>0(0)</Typography.Link>
          </Space.Compact>
        </Space>
      ),
    },
    {
      title: t("score"),
      dataIndex: "score",
      key: "score",
      minWidth: 100,
      render: (val, record) => (
        <Space direction="vertical" align="center">
          <Space.Compact block size="small">
            <Input value={0}/>:
            <Input value={0}/>
          </Space.Compact>
        </Space>
      ),
    },
    {
      title: t("gameTime"),
      dataIndex: "gameTime",
      key: "gameTime",
      minWidth: 200,
    },
    {
      title: t("registrationTime"),
      dataIndex: "registrationTime",
      key: "registrationTime",
      minWidth: 200
    },
    {
      title: t("endTime"),
      dataIndex: "endTime",
      key: "endTime",
      minWidth: 200
    },
    {
      title: t("status"),
      dataIndex: "status",
      key: "status",
      minWidth: 150,
      render: (text) => (
        <Tag bordered={false} color={text == "inProgress" ? "success" : "red"}>
          {text.toUpperCase() || "UNKNOWN"}
        </Tag>
      ),
    },
    {
      title: t("action"),
      key: "action",
      fixed: "right",
      width: 200,
      render: (_, record) => (
        <Space.Compact size="small" className="gap-2">
          <Tooltip title={t("particulate")}>
            <Button
              type="primary"
              variant="outlined"
              color="primary"
              icon={<BiDotsHorizontalRounded />}
              // onClick={() => }
            />
          </Tooltip>
          <Tooltip title={t("update")}>
            <Button
              type="primary"
              variant="outlined"
              color="danger"
              icon={<BiRefresh />}
              // onClick={() => }
            />
          </Tooltip>
          <Tooltip title={t("recalculate")}>
            <Button
              type="primary"
              variant="outlined"
              color="green"
              icon={<BiCheck />}
              // onClick={() => }
            />
          </Tooltip>
          <Tooltip title={t("changeToInGame")}>
            <Button
              type="primary"
              variant="outlined"
              color="green"
              icon={<BiPlus />}
              // onClick={() => }
            />
          </Tooltip>
        </Space.Compact>
      ),
    },
  ];

  return (
    <Layout>
      <Content className="overflow-auto h-[calc(100vh-100px)] dark:bg-black w-fit">
        <Card
          title={t("admin/menu/matchEndsLive")}
          extra={<Space className="gap-2">
            {dayjs().format('YYYY-MM-DD HH:mm:ss')}
            <Tooltip title={t("refresh")}>
              <Button
                type="text"
                color="primary"
                icon={<BiRefresh />}
                // onClick={() => onBlockMatch(record)}
              />
            </Tooltip>
          </Space>
          }
        >
          <Space className="gap-2 flex justify-between !w-full py-1">
            <Space.Compact>
              <Select
                value={"entire"}
                style={{ width: 100 }}
                options={[
                  { value: "entire", label: t("entire") },]}
                // onChange={(value) => onLevelChange(record, value)}
              />
              <Input
                size="small"
                placeholder={t("nation")}
                className="!w-[80px]"
              />
              <Input
                size="small"
                placeholder={t("league")}
                className="!w-[80px]"
              />
              <Input
                size="small"
                placeholder={t("team")}
                className="!w-[80px]"
              />
              <Input
                size="small"
                placeholder={t("marketName")}
                className="!w-[80px]"
              />
              <Input
                size="small"
                placeholder={t("fixtureID")}
                className="!w-[80px]"
              />
              <Button
                size="small"
                type="primary"
              >{t("search")}</Button>
            </Space.Compact>
            <Space.Compact>
              <Select
                value={25}
                className="!w-[100px]"
                options={[
                  { value: 25, label: `25 ${t("outputs")}` },
                  { value: 50, label: `50 ${t("outputs")}` },
                  { value: 100, label: `100 ${t("outputs")}` },
                ]}
                // onChange={(value) => onOutputChange(record, value)}
              />
            </Space.Compact>
          </Space>
          <Card size="small"
            className="w-full"
          >
            <Table<DataType>
              columns={columns}
              dataSource={data}
              className="w-full"
              scroll={{x: 2000}}
            />
          </Card>
        </Card>
      </Content>
    </Layout>
  );
};

export default MatchEndsLive;
