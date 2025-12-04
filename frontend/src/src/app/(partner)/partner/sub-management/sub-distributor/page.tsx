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
  Checkbox,
  message,
} from "antd";
import type { TableProps } from "antd";
import { Content } from "antd/es/layout/layout";
import { useFormatter, useTranslations } from "next-intl";
import dayjs, { Dayjs } from "dayjs";
import { formatNumber } from "@/lib";
import api from "@/api";
import { ReloadOutlined, UserAddOutlined, MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { usePageTitle } from "@/hooks/usePageTitle";
import DirectMemberRegistrationModal from "@/components/Partner/DirectMemberRegistrationModal";

const { RangePicker } = DatePicker;

interface SubDistributor {
  id: number;
  userid: string;
  nickname: string;
  numberOfMembers: number;
  status: string;
  amountHeld: number;
  point: number;
  settlementType: string;
  rollingRate: string;
  rollingToday: number;
  losingRate: string;
  losingToday: number;
  subDistributors?: SubDistributor[];
}

export default function SubDistributorPage() {
  usePageTitle("Partner - Sub Distributor Page");
  const t = useTranslations();
  const f = useFormatter();
  const [loading, setLoading] = useState<boolean>(false);
  const [distributors, setDistributors] = useState<SubDistributor[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null] | null>(null);
  const [levelFilter, setLevelFilter] = useState<string>("");
  const [onlyDirectMembers, setOnlyDirectMembers] = useState<boolean>(false);
  const [expandedRowKeys, setExpandedRowKeys] = useState<React.Key[]>([]);
  const [currentTime, setCurrentTime] = useState<string>("");
  const [pageSize, setPageSize] = useState<number>(50);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState<boolean>(false);

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

  // Fetch distributors
  const fetchDistributors = async () => {
    setLoading(true);
    try {
      const params: any = {};

      if (statusFilter) {
        params.status = statusFilter;
      }
      if (searchQuery) {
        params.search = searchQuery;
      }
      if (dateRange && dateRange[0] && dateRange[1]) {
        params.dateFrom = dateRange[0].format("YYYY-MM-DD");
        params.dateTo = dateRange[1].format("YYYY-MM-DD");
      }
      if (levelFilter) {
        params.level = levelFilter;
      }
      if (onlyDirectMembers) {
        params.onlyDirectMembers = "true";
      }

      const response = await api("partner/sub-management/sub-distributors", {
        method: "GET",
        params,
      });

      if (response.success) {
        const data = response.data || [];
        setDistributors(data);
        // Set all rows as expanded by default
        const allKeys = getAllRowKeys(data);
        setExpandedRowKeys(allKeys);
        // Set total count - use root level count for pagination
        // Children are shown with their parents, so pagination is based on root items only
        setTotal(data.length);
      } else {
        message.error("Failed to fetch sub-distributors");
      }
    } catch (error: any) {
      console.error("Error fetching sub-distributors:", error);
      message.error(error?.response?.data?.message || "Failed to fetch sub-distributors");
    } finally {
      setLoading(false);
    }
  };

  // Get all row keys recursively for default expansion
  const getAllRowKeys = (data: SubDistributor[]): React.Key[] => {
    const keys: React.Key[] = [];
    data.forEach((item) => {
      keys.push(item.id);
      if (item.subDistributors && item.subDistributors.length > 0) {
        keys.push(...getAllRowKeys(item.subDistributors));
      }
    });
    return keys;
  };

  useEffect(() => {
    fetchDistributors();
  }, [statusFilter, dateRange, levelFilter, onlyDirectMembers, currentPage, pageSize]);

  // Auto-refresh every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchDistributors();
    }, 60000);

    return () => clearInterval(interval);
  }, [statusFilter, dateRange, levelFilter, onlyDirectMembers, searchQuery]);

  const onSearch = () => {
    setCurrentPage(1); // Reset to first page when searching
    fetchDistributors();
  };

  const onDateRangeChange = (dates: (Dayjs | null)[] | null) => {
    if (dates) {
      setDateRange([dates[0], dates[1]]);
    } else {
      setDateRange(null);
    }
    setCurrentPage(1); // Reset to first page when date filter changes
  };

  const onStatusChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handleRefresh = () => {
    fetchDistributors();
  };

  const handleSubDistributorRegistration = () => {
    setIsRegistrationModalOpen(true);
  };

  const handleRegistrationSuccess = () => {
    fetchDistributors();
  };

  // Flatten data structure for table display with parent-child relationships
  // This creates a flat list where children appear as rows when parent is expanded
  // Pagination is applied to root level items, children are always shown with their parents
  const flattenTableData = (data: SubDistributor[], level: number = 0, parentId?: number): any[] => {
    const result: any[] = [];
    data.forEach((item) => {
      const rowData = {
        ...item,
        key: `${item.id}-${level}`,
        level,
        isSubDistributor: level > 0,
        parentId,
        hasChildren: !!(item.subDistributors && item.subDistributors.length > 0),
      };
      result.push(rowData);
      
      // If expanded, add children as regular rows
      if (expandedRowKeys.includes(item.id) && item.subDistributors && item.subDistributors.length > 0) {
        result.push(...flattenTableData(item.subDistributors, level + 1, item.id));
      }
    });
    return result;
  };

  // Apply pagination to root level items only
  // Get root level items for pagination
  const rootItems = distributors;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedRootItems = rootItems.slice(startIndex, endIndex);
  
  // Flatten only the paginated root items (children are included if parent is expanded)
  const tableData = flattenTableData(paginatedRootItems);
  
  // Update total to be root items count
  const rootItemsCount = rootItems.length;

  const columns: TableProps<SubDistributor & { level: number; isSubDistributor: boolean; hasChildren?: boolean; parentId?: number }>["columns"] = [
    {
      title: t("rootDistributor") || "Root Distributor",
      dataIndex: "userid",
      key: "userid",
      width: 200,
      fixed: "left",
      render: (text, record) => {
        const hasSubDistributors = record.hasChildren || (record.subDistributors && record.subDistributors.length > 0);
        const isExpanded = expandedRowKeys.includes(record.id);
        const indentLevel = record.level || 0;
        
        return (
          <div className="flex items-center gap-2" style={{ paddingLeft: `${indentLevel * 24}px` }}>
            {hasSubDistributors && record.level === 0 && (
              <span 
                className="text-blue-500 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  onExpand(!isExpanded, record);
                }}
              >
                {isExpanded ? <MinusOutlined /> : <PlusOutlined />}
              </span>
            )}
            {record.level > 0 && (
              <span className="w-4 flex items-center justify-center">
                <span className="w-0.5 h-4 bg-gray-300"></span>
              </span>
            )}
            {!hasSubDistributors && record.level === 0 && <span className="w-4" />}
            <span className="text-xs text-white bg-black px-1 py-0.5 rounded cursor-pointer">
              {text}
            </span>
            {record.nickname && (
              <span className="text-xs text-gray-600">({record.nickname})</span>
            )}
          </div>
        );
      },
    },
    {
      title: t("numberOfMembers") || "Number of members",
      dataIndex: "numberOfMembers",
      key: "numberOfMembers",
      width: 120,
      render: (text) => formatNumber(text || 0),
    },
    {
      title: t("situation") || "situation",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (text) => {
        const statusMap: Record<string, { color: string; label: string }> = {
          A: { color: "blue", label: t("normal") || "normal" },
          S: { color: "orange", label: t("suspened") || "Suspended" },
          D: { color: "red", label: t("deleted") || "Deleted" },
          I: { color: "gray", label: t("inactive") || "Inactive" },
          P: { color: "yellow", label: t("pending") || "Pending" },
        };
        const status = statusMap[text] || { color: "default", label: text };
        return <Tag color={status.color}>{status.label}</Tag>;
      },
    },
    {
      title: t("amountHeld") || "Amount held",
      dataIndex: "amountHeld",
      key: "amountHeld",
      width: 120,
      render: (text) => formatNumber(text || 0),
    },
    {
      title: t("point") || "point",
      dataIndex: "point",
      key: "point",
      width: 100,
      render: (text) => formatNumber(text || 0),
    },
    {
      title: t("settlementType") || "Settlement type",
      dataIndex: "settlementType",
      key: "settlementType",
      width: 200,
      render: (text) => <span className="text-xs">{text}</span>,
    },
    {
      title: t("rollingRate") || "Rolling rate (%)",
      dataIndex: "rollingRate",
      key: "rollingRate",
      width: 150,
      render: (text) => <span className="text-xs font-mono">{text}</span>,
    },
    {
      title: t("rollingToday") || "Rolling (today)",
      dataIndex: "rollingToday",
      key: "rollingToday",
      width: 120,
      render: (text) => formatNumber(text || 0),
    },
    {
      title: t("losingRate") || "Losing rate",
      dataIndex: "losingRate",
      key: "losingRate",
      width: 150,
      render: (text) => <span className="text-xs font-mono">{text}</span>,
    },
    {
      title: t("losingToday") || "Losing (today)",
      dataIndex: "losingToday",
      key: "losingToday",
      width: 120,
      render: (text) => formatNumber(text || 0),
    },
    // {
    //   title: t("function") || "function",
    //   key: "function",
    //   width: 150,
    //   render: (_, record) => {
    //     if (record.isSubDistributor) {
    //       return (
    //         <Button
    //           type="link"
    //           size="small"
    //           onClick={() => {
    //             // Handle losing rolling settings
    //             message.info("Losing rolling settings");
    //           }}
    //         >
    //           {t("losingRollingSetting") || "Losing rolling settings"}
    //         </Button>
    //       );
    //     }
    //     return null;
    //   },
    // },
  ];

  const onExpand = (expanded: boolean, record: SubDistributor & { level: number; isSubDistributor: boolean; hasChildren?: boolean; parentId?: number }) => {
    if (expanded) {
      setExpandedRowKeys([...expandedRowKeys, record.id]);
    } else {
      // Remove this key and all its children from expanded keys
      const removeKeys = (id: number): number[] => {
        const keys = [id];
        const findItem = (items: SubDistributor[], targetId: number): SubDistributor | null => {
          for (const item of items) {
            if (item.id === targetId) return item;
            if (item.subDistributors) {
              const found = findItem(item.subDistributors, targetId);
              if (found) return found;
            }
          }
          return null;
        };
        const item = findItem(distributors, id);
        if (item?.subDistributors) {
          item.subDistributors.forEach(sub => {
            keys.push(...removeKeys(sub.id));
          });
        }
        return keys;
      };
      const keysToRemove = removeKeys(record.id);
      setExpandedRowKeys(expandedRowKeys.filter((key) => !keysToRemove.includes(key as number)));
    }
  };

  // Don't use expandedRowRender - we're flattening the data instead to show children as rows
  const expandedRowRender = undefined;

  return (
    <Layout>
      <Content className="overflow-auto h-[calc(100vh-100px)] dark:bg-black">
        <Card
          title={
            <div className="flex justify-between items-center w-full">
              <span>{t("partner/menu/sub-distributor") || "List of sub-distributors"}</span>
              <div className="flex items-center gap-2">
                <span className="text-sm">{currentTime}</span>
                <Button
                  type="text"
                  icon={<ReloadOutlined />}
                  onClick={handleRefresh}
                  size="small"
                />
                <Button
                  type="primary"
                  icon={<UserAddOutlined />}
                  onClick={handleSubDistributorRegistration}
                >
                  {t("subDistributorRegistration") || "Sub-distributor registration"}
                </Button>
              </div>
            </div>
          }
          classNames={{
            body: "!p-0",
          }}
        >
          <Space className="p-2 !w-full" direction="vertical">
            {/* Member Status Tabs */}
            <Space wrap>
              <Radio.Group
                size="small"
                optionType="button"
                buttonStyle="solid"
                value={statusFilter}
                onChange={(e) => onStatusChange(e.target.value)}
                options={[
                  { label: t("entire") || "entire", value: "" },
                  { label: t("approved") || "Approved member", value: "A" },
                  { label: t("membersWhoRefuseToJoin") || "Members who refuse to join", value: "R" },
                  { label: t("suspened") || "Suspended member", value: "S" },
                  { label: t("deleted") || "Deleted member", value: "D" },
                  { label: t("inactive") || "dormant member", value: "I" },
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
                {/* <Select
                  size="small"
                  placeholder={t("byLevel") || "By level"}
                  value={levelFilter}
                  onChange={(value) => {
                    setLevelFilter(value);
                    setCurrentPage(1); // Reset to first page when level filter changes
                  }}
                  style={{ width: 120 }}
                  options={[
                    { label: t("entire") || "entire", value: "" },
                    { label: "Level 1", value: "1" },
                    { label: "Level 2", value: "2" },
                    { label: "Level 3", value: "3" },
                  ]}
                /> */}
                {/* <Select
                  size="small"
                  placeholder={t("entire") || "entire"}
                  value=""
                  style={{ width: 120 }}
                  options={[{ label: t("entire") || "entire", value: "" }]}
                /> */}
                <Input.Search
                  size="small"
                  placeholder={t("idNicknameAccount") || "ID/Nickname/Account holder/Phone"}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onSearch={onSearch}
                  enterButton={t("search") || "search"}
                  style={{ width: 300 }}
                />
                <Button
                  type="primary"
                  size="small"
                  onClick={() => {
                    // Handle view all lower part
                    message.info("View all lower part");
                  }}
                >
                  {t("viewAllLowerPart") || "View all lower part"}
                </Button>
                <Checkbox
                  checked={onlyDirectMembers}
                  onChange={(e) => {
                    setOnlyDirectMembers(e.target.checked);
                    setCurrentPage(1); // Reset to first page when filter changes
                  }}
                >
                  {t("openOnlyToDirectMembers") || "Open only to direct members"}
                </Checkbox>
              </Space>
              <Select
                size="small"
                value={pageSize}
                onChange={(value) => {
                  setPageSize(value);
                  setCurrentPage(1);
                }}
                style={{ width: 100 }}
                options={[
                  { label: "25", value: 25 },
                  { label: "50", value: 50 },
                  { label: "100", value: 100 },
                  { label: "250", value: 250 },
                  { label: "500", value: 500 },
                ]}
              />
            </Space>
          </Space>
          <Table<SubDistributor & { level: number; isSubDistributor: boolean; parentId?: number }>
            columns={columns}
            loading={loading}
            dataSource={tableData}
            className="w-full"
            size="small"
            scroll={{ x: "max-content" }}
            rowKey={(record) => `${record.id}-${record.level}`}
            onChange={(pagination) => {
              if (pagination.current) {
                setCurrentPage(pagination.current);
              }
              if (pagination.pageSize) {
                setPageSize(pagination.pageSize);
                setCurrentPage(1);
              }
            }}
            pagination={{
              showTotal: (total, range) => {
                return t("paginationLabel", {
                  from: range[0],
                  to: range[1],
                  total,
                });
              },
              total: rootItemsCount,
              current: currentPage,
              pageSize: pageSize,
              showSizeChanger: true,
              pageSizeOptions: ["25", "50", "100", "250", "500"],
            }}
            rowClassName={(record) => {
              // Style child rows differently
              if (record.level > 0) {
                return "bg-gray-50 dark:bg-gray-800";
              }
              return "";
            }}
          />
        </Card>
        <DirectMemberRegistrationModal
          open={isRegistrationModalOpen}
          onClose={() => setIsRegistrationModalOpen(false)}
          onSuccess={handleRegistrationSuccess}
        />
      </Content>
    </Layout>
  );
}
