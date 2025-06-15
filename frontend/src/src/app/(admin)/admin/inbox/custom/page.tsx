"use client";
import React, { useEffect, useState } from "react";

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
import { FilterDropdown } from "@refinedev/antd";
import type { TableProps } from "antd";

import { Content } from "antd/es/layout/layout";

import { useFormatter, useTranslations } from "next-intl";
import { useMutation, useQuery } from "@apollo/client";
import { BiEdit, BiTrash } from "react-icons/bi";
import { PiPlus } from "react-icons/pi";

// import HighlighterComp, { HighlighterProps } from "react-highlight-words";
// import dayjs from "dayjs";
import { parseTableOptions } from "@/lib";
import {
  CREATE_INBOX,
  DELETE_INBOX,
  GET_INBOXES,
  UPDATE_INBOX,
} from "@/actions/inbox";

import { FILTER_USERS } from "@/actions/user";
// const Highlighter = HighlighterComp as unknown as React.FC<HighlighterProps>;

// type UserIndex = keyof User;

const InboxPage: React.FC = () => {
  const t = useTranslations();
  const f = useFormatter();
  const [tableOptions, setTableOptions] = useState<any>(null);

  const [total, setTotal] = useState<number>(0);
  const [ibxs, setIbxs] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  const {
    loading: loadingUser,
    // error,
    data: userData,
    refetch: refetchUser,
  } = useQuery(FILTER_USERS);
  const { loading, data, refetch } = useQuery(GET_INBOXES);

  const [notiAPI, context] = notification.useNotification();

  const [updateInbox, { loading: loadingUpdate }] = useMutation(UPDATE_INBOX);
  const [createInbox, { loading: loadingCreate }] = useMutation(CREATE_INBOX);
  const [deleteInbox, { loading: loadingDelete }] = useMutation(DELETE_INBOX);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const [currentInbox, setCurrentInbox] = useState<Inbox | null>(null);

  const showModal = () => {
    setOpen(true);
  };

  const onStatusChange = (ann: Inbox, checked: boolean) => {
    updateInbox({
      variables: {
        id: ann.id,
        input: {
          status: checked,
        },
      },
    }).then((result) => {
      console.log({ result });
    });
  };

  const onCreate = (ann: Inbox) => {
    const newInbox = {
      userId: ann.userId,
      title: ann.title,
      description: ann.description,
      status: ann.status,
      orderNum: ann.orderNum,
    };
    createInbox({ variables: { input: newInbox } })
      .then((res) => {
        if (res.data?.success) {
        }
        refetch();
        setOpen(false);
      })
      .catch((err) => {
        console.log({ err });
        notiAPI.error({
          message: err.message,
        });
      });
  };

  const onUpdate = (noti: Inbox) => {
    const update = {
      title: noti.title,
      description: noti.description,
      orderNum: noti.orderNum,
      status: noti.status,
    };
    updateInbox({
      variables: {
        id: currentInbox!.id,
        input: update,
      },
    }).then(() => {
      setEditOpen(false);
      refetch(tableOptions);
    });
  };

  const onEdit = (ibx: Inbox) => {
    console.log("Received values of form: ", ibx);
    setCurrentInbox(ibx);
    setEditOpen(true);
  };

  const onCancelEdit = () => {
    setCurrentInbox(null);
    setEditOpen(false);
  };

  const onCancelNew = () => {
    setOpen(false);
  };

  const onDeleteInbox = (noti: Inbox) => {
    deleteInbox({ variables: { id: noti.id } })
      .then((res) => {
        if (res.data?.success) {
        }
        refetch(tableOptions);
      })
      .catch((err) => {
        console.log({ err });
      });
  };

  const onChange: TableProps<Inbox>["onChange"] = (
    pagination,
    filters,
    sorter,
    extra
  ) => {
    setTableOptions(parseTableOptions(pagination, filters, sorter, extra));
  };

  const onSearchUser = (value: string) => {
    if (value) {
      refetchUser({
        filters: [
          {
            field: "userid",
            value: value,
            op: "like",
          },
        ],
      });
    }
  };
  const columns: TableProps<Inbox>["columns"] = [
    {
      title: t("number"),
      dataIndex: "id",
      key: "id",
      render: (text, record, index) => index + 1,
    },
    {
      title: t("userId"),
      dataIndex: '"User"."userid"',
      key: '"User"."userid"',
      render: (text, record) => record?.user?.userid,
    },
    {
      title: t("title"),
      dataIndex: "title",
      key: "title",
      filterDropdown: (props) => (
        <FilterDropdown {...props}>
          <Input className="w-full" />
        </FilterDropdown>
      ),
    },
    {
      title: t("desc"),
      dataIndex: "description",
      key: "description",
      filterDropdown: (props) => (
        <FilterDropdown {...props}>
          <Input className="w-full" />
        </FilterDropdown>
      ),
    },
    {
      title: t("openedAt"),
      dataIndex: "openedAt",
      key: "openedAt",
      render: (_, record: any) => {
          const openedTime = new Date(record.openedAt).getTime();
          const year2024 = new Date('2024-01-01').getTime();
          return openedTime < year2024 ? 'Not Read' : 'Read';
      },
    },
    {
      title: t("createdAt"),
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => (text ? f.dateTime(new Date(text) ?? null) : ""),
    },
    {
      title: t("status"),
      dataIndex: "status",
      key: "status",
      render: (text, record) => (
        <Switch
          size="small"
          checked={text}
          onChange={(checked) => onStatusChange(record, checked)}
        ></Switch>
      ),
    },
    {
      title: t("orderNum"),
      dataIndex: "orderNum",
      key: "orderNum",
    },
    {
      title: t("action"),
      key: "action",
      fixed: "right",
      render: (_, record) => (
        <Space.Compact size="small" className="gap-2">
          <Button
            title={t("edit")}
            variant="outlined"
            color="green"
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

  useEffect(() => {
    setIbxs(
      data?.response?.inboxes?.map((u: any) => {
        return { ...u, key: u.id };
      }) ?? []
    );
    setTotal(data?.response?.total);
  }, [data]);

  useEffect(() => {
    if (userData) {
      console.log({ userData });
      setUsers(
        userData?.response?.users?.map((u: User) => ({
          label: u.userid,
          value: u.id,
        }))
      );
    }
  }, [userData]);

  useEffect(() => {
    console.log({ tableOptions });
    refetch(tableOptions ?? undefined);
  }, [tableOptions]);

  return (
    <Layout>
      {context}
      <Content className="overflow-auto h-[calc(100vh-100px)] dark:bg-black">
        <Card
          title={t("admin/menu/inbox")}
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
          <Table<Inbox>
            columns={columns}
            loading={loading}
            dataSource={ibxs ?? []}
            className="w-full"
            size="small"
            scroll={{ x: "max-content" }}
            onChange={onChange}
            pagination={{
              showTotal(total, range) {
                return t(`paginationLabel`, {
                  from: range[0],
                  to: range[1],
                  total: total,
                });
              },
              total: total,
              showSizeChanger: true,
              pageSizeOptions: [10, 20, 50],
            }}
          />
          <Modal
            open={open}
            title={t("new")}
            footer={false}
            onCancel={onCancelNew}
          >
            <Form
              name="newForm"
              layout="vertical"
              clearOnDestroy
              onFinish={onCreate}
            >
              <Form.Item name="userId" label={t("recipient")}>
                <Select
                  showSearch
                  // style={{ width: 200 }}
                  // placeholder="Search Recipient"
                  optionFilterProp="label"
                  onSearch={onSearchUser}
                  loading={loadingUser}
                  options={users}
                />
              </Form.Item>
              <Form.Item name="title" label={t("title")}>
                <Input />
              </Form.Item>
              <Form.Item name="description" label={t("desc")}>
                <Input.TextArea />
              </Form.Item>
              <Form.Item name="status" label={t("status")}>
                <Switch />
              </Form.Item>
              <Form.Item name="orderNum" label={t("orderNum")}>
                <InputNumber />
              </Form.Item>
              <Form.Item>
                <Button htmlType="submit" loading={loadingCreate}>
                  {t("submit")}
                </Button>
              </Form.Item>
            </Form>
          </Modal>

          <Modal
            title={t("edit")}
            open={editOpen}
            footer={false}
            onCancel={onCancelEdit}
            destroyOnClose
          >
            <Form
              name="editForm"
              layout="vertical"
              initialValues={currentInbox ?? {}}
              onFinish={onUpdate}
            >
              <Form.Item name="userId" label={t("recipient")}>
                <Select
                  showSearch
                  style={{ width: 200 }}
                  placeholder="Search Domain"
                  optionFilterProp="label"
                  onSearch={onSearchUser}
                  loading={loadingUser}
                  options={users}
                />
              </Form.Item>
              <Form.Item name="title" label={t("title")}>
                <Input />
              </Form.Item>
              <Form.Item name="description" label={t("desc")}>
                <Input.TextArea />
              </Form.Item>
              <Form.Item name="status" label={t("status")}>
                <Switch />
              </Form.Item>
              <Form.Item name="orderNum" label={t("orderNum")}>
                <InputNumber />
              </Form.Item>
              <Form.Item>
                <Button htmlType="submit" loading={loadingUpdate}>
                  {t("submit")}
                </Button>
              </Form.Item>
            </Form>
          </Modal>
        </Card>
      </Content>
    </Layout>
  );
};

export default InboxPage;
