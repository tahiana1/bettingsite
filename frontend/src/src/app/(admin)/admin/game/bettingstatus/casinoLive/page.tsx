"use client";
import React, { useEffect, useState } from "react";
import * as XLSX from 'xlsx';

import {
  Layout,
  Space,
  Card,
  Table,
  Button,
  Input,
  DatePicker,
  Radio,
  Select,
} from "antd";
import { FilterDropdown } from "@refinedev/antd";
import type { TableProps } from "antd";

import { Content } from "antd/es/layout/layout";
import { useFormatter, useTranslations } from "next-intl";
import { fetchCasinoBets, CasinoBetFilters } from "@/actions/betLog";
import { RxLetterCaseToggle } from "react-icons/rx";
import { Dayjs } from "dayjs";
import { isValidDate, parseTableOptions } from "@/lib";

interface CasinoBet {
  id: string;
  type: string;
  userId: string;
  gameId: string;
  amount: number;
  status: string;
  gameName: string;
  transId: string;
  winningAmount: number;
  bettingTime: number;
  details: any;
  beforeAmount: number;
  afterAmount: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  user: {
    id: string;
    name: string;
    userid: string;
    role: string;
    parent?: {
      id: string;
      userid: string;
    };
    root?: {
      id: string;
      userid: string;
    };
    profile: {
      id: string;
      userId: string;
      name: string;
      nickname: string;
      bankName: string;
      holderName: string;
      accountNumber: string;
      phone: string;
      mobile: string;
      balance: number;
      point: number;
      comp: number;
      level: number;
      favorites: string;
      referral: string;
      lastDeposit: string;
      lastWithdraw: string;
    };
  };
}

const CasinoLive: React.FC = () => {
  const t = useTranslations();
  const f = useFormatter();

  const [range, setRange] = useState<any[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [casinoBets, setCasinoBets] = useState<CasinoBet[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const popupWindow = (id: number) => {
    window.open(`/admin/popup/user?id=${id}`, '_blank', 'width=1200,height=800,toolbar=no,menubar=no,scrollbars=yes,resizable=yes,location=no,status=no');
  }

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);
  const [filters, setFilters] = useState<CasinoBetFilters>({
    game_name_filter: "not_slot",
    limit: 25,
    offset: 0,
  });

  const loadCasinoBets = async () => {
    setLoading(true);
    try {
      const result = await fetchCasinoBets(filters);
      setCasinoBets(result.casinoBets.map((bet: any) => ({ ...bet, key: bet.id })));
      setTotal(result.total);
    } catch (error) {
      console.error("Error loading casino bets:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCasinoBets();
  }, [filters]);

  useEffect(() => {
    const interval = setInterval(() => {
      loadCasinoBets();
    }, 5000);
    return () => clearInterval(interval);
  }, [filters]);

  const onStatusChange = (v: string = "") => {
    setFilters(prev => ({
      ...prev,
      status: v && v !== "entire" ? v : "",
      offset: 0,
    }));
    setCurrentPage(1);
  };

  const labelRenderer = (props: any) =>
    props.value.toString() == "100"
      ? "Premium"
      : (parseInt(props.value.toString()) > 100 ? "VIP " : "Level ") +
        props.value;

  const levelOption = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 101, 102, 100,
  ].map((i) => ({
    value: i,
    label: i == 100 ? "Premium" : (i > 100 ? "VIP " : "Level ") + i,
  }));

  const columns: TableProps<CasinoBet>["columns"] = [
    {
      title: t("number"),
      dataIndex: "id", 
      key: "id",
      render: (_, __, index) => index + 1
    },
    {
      title: t("root_dist"),
      dataIndex: "root.userid",
      key: "root.userid",
      render(_, record) {
        return record.user?.root?.userid;
      },
    },
    {
      title: t("top_dist"),
      dataIndex: "top_dist",
      key: "top_dist",
      render(_, record) {
        return record.user?.parent?.userid;
      },
    },
    {
      title: "Level",
      dataIndex: "level",
      key: "level",
      fixed: "left",
      render: (_, record) => {
        return <div className="flex items-center cursor-pointer" onClick={() => popupWindow(parseInt(record.user?.id))}>
          <p className="w-[15px] h-[15px] flex items-center justify-center rounded-full bg-[#1677ff] text-white text-xs">{record.user?.profile?.level}</p>
          <p className="text-xs text-[white] bg-[#000] px-1 py-0.5 rounded">{record.user?.profile?.name}</p>
        </div>
      },
    },
    {
      title: t("nickname"),
      dataIndex: "profile.nickname",
      key: "profile.nickname",
      render: (_, record) => record.user?.profile?.nickname,
    },
    {
      title: t("phone"),
      dataIndex: "profile.phone",
      key: "profile.phone",
      render: (_, record) => record.user?.profile?.phone,
      filterDropdown: (props) => (
        <FilterDropdown {...props}>
          <Input className="w-full" />
        </FilterDropdown>
      ),
    },
    {
      title: "Game ID",
      dataIndex: "gameId",
      key: "gameId",
      render: (_, record) => record.gameId,
    },
    {
      title: "Game Name",
      dataIndex: "gameName",
      key: "gameName",
      render: (_, record) => record.gameName,
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (_, record) => record.type,
    },
    {
      title: "Transaction ID",
      dataIndex: "transId",
      key: "transId",
      render: (_, record) => record.transId,
    },
    {
      title: t("amount"),
      dataIndex: "amount",
      key: "amount",
      render: (_, record) => f.number(record.amount),
    },
    {
      title: "Winning Amount",
      dataIndex: "winningAmount",
      key: "winningAmount",
      render: (_, record) => f.number(record.winningAmount),
    },
    {
      title: "Before Amount",
      dataIndex: "beforeAmount",
      key: "beforeAmount",
      render: (_, record) => f.number(record.beforeAmount),
    },
    {
      title: "After Amount",
      dataIndex: "afterAmount",
      key: "afterAmount",
      render: (_, record) => f.number(record.afterAmount),
    },
    {
      title: "Betting Time",
      dataIndex: "bettingTime",
      key: "bettingTime",
      render: (_, record) => record.bettingTime,
    },
    {
      title: "Details",
      dataIndex: "details",
      key: "details",
      render: (_, record) => (
        <div className="max-w-xs overflow-hidden text-ellipsis">
          {record.details ? JSON.stringify(record.details) : '-'}
        </div>
      ),
    },
    {
      title: t("createdAt"),
      dataIndex: "createdAt",
      key: "createdAt",
      render: (v) => (isValidDate(v) ? f.dateTime(new Date(v)) : ""),
    },
    {
      title: t("updatedAt"),
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (v) => (isValidDate(v) ? f.dateTime(new Date(v)) : ""),
    },
    {
      title: t("status"),
      dataIndex: "status",
      key: "status",
      fixed: "right",
      render: (_, record) => {
        return <div className="text-xs">
          {record.status === "won" && <span className="bg-green-500 text-white px-2 py-1 rounded">Won</span>}
          {record.status === "lost" && <span className="bg-red-500 text-white px-2 py-1 rounded">Lost</span>}
          {record.status === "pending" && <span className="bg-yellow-500 text-white px-2 py-1 rounded">Pending</span>}
          {record.status === "cancelled" && <span className="bg-gray-500 text-white px-2 py-1 rounded">Cancelled</span>}
          {!["won", "lost", "pending", "cancelled"].includes(record.status) && <span className="bg-blue-500 text-white px-2 py-1 rounded">{record.status}</span>}
        </div>
      }
    },
  ];

  const onChange: TableProps<CasinoBet>["onChange"] = (
    pagination,
    filters,
    sorter,
    extra
  ) => {
    if (pagination) {
      const newPage = pagination.current || 1;
      const newPageSize = pagination.pageSize || 25;
      
      setCurrentPage(newPage);
      setPageSize(newPageSize);
      setFilters(prev => ({
        ...prev,
        limit: newPageSize,
        offset: (newPage - 1) * newPageSize,
      }));
    }
  };

  const onLevelChange = (v: string = "") => {
    // Level filtering would need to be implemented in the backend API
    // For now, we'll skip this functionality
    console.log("Level filter not yet implemented:", v);
  };

  const onRangerChange = (
    dates: (Dayjs | null)[] | null,
    dateStrings: string[]
  ) => {
    setRange(dateStrings);
    
    if (dates?.[0] && dates?.[1]) {
      const startDate = dates[0].startOf('day').toISOString();
      const endDate = dates[1].endOf('day').toISOString();
      
      setFilters(prev => ({
        ...prev,
        date_from: startDate,
        date_to: endDate,
        offset: 0,
      }));
    } else {
      setFilters(prev => ({
        ...prev,
        date_from: "",
        date_to: "",
        offset: 0,
      }));
    }
    
    setCurrentPage(1);
  };


  const onSearch = (value: string) => {
    // Search functionality would need to be implemented in the backend API
    // For now, we'll skip this functionality
    console.log("Search not yet implemented:", value);
  };

  const handleDownload = () => {
    // Create worksheet from casino bets data
    const worksheet = XLSX.utils.json_to_sheet(
      casinoBets.map((bet) => ({
        ID: bet.id,
        "User ID": bet.userId,
        "Game ID": bet.gameId,
        "Game Name": bet.gameName,
        Type: bet.type,
        "Transaction ID": bet.transId,
        Amount: bet.amount,
        "Winning Amount": bet.winningAmount,
        "Before Amount": bet.beforeAmount,
        "After Amount": bet.afterAmount,
        "Betting Time": bet.bettingTime,
        Status: bet.status,
        [t("nickname")]: bet.user?.profile?.nickname,
        [t("phone")]: bet.user?.profile?.phone,
        [t("level")]: bet.user?.profile?.level,
        [t("createdAt")]: bet.createdAt ? f.dateTime(new Date(bet.createdAt)) : "",
        [t("updatedAt")]: bet.updatedAt ? f.dateTime(new Date(bet.updatedAt)) : "",
        Details: bet.details ? JSON.stringify(bet.details) : "",
      }))
    );

    // Create workbook and append worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Casino Live Bets");

    // Generate Excel file and trigger download
    XLSX.writeFile(workbook, "casino_live_bets.xlsx");
  };

  return (
    <Layout>
      <Content className="overflow-auto h-[calc(100vh-100px)] dark:bg-black">
        <Card
          title="Casino Live Betting Status"
          classNames={{
            body: "!p-0",
          }}
        >
          <Space className="p-2 !w-full" direction="vertical">
            <Space wrap>
              <Radio.Group
                size="small"
                optionType="button"
                buttonStyle="solid"
                options={[
                  {
                    label: t("entire"),
                    value: "entire",
                  },
                  {
                    label: "Won",
                    value: "won",
                  },
                  {
                    label: "Lost",
                    value: "lost",
                  },
                  {
                    label: "Pending",
                    value: "pending",
                  },
                  {
                    label: "Cancelled",
                    value: "cancelled",
                  },
                ]}
                defaultValue={"entire"}
                onChange={(e) => onStatusChange(e.target.value)}
              />
            </Space>
            <Space className="!w-full justify-between">
              <Space>
                <DatePicker.RangePicker
                  size="small"
                  onChange={onRangerChange}
                />
                <Input.Search
                  size="small"
                  placeholder="Nickname, Phone, Transaction ID"
                  suffix={
                    <Button
                      size="small"
                      type="text"
                      icon={<RxLetterCaseToggle />}
                    />
                  }
                  enterButton={t("search")}
                  onSearch={onSearch}
                />
                <Select
                  size="small"
                  placeholder="By Level"
                  className="min-w-28"
                  allowClear
                  onClear={onLevelChange}
                  options={levelOption}
                  labelRender={labelRenderer}
                  onChange={onLevelChange}
                />
              </Space>
              <Space.Compact className="gap-1">
                <Button size="small" type="primary" onClick={handleDownload}>
                  {t("download")}
                </Button>
              </Space.Compact>
            </Space>
          </Space>

          <Table<CasinoBet>
            columns={columns}
            loading={loading}
            dataSource={casinoBets ?? []}
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
              current: currentPage,
              pageSize: pageSize,
              showSizeChanger: true,
              pageSizeOptions: [25, 50, 100, 250, 500, 1000],
            }}
          />
        </Card>
      </Content>
    </Layout>
  );
};

export default CasinoLive;
