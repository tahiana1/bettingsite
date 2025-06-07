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

interface TeamDataType {
  id: string;
  code: string;
  name: string;
  enName: string;
  nation: NationDataType;
  event: string;
  use: Boolean;
  specialUse: Boolean;
  league: LeagueDataType;
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

const leagueData: LeagueDataType[] = [
  {
    id: "1",
    code: "9",
    name: "Ghana",
    event: "soccer",
    enName: "Ghana",
    use: true,
    specialUse: false,
    nation: {
      id: "1",
      code: "9",
      name: "Ghana",
      enName: "Ghana",
      use: true,
      specialUse: false,
    }
  },
  {
    id: "2",
    code: "15",
    name: "FA Cap W",
    event: "soccer",
    enName: "FA Cap W",
    use: true,
    specialUse: false,
    nation: {
      id: "1",
      code: "9",
      name: "Ghana",
      enName: "Ghana",
      use: true,
      specialUse: false,
    }
  },
  {
    id: "3",
    code: "17",
    name: "Ghana Cup",
    event: "soccer",
    enName: "Ghana Cup",
    use: true,
    specialUse: false,
    nation: {
      id: "1",
      code: "9",
      name: "Ghana",
      enName: "Ghana",
      use: true,
      specialUse: false,
    }
  },
];


const TeamData: TeamDataType[] = [
  {
    id: "1",
    code: "9",
    name: "soccer",
    enName: "soccer",
    event: "soccer",
    nation: {
      id: "1",
      code: "9",
      name: "Ghana",
      enName: "Ghana",
      use: true,
      specialUse: false,
    },
    use: true,
    specialUse: true,
    league: {
      id: "1",
      code: "9",
      name: "Ghana",
      event: "soccer",
      enName: "Ghana",
      use: true,
      specialUse: false,
      nation: {
        id: "1",
        code: "9",
        name: "Ghana",
        enName: "Ghana",
        use: true,
        specialUse: false,
      }
    },
  },
  {
    id: "2",
    code: "94",
    name: "Ash-Town W",
    enName: "Ash-Town W",
    event: "soccer",
    nation: {
      id: "1",
      code: "9",
      name: "Ghana",
      enName: "Ghana",
      use: true,
      specialUse: false,
    },
    use: true,
    specialUse: true,
    league: {
      id: "1",
      code: "9",
      name: "Ghana",
      event: "soccer",
      enName: "Ghana",
      use: true,
      specialUse: false,
      nation: {
        id: "1",
        code: "9",
        name: "Ghana",
        enName: "Ghana",
        use: true,
        specialUse: false,
      }
    },
  },
];

const SportsBasicInformation: React.FC = () => {
  const t = useTranslations();

  const [nations, setNations] = useState<any[]>([]);
  const [updateNation] = useMutation(UPDATE_NATION);
  // const { nationsLoading, nationData, refetch } = useQuery();

  const nationColumns: TableProps<NationDataType>["columns"] = [
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

  const sportsColumns: TableProps<SportsDataType>["columns"] = [
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Event",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "English",
      dataIndex: "enName",
      key: "enName",
    },
    {
      title: "Prematch Bookmaker",
      dataIndex: "preBookmaker",
      key: "preBookmaker",
    },
    {
      title: "Live Bookmaker",
      dataIndex: "liveBookmaker",
      key: "liveBookmaker",
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
      title: "Use settings where adding a league",
      dataIndex: "useSettings",
      key: "useSettings",
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
      title: "Results by score",
      dataIndex: "resultsByScore",
      key: "resultsByScore",
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

  const leagueColumns: TableProps<LeagueDataType>["columns"] = [
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Nation",
      dataIndex: "nation",
      key: "nation",
      render: (_, record) => record.nation?.name 
    },
    {
      title: "Event",
      dataIndex: "event",
      key: "event",
    },
    {
      title: "Name",
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


  const teamColumns: TableProps<TeamDataType>["columns"] = [
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Nation",
      dataIndex: "nation",
      key: "nation",
      render: (_, record) => record.nation?.name 
    },
    {
      title: "Event",
      dataIndex: "event",
      key: "event",
    },
    {
      title: "League name",
      dataIndex: "league",
      key: "league",
      render: (_, record) => record.league?.name 
    },
    {
      title: "Team name",
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
                  {t("listCountries")}
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
                columns={nationColumns}
                dataSource={data}
                className="w-full"
              />
            </Card>
            <Card
              classNames={{
                body: "!p-0",
              }}
            >
              <Space className="gap-2">
                {t("sports")}
              </Space>
              <Table<SportsDataType>
                columns={sportsColumns}
                dataSource={sportsData}
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
                  {t("listLeague")}
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
              <Table<LeagueDataType>
                columns={leagueColumns}
                dataSource={leagueData ?? []}
                className="w-full"
              />
            </Card>
            <Card
              classNames={{
                body: "!p-0",
              }}
            >
              <Space className="w-full justify-around">
                <Space className="gap-2">
                  {t("listTeams")}
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
              <Table<TeamDataType>
                columns={teamColumns}
                dataSource={TeamData}
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
