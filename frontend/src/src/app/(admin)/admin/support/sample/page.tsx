"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { Form, message, Modal, Popconfirm, Input } from "antd";

import {
  Layout,
  Space,
  Card,
  Table,
  Button,
  Switch,
} from "antd";
import type { TableProps } from "antd";
import { Content } from "antd/es/layout/layout";
import { useTranslations } from "next-intl";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import api from "@/api";
import dayjs from "dayjs";

interface SampleQna {
  id: number;
  key: string;
  site: string;
  answerTitle: string;
  answerContent: string;
  use: boolean;
  createdAt: string;
  updatedAt: string;
}

const SampleQnaPage: React.FC = () => {
  const [form] = Form.useForm();
  const t = useTranslations();
  const [dataSource, setDataSource] = useState<SampleQna[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<SampleQna | null>(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 25,
    total: 0,
  });
  
  const quillRef = useRef<HTMLDivElement>(null);
  const quillInstanceRef = useRef<Quill | null>(null);

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

  // Initialize Quill editor when modal opens
  useEffect(() => {
    if (modalOpen && quillRef.current && !quillInstanceRef.current) {
      quillInstanceRef.current = new Quill(quillRef.current, {
        modules,
        formats,
        theme: 'snow',
        placeholder: 'Enter answer content here...'
      });

      const handleTextChange = () => {
        if (quillInstanceRef.current) {
          const content = quillInstanceRef.current.root.innerHTML;
          form.setFieldValue('answerContent', content);
        }
      };

      quillInstanceRef.current.on('text-change', handleTextChange);
    }
  }, [modalOpen, modules, formats, form]);

  // Effect to handle pre-populating the editor when editing
  useEffect(() => {
    if (modalOpen && editingRecord && quillInstanceRef.current) {
      const timer = setTimeout(() => {
        if (editingRecord.answerContent && quillInstanceRef.current) {
          quillInstanceRef.current.root.innerHTML = editingRecord.answerContent;
          form.setFieldValue('answerContent', editingRecord.answerContent);
        } else if (quillInstanceRef.current) {
          quillInstanceRef.current.setText('');
          form.setFieldValue('answerContent', '');
        }
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [modalOpen, editingRecord, form]);

  // Cleanup effect for component unmount
  useEffect(() => {
    return () => {
      if (quillInstanceRef.current) {
        quillInstanceRef.current = null;
      }
    };
  }, []);

  // Fetch sample QNAs
  const fetchSampleQnas = useCallback(async (page: number = 1, pageSize: number = 25) => {
    setLoading(true);
    try {
      const response = await api(`admin/sample-qnas?page=${page}&perPage=${pageSize}`);
      if (response?.response) {
        const data = response.response.data || [];
        setDataSource(
          data.map((item: any) => ({
            ...item,
            key: item.id.toString(),
          }))
        );
        setPagination({
          current: response.response.current_page || page,
          pageSize: response.response.per_page || pageSize,
          total: response.response.total || 0,
        });
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.error || error?.message || "Failed to fetch sample QNAs";
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSampleQnas(pagination.current, pagination.pageSize);
  }, [fetchSampleQnas, pagination.current, pagination.pageSize]);

  const handleToggleUse = async (record: SampleQna, checked: boolean) => {
    try {
      await api(`admin/sample-qnas/${record.id}/use`, {
        method: "PATCH",
        data: { use: checked },
      });
      message.success("Use status updated successfully");
      fetchSampleQnas(pagination.current, pagination.pageSize);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.error || error?.message || "Failed to update use status";
      message.error(errorMessage);
    }
  };

  const handleAdd = () => {
    setEditingRecord(null);
    form.resetFields();
    setModalOpen(true);
    // Clear editor after a short delay to ensure it's initialized
    setTimeout(() => {
      if (quillInstanceRef.current) {
        quillInstanceRef.current.setText('');
      }
    }, 200);
  };

  const handleEdit = (record: SampleQna) => {
    setEditingRecord(record);
    form.setFieldsValue({
      site: record.site,
      answerTitle: record.answerTitle,
      answerContent: record.answerContent,
    });
    setModalOpen(true);
  };

  const handleDelete = async (record: SampleQna) => {
    try {
      await api(`admin/sample-qnas/${record.id}/delete`, {
        method: "DELETE",
      });
      message.success("Sample QNA deleted successfully");
      fetchSampleQnas(pagination.current, pagination.pageSize);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.error || error?.message || "Failed to delete sample QNA";
      message.error(errorMessage);
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditingRecord(null);
    form.resetFields();
    
    // Clean up the editor instance
    if (quillInstanceRef.current) {
      quillInstanceRef.current.setText('');
      quillInstanceRef.current = null;
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      if (editingRecord) {
        // Update existing
        await api(`admin/sample-qnas/${editingRecord.id}/update`, {
          method: "PUT",
          data: {
            site: values.site,
            answerTitle: values.answerTitle,
            answerContent: values.answerContent,
            use: editingRecord.use,
          },
        });
        message.success("Sample QNA updated successfully");
      } else {
        // Create new
        await api("admin/sample-qnas/create", {
          method: "POST",
          data: {
            site: values.site,
            answerTitle: values.answerTitle,
            answerContent: values.answerContent,
            use: true,
          },
        });
        message.success("Sample QNA created successfully");
      }
      handleModalClose();
      fetchSampleQnas(pagination.current, pagination.pageSize);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.error || error?.message || 
        `Failed to ${editingRecord ? 'update' : 'create'} sample QNA`;
      message.error(errorMessage);
    }
  };

  const handleTableChange = (newPagination: any) => {
    setPagination({
      current: newPagination.current,
      pageSize: newPagination.pageSize,
      total: pagination.total,
    });
  };

  const columns: TableProps<SampleQna>["columns"] = [
    {
      title: t("number"),
      dataIndex: "id",
      key: "number",
      render: (_, __, index) => {
        return (pagination.current - 1) * pagination.pageSize + index + 1;
      },
      width: 80,
    },
    {
      title: t("site"),
      dataIndex: "site",
      key: "site",
    },
    {
      title: t("question"),
      dataIndex: "answerTitle",
      key: "answerTitle",
    },
    {
      title: t("use"),
      dataIndex: "use",
      key: "use",
      render: (_, record) => (
        <Switch
          checked={record.use}
          onChange={(checked) => handleToggleUse(record, checked)}
        />
      ),
    },
    {
      title: t("createTime"),
      dataIndex: "createdAt",
      key: "createTime",
      render: (text) => {
        return text ? dayjs(text).format("YYYY-MM-DD HH:mm:ss") : "";
      },
    },
    {
      title: t("updateTime"),
      dataIndex: "updatedAt",
      key: "updateTime",
      render: (text) => {
        return text ? dayjs(text).format("YYYY-MM-DD HH:mm:ss") : "";
      },
    },
    {
      title: t("action"),
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            onClick={() => handleEdit(record)}
          >
            {t("edit")}
          </Button>
          <Popconfirm
            title={t("deleteConfirm")}
            description={t("deleteConfirmDescription")}
            onConfirm={() => handleDelete(record)}
            okText={t("yes")}
            cancelText={t("no")}
          >
            <Button
              type="primary"
              danger
            >
              {t("delete")}
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Layout>
      <Content className="overflow-auto h-[calc(100vh-100px)] dark:bg-black">
        <Card
          title={t("sampleAnswerList")}
          classNames={{
            body: "!p-0",
          }}
          extra={
            <Button type="primary" onClick={handleAdd}>
              {t("add")}
            </Button>
          }
        >
          <Table<SampleQna>
            columns={columns}
            dataSource={dataSource}
            loading={loading}
            className="w-full"
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: pagination.total,
              showSizeChanger: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} items`,
              pageSizeOptions: ["25", "50", "100", "250"],
            }}
            onChange={handleTableChange}
          />
        </Card>

        {/* Add/Edit Modal */}
        <Modal
          title={editingRecord ? t("edit") : t("add")}
          open={modalOpen}
          onCancel={handleModalClose}
          footer={null}
          width={800}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
          >
            <Form.Item
              name="site"
              label={t("site")}
              rules={[{ required: true, message: t("required") }]}
            >
              <Input placeholder={t("site")} />
            </Form.Item>

            <Form.Item
              name="answerTitle"
              label={t("question")}
              rules={[{ required: true, message: t("required") }]}
            >
              <Input placeholder={t("question")} />
            </Form.Item>

            <Form.Item
              name="answerContent"
              label={t("answerContent")}
              rules={[{ required: true, message: t("required") }]}
            >
              <div 
                ref={quillRef}
                style={{ minHeight: '200px', border: '1px solid #d9d9d9', borderRadius: '6px' }}
              ></div>
            </Form.Item>

            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">
                  {t("save")}
                </Button>
                <Button onClick={handleModalClose}>
                  {t("cancel")}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </Content>
    </Layout>
  );
};

export default SampleQnaPage;
