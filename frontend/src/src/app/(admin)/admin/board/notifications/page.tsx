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
  Upload,
  Select,
} from "antd";
import { GET_DOMAINS } from "@/actions/domain";
import { FilterDropdown } from "@refinedev/antd";
import type { TableProps } from "antd";
import type { UploadProps } from 'antd';
import { Content } from "antd/es/layout/layout";
import { uploadFile } from '@/lib/supabase/storage';
import { useFormatter, useTranslations } from "next-intl";
import { useMutation, useQuery } from "@apollo/client";
import { BiTrash } from "react-icons/bi";
import { useQuill } from "react-quilljs";
import { PiPlus } from "react-icons/pi";
import { UploadOutlined } from "@ant-design/icons";
import { message } from 'antd';

// import HighlighterComp, { HighlighterProps } from "react-highlight-words";
import dayjs from "dayjs";
import { parseTableOptions } from "@/lib";
import {
  CREATE_NOTI,
  FILTER_NOTI,
  UPDATE_NOTI,
  DELETE_NOTI,
} from "@/actions/notification";

// const Highlighter = HighlighterComp as unknown as React.FC<HighlighterProps>;

// type UserIndex = keyof User;

const NotiPage: React.FC = () => {
  const [form] = Form.useForm();
  const t = useTranslations();
  const f = useFormatter();
  const [tableOptions, setTableOptions] = useState<any>(null);
  const {
    loading: loadingDomain,
    data: domainData,
    // refetch: refetchDomain,
  } = useQuery(GET_DOMAINS);

  const [total, setTotal] = useState<number>(0);
  const [notis, setNotis] = useState<any[]>([]);
  const { loading, data, refetch } = useQuery(FILTER_NOTI);
  const [domains, setDomains] = useState<any[]>([]);
  const [notiAPI, context] = notification.useNotification();
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [updateNoti, { loading: loadingUpdate }] = useMutation(UPDATE_NOTI);
  const [createNoti, { loading: loadingCreate }] = useMutation(CREATE_NOTI);
  const [deleteNoti, { loading: loadingDelete }] = useMutation(DELETE_NOTI);
  const [open, setOpen] = useState(false);

  const onLevelChange = (evt: Noti, value: number) => {
    console.log(loadingUpdate, 'loadingUpdate');
    updateNoti({
      variables: { 
        id: evt.id, 
        input: { 
          orderNum: value
        } 
      },
    }).then(() => {
      refetch(tableOptions);
    }).catch((err) => {
      console.error('Error updating notification order:', err);
      notiAPI.error({
        message: 'Failed to update notification order',
      });
    });
  };

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

  const showModal = () => {
    setOpen(true);
  };
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

  const props: UploadProps = {
    name: 'file',
    customRequest: async ({ file, onSuccess, onError }) => {
      try {
        const result = await uploadFile(file as File, 'images/notifications/');
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


  const onDomainChange = (evt: Noti, value: number[]) => {
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

  const onStatusChange = (noti: Noti, checked: boolean) => {
    updateNoti({
      variables: {
        id: noti.id,
        input: {
          status: checked,
        },
      },
    }).then((result) => {
      refetch(tableOptions);
      console.log({ result });
    });
  };

  const onCreate = (noti: Noti) => {
    console.log("Received values of form: ", noti);
    const newNoti = {
      title: noti.title,
      description: noti.description,
      mainImage: noti['main-image'],
      imageUpload: uploadedImageUrl,
      noticeType: noti.noticeType,
      registerDate: noti['register-date'] ? dayjs(noti['register-date']).toISOString() : dayjs().toISOString(),
      views: noti.views,
    };
    console.log(newNoti, 'newNoti')
    createNoti({ variables: { input: newNoti } })
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

  // const onEdit = (noti: Noti) => {
  //   console.log("Received values of form: ", noti);
  //   setCurrentNoti(noti);
  //   setEditOpen(true);
  // };

  // const onCancelEdit = () => {
  //   setCurrentNoti(null);
  //   setEditOpen(false);
  // };

  const onCancelNew = () => {
    setOpen(false);
  };

  const onDeleteNoti = (noti: Noti) => {
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

  const onChange: TableProps<Noti>["onChange"] = (
    pagination,
    filters,
    sorter,
    extra
  ) => {
    setTableOptions(parseTableOptions(pagination, filters, sorter, extra));
  };
  const columns: TableProps<Noti>["columns"] = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: t("author"),
      dataIndex: "user.userid",
      key: "user.userid",
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
      title: t("register-date"),
      dataIndex: "registerDate",
      key: "registerDate",
      render: (text) => (text ? f.dateTime(new Date(text) ?? null) : ""),
    },
    {
      title: t("notice-type"),
      dataIndex: "noticeType",
      key: "noticeType",
      render: (text) => (text),
    },
    {
      title: t("orderNum"),
      dataIndex: "orderNum", 
      key: "orderNum",
      render: (text, record) => {
        const options = Array.from({length: notis.length}, (_, i) => ({
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
        const selectedDomains = domains.filter(d => d.label === record.domain?.name);
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
    setNotis(
      data?.response?.notifications?.map((u: any) => {
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
          title={t("admin/menu/notifications")}
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
            <Table<Noti>
              columns={columns}
              loading={loading}
              dataSource={notis ?? []}
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
              form={form}
              name="newForm"
              layout="vertical"
              clearOnDestroy
              onFinish={onCreate}
            >
              <Form.Item 
                  name="author" 
                  label={t("author")}
                  initialValue="admin"
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
              <Form.Item
                  name="noticeType"
                  label={t("notice-type")}
                  rules={[{ required: true, message: 'Please select a notice type!' }]}
                >
                  <Select
                    options={
                      [
                        { value: 'notice', label: t("notice-type") }, 
                        { value: 'rules', label: t("gameRules") }
                      ]
                    }
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

export default NotiPage;
