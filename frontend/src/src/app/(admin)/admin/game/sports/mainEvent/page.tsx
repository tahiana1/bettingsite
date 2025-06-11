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
  Tooltip,
  Modal,
} from "antd";

import type { TableProps } from "antd";
import { Content } from "antd/es/layout/layout";

import { useTranslations } from "next-intl";

import { RxLetterCaseToggle } from "react-icons/rx";
import { BiBlock, BiEdit, BiPlus, BiShow, BiTrash } from "react-icons/bi";
import { useQuery } from "@apollo/client";
import { FILTER_NATION } from "@/actions/nation";


interface LeagueDataType {
  key: React.Key;
  id: React.Key;
  nation: string;
  event: string;
  code: string;
  name: string;
  enName: string;
}

interface MatchDataType {
  id: string;
  name: string;
  orderNum: number;
  showYn: Boolean;
}

const leagueData: LeagueDataType[] = [
  {
    key: "1",
    id: "1",
    code: "9",
    name: "MLB",
    enName: "MLB",
    nation: "USA",
    event: "baseball",
  },
  {
    key: "2",
    id: "2",
    code: "10",
    name: "MLB.All-Star Game",
    enName: "MLB.All-Star Game",
    nation: "USA",
    event: "baseball",
  },
];

const MatchData: MatchDataType[] = [
  {
    id: "1",
    name: "UFC Fight Night",
    orderNum: 1,
    showYn: true,
  },
  {
    id: "2",
    name: "UFC 309",
    orderNum: 2,
    showYn: true,
  },
  {
    id: "3",
    name: "KBO",
    orderNum: 3,
    showYn: true,
  },
];

const MainEventSettings: React.FC = () => {
  const t = useTranslations();

  const [addLeagueModal, setAddLeagueModal] = useState<boolean>(false);

  const onAddLeague = async () => {
    setAddLeagueModal(false);
  };

  const MatchColumns: TableProps<MatchDataType>["columns"] = [
    {
      title: t("number"),
      dataIndex: "number",
      key: "number",
      render: (_, __, index) => index + 1,
      width: 50,
    },
    {
      title: t("name"),
      dataIndex: "name",
      key: "name",
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
    {
      title: t("presentOrNot"),
      dataIndex: "showYn",
      key: "showYn",
      render: (text, record) => {
        return (
          <Switch
            size="small"
            checked={text}
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
          <Tooltip title={t("change")}>
            <Button
              type="primary"
              variant="outlined"
              color="primary"
              icon={<BiEdit />}
              // onClick={() => onBlockMatch(record)}
            />
          </Tooltip>
          <Tooltip title={t("viewLeague")}>
            <Button
              type="primary"
              variant="outlined"
              color="danger"
              icon={<BiShow />}
              // onClick={() => onBlockMatch(record)}
            />
          </Tooltip>
          <Tooltip title={t("addLeague")}>
            <Button
              type="primary"
              variant="outlined"
              color="green"
              icon={<BiPlus />}
              onClick={() => setAddLeagueModal(true)}
            />
          </Tooltip>
          <Popconfirm
            title={t("confirmSure")}
            // onConfirm={() => onDeleteMatch(record)}
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

  const leagueColumns: TableProps<LeagueDataType>["columns"] = [
    {
      title: t("code"),
      dataIndex: "code",
      key: "code",
    },
    {
      title: t("nation"),
      dataIndex: "nation",
      key: "nation",
    },
    {
      title: t("event"),
      dataIndex: "event",
      key: "event",
    },
    {
      title: t("leagueName"),
      dataIndex: "name",
      key: "name",
    },
    {
      title: t("englishName"),
      dataIndex: "enName",
      key: "enName",
    },
  ];

  const rowSelection: TableProps<LeagueDataType>['rowSelection'] = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: LeagueDataType[]) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    getCheckboxProps: (record: LeagueDataType) => ({
      disabled: record.name === 'Disabled User',
      name: record.name,
    }),
  };

  const handleAddLeague = () => {
    // Logic to handle adding a league
    console.log("League added");
    setAddLeagueModal(false);
  };

  return (
    <Layout>
      <Content className="overflow-auto h-[calc(100vh-100px)] dark:bg-black">
        <Card
          title={t("admin/menu/mainEventSettings")}
        >
          <Row>
            <Col span={12} className="px-1">
              <Card size="small"
                title={`${t("listMainEvents")}`}
                extra={<Space className="gap-2">
                  <Input.Search
                    size="small"
                    placeholder={t("name")}
                    enterButton={t("search")}
                  />
                  <Button
                    size="small"
                    type="primary"
                    // onClick={onAddMatch}
                  >{t("add")}</Button>
                </Space>}
                className="w-full">
                <Table<MatchDataType>
                  columns={MatchColumns}
                  dataSource={MatchData}
                  className="w-full"
                />
              </Card>
            </Col>
            <Col span={12} className="px-1">
              <Card size="small"
                title={`${t("leagueList")}`}
                className="w-full"
                extra={<Space className="gap-2">
                  <Input.Search
                    size="small"
                    placeholder={t("leagueName")}
                    suffix={
                      <Button
                        size="small"
                        type="text"
                      />
                    }
                    enterButton={t("search")}
                  />
                </Space>}
              >
                <Table<LeagueDataType>
                  columns={leagueColumns}
                  dataSource={leagueData}
                  className="w-full"
                />
              </Card>
            </Col>
          </Row>
          <Modal
            open={addLeagueModal}
            onCancel={() => setAddLeagueModal(false)}
            onOk={onAddLeague}
            title={t("addLeague")}
            footer={[
              <Button key="submit" type="primary" onClick={handleAddLeague}>
                {t("add")}
              </Button>
            ]}
            width={{
              xs: '90%',
              sm: '80%',
              md: '70%',
              lg: '60%',
              xl: '50%',
              xxl: '40%',
            }}
          >
              <Card size="small"
                title={`${t("leagueList")}`}
                className="w-full"
                extra={<Space className="gap-2">
                  <Input.Search
                    size="small"
                    placeholder={t("leagueName")}
                    suffix={
                      <Button
                        size="small"
                        type="text"
                      />
                    }
                    enterButton={t("search")}
                  />
                </Space>}
              >
                <Table<LeagueDataType>
                  columns={leagueColumns}
                  dataSource={leagueData}
                  rowSelection={{ type: 'checkbox', ...rowSelection }}
                  className="w-full"
                />
              </Card>
          </Modal>
        </Card>
      </Content>
    </Layout>
  );
};

export default MainEventSettings;
