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
  CREATE_POPUP,
  FILTER_POPUP,
  UPDATE_POPUP,
  DELETE_POPUP,
} from "@/actions/popup";

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
  const [popups, setPopups] = useState<any[]>([]);
  const { loading, data, refetch } = useQuery(FILTER_POPUP);

  const [notiAPI, context] = notification.useNotification();

  const [updatePopup, { loading: loadingUpdate }] = useMutation(UPDATE_POPUP);
  const [createPopup, { loading: loadingCreate }] = useMutation(CREATE_POPUP);
  const [deletePopup, { loading: loadingDelete }] = useMutation(DELETE_POPUP);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const [currentPopup, setCurrentPopup] = useState<Popup | null>(null);
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


  const onStatusChange = (popup: Popup, checked: boolean) => {
    updatePopup({
      variables: {
        id: popup.id,
        input: {
          status: checked,
        },
      },
    }).then((result) => {
      console.log({ result });
    });
  };

  const onCreate = (popup: Popup) => {
    console.log("Received values of form: ", popup);
    const newPopup = {
      title: popup.title,
      orderNum: popup.orderNum,
      description: createEditorContent,
      showFrom: popup.duration ? popup.duration[0] : undefined,
      showTo: popup.duration ? popup.duration[1] : undefined,
      status: popup.status,
    };
    createPopup({ variables: { input: newPopup } })
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

  const onUpdate = (popup: Popup) => {
    const update = {
      title: popup.title,
      description: editEditorContent,
      showFrom: popup.duration ? popup.duration[0] : undefined,
      showTo: popup.duration ? popup.duration[1] : undefined,
      orderNum: popup.orderNum,
      status: popup.status,
    };
    updatePopup({
      variables: {
        id: currentPopup!.id,
        input: update,
      },
    }).then(() => {
      setEditOpen(false);
      refetch(tableOptions);
    });
  };

  const onEdit = (popup: Popup) => {
    console.log("Received values of form: ", popup);
    popup.duration = [dayjs(popup.showFrom), dayjs(popup.showTo)];
    setCurrentPopup(popup);
    setEditEditorContent(popup.description || '');
    setEditOpen(true);
    setEditorKey(prev => prev + 1); // Force re-render of editor
  };

  const onCancelEdit = () => {
    setCurrentPopup(null);
    setEditOpen(false);
    setEditEditorContent('');
  };

  const onCancelNew = () => {
    setOpen(false);
    createForm.resetFields();
    setCreateEditorContent('');
    setCreateEditorKey(prev => prev + 1); // Force re-render for next open
  };

  const onDeletePopup = (popup: Popup) => {
    deletePopup({ variables: { id: popup.id } })
      .then((res) => {
        if (res.data?.success) {
        }
        refetch(tableOptions);
      })
      .catch((err) => {
        console.log({ err });
      });
  };

  const onChange: TableProps<Popup>["onChange"] = (
    pagination,
    filters,
    sorter,
    extra
  ) => {
    setTableOptions(parseTableOptions(pagination, filters, sorter, extra));
  };
  const columns: TableProps<Popup>["columns"] = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      render: (_text: any, _record: Popup, index: number) => {
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
      width: 300,
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
            onConfirm={() => onDeletePopup(record)}
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
    setPopups(
      data?.response?.popups?.map((u: any) => {
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
            <Table<Popup>
              columns={columns}
              loading={loading}
              dataSource={popups ?? []}
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
            key={currentPopup?.id || 'edit-modal'}
          >
            <Form
              name="editForm"
              layout="vertical"
              initialValues={currentPopup ?? {}}
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
