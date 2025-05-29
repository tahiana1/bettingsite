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
  DatePicker,
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
 
import dayjs from "dayjs";
import { parseTableOptions } from "@/lib";
import {
  CREATE_ANNOUNCEMENT,
  DELETE_ANNOUNCEMENT,
  GET_ANNOUNCEMENTS,
  UPDATE_ANNOUNCEMENT,
} from "@/actions/announcement"; 

const AnnouncementPage: React.FC = () => {
  const t = useTranslations();
  const f = useFormatter();
  const [tableOptions, setTableOptions] = useState<any>(null);

  const [total, setTotal] = useState<number>(0);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const { loading, data, refetch } = useQuery(GET_ANNOUNCEMENTS);

  const [notiAPI, context] = notification.useNotification();

  const [updateAnnouncement, { loading: loadingUpdate }] =
    useMutation(UPDATE_ANNOUNCEMENT);
  const [createAnnouncement, { loading: loadingCreate }] =
    useMutation(CREATE_ANNOUNCEMENT);
  const [deleteNoti, { loading: loadingDelete }] =
    useMutation(DELETE_ANNOUNCEMENT);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const [currentAnnouncement, setCurrentAnnouncement] = useState<Announcement | null>(null);

  const showModal = () => {
    setOpen(true);
  };

  const onLevelChange = (announcement: Announcement, value: number) => {
    updateAnnouncement({
      variables: { 
        id: announcement.id, 
        input: { 
          orderNum: value
        } 
      },
    }).then(() => {
      refetch(tableOptions);
    }).catch((err) => {
      console.error('Error updating announcement level:', err);
      notiAPI.error({
        message: 'Failed to update announcement level',
      });
    });
  };

  const onStatusChange = (ann: Announcement, checked: boolean) => {
    updateAnnouncement({
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

  const onCreate = (ann: Announcement) => {
    console.log("Received values of form: ", ann);
    const newNoti = {
      title: ann.title,
      description: ann.description,
      status: ann.status,
    };
    createAnnouncement({ variables: { input: newNoti } })
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

  const onUpdate = (noti: Announcement) => {
    // const update = {
    //   title: noti.title,
    //   description: noti.description,
    //   showFrom: noti.duration ? noti.duration[0] : undefined,
    //   showTo: noti.duration ? noti.duration[1] : undefined,
    //   orderNum: noti.orderNum,
    //   status: noti.status,
    // };
    // updateAnnouncement({
    //   variables: {
    //     id: currentAnnouncement!.id,
    //     input: update,
    //   },
    // }).then(() => {
    //   setEditOpen(false);
    //   refetch(tableOptions);
    // });
  };

  const onEdit = (announce: Announcement) => {
    console.log("Received values of form: ", announce);
    announce.duration = [dayjs(announce.showFrom), dayjs(announce.showTo)];
    setCurrentAnnouncement(announce);
    setEditOpen(true);
  };

  const onCancelEdit = () => {
    setCurrentAnnouncement(null);
    setEditOpen(false);
  };

  const onCancelNew = () => {
    setOpen(false);
  };

  const onDeleteNoti = (noti: Announcement) => {
    deleteNoti({ variables: { id: noti.id } })
      .then((res) => {
        if (res.data?.success) {
        }
        refetch(tableOptions);
      })
      .catch((err) => {
        console.log({ err });
      });
  };

  const onChange: TableProps<Announcement>["onChange"] = (
    pagination,
    filters,
    sorter,
    extra
  ) => {
    setTableOptions(parseTableOptions(pagination, filters, sorter, extra));
  };
  const columns: TableProps<Announcement>["columns"] = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
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
      width: 1000,
      filterDropdown: (props) => (
        <FilterDropdown {...props}>
          <Input className="w-full" />
        </FilterDropdown>
      ),
      render: (text) => {
        if (!text) return '-';
        return text.length > 250 ? `${text.slice(0, 250)}...` : text;
      }
    },
    {
      title: t("status"),
      dataIndex: "status",
      key: "status",
      render: (text, record) => {
        return (
          <Switch
            size="small"
            checked={text}
            onChange={(checked) => onStatusChange(record, checked)}
          ></Switch>
        );
      },
    },
    {
      title: t("orderNum"),
      dataIndex: "orderNum", 
      key: "orderNum",
      render: (text, record) => {
        const options = Array.from({length: announcements.length}, (_, i) => ({
          value: i + 1,
          label: i + 1
        }));
        return (
          <Select
            value={text}
            style={{ width: 100 }}
            options={options}
            onChange={(value) => onLevelChange(record, value)}
          />
        );
      }
    },
    {
      title: t("action"),
      key: "action",
      fixed: "right",
      render: (_, record) => (
        <Space.Compact size="small" className="gap-2">
          
          <Popconfirm
            title={t("confirmSure")}
            onConfirm={() => onDeleteNoti(record)}
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
    setAnnouncements(
      data?.response?.announcements?.map((u: any) => {
        return { ...u, key: u.id };
      }) ?? []
    );
    setTotal(data?.response?.total);
  }, [data]);

  useEffect(() => {
    console.log({ tableOptions });
    refetch(tableOptions ?? undefined);
  }, [tableOptions]);

  return (
    <Layout>
      {context}
      <Content className="overflow-auto h-[calc(100vh-100px)] dark:bg-black">
        <Card
          title={t("admin/menu/comments")}
          classNames={{
            body: "!p-0",
          }}
          extra={
            <Button
              type="primary"
              size="small"
              onClick={showModal}
              icon={<PiPlus />}
            >
              {t("new")}
            </Button>
          }
        >
          {loading ? (
            ""
          ) : (
            <Table<Announcement>
              columns={columns}
              loading={loading}
              dataSource={announcements ?? []}
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
          )}

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
              <Form.Item name="title" label={t("title")}>
                <Input />
              </Form.Item>
              <Form.Item name="description" label={t("desc")}>
                <Input.TextArea />
              </Form.Item>
              <Form.Item name="status" label={t("status")}>
                <Switch />
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
              initialValues={currentAnnouncement ?? {}}
              onFinish={onUpdate}
            >
              <Form.Item name="title" label={t("title")}>
                <Input />
              </Form.Item>
              <Form.Item name="description" label={t("desc")}>
                <Input.TextArea />
              </Form.Item>
              <Form.Item name="duration" label={t("duration")}>
                <DatePicker.RangePicker />
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

export default AnnouncementPage;
