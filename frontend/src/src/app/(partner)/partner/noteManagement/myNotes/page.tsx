"use client";
import React, { useEffect, useState, useCallback } from "react";

import {
  Layout,
  Space,
  Card,
  Table,
  Button,
  Popconfirm,
  Input,
  Switch,
  Modal,
  Form,
  InputNumber,
  notification,
  Select,
} from "antd";
import type { TableProps } from "antd";

import { Content } from "antd/es/layout/layout";

import { useTranslations } from "next-intl";
import { BiEdit, BiTrash } from "react-icons/bi";
import { PiPlus } from "react-icons/pi";

import dayjs from "dayjs";
import { 
  partnerInboxAPI, 
  PartnerInbox,
  CreatePartnerInboxInput,
  UpdatePartnerInboxInput
} from "@/api/partnerInboxAPI";

const PartnerNotesPage: React.FC = () => {
  const t = useTranslations();
  
  // State management
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingUser, setLoadingUser] = useState<boolean>(false);
  const [loadingUpdate, setLoadingUpdate] = useState<boolean>(false);
  const [loadingCreate, setLoadingCreate] = useState<boolean>(false);
  const [loadingDelete, setLoadingDelete] = useState<boolean>(false);
  
  const [ibxs, setIbxs] = useState<PartnerInbox[]>([]);
  const [users, setUsers] = useState<{ label: string; value: number }[]>([]);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);
  
  // Filter state
  const [searchText, setSearchText] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [titleFilter, setTitleFilter] = useState<string>("");
  const [descFilter, setDescFilter] = useState<string>("");

  const [notiAPI, context] = notification.useNotification();

  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [newForm] = Form.useForm();
  const [editForm] = Form.useForm();

  const [currentInbox, setCurrentInbox] = useState<PartnerInbox | null>(null);

  // Fetch inboxes
  const fetchInboxes = useCallback(async () => {
    setLoading(true);
    try {
      const response = await partnerInboxAPI.getInboxes(
        currentPage,
        pageSize,
        searchText || titleFilter || descFilter,
        statusFilter
      );
      
      setIbxs(response.data || []);
      setTotal(response.pagination?.total || 0);
    } catch (error: any) {
      console.error("Error fetching inboxes:", error);
      notiAPI.error({
        message: t("error"),
        description: error?.response?.data?.message || error?.message || t("Failed to load inboxes"),
      });
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, searchText, titleFilter, descFilter, statusFilter, notiAPI, t]);

  // Fetch users for dropdown
  const fetchUsers = useCallback(async (search?: string) => {
    setLoadingUser(true);
    try {
      const response = await partnerInboxAPI.getPartnerUsers(search);
      const userOptions = response.data.map((user) => ({
        label: user.userid,
        value: user.id,
      }));
      setUsers(userOptions);
    } catch (error: any) {
      console.error("Error fetching users:", error);
    } finally {
      setLoadingUser(false);
    }
  }, []);

  // Initial data load
  useEffect(() => {
    fetchInboxes();
  }, [fetchInboxes]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Auto-refresh data every 10 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchInboxes();
    }, 10000); // 10 seconds

    // Cleanup interval on unmount
    return () => {
      clearInterval(intervalId);
    };
  }, [fetchInboxes]);

  const showModal = () => {
    newForm.resetFields();
    setOpen(true);
  };

  const onStatusChange = async (inbox: PartnerInbox, checked: boolean) => {
    try {
      await partnerInboxAPI.updateInbox(inbox.id, { status: checked });
      notiAPI.success({
        message: t("success"),
        description: t("Status updated successfully"),
      });
      fetchInboxes();
    } catch (error: any) {
      console.error("Error updating status:", error);
      notiAPI.error({
        message: t("error"),
        description: error?.response?.data?.message || error?.message,
      });
    }
  };

  const onCreate = async (values: any) => {
    setLoadingCreate(true);
    try {
      const newInbox: CreatePartnerInboxInput = {
        userId: values.userId,
        title: values.title,
        description: values.description,
        status: values.status ?? true,
        orderNum: values.orderNum,
      };
      
      await partnerInboxAPI.createInbox(newInbox);
      
      notiAPI.success({
        message: t("success"),
        description: t("Inbox created successfully"),
      });
      
      setOpen(false);
      newForm.resetFields();
      fetchInboxes();
    } catch (error: any) {
      console.error("Error creating inbox:", error);
      notiAPI.error({
        message: t("error"),
        description: error?.response?.data?.message || error?.message,
      });
    } finally {
      setLoadingCreate(false);
    }
  };

  const onUpdate = async (values: any) => {
    if (!currentInbox) return;
    
    setLoadingUpdate(true);
    try {
      const updateData: UpdatePartnerInboxInput = {
        title: values.title,
        description: values.description,
        orderNum: values.orderNum,
        status: values.status,
      };
      
      await partnerInboxAPI.updateInbox(currentInbox.id, updateData);
      
      notiAPI.success({
        message: t("success"),
        description: t("Inbox updated successfully"),
      });
      
      setEditOpen(false);
      setCurrentInbox(null);
      fetchInboxes();
    } catch (error: any) {
      console.error("Error updating inbox:", error);
      notiAPI.error({
        message: t("error"),
        description: error?.response?.data?.message || error?.message,
      });
    } finally {
      setLoadingUpdate(false);
    }
  };

  const onEdit = (inbox: PartnerInbox) => {
    setCurrentInbox(inbox);
    editForm.setFieldsValue({
      title: inbox.title,
      description: inbox.description,
      orderNum: inbox.orderNum,
      status: inbox.status,
    });
    setEditOpen(true);
  };

  const onCancelEdit = () => {
    setCurrentInbox(null);
    editForm.resetFields();
    setEditOpen(false);
  };

  const onCancelNew = () => {
    newForm.resetFields();
    setOpen(false);
  };

  const onDeleteInbox = async (inbox: PartnerInbox) => {
    setLoadingDelete(true);
    try {
      await partnerInboxAPI.deleteInbox(inbox.id);
      
      notiAPI.success({
        message: t("success"),
        description: t("Inbox deleted successfully"),
      });
      
      fetchInboxes();
    } catch (error: any) {
      console.error("Error deleting inbox:", error);
      notiAPI.error({
        message: t("error"),
        description: error?.response?.data?.message || error?.message,
      });
    } finally {
      setLoadingDelete(false);
    }
  };

  const onTableChange: TableProps<PartnerInbox>["onChange"] = (
    pagination,
    filters,
    sorter,
    extra
  ) => {
    // Handle pagination
    if (pagination.current) {
      setCurrentPage(pagination.current);
    }
    if (pagination.pageSize) {
      setPageSize(pagination.pageSize);
    }

    // Handle filters
    if (filters.title) {
      setTitleFilter(filters.title[0] as string || "");
    }
    if (filters.description) {
      setDescFilter(filters.description[0] as string || "");
    }
  };

  const onSearchUser = (value: string) => {
    if (value) {
      fetchUsers(value);
    }
  };

  const popupWindow = (id: number) => {
    window.open(`/partner/popup/user?id=${id}`, '_blank', 'width=screen.width,height=screen.height,toolbar=no,menubar=no,scrollbars=yes,resizable=yes,location=no,status=no');
  }

  const columns: TableProps<PartnerInbox>["columns"] = [
    {
      title: t("number"),
      dataIndex: "id",
      key: "id",
      width: 80,
      render: (text, record, index) => (currentPage - 1) * pageSize + index + 1,
    },
    {
      title: t("userId"),
      dataIndex: "User",
      key: "user",
      width: 150,
      render: (User) => {
        if (!User) return null;
        return (
          <div className="flex items-center cursor-pointer" onClick={() => popupWindow(User?.id || 0)}>
            <p className="w-[15px] h-[15px] flex items-center justify-center rounded-full bg-[#1677ff] text-white text-xs">
              {User?.profile?.level ?? 0}
            </p>
            <p className="text-xs text-[white] bg-[#000] px-1 py-0.5 rounded">
              {User?.userid || ""}
            </p>
          </div>
        );
      },
    },
    {
      title: t("title"),
      dataIndex: "title",
      key: "title",
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder={`Search ${t("title")}`}
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => confirm()}
            style={{ marginBottom: 8, display: "block" }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => confirm()}
              size="small"
              style={{ width: 90 }}
            >
              {t("search")}
            </Button>
            <Button
              onClick={() => {
                if (clearFilters) clearFilters();
                confirm();
              }}
              size="small"
              style={{ width: 90 }}
            >
              {t("reset")}
            </Button>
          </Space>
        </div>
      ),
      filterIcon: (filtered) => (
        <span style={{ color: filtered ? "#1890ff" : undefined }}>🔍</span>
      ),
    },
    {
      title: t("description"),
      dataIndex: "description",
      key: "description",
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder={`Search ${t("description")}`}
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => confirm()}
            style={{ marginBottom: 8, display: "block" }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => confirm()}
              size="small"
              style={{ width: 90 }}
            >
              {t("search")}
            </Button>
            <Button
              onClick={() => {
                if (clearFilters) clearFilters();
                confirm();
              }}
              size="small"
              style={{ width: 90 }}
            >
              {t("reset")}
            </Button>
          </Space>
        </div>
      ),
      filterIcon: (filtered) => (
        <span style={{ color: filtered ? "#1890ff" : undefined }}>🔍</span>
      ),
    },
    {
      title: t("partner/inbox/openedAt"),
      dataIndex: "openedAt",
      key: "openedAt",
      width: 120,
      render: (openedAt) => {
        if (!openedAt) return "Not Read";
        const openedTime = new Date(openedAt).getTime();
        const year2024 = new Date("2024-01-01").getTime();
        return openedTime < year2024 ? "Not Read" : "Read";
      },
    },
    {
      title: t("partner/inbox/createdAt"),
      dataIndex: "createdAt",
      key: "createdAt",
      width: 180,
      render: (text) => (text ? dayjs(text).format("M/D/YYYY HH:mm:ss") : ""),
    },
    {
      title: t("partner/inbox/status"),
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (text, record) => (
        <Switch
          size="small"
          checked={text}
          onChange={(checked) => onStatusChange(record, checked)}
        />
      ),
    },
    {
      title: t("partner/inbox/orderNum"),
      dataIndex: "orderNum",
      key: "orderNum",
      width: 100,
    },
    {
      title: t("partner/inbox/action"),
      key: "action",
      fixed: "right",
      width: 120,
      render: (_, record) => (
        <Space.Compact size="small" className="gap-2">
          <Button
            title={t("edit")}
            variant="outlined"
            color="default"
            icon={<BiEdit />}
            onClick={() => onEdit(record)}
          />
          <Popconfirm
            title={t("confirmSure")}
            onConfirm={() => onDeleteInbox(record)}
            description={t("deleteMessage")}
          >
            <Button
              title={t("delete")}
              loading={loadingDelete}
              variant="outlined"
              color="danger"
              icon={<BiTrash />}
            />
          </Popconfirm>
        </Space.Compact>
      ),
    },
  ];

  return (
    <Layout>
      {context}
      <Content className="overflow-auto h-[calc(100vh-100px)] dark:bg-black">
        <Card
          title={t("partner/inbox/title")}
          classNames={{
            body: "!p-0",
          }}
          extra={
            <Button
              type="primary"
              size="small"
              onClick={showModal}
              icon={<PiPlus />}
              key={"new"}
            >
              {t("new")}
            </Button>
          }
        >
          <Table<PartnerInbox>
            columns={columns}
            loading={loading}
            dataSource={ibxs}
            rowKey="id"
            className="w-full"
            size="small"
            scroll={{ x: "max-content" }}
            onChange={onTableChange}
            pagination={{
              current: currentPage,
              pageSize: pageSize,
              total: total,
              showTotal: (total, range) =>
                t(`paginationLabel`, {
                  from: range[0],
                  to: range[1],
                  total: total,
                }),
              showSizeChanger: true,
              pageSizeOptions: [10, 20, 50],
            }}
          />
          
          {/* Create Modal */}
          <Modal
            open={open}
            title={t("new")}
            footer={false}
            onCancel={onCancelNew}
          >
            <Form
              form={newForm}
              name="newForm"
              layout="vertical"
              onFinish={onCreate}
            >
              <Form.Item
                name="userId"
                label={t("recipient")}
                rules={[{ required: true, message: t("pleaseSelectRecipient") }]}
              >
                <Select
                  showSearch
                  placeholder={t("searchUser")}
                  optionFilterProp="label"
                  onSearch={onSearchUser}
                  loading={loadingUser}
                  options={users}
                />
              </Form.Item>
              <Form.Item
                name="title"
                label={t("partner/inbox/title")}
                rules={[{ required: true, message: t("partner/inbox/title") }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="description"
                label={t("partner/inbox/description")}
                rules={[{ required: true, message: t("partner/inbox/description") }]}
              >
                <Input.TextArea rows={4} />
              </Form.Item>
              <Form.Item name="status" label={t("partner/inbox/status")} valuePropName="checked" initialValue={true}>
                <Switch />
              </Form.Item>
              <Form.Item name="orderNum" label={t("partner/inbox/orderNum")} initialValue={1}>
                <InputNumber min={0} style={{ width: "100%" }} />
              </Form.Item>
              <Form.Item>
                <Space>
                  <Button type="primary" htmlType="submit" loading={loadingCreate}>
                    {t("submit")}
                  </Button>
                  <Button onClick={onCancelNew}>
                    {t("cancel")}
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Modal>

          {/* Edit Modal */}
          <Modal
            title={t("edit")}
            open={editOpen}
            footer={false}
            onCancel={onCancelEdit}
            destroyOnHidden
          >
            <Form
              form={editForm}
              name="editForm"
              layout="vertical"
              onFinish={onUpdate}
            >
              <Form.Item name="title" label={t("partner/inbox/title")}>
                <Input />
              </Form.Item>
              <Form.Item name="description" label={t("partner/inbox/description")}>
                <Input.TextArea rows={4} />
              </Form.Item>
              <Form.Item name="status" label={t("partner/inbox/status")} valuePropName="checked">
                <Switch />
              </Form.Item>
              <Form.Item name="orderNum" label={t("partner/inbox/orderNum")}>
                <InputNumber min={0} style={{ width: "100%" }} />
              </Form.Item>
              <Form.Item>
                <Space>
                  <Button type="primary" htmlType="submit" loading={loadingUpdate}>
                    {t("submit")}
                  </Button>
                  <Button onClick={onCancelEdit}>
                    {t("cancel")}
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Modal>
        </Card>
      </Content>
    </Layout>
  );
};

export default PartnerNotesPage;
