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
  Upload,
} from "antd";
import { FilterDropdown } from "@refinedev/antd";
import type { TableProps } from "antd";

import { Content } from "antd/es/layout/layout";
import { useQuill } from "react-quilljs";

import { useFormatter, useTranslations } from "next-intl";
import { useMutation, useQuery } from "@apollo/client";
import { BiTrash } from "react-icons/bi";
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
import type { UploadProps } from 'antd';
import { message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { uploadFile } from '@/lib/supabase/storage';

// const Highlighter = HighlighterComp as unknown as React.FC<HighlighterProps>;

// type UserIndex = keyof User;
interface Event {
  id?: string;
  title: string;
  author: string;
  views: number;
  type: string;
  description: string;
  showFrom?: string;
  showTo?: string;
  domainId: number;
  status: boolean;
  mainImage?: string;
  imageUpload?: any;
  'event-category'?: string;
  'register-date'?: any;
  'main-image'?: string;
  'image-upload'?: any;
  'event-period'?: [any, any];
  user?: {
    userid: string;
  };
  domain?: {
    name: string;
  };
  duration?: [any, any];
  orderNum?: number;
  level?: number;
}



const EventPage: React.FC = () => {
  const [form] = Form.useForm();
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
    // refetch: refetchDomain,
  } = useQuery(GET_DOMAINS);

  const [updateEvent /* { loading: loadingUpdate } */] =
    useMutation(UPDATE_EVENT);
  const [createEvent, { loading: loadingCreate }] = useMutation(CREATE_EVENT);
  const [deleteEvent, { loading: loadingDelete }] = useMutation(DELETE_EVENT);
  const [open, setOpen] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);

  const onLevelChange = (evt: Event, value: number) => {
    updateEvent({
      variables: { 
        id: evt.id, 
        input: { 
          orderNum: value // Use the level value as orderNum to maintain sorting
        } 
      },
    }).then(() => {
      // Refresh the table with updated sorting
      refetch(tableOptions);
    }).catch((err) => {
      console.error('Error updating event level:', err);
      evtAPI.error({
        message: 'Failed to update event level',
      });
    });
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image"],
      ["clean"],
    ],
  };

  const props: UploadProps = {
    name: 'file',
    customRequest: async ({ file, onSuccess, onError }) => {
      try {
        const result = await uploadFile(file as File, 'images/events/');
        onSuccess?.(result);
        setUploadedImageUrl(result);
      } catch (error) {
        onError?.(error as Error);
      }
    },
    onChange(info) {
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
        form.setFieldValue('image-upload', info.file.response.url);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };
  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    // "bullet",
    "indent",
    "link",
    "image",
  ];
  const { quill, quillRef } = useQuill({ modules, formats });
  const { quill: quillOther, quillRef: quillRefOther } = useQuill({ modules, formats });
  

  const handleQuillChange = (editor: any, fieldName: string) => {
    if (editor) {
      const content = editor.root.innerHTML;
      form.setFieldValue(fieldName, content);
    }
  };

  useEffect(() => {
    if (quill) {
      const handleTextChange = () => handleQuillChange(quill, 'description');
      quill.on('text-change', handleTextChange);
      return () => {
        quill.off('text-change', handleTextChange);
      };
    }
  }, [quill]);

  useEffect(() => {
    if (quillOther) {
      const handleTextChange = () => handleQuillChange(quillOther, 'main-image');
      quillOther.on('text-change', handleTextChange);
      return () => {
        quillOther.off('text-change', handleTextChange);
      };
    }
  }, [quillOther]);

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
    }).then(() => {
      refetch(tableOptions);
    });
  };

  const onCreate = (evt: Event) => {
    const newEvent = {
      title: evt.title,
      author: evt.author || 'admin',
      description: evt.description,
      showFrom: evt['event-period'] ? dayjs(evt['event-period'][0]).toISOString() : undefined,
      showTo: evt['event-period'] ? dayjs(evt['event-period'][1]).toISOString() : undefined,
      category: evt['event-category'] ? parseInt(evt['event-category']) : undefined,
      views: evt.views ? parseInt(evt.views.toString()) : 0,
      mainImage: evt['main-image'],
      imageUpload: uploadedImageUrl,
      createdDate: evt['register-date'] ? dayjs(evt['register-date']).toISOString() : dayjs().toISOString(),
    };
    
    console.log('Creating new event with data:', newEvent);
    
    createEvent({ variables: { input: newEvent } })
      .then((res) => {
        if (res.data?.response) {
          evtAPI.success({
            message: 'Event created successfully',
          });
          refetch();
          setOpen(false);
          form.resetFields();
        }
      })
      .catch((err) => {
        console.error('Error creating event:', err);
        evtAPI.error({
          message: err.message || 'Failed to create event',
        });
      });
  };

  const onCancelNew = () => {
    setOpen(false);
  };

  const onDeleteEvent = (evt: Event) => {
    if (!evt.id) {
      evtAPI.error({
        message: 'Cannot delete event: No event ID provided',
      });
      return;
    }

    deleteEvent({ variables: { id: evt.id } })
      .then((res) => {
        if (res.data?.response) {
          evtAPI.success({
            message: 'Event deleted successfully',
          });
          refetch(tableOptions);
        } else {  
          evtAPI.error({
            message: 'Failed to delete event',
          });
        }
      })
      .catch((err) => {
        console.error('Error deleting event:', err);
        evtAPI.error({
          message: err.message || 'Failed to delete event',
        });
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

  const onDomainChange = (evt: Event, value: number[]) => {
    console.log('value', value);
    setTableOptions({
      ...tableOptions,
      filter: [
        ...(tableOptions?.filter?.filter((f: any) => f.field !== '"domains"."name"') ?? []),
        ...(value.length > 0
          ? [
              {
                field: '"domains"."name"',
                value: value.map(v => v === 0 ? "entire" : domains.find(d => d.value === v)?.label).filter(Boolean),
                op: "in",
              },
            ]
          : []),
      ],
    });
    // updateEvent({
    //   variables: {
    //     id: evt.id,
    //     input: {
    //       domainId: value.map((v: number) => v),
    //     },
    //   },
    // });
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
      render: (text, record) => record?.user?.userid ?? '-',
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
      render: (text, record) => (
        <div className="flex items-center gap-2">
          <div>{text}</div>
          {record?.imageUpload && (
            <img 
              src={record.imageUpload} 
              alt={record.title}
              className="max-h-[50px]"
            />
          )}
        </div>
      ),
      filterDropdown: (props) => (
        <FilterDropdown {...props}>
          <Input className="w-full" />
        </FilterDropdown>
      ),
    },
    {
      title: t("views"),
      dataIndex: "views",
      key: "views",
      filterDropdown: (props) => (
        <FilterDropdown {...props}>
          <Input className="w-full" />
        </FilterDropdown>
      ),
    },
    {
      title: t("period"),
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
      title: t("register-date"),
      dataIndex: "createdDate",
      key: "createdDate",
      render: (text) => (text ? f.dateTime(new Date(text) ?? null) : ""),
    },
    {
      title: t("category"),
      dataIndex: "category",
      key: "category",
    },
    {
      title: t("orderNum"),
      dataIndex: "orderNum", 
      key: "orderNum",
      render: (text, record) => {
        const options = Array.from({length: evts.length}, (_, i) => ({
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
      title: t("domain"),
      dataIndex: "domain",
      key: "domain",
      render: (text, record) => {
        return (
          <Select
            mode="multiple"
            value={tableOptions?.filter?.filter((f: any) => f.field === '"domains"."name"')?.value }
            style={{ width: 200 }}
            options={[
              { value: 0, label: t("entire") },
              ...domains
            ]}
            onChange={(value) => onDomainChange(record, value)}
          />
        );
      },
    },
    
    {
      title: t("action"),
      key: "action",
      fixed: "right",
      render: (_, record) => (
        <Space.Compact size="small" className="gap-2">
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
            width={700}
          >
            <Form
              form={form}
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 16 }}
              name="newForm"
              clearOnDestroy
              onFinish={(values) => {
                console.log('Form submitted values:', values);
                onCreate(values);
              }}
            >
              <Form.Item 
                  name="author" 
                  label={t("author")}
                  initialValue="admin"
                  rules={[{ required: true, message: 'Please input the author!' }]}
                >
                  <Input value='admin' readOnly disabled /> 
              </Form.Item>
              <Form.Item 
                  name="views" 
                  label={t("views")}
                  rules={[{ required: true, message: 'Please input the views!' }]}
                >
                <InputNumber min={0} />
              </Form.Item>
              <Form.Item name="event-period" label={t("event-period")} rules={[{ required: true, message: 'Please select a date!' }]}>
                <DatePicker.RangePicker />
              </Form.Item>
              <Form.Item 
                name="event-category" 
                label={t("event-category")}
                rules={[{ required: true, message: 'Please select a category!' }]}
              >
                  <Select
                    showSearch
                    style={{ width: 200 }}
                    placeholder="Search Category"
                    optionFilterProp="label"
                    // onSearch={(value) => onSearchDomain([value])}
                    loading={loadingDomain}
                    options={[
                      {
                        label: "test",
                        value: 1,
                      },
                    ]}
                  />
              </Form.Item>
              
              <Form.Item 
                name="register-date" 
                label={t("register-date")}
                rules={[{ required: true, message: 'Please select a date!' }]}
              >
                  <DatePicker />
                </Form.Item>
              <Form.Item 
                name="title" 
                label={t("title")}
                rules={[{ required: true, message: 'Please input the title!' }]}
              >
                 <Input />
              </Form.Item>
              <Form.Item 
                name="image-upload" 
                className="text-center"
                rules={[{ required: true, message: 'Please upload an image!' }]}
              >
              <Upload {...props} fileList={[]}>
                <Button icon={<UploadOutlined />}>Click to Upload</Button>
              </Upload>
              </Form.Item>
              <Form.Item 
                name="description" 
                label={t("desc")}
                rules={[{ required: true, message: 'Please input the description!' }]}
              >
                <div ref={quillRef}></div>
              </Form.Item>
              <Form.Item 
                name="main-image" 
                label={t("main-image")}
                rules={[{ required: true, message: 'Please input the main image!' }]}
              >
                <div ref={quillRefOther}></div>
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
