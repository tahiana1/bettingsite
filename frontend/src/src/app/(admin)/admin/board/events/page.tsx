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
import { usePageTitle } from "@/hooks/usePageTitle";
import { GET_DOMAINS } from "@/actions/domain";
import type { UploadProps } from 'antd';
import { message } from 'antd';
import { UploadOutlined, EditOutlined } from '@ant-design/icons';
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
  category?: number;
  createdDate?: string;
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
  usePageTitle("Admin - Events Page");
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

  const [updateEvent, { loading: loadingUpdate }] =
    useMutation(UPDATE_EVENT);
  const [createEvent, { loading: loadingCreate }] = useMutation(CREATE_EVENT);
  const [deleteEvent, { loading: loadingDelete }] = useMutation(DELETE_EVENT);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);
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
  const { quill: editQuill, quillRef: editQuillRef } = useQuill({ modules, formats });
  const { quill: editQuillOther, quillRef: editQuillRefOther } = useQuill({ modules, formats });
  

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

  useEffect(() => {
    if (editQuill) {
      const handleTextChange = () => handleQuillChange(editQuill, 'description');
      editQuill.on('text-change', handleTextChange);
      return () => {
        editQuill.off('text-change', handleTextChange);
      };
    }
  }, [editQuill]);

  useEffect(() => {
    if (editQuillOther) {
      const handleTextChange = () => handleQuillChange(editQuillOther, 'main-image');
      editQuillOther.on('text-change', handleTextChange);
      return () => {
        editQuillOther.off('text-change', handleTextChange);
      };
    }
  }, [editQuillOther]);

  // Handle loading content into edit Quill editors when modal opens
  useEffect(() => {
    if (editOpen && currentEvent) {
      console.log("Loading content into Quill editors:", {
        description: currentEvent.description,
        mainImage: currentEvent.mainImage
      });
      
      // Use a timeout to ensure editors are fully initialized
      const timer = setTimeout(() => {
        if (editQuill && editQuillOther) {
          // Clear existing content first
          editQuill.setContents([]);
          editQuillOther.setContents([]);
          
          // Load description content
          if (currentEvent.description) {
            editQuill.root.innerHTML = currentEvent.description;
          }
          // Load main image content
          if (currentEvent.mainImage) {
            editQuillOther.root.innerHTML = currentEvent.mainImage;
          }
        }
      }, 200);

      return () => clearTimeout(timer);
    }
  }, [editOpen, currentEvent, editQuill, editQuillOther]);

  const showModal = () => {
    setOpen(true);
    // Reset form and set initial values
    form.resetFields();
    form.setFieldsValue({
      author: 'admin'
    });
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
    form.resetFields();
    // Clear Quill editors
    if (quill) {
      quill.setContents([]);
    }
    if (quillOther) {
      quillOther.setContents([]);
    }
    // Reset uploaded image URL
    setUploadedImageUrl(null);
  };

  const onEdit = (evt: Event) => {
    console.log("Editing event: ", evt);
    console.log("Event mainImage: ", evt.mainImage);
    setCurrentEvent(evt);
    setEditOpen(true);
    
    // Pre-populate form with current event data
    form.setFieldsValue({
      title: evt.title,
      author: evt.author || 'admin',
      description: evt.description,
      'main-image': evt.mainImage,
      'image-upload': evt.imageUpload,
      'event-category': evt.category?.toString(),
      'register-date': evt.createdDate ? dayjs(evt.createdDate) : null,
      views: evt.views,
      'event-period': evt.showFrom && evt.showTo ? [dayjs(evt.showFrom), dayjs(evt.showTo)] : null,
    });
    
    // Load content into Quill editors immediately
    setTimeout(() => {
      if (editQuill && editQuillOther) {
        // Clear existing content first
        editQuill.setContents([]);
        editQuillOther.setContents([]);
        
        // Load description content
        if (evt.description) {
          editQuill.root.innerHTML = evt.description;
        }
        // Load main image content
        if (evt.mainImage) {
          editQuillOther.root.innerHTML = evt.mainImage;
        }
      }
    }, 100);
  };

  const onCancelEdit = () => {
    setCurrentEvent(null);
    setEditOpen(false);
    form.resetFields();
    // Clear Quill editors
    if (editQuill) {
      editQuill.setContents([]);
    }
    if (editQuillOther) {
      editQuillOther.setContents([]);
    }
    // Reset uploaded image URL
    setUploadedImageUrl(null);
  };

  const onUpdate = (values: any) => {
    console.log("Updating event with values: ", values);
    
    // Get content from Quill editors
    const descriptionContent = editQuill ? editQuill.root.innerHTML : values.description;
    const mainImageContent = editQuillOther ? editQuillOther.root.innerHTML : values['main-image'];
    
    const updatedEvent = {
      title: values.title,
      type: 'event', // Set default type since it's required
      description: descriptionContent,
      showFrom: values['event-period'] ? dayjs(values['event-period'][0]).toISOString() : undefined,
      showTo: values['event-period'] ? dayjs(values['event-period'][1]).toISOString() : undefined,
      category: values['event-category'] ? parseInt(values['event-category']) : undefined,
      views: values.views ? parseInt(values.views.toString()) : 0,
      mainImage: mainImageContent,
      imageUpload: values['image-upload'] || uploadedImageUrl,
      createdDate: values['register-date'] ? dayjs(values['register-date']).toISOString() : dayjs().toISOString(),
    };
    
    console.log("Final updated event data:", updatedEvent);
    
    updateEvent({
      variables: { 
        id: currentEvent?.id, 
        input: updatedEvent 
      },
    }).then((res) => {
      console.log("Update response:", res);
      if (res.data?.response) {
        evtAPI.success({
          message: 'Event updated successfully',
        });
        // Close modal and reset form
        setEditOpen(false);
        setCurrentEvent(null);
        form.resetFields();
        // Clear Quill editors
        if (editQuill) {
          editQuill.setContents([]);
        }
        if (editQuillOther) {
          editQuillOther.setContents([]);
        }
        // Reload the page after successful update
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        evtAPI.error({
          message: 'Failed to update event',
        });
      }
    }).catch((err) => {
      console.error("Update error:", err);
      evtAPI.error({
        message: err.message || 'Failed to update event',
      });
    });
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
          render: (text) => (text ? dayjs(text).format("M/D/YYYY HH:mm:ss") : ""),
        },
        {
          title: t("showTo"),
          dataIndex: "showTo",
          key: "showTo",
          render: (text) => (text ? dayjs(text).format("M/D/YYYY HH:mm:ss") : ""),
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
      render: (text) => (text ? dayjs(text).format("M/D/YYYY HH:mm:ss") : ""),
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
          <Button
            title={t("edit")}
            variant="outlined"
            icon={<EditOutlined />}
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
                  <Input readOnly disabled /> 
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

          <Modal
            open={editOpen}
            title={t("edit")}
            footer={false}
            onCancel={onCancelEdit}
            width={700}
          >
            <Form
              form={form}
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 16 }}
              name="editForm"
              onFinish={onUpdate}
            >
              <Form.Item 
                  name="author" 
                  label={t("author")}
                  initialValue="admin"
                  rules={[{ required: true, message: 'Please input the author!' }]}
                >
                  <Input readOnly disabled /> 
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
                <div ref={editQuillRef}></div>
              </Form.Item>
              <Form.Item 
                name="main-image" 
                label={t("main-image")}
                rules={[{ required: true, message: 'Please input the main image!' }]}
              >
                <div ref={editQuillRefOther}></div>
              </Form.Item>
              <Form.Item>
                <Button htmlType="submit" loading={loadingUpdate}>
                  {t("update")}
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
