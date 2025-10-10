"use client";
import React, { useEffect, useState } from "react";

import {
  Layout,
  Space,
  Card,
  Button,
  Popconfirm,
  Input,
  DatePicker,
  Switch,
  Form,
  InputNumber,
  notification,
  Select,
  Row,
  Col,
} from "antd";

import { Content } from "antd/es/layout/layout";

import { useFormatter, useTranslations } from "next-intl";
import { useMutation, useQuery } from "@apollo/client";
import { BiTrash } from "react-icons/bi";
import { useQuill } from "react-quilljs";
import dayjs from "dayjs";
import {
  CREATE_POPUP,
  FILTER_POPUP,
  UPDATE_POPUP,
  DELETE_POPUP,
} from "@/actions/popup";

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

  const [popups, setPopups] = useState<any[]>([]);
  const { loading, data, refetch } = useQuery(FILTER_POPUP);

  const [notiAPI, context] = notification.useNotification();

  const [updatePopup, { loading: loadingUpdate }] = useMutation(UPDATE_POPUP);
  const [createPopup, { loading: loadingCreate }] = useMutation(CREATE_POPUP);
  const [deletePopup, { loading: loadingDelete }] = useMutation(DELETE_POPUP);

  const [editorKeys, setEditorKeys] = useState<Record<string, number>>({});
  const [createEditorKey, setCreateEditorKey] = useState(0);
  const [createForm] = Form.useForm();
  const [editForms, setEditForms] = useState<Record<number, any>>({});
  const [createEditorContent, setCreateEditorContent] = useState<string>('');
  const [editEditorContents, setEditEditorContents] = useState<Record<number, string>>({});


  useEffect(() => {
    if (data?.response?.popups) {
      setPopups(data.response.popups);
      // Initialize edit editor contents for each popup
      const contents: Record<number, string> = {};
      data.response.popups.forEach((popup: Popup) => {
        contents[popup.id] = popup.description || '';
      });
      setEditEditorContents(contents);
    }
  }, [data]);

  const onCreate = (values: any) => {
    const newPopup = {
      title: values.title || '',
      orderNum: values.orderNum || 0,
      description: createEditorContent,
      displayType: values.displayType || 'standard',
      width: values.width || 0,
      height: values.height || 0,
      showFrom: values.duration ? values.duration[0].toISOString() : new Date().toISOString(),
      showTo: values.duration ? values.duration[1].toISOString() : new Date().toISOString(),
      status: values.status || false,
    };
    createPopup({ variables: { input: newPopup } })
      .then((res) => {
        refetch();
        createForm.resetFields();
        setCreateEditorContent('');
        setCreateEditorKey(prev => prev + 1);
        notiAPI.success({
          message: t("success"),
          description: t("popupCreatedSuccessfully"),
        });
      })
      .catch((err) => {
        console.log({ err });
        notiAPI.error({
          message: err.message,
        });
      });
  };

  const onUpdate = (popupId: number, values: any) => {
    const update = {
      title: values.title,
      description: editEditorContents[popupId] || '',
      displayType: values.displayType,
      width: values.width,
      height: values.height,
      showFrom: values.duration ? values.duration[0].toISOString() : undefined,
      showTo: values.duration ? values.duration[1].toISOString() : undefined,
      orderNum: values.orderNum,
      status: values.status,
    };
    updatePopup({
      variables: {
        id: popupId,
        input: update,
      },
    }).then(() => {
      refetch();
      notiAPI.success({
        message: t("success"),
        description: t("popupUpdatedSuccessfully"),
      });
    }).catch((err) => {
      notiAPI.error({
        message: err.message,
      });
    });
  };

  const onDeletePopup = (popup: Popup) => {
    deletePopup({ variables: { id: popup.id } })
      .then(() => {
        refetch();
        notiAPI.success({
          message: t("success"),
          description: t("popupDeletedSuccessfully"),
        });
      })
      .catch((err) => {
        console.log({ err });
        notiAPI.error({
          message: err.message,
        });
      });
  };

  const handleEditorContentChange = (popupId: number, content: string) => {
    setEditEditorContents(prev => ({
      ...prev,
      [popupId]: content
    }));
  };

  return (
    <Layout>
      {context}
      <Content className="overflow-auto h-[calc(100vh-100px)] dark:bg-black p-6">
        <div className="w-full">
          <h1 className="text-2xl font-semibold mb-6">{t("admin/menu/popupSetting")}</h1>
          
          {/* All Popups (Create + Existing) */}
          {loading ? (
            <div className="text-center py-8">{t("loading")}</div>
          ) : (
            <Row gutter={[16, 16]}>
              {/* Create New Popup Card */}
              <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                <Card 
                  title={t("createNewPopup")}
                  className="h-full"
                  style={{ backgroundColor: '#f9f9f9' }}
                >
                  <Form
                    form={createForm}
                    layout="vertical"
                    onFinish={onCreate}
                    initialValues={{
                      displayType: 'standard',
                      width: 400,
                      height: 600,
                      status: false,
                      orderNum: 1,
                    }}
                  >
                    <Form.Item name="title" label={t("popupTitle")}>
                      <Input placeholder={t("afterLoggingInPopupTitle")} />
                    </Form.Item>

                    <Form.Item name="displayType" label={t("displayType")}>
                      <Select>
                        <Select.Option value="standard">{t("standard")}</Select.Option>
                        <Select.Option value="center">{t("center")}</Select.Option>
                        <Select.Option value="doesntExist">{t("doesntExist")}</Select.Option>
                      </Select>
                    </Form.Item>

                    <Row gutter={8}>
                      <Col span={12}>
                        <Form.Item 
                          name="width" 
                          label={t("width")}
                          help={t("if0NoWidthRestriction")}
                        >
                          <InputNumber className="w-full" min={0} />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item 
                          name="height" 
                          label={t("heightMinimum")}
                          help={t("if0NoHeightLimit")}
                        >
                          <InputNumber className="w-full" min={0} />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Form.Item name="description" label={t("content")}>
                      <CreateQuillEditor 
                        key={`create-quill-${createEditorKey}`}
                        onContentChange={setCreateEditorContent}
                      />
                    </Form.Item>

                    <Form.Item name="duration" label={t("duration")}>
                      <DatePicker.RangePicker 
                        showTime={{ format: 'HH:mm:ss' }}
                        format="YYYY-MM-DD HH:mm:ss"
                        placeholder={[t("startDate"), t("endDate")]}
                        style={{ width: '100%' }}
                      />
                    </Form.Item>

                    <Row gutter={8}>
                      <Col span={12}>
                        <Form.Item name="status" label={t("status")} valuePropName="checked">
                          <Switch />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item name="orderNum" label={t("orderNum")}>
                          <InputNumber className="w-full" min={0} />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Form.Item>
                      <Button type="primary" htmlType="submit" loading={loadingCreate}>
                        {t("registration")}
                      </Button>
                    </Form.Item>
                  </Form>
                </Card>
              </Col>

              {/* Existing Popups */}
              {popups.map((popup, index) => (
                <Col xs={24} sm={24} md={12} lg={8} xl={8} key={popup.id}>
                  <Card 
                    title={`${t("popup")} ${index + 1} ${t("settings")}`}
                    className="h-full"
                  >
                    <Form
                      layout="vertical"
                      onFinish={(values) => onUpdate(popup.id, values)}
                      initialValues={{
                        ...popup,
                        duration: popup.showFrom && popup.showTo 
                          ? [dayjs(popup.showFrom), dayjs(popup.showTo)]
                          : undefined,
                      }}
                    >
                      <Form.Item name="title" label={t("popupTitle")}>
                        <Input />
                      </Form.Item>

                      <Form.Item name="displayType" label={t("displayType")}>
                        <Select>
                          <Select.Option value="standard">{t("standard")}</Select.Option>
                          <Select.Option value="center">{t("center")}</Select.Option>
                          <Select.Option value="doesntExist">{t("doesntExist")}</Select.Option>
                        </Select>
                      </Form.Item>

                      <Row gutter={8}>
                        <Col span={12}>
                          <Form.Item 
                            name="width" 
                            label={t("width")}
                            help={t("if0NoWidthRestriction")}
                          >
                            <InputNumber className="w-full" min={0} />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item 
                            name="height" 
                            label={t("heightMinimum")}
                            help={t("if0NoHeightLimit")}
                          >
                            <InputNumber className="w-full" min={0} />
                          </Form.Item>
                        </Col>
                      </Row>

                      <Form.Item name="description" label={t("content")}>
                        <EditQuillEditor 
                          key={`edit-quill-${popup.id}-${editorKeys[popup.id] || 0}`}
                          initialContent={editEditorContents[popup.id] || popup.description || ''}
                          onContentChange={(content) => handleEditorContentChange(popup.id, content)}
                        />
                      </Form.Item>

                      <Form.Item name="duration" label={t("duration")}>
                        <DatePicker.RangePicker 
                          showTime={{ format: 'HH:mm:ss' }}
                          format="YYYY-MM-DD HH:mm:ss"
                          placeholder={[t("startDate"), t("endDate")]}
                          style={{ width: '100%' }}
                        />
                      </Form.Item>

                      <Row gutter={8}>
                        <Col span={12}>
                          <Form.Item name="status" label={t("status")} valuePropName="checked">
                            <Switch />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item name="orderNum" label={t("orderNum")}>
                            <InputNumber className="w-full" min={0} />
                          </Form.Item>
                        </Col>
                      </Row>

                      <Space>
                        <Button type="primary" htmlType="submit" loading={loadingUpdate}>
                          {t("change")}
                        </Button>
                        <Popconfirm
                          title={t("confirmSure")}
                          onConfirm={() => onDeletePopup(popup)}
                          description={t("deleteMessage")}
                        >
                          <Button 
                            danger
                            loading={loadingDelete}
                            icon={<BiTrash />}
                          >
                            {t("delete")}
                          </Button>
                        </Popconfirm>
                      </Space>
                    </Form>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </div>
      </Content>
    </Layout>
  );
};

export default PopupPage;
