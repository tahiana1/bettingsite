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
  leagueNumber: string;
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
  situation: string;
  ignoreAPIsignal: Boolean;
  ignoreAPIstartTime: Boolean;
  waitingOrRelease: Boolean;
}

const data: DataType[] = [
  {
    key: "1",
    id: "1",
    matchNumber: "14848558",
    leagueNumber: "35226",
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
    situation: "inProgress",
    ignoreAPIsignal: false,
    ignoreAPIstartTime: false,
    waitingOrRelease: true,
  },
  {
    key: "2",
    id: "2",
    matchNumber: "14848558",
    leagueNumber: "35226",
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
    situation: "inProgress",
    ignoreAPIsignal: false,
    ignoreAPIstartTime: false,
    waitingOrRelease: true,
  },
  {
    key: "3",
    id: "3",
    matchNumber: "14848558",
    leagueNumber: "35226",
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
    situation: "inProgress",
    ignoreAPIsignal: false,
    ignoreAPIstartTime: false,
    waitingOrRelease: true,
  },
];

const MatchManagementAuto: React.FC = () => {
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
      title: t("leagueNumber"),
      dataIndex: "leagueNumber",
      key: "leagueNumber",
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
      minWidth: 100,
      render: (val, record) => (
        <Space direction="vertical" align="center">
          <Space.Compact block size="small">
            <DatePicker
              showTime
              onChange={(value, dateString) => {
                console.log('Selected Time: ', value);
                console.log('Formatted Selected Time: ', dateString);
              }}
              // onOk={onOk}
            />
          </Space.Compact>
        </Space>
      ),
    },
    {
      title: t("registrationTime"),
      dataIndex: "registrationTime",
      key: "registrationTime",
      minWidth: 200
    },
    {
      title: t("situation"),
      dataIndex: "situation",
      key: "situation",
      minWidth: 150,
      render: (isAuto) => (
        <Select
          defaultValue="inProgress"
          // onChange={handleChange}
          options={[
            { value: 'inProgress', label: 'In progress' },
            { value: 'special', label: 'Special feature' },
          ]}
        />
      ),
    },
    {
      title: t("ignoreAPIsignal"),
      dataIndex: "ignoreAPIsignal",
      key: "ignoreAPIsignal",
      width: 100,
      render: (val, record) => {
        return (
          <Space className="w-full justify-center">
            <Switch
              size="small"
              // checked={val}
              // onChange={(checked) => onStatusChange(record, checked)}
            ></Switch>
          </Space>
        );
      },
    },
    {
      title: t("ignoreAPIstartTime"),
      dataIndex: "ignoreAPIstartTime",
      key: "ignoreAPIstartTime",
      width: 100,
      render: (val, record) => {
        return (
          <Space className="w-full justify-center">
            <Switch
              size="small"
              // checked={val}
              // onChange={(checked) => onStatusChange(record, checked)}
            ></Switch>
          </Space>
        );
      },
    },
    {
      title: t("waitingOrRelease"),
      dataIndex: "waitingOrRelease",
      key: "waitingOrRelease",
      width: 100,
      render: (val, record) => {
        return (
          <Space className="w-full justify-center">
            <Switch
              size="small"
              // checked={val}
              // onChange={(checked) => onStatusChange(record, checked)}
            ></Switch>
          </Space>
        );
      },
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
          <Tooltip title={t("apply")}>
            <Button
              type="primary"
              variant="outlined"
              color="green"
              icon={<BiCheck />}
              // onClick={() => }
            />
          </Tooltip>
          <Tooltip title={t("addMarket")}>
            <Button
              type="primary"
              variant="outlined"
              color="green"
              icon={<BiPlus />}
              // onClick={() => }
            />
          </Tooltip>
          <Popconfirm
            title={t("confirmSure")}
            // onConfirm={() => onDelete(record)}
            // description={t("deleteMessage")}
          >
            <Button
              title={t("end")}
              // loading={loadingDelete}
              variant="outlined"
              color="danger"
            >{t("end")}</Button>
          </Popconfirm>
        </Space.Compact>
      ),
    },
  ];

  return (
    <Layout>
      <Content className="overflow-auto h-[calc(100vh-100px)] dark:bg-black w-fit">
        <Card
          title={t("admin/menu/matchManagementAuto")}
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
          <Space>
            <Space.Compact block>
              <Button type="primary">{t("entire")}</Button>
              <Button type="default">{t("prematch")}</Button>
              <Button type="default">{t("live")}</Button>
              <Button type="default">{t("special")}</Button>
            </Space.Compact>
            <Space.Compact block>
              <Button type="primary">{t("wholeMargetDisplay")}</Button>
              <Button type="default">{t("onlyReleaseMarketDisplay")}</Button>
              <Button type="default">{t("onlyBettingMarketDisplay")}</Button>
            </Space.Compact>
          </Space>
          <Space className="gap-2 flex justify-between !w-full">
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
              <Select
                value={"entire"}
                style={{ width: 100 }}
                options={[
                  { value: "entire", label: t("entire") },]}
                // onChange={(value) => onLevelChange(record, value)}
              />
              <Select
                value={"entire"}
                style={{ width: 100 }}
                options={[
                  { value: "entire", label: t("entire") },]}
                // onChange={(value) => onLevelChange(record, value)}
              />
              <Button
                size="small"
                type="primary"
              >{t("search")}</Button>
            </Space.Compact>
            <Space.Compact className="gap-2">
              <Button
                size="small"
                type="primary"
                // onClick={() => {}}
                className="w-[75px]"
              >{t("APIrequest")}</Button>
              <Button
                size="small"
                type="primary"
                className="w-[120px] !whitespace-break-spaces !h-auto"
                // onClick={() => {}}
              ><div>{t("inPlayMatchScheduleRequest")}</div></Button>
            </Space.Compact>
            <Space.Compact className="gap-2">
              <Button
                size="small"
                type="primary"
                className="w-[80px] !whitespace-break-spaces !h-auto"
                // onClick={() => {}}
              >{t("fullMatchWaiting")}</Button>
              <Button
                size="small"
                type="primary"
                className="w-[80px] !whitespace-break-spaces !h-auto"
                // onClick={() => {}}
                color="green"
              >{t("fullGameRelease")}</Button>
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

export default MatchManagementAuto;
