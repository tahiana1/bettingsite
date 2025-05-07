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

// import HighlighterComp, { HighlighterProps } from "react-highlight-words";
import dayjs from "dayjs";
import { parseTableOptions } from "@/lib";
import {
  CREATE_EVENT,
  DELETE_EVENT,
  FILTER_EVENT,
  UPDATE_EVENT,
} from "@/actions/event";
import { GET_DOMAINS } from "@/actions/domain";

// const Highlighter = HighlighterComp as unknown as React.FC<HighlighterProps>;

// type UserIndex = keyof User;

const EventPage: React.FC = () => {
  const t = useTranslations();
  const f = useFormatter();
  const [tableOptions, setTableOptions] = useState<any>(null);
  const [evtAPI, context] = notification.useNotification();

  const [total, setTotal] = useState<number>(0);
  const [evts, setEvents] = useState<any[]>([]);
  const [domains, setDomains] = useState<any[]>([]);

  const { loading, data, refetch } = useQuery(FILTER_EVENT);
  const {
    loading: loadingDomain,
    data: domainData,
    refetch: refetchDomain,
  } = useQuery(GET_DOMAINS);

  const [updateEvent, { loading: loadingUpdate }] = useMutation(UPDATE_EVENT);
  const [createEvent, { loading: loadingCreate }] = useMutation(CREATE_EVENT);
  const [deleteEvent, { loading: loadingDelete }] = useMutation(DELETE_EVENT);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);

  const showModal = () => {
    setOpen(true);
  };

  const onStatusChange = (evt: Event, checked: boolean) => {
    updateEvent({
      variables: {
        id: evt.id,
        input: {
          status: checked,
        },
      },
    }).then((result) => {
      refetch(tableOptions);
    });
  };

  const onCreate = (evt: Event) => {
    const newEvent = {
      title: evt.title,
      type: evt.type,
      description: evt.description,
      orderNum: evt.orderNum,
      showFrom: evt.duration ? evt.duration[0] : undefined,
      showTo: evt.duration ? evt.duration[1] : undefined,
      domainId: evt.domainId,
      level: evt.level,
      status: evt.status,
    };

    createEvent({ variables: { input: newEvent } })
      .then((res) => {
        if (res.data?.success) {
        }
        refetch();
        setOpen(false);
      })
      .catch((err) => {
        console.log({ err });
        evtAPI.error({
          message: err.message,
        });
      });
  };

  const onUpdate = (evt: Event) => {
    const update = {
      title: evt.title,
      description: evt.description,
      showFrom: evt.duration ? evt.duration[0] : undefined,
      showTo: evt.duration ? evt.duration[1] : undefined,
      orderNum: evt.orderNum,
      level: evt.level,
      type: evt.type,
      domainId: evt.domainId,
      status: evt.status,
    };
    updateEvent({
      variables: {
        id: currentEvent!.id,
        input: update,
      },
    }).then((res) => {
      setEditOpen(false);
      refetch(tableOptions);
    });
  };

  const onEdit = (evt: Event) => {
    console.log("Received values of form: ", evt);
    evt.duration = [dayjs(evt.showFrom), dayjs(evt.showTo)];
    setCurrentEvent(evt);
    setEditOpen(true);
  };

  const onCancelEdit = () => {
    setCurrentEvent(null);
    setEditOpen(false);
  };

  const onCancelNew = () => {
    setOpen(false);
  };

  const onDeleteEvent = (evt: Event) => {
    deleteEvent({ variables: { id: evt.id } })
      .then((res) => {
        if (res.data?.success) {
        }
        refetch(tableOptions);
      })
      .catch((err) => {
        console.log({ err });
      });
  };

  const onChange: TableProps<Event>["onChange"] = (
    pagination,
    filters,
    sorter,
    extra
  ) => {
    setTableOptions(parseTableOptions(pagination, filters, sorter, extra));
  };

  const onSearchDomain = (value: string) => {
    if (value) {
      refetchDomain({
        filters: [
          {
            field: '"domains"."name"',
            value: value,
            op: "like",
          },
        ],
      });
    }
  };

  const columns: TableProps<Event>["columns"] = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: t("author"),
      dataIndex: '"User"."userid"',
      key: '"User"."userid"',
      render: (text, record) => record?.user.userid,
      filterDropdown: (props) => (
        <FilterDropdown {...props}>
          <Input className="w-full" />
        </FilterDropdown>
      ),
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
      title: "Period",
      children: [
        {
          title: t("showFrom"),
          dataIndex: "showFrom",
          key: "showFrom",
          render: (text) => (text ? f.dateTime(new Date(text) ?? null) : ""),
        },
        {
          title: t("showTo"),
          dataIndex: "showTo",
          key: "showTo",
          render: (text) => (text ? f.dateTime(new Date(text) ?? null) : ""),
        },
      ],
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
    },
    {
      title: t("createdAt"),
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => (text ? f.dateTime(new Date(text) ?? null) : ""),
    },
    {
      title: t("updatedAt"),
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (text) => (text ? f.dateTime(new Date(text) ?? null) : ""),
    },
    {
      title: t("domain"),
      dataIndex: "domain",
      key: "domain",
      render: (text, record) => record?.domain?.name,
    },
    {
      title: t("level"),
      dataIndex: "level",
      key: "level",
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
            onConfirm={() => onDeleteEvent(record)}
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
    if (domainData) {
      setDomains([
        ...(domainData.response?.domains?.map((d: Domain) => ({
          value: d.id,
          label: d.name,
        })) ?? []),
      ]);
    }
  }, [loadingDomain, domainData]);

  useEffect(() => {
    setEvents(
      data?.response?.events?.map((u: any) => {
        return { ...u, key: u.id };
      }) ?? []
    );
    setTotal(data?.response?.total);
  }, [data]);

  useEffect(() => {
    refetch(tableOptions ?? undefined);
  }, [tableOptions]);

  return (
    <Layout>
      {context}
      <Content className="overflow-auto h-[calc(100vh-100px)] dark:bg-black">
        <Card
          title={t("admin/menu/events")}
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
            <Table<Event>
              columns={columns}
              loading={loading}
              dataSource={evts ?? []}
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
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 16 }}
              name="newForm"
              clearOnDestroy
              onFinish={onCreate}
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
              <Form.Item name="type" label={t("type")}>
                <Select
                  showSearch
                  style={{ width: 200 }}
                  placeholder="Search Domain"
                  optionFilterProp="label"
                  onSearch={onSearchDomain}
                  loading={loadingDomain}
                  options={[
                    {
                      label: "-",
                      value: "",
                    },
                  ]}
                />
              </Form.Item>
              <Form.Item name="domain" label={t("domain")}>
                <Select
                  showSearch
                  style={{ width: 200 }}
                  placeholder="Search Domain"
                  optionFilterProp="label"
                  onSearch={onSearchDomain}
                  loading={loadingDomain}
                  options={[...domains]}
                />
              </Form.Item>
              <Form.Item name="level" label={t("level")}>
                <InputNumber min={0} />
              </Form.Item>
              <Form.Item name="orderNum" label={t("orderNum")}>
                <InputNumber min={0} />
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
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 16 }}
              initialValues={currentEvent ?? {}}
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
              <Form.Item name="type" label={t("type")}>
                <Select
                  showSearch
                  style={{ width: 200 }}
                  placeholder="Search Category"
                  optionFilterProp="label"
                  onSearch={onSearchDomain}
                  loading={loadingDomain}
                  options={[
                    {
                      label: "-",
                      value: "",
                    },
                  ]}
                />
              </Form.Item>
              <Form.Item name="domainId" label={t("domain")}>
                <Select
                  showSearch
                  style={{ width: 200 }}
                  placeholder="Search Domain"
                  optionFilterProp="label"
                  onSearch={onSearchDomain}
                  loading={loadingDomain}
                  options={[...domains]}
                />
              </Form.Item>
              <Form.Item name="level" label={t("level")}>
                <InputNumber min={0} />
              </Form.Item>
              <Form.Item name="orderNum" label={t("orderNum")}>
                <InputNumber min={0} />
              </Form.Item>
              <Form.Item>
                <Button htmlType="submit" loading={loadingCreate}>
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

export default EventPage;
