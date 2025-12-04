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
  Select,
  message,
} from "antd";
import type { TableProps } from "antd";
import { Content } from "antd/es/layout/layout";
import { useFormatter, useTranslations } from "next-intl";
import dayjs, { Dayjs } from "dayjs";
import { formatNumber } from "@/lib";
import { USER_STATUS, USER_TYPE } from "@/constants";
import api from "@/api";
import { ReloadOutlined } from "@ant-design/icons";
import { usePageTitle } from "@/hooks/usePageTitle";

const { RangePicker } = DatePicker;

interface SubMember {
  id: number;
  userid: string;
  nickname: string;
  depositor: string;
  amountHeld: number;
  point: number;
  rollingGold: number;
  losingMoney: number;
  deposit: number;
  withdrawal: number;
  entryAndExit: number;
  numberOfDeposits: number;
  bet: number;
  winner: number;
  beDang: number;
  accessDate: string;
  dateOfRegistration: string;
  status: string;
  type: string;
  role: string;
  hasReferral: boolean;
}

interface TotalRow {
  userid: string;
  nickname: string;
  depositor: string;
  amountHeld: number;
  point: number;
  rollingGold: number;
  losingMoney: number;
  deposit: number;
  withdrawal: number;
  entryAndExit: number;
  numberOfDeposits: number;
  bet: number;
  winner: number;
  beDang: number;
}

export default function SubMemberListPage() {
  usePageTitle("Partner - Sub Member List Page");
  const t = useTranslations();
  const f = useFormatter();
  const [loading, setLoading] = useState<boolean>(false);
  const [members, setMembers] = useState<SubMember[]>([]);
  const [totalRow, setTotalRow] = useState<TotalRow | null>(null);
  const [total, setTotal] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [memberTypeFilter, setMemberTypeFilter] = useState<string>("");
  const [referralFilter, setReferralFilter] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null] | null>([
    dayjs("2020-01-01"),
    dayjs(),
  ]);
  const [currentTime, setCurrentTime] = useState<string>("");

  // Update current time
  useEffect(() => {
    const updateTime = () => {
      const now = dayjs().format("YYYY-MM-DD HH:mm:ss");
      setCurrentTime(now);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch members
  const fetchMembers = async () => {
    setLoading(true);
    try {
      const params: any = {
        page: currentPage,
        perPage: pageSize,
      };

      if (statusFilter) {
        params.status = statusFilter;
      }
      if (typeFilter) {
        params.type = typeFilter;
      }
      if (memberTypeFilter) {
        params.memberType = memberTypeFilter;
      }
      if (referralFilter) {
        params.referral = referralFilter;
      }
      if (searchQuery) {
        params.search = searchQuery;
      }
      if (dateRange && dateRange[0] && dateRange[1]) {
        params.dateFrom = dateRange[0].format("YYYY-MM-DD");
        params.dateTo = dateRange[1].format("YYYY-MM-DD");
      }

      const response = await api("partner/sub-management/sub-members", {
        method: "GET",
        params,
      });

      if (response.success) {
        setMembers(response.data || []);
        setTotalRow(response.total || null);
        setTotal(response.pagination?.total || 0);
      } else {
        message.error("Failed to fetch members");
      }
    } catch (error: any) {
      console.error("Error fetching members:", error);
      message.error(error?.response?.data?.message || "Failed to fetch members");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [currentPage, pageSize, statusFilter, typeFilter, memberTypeFilter, referralFilter, dateRange]);

  // Auto-refresh every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchMembers();
    }, 10000);

    return () => clearInterval(interval);
  }, [currentPage, pageSize, statusFilter, typeFilter, memberTypeFilter, referralFilter, dateRange, searchQuery]);

  const onSearch = () => {
    setCurrentPage(1);
    fetchMembers();
  };

  const onDateRangeChange = (dates: (Dayjs | null)[] | null) => {
    if (dates) {
      setDateRange([dates[0], dates[1]]);
    } else {
      setDateRange(null);
    }
    setCurrentPage(1);
  };

  const onStatusChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const onTypeChange = (value: string) => {
    setTypeFilter(value);
    setCurrentPage(1);
  };

  const onMemberTypeChange = (value: string) => {
    setMemberTypeFilter(value);
    setCurrentPage(1);
  };

  const onReferralChange = (value: string) => {
    setReferralFilter(value);
    setCurrentPage(1);
  };

  const handleRefresh = () => {
    fetchMembers();
  };

  // Prepare table data with total row
  const tableData: (SubMember & { isTotal?: boolean; key: string | number })[] = totalRow
    ? [
        {
          key: t("total"),
          id: 0,
          userid: totalRow.userid,
          nickname: totalRow.nickname,
          depositor: totalRow.depositor,
          amountHeld: totalRow.amountHeld,
          point: totalRow.point,
          rollingGold: totalRow.rollingGold,
          losingMoney: totalRow.losingMoney,
          deposit: totalRow.deposit,
          withdrawal: totalRow.withdrawal,
          entryAndExit: totalRow.entryAndExit,
          numberOfDeposits: totalRow.numberOfDeposits,
          bet: totalRow.bet,
          winner: totalRow.winner,
          beDang: totalRow.beDang,
          accessDate: "",
          dateOfRegistration: "",
          status: "",
          type: "",
          role: "",
          hasReferral: false,
          isTotal: true,
        },
        ...members.map((m) => ({ ...m, key: m.id, isTotal: false })),
      ]
    : members.map((m) => ({ ...m, key: m.id, isTotal: false }));

  const columns: TableProps<SubMember & { isTotal?: boolean; key: string | number }>["columns"] = [
    {
      title: t("number"),
      dataIndex: "number",
      key: "number",
      width: 80,
      render: (_, record, index) => {
        if (record.isTotal) return t("total");
        // Adjust index if total row is present (it's at index 0)
        const adjustedIndex = totalRow ? index - 1 : index;
        return (currentPage - 1) * pageSize + adjustedIndex + 1;
      },
    },
    {
      title: t("id"),
      dataIndex: "userid",
      key: "userid",
      width: 150,
      render: (text, record) => {
        if (record.isTotal) return "-";
        return (
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 flex items-center justify-center rounded-full bg-[#1677ff] text-white text-xs">
              {record.point > 0 ? 1 : 0}
            </div>
            <span className="text-xs text-[white] bg-[#000] px-1 py-0.5 rounded cursor-pointer">
              {text}
            </span>
          </div>
        );
      },
    },
    {
      title: t("nickname"),
      dataIndex: "nickname",
      key: "nickname",
      width: 120,
      render: (text, record) => (record.isTotal ? "-" : text),
    },
    {
      title: t("depositor"),
      dataIndex: "depositor",
      key: "depositor",
      width: 120,
      render: (text, record) => (record.isTotal ? "-" : text),
    },
    {
      title: t("membershipType") || "Membership Type",
      dataIndex: "type",
      key: "type",
      width: 120,
      render: (text, record) => {
        if (record.isTotal) return "-";
        const typeMap: Record<string, string> = {
          G: t("general"),
          T: t("test"),
          I: t("interest"),
          W: t("working"),
        };
        return typeMap[text] || text;
      },
    },
    {
      title: t("situation") || "Situation",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (text, record) => {
        if (record.isTotal) return "-";
        const statusMap: Record<string, string> = {
          A: t("approved"),
          S: t("suspened"),
          D: t("deleted"),
          B: t("blocked"),
          I: t("inactive"),
          P: t("pending"),
        };
        return statusMap[text] || text;
      },
    },
    {
      title: t("amountHeld"),
      dataIndex: "amountHeld",
      key: "amountHeld",
      width: 120,
      render: (text) => formatNumber(text || 0),
    },
    {
      title: t("point"),
      dataIndex: "point",
      key: "point",
      width: 100,
      render: (text) => formatNumber(text || 0),
    },
    {
      title: t("rollingGold"),
      dataIndex: "rollingGold",
      key: "rollingGold",
      width: 120,
      render: (text) => formatNumber(text || 0),
    },
    {
      title: t("losingMoney") || "Losing Money",
      dataIndex: "losingMoney",
      key: "losingMoney",
      width: 120,
      render: (text) => formatNumber(text || 0),
    },
    {
      title: t("deposit"),
      dataIndex: "deposit",
      key: "deposit",
      width: 120,
      render: (text) => formatNumber(text || 0),
    },
    {
      title: t("withdrawal"),
      dataIndex: "withdrawal",
      key: "withdrawal",
      width: 120,
      render: (text) => formatNumber(text || 0),
    },
    {
      title: t("entryAndExit") || "Entry and Exit",
      dataIndex: "entryAndExit",
      key: "entryAndExit",
      width: 120,
      render: (text) => formatNumber(text || 0),
    },
    {
      title: t("numberOfDeposits") || "Number of Deposits",
      dataIndex: "numberOfDeposits",
      key: "numberOfDeposits",
      width: 120,
      render: (text) => formatNumber(text || 0),
    },
    {
      title: t("bet"),
      dataIndex: "bet",
      key: "bet",
      width: 120,
      render: (text) => formatNumber(text || 0),
    },
    {
      title: t("winner"),
      dataIndex: "winner",
      key: "winner",
      width: 120,
      render: (text) => formatNumber(text || 0),
    },
    {
      title: t("bedang") || "Be-Dang",
      dataIndex: "beDang",
      key: "beDang",
      width: 120,
      render: (text) => formatNumber(text || 0),
    },
    {
      title: t("accessDate"),
      dataIndex: "accessDate",
      key: "accessDate",
      width: 180,
      render: (text, record) => {
        if (record.isTotal) return "-";
        return text ? f.dateTime(new Date(text)) : "-";
      },
    },
    {
      title: t("dateOfRegistration"),
      dataIndex: "dateOfRegistration",
      key: "dateOfRegistration",
      width: 180,
      render: (text, record) => {
        if (record.isTotal) return "-";
        return text ? f.dateTime(new Date(text)) : "-";
      },
    },
  ];

  const onChange: TableProps<SubMember & { isTotal?: boolean; key: string | number }>["onChange"] = (
    pagination,
    filters,
    sorter
  ) => {
    if (pagination.current) {
      setCurrentPage(pagination.current);
    }
    if (pagination.pageSize) {
      setPageSize(pagination.pageSize);
      setCurrentPage(1);
    }
  };

  return (
    <Layout>
      <Content className="overflow-auto h-[calc(100vh-100px)] dark:bg-black">
        <Card
          title={
            <div className="flex justify-between items-center w-full">
              <span>{t("partner/menu/sub-member-list")}</span>
              <div className="flex items-center gap-2">
                <span className="text-sm">{currentTime}</span>
                <Button
                  type="text"
                  icon={<ReloadOutlined />}
                  onClick={handleRefresh}
                  size="small"
                />
              </div>
            </div>
          }
          classNames={{
            body: "!p-0",
          }}
        >
          <Space className="p-2 !w-full" direction="vertical">
            {/* Member Type Filters */}
            <Space wrap>
              <Radio.Group
                size="small"
                optionType="button"
                buttonStyle="solid"
                value={memberTypeFilter}
                onChange={(e) => onMemberTypeChange(e.target.value)}
                options={[
                  { label: t("member") || "member", value: "member" },
                  { label: t("distributor") || "Distributor", value: "distributor" },
                  { label: t("distributor") + " + " + t("member") || "Distributor + Member", value: "distributor+member" },
                ]}
              />
            </Space>

            {/* Referral Link Filters */}
            <Space wrap>
              <Radio.Group
                size="small"
                optionType="button"
                buttonStyle="solid"
                value={referralFilter}
                onChange={(e) => onReferralChange(e.target.value)}
                options={[
                  { label: t("entire") || "entire", value: "" },
                  { label: t("referralLinkO") || "Referral link O", value: "has" },
                  { label: t("noReferralLinkX") || "No referral link X", value: "none" },
                ]}
              />
            </Space>

            {/* Member Status Filters */}
            <Space wrap>
              <Radio.Group
                size="small"
                optionType="button"
                buttonStyle="solid"
                value={typeFilter}
                onChange={(e) => onTypeChange(e.target.value)}
                options={[
                  { label: t("allMembers") || "All members", value: "" },
                  { label: t("general"), value: "G" },
                  { label: t("test"), value: "T" },
                  { label: t("interest"), value: "I" },
                  { label: t("working"), value: "W" },
                ]}
              />
            </Space>

            {/* Approval/Activity Status Filters */}
            <Space wrap>
              <Radio.Group
                size="small"
                optionType="button"
                buttonStyle="solid"
                value={statusFilter}
                onChange={(e) => onStatusChange(e.target.value)}
                options={[
                  { label: t("entire") || "entire", value: "" },
                  { label: t("approved"), value: "A" },
                  { label: t("membersWhoRefuseToJoin") || "Members who refuse to join", value: "P" },
                  { label: t("suspened"), value: "S" },
                  { label: t("deleted"), value: "D" },
                  { label: t("dormantMember") || "dormant member", value: "I" },
                ]}
              />
            </Space>

            {/* Search and Filter Section */}
            <Space className="!w-full justify-between" wrap>
              <Space wrap>
                <RangePicker
                  size="small"
                  value={dateRange}
                  onChange={onDateRangeChange}
                  format="YYYY-MM-DD"
                />
                <Input.Search
                  size="small"
                  placeholder={t("idNicknameAccount") || "ID/Nickname/Account holder/Phone"}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onSearch={onSearch}
                  enterButton={t("search")}
                  style={{ width: 300 }}
                />
              </Space>
              <Select
                size="small"
                value={pageSize}
                onChange={(value) => {
                  setPageSize(value);
                  setCurrentPage(1);
                }}
                style={{ width: 120 }}
                options={[
                  { label: "25 outputs", value: 25 },
                  { label: "50 outputs", value: 50 },
                  { label: "100 outputs", value: 100 },
                  { label: "250 outputs", value: 250 },
                  { label: "500 outputs", value: 500 },
                ]}
              />
            </Space>
          </Space>
          <Table<SubMember & { isTotal?: boolean; key: string | number }>
            columns={columns}
            loading={loading}
            dataSource={tableData}
            className="w-full"
            size="small"
            scroll={{ x: "max-content" }}
            onChange={onChange}
            pagination={{
              showTotal: (total, range) => {
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
              pageSizeOptions: ["25", "50", "100", "250", "500"],
            }}
            rowClassName={(record) => {
              return record.isTotal ? "bg-gray-100 font-bold" : "";
            }}
          />
        </Card>
      </Content>
    </Layout>
  );
}
