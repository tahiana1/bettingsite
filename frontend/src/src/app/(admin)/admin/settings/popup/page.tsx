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
} from "antd";
import { FilterDropdown } from "@refinedev/antd";
import type { TableProps } from "antd";

import { Content } from "antd/es/layout/layout";

import { useFormatter, useTranslations } from "next-intl";
import { useMutation, useQuery } from "@apollo/client";
import { BiEdit, BiTrash } from "react-icons/bi";
import { PiPlus } from "react-icons/pi";
import { useQuill } from "react-quilljs";
import dynamic from "next/dynamic";

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

// Separate Quill Editor Components
const CreateQuillEditor: React.FC<{ onContentChange: (content: string) => void }> = ({ onContentChange }) => {
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
    "indent",
    "link",
    "image",
  ];

  const { quill, quillRef } = useQuill({ 
    modules, 
    formats, 
    placeholder: 'Enter description...' 
  });

  useEffect(() => {
    if (quill) {
      const handleTextChange = () => {
        onContentChange(quill.root.innerHTML);
      };
      quill.on('text-change', handleTextChange);
      
      return () => {
        quill.off('text-change', handleTextChange);
      };
    }
  }, [quill, onContentChange]);

  return <div ref={quillRef} style={{ height: '200px' }} />;
};

const EditQuillEditor: React.FC<{ 
  initialContent: string; 
  onContentChange: (content: string) => void;
  key: string;
}> = ({ initialContent, onContentChange, key }) => {
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
    "indent",
    "link",
    "image",
  ];

  const { quill, quillRef } = useQuill({ 
    modules, 
    formats, 
    placeholder: 'Enter description...' 
  });

  useEffect(() => {
    if (quill && initialContent) {
      quill.root.innerHTML = initialContent;
    }
  }, [quill, initialContent]);

  useEffect(() => {
    if (quill) {
      const handleTextChange = () => {
        onContentChange(quill.root.innerHTML);
      };
      quill.on('text-change', handleTextChange);
      
      return () => {
        quill.off('text-change', handleTextChange);
      };
    }
  }, [quill, onContentChange]);

  return <div ref={quillRef} style={{ height: '200px' }} key={key} />;
};

const PopupPage: React.FC = () => {
  const t = useTranslations();
  const f = useFormatter();
  const [tableOptions, setTableOptions] = useState<any>(null);

  const [total, setTotal] = useState<number>(0);
  const [notis, setNotis] = useState<any[]>([]);
  const { loading, data, refetch } = useQuery(FILTER_NOTI);

  const [notiAPI, context] = notification.useNotification();

  const [updateNoti, { loading: loadingUpdate }] = useMutation(UPDATE_NOTI);
  const [createNoti, { loading: loadingCreate }] = useMutation(CREATE_NOTI);
  const [deleteNoti, { loading: loadingDelete }] = useMutation(DELETE_NOTI);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const [currentNoti, setCurrentNoti] = useState<Noti | null>(null);
  const [editorKey, setEditorKey] = useState(0);
  const [createEditorKey, setCreateEditorKey] = useState(0);
  const [createForm] = Form.useForm();
  const [createEditorContent, setCreateEditorContent] = useState<string>('');
  const [editEditorContent, setEditEditorContent] = useState<string>('');


  const showModal = () => {
    setOpen(true);
    setCreateEditorKey(prev => prev + 1); // Force re-render of create editor
    setCreateEditorContent(''); // Clear editor content
    createForm.resetFields();
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
      console.log({ result });
    });
  };

  const onCreate = (noti: Noti) => {
    console.log("Received values of form: ", noti);
    const newNoti = {
      title: noti.title,
      orderNum: noti.orderNum,
      description: createEditorContent,
      showFrom: noti.duration ? noti.duration[0] : undefined,
      showTo: noti.duration ? noti.duration[1] : undefined,
      status: noti.status,
    };
    createNoti({ variables: { input: newNoti } })
      .then((res) => {
        if (res.data?.success) {
        }
        refetch();
        setOpen(false);
        createForm.resetFields();
        setCreateEditorContent('');
        setCreateEditorKey(prev => prev + 1); // Force re-render for next open
      })
      .catch((err) => {
        console.log({ err });
        notiAPI.error({
          message: err.message,
        });
      });
  };

  const onUpdate = (noti: Noti) => {
    const update = {
      title: noti.title,
      description: editEditorContent,
      showFrom: noti.duration ? noti.duration[0] : undefined,
      showTo: noti.duration ? noti.duration[1] : undefined,
      orderNum: noti.orderNum,
      status: noti.status,
    };
    updateNoti({
      variables: {
        id: currentNoti!.id,
        input: update,
      },
    }).then(() => {
      setEditOpen(false);
      refetch(tableOptions);
    });
  };

  const onEdit = (noti: Noti) => {
    console.log("Received values of form: ", noti);
    noti.duration = [dayjs(noti.showFrom), dayjs(noti.showTo)];
    setCurrentNoti(noti);
    setEditEditorContent(noti.description || '');
    setEditOpen(true);
    setEditorKey(prev => prev + 1); // Force re-render of editor
  };

  const onCancelEdit = () => {
    setCurrentNoti(null);
    setEditOpen(false);
    setEditEditorContent('');
  };

  const onCancelNew = () => {
    setOpen(false);
    createForm.resetFields();
    setCreateEditorContent('');
    setCreateEditorKey(prev => prev + 1); // Force re-render for next open
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
      render: (_text: any, _record: Noti, index: number) => {
        return index + 1;
      }
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
      render: (text) => {
        return (
          <div
            dangerouslySetInnerHTML={{
              __html: text
            }}
          />
        );
      }
    },
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
          title={t("admin/menu/popupSetting")}
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
            destroyOnClose
            key={`create-modal-${createEditorKey}`}
          >
            <Form
              form={createForm}
              name="newForm"
              layout="vertical"
              onFinish={onCreate}
            >
              <Form.Item name="title" label={t("title")}>
                <Input />
              </Form.Item>
              <Form.Item name="description" label={t("desc")}>
                {open && (
                  <CreateQuillEditor 
                    key={`create-quill-${createEditorKey}`}
                    onContentChange={setCreateEditorContent}
                  />
                )}
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
            key={currentNoti?.id || 'edit-modal'}
          >
            <Form
              name="editForm"
              layout="vertical"
              initialValues={currentNoti ?? {}}
              onFinish={onUpdate}
            >
              <Form.Item name="title" label={t("title")}>
                <Input />
              </Form.Item>
              <Form.Item name="description" label={t("desc")}>
                {editOpen && (
                  <EditQuillEditor 
                    key={`edit-quill-${editorKey}`}
                    initialContent={editEditorContent}
                    onContentChange={setEditEditorContent}
                  />
                )}
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

export default PopupPage;
