"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { Form } from "antd";

import {
  Layout,
  Space,
  Card,
  Table,
  Button,
  Popconfirm,
  Input,
  Radio,
  Select,
  Tag,
  Modal,
  notification,
} from "antd";
import type { TableProps } from "antd";

import { Content } from "antd/es/layout/layout";
import { useTranslations } from "next-intl";
import { BiBlock, BiTrash } from "react-icons/bi";
import { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { isValidDate } from "@/lib";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import api from "@/api";
import { partnerQnaAPI, PartnerQna } from "@/api/partnerQnaAPI";

const SupportCenterPage: React.FC = () => {
  const [form] = Form.useForm();
  const t = useTranslations();
  const [modalOpen, setModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<PartnerQna | null>(null);
  const [qnas, setQnas] = useState<PartnerQna[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [sampleQnas, setSampleQnas] = useState<any[]>([]);
  const [loadingSampleQnas, setLoadingSampleQnas] = useState(false);
  const quillRef = useRef<HTMLDivElement>(null);
  const quillInstanceRef = useRef<Quill | null>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);
  
  // Filter state
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<string>("");

  const [notiAPI, contextHolder] = notification.useNotification();

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
        placeholder: 'Type your answer here...'
      });

      // Add text change handler
      const handleTextChange = () => {
        if (quillInstanceRef.current) {
          const content = quillInstanceRef.current.root.innerHTML;
          form.setFieldValue('answer', content);
        }
      };

      quillInstanceRef.current.on('text-change', handleTextChange);
    }
  }, [modalOpen, modules, formats, form]);

  // Effect to handle pre-populating the editor when opening reply modal
  useEffect(() => {
    if (modalOpen && selectedQuestion && quillInstanceRef.current) {
      // Small delay to ensure editor is fully initialized
      const timer = setTimeout(() => {
        if (selectedQuestion.answer && quillInstanceRef.current) {
          quillInstanceRef.current.root.innerHTML = selectedQuestion.answer;
          form.setFieldValue('answer', selectedQuestion.answer);
        } else if (quillInstanceRef.current) {
          quillInstanceRef.current.setText('');
          form.setFieldValue('answer', '');
        }
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [modalOpen, selectedQuestion, form]);

  // Cleanup effect for component unmount
  useEffect(() => {
    return () => {
      if (quillInstanceRef.current) {
        quillInstanceRef.current = null;
      }
    };
  }, []);

  // Fetch sample QNAs when modal opens
  useEffect(() => {
    const fetchSampleQnas = async () => {
      if (modalOpen) {
        setLoadingSampleQnas(true);
        try {
          const response = await api(`admin/sample-qnas?page=1&perPage=1000`);
          if (response?.response?.data) {
            // Filter only active (use: true) sample QNAs
            const activeSamples = response.response.data.filter((item: any) => item.use === true);
            setSampleQnas(activeSamples);
          }
        } catch (error) {
          console.error('Error fetching sample QNAs:', error);
        } finally {
          setLoadingSampleQnas(false);
        }
      }
    };
    fetchSampleQnas();
  }, [modalOpen]);

  // Handle sample QNA selection
  const handleSampleQnaChange = (value: string) => {
    const selectedSample = sampleQnas.find((item: any) => item.id.toString() === value);
    if (selectedSample && quillInstanceRef.current) {
      quillInstanceRef.current.root.innerHTML = selectedSample.answerContent || '';
      form.setFieldValue('answer', selectedSample.answerContent || '');
    }
  };

  // Fetch QNAs
  const fetchQnas = useCallback(async () => {
    setLoading(true);
    try {
      const response = await partnerQnaAPI.getQnas(
        currentPage,
        pageSize,
        statusFilter || undefined,
        typeFilter || undefined
      );
      
      if (response.success) {
        setQnas(response.data.map((q: PartnerQna) => ({ ...q, key: q.id })));
        setTotal(response.pagination.total);
      }
    } catch (error: any) {
      console.error('Error fetching QNAs:', error);
      notiAPI.error({
        message: t("error"),
        description: error?.response?.data?.message || error?.message || t("Failed to load QNAs"),
      });
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, statusFilter, typeFilter, notiAPI, t]);

  useEffect(() => {
    fetchQnas();
  }, [fetchQnas]);

  // Auto-refresh data every 10 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchQnas();
    }, 10000); // 10 seconds

    // Cleanup interval on unmount
    return () => {
      clearInterval(intervalId);
    };
  }, [fetchQnas]);

  const popupWindow = (id: number) => {
    window.open(`/partner/popup/user?id=${id}`, '_blank', 'width=screen.width,height=screen.height,toolbar=no,menubar=no,scrollbars=yes,resizable=yes,location=no,status=no');
  }

  const onQnaStatusChange = (v: string = "") => {
    setStatusFilter(v);
    setCurrentPage(1);
  };

  const onQnaTypeChange = (v: string = "") => {
    setTypeFilter(v);
    setCurrentPage(1);
  };
  
  const columns: TableProps<PartnerQna>["columns"] = [
    {
      title: t("number"),
      dataIndex: "id",
      key: "id",
      fixed: "left",
      render: (_, record, index) => {
        return (currentPage - 1) * pageSize + index + 1;
      }
    },
    {
      title: t("userid"),
      dataIndex: "user.userid",
      key: "user.userid",
      render: (_, record) => (
        <div className="flex items-center cursor-pointer" onClick={() => popupWindow(record.user?.id || 0)}>
          <p className="w-[15px] h-[15px] flex items-center justify-center rounded-full bg-[#1677ff] text-white text-xs">
            {record.user?.profile?.level || 0}
          </p>
          <p className="text-xs text-[white] bg-[#000] px-1 py-0.5 rounded">
            {record.user?.userid || ""}
          </p>
        </div>
      ),
    },
    {
      title: t("nickname"),
      dataIndex: "user.profile.nickname",
      key: "user.profile.nickname",
      render: (_, record) => record.user?.profile?.nickname || "",
    },
    {
      title: t("title"),
      dataIndex: "questionTitle",
      key: "questionTitle",
      render: (text, record) => {
        return (
          <div 
            className="line-clamp-2 cursor-pointer hover:text-blue-600"
            onClick={() => handleReplyQuestion(record)}
          >
            {text}
          </div>
        );
      }
    },
    {
      title: t("status"),
      dataIndex: "status",
      key: "status",
      render: (text) => {
        return text === "P" ? (
          <Tag color="blue">{t("pending")}</Tag>
        ) : text == "F" || text == "A" ? (
          <Tag color="green">{t("answered")}</Tag>
        ) : (
          <Tag color="red">{t("checked")}</Tag>
        );
      }
    },
    {
      title: t("createdAt"),
      dataIndex: "createdAt",
      key: "createdAt",
      render: (v) => (isValidDate(v) ? dayjs(v).format("M/D/YYYY HH:mm:ss") : ""),
    },
    {
      title: t("updatedAt"),
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (v) => (isValidDate(v) ? dayjs(v).format("M/D/YYYY HH:mm:ss") : ""),
    },
    {
      title: t("action"),
      key: "action",
      fixed: "right",
      render: (_, record) => (
        <Space.Compact size="small" className="gap-1">
          <button 
            className="bg-[white] border-1 rounded-[3px] cursor-pointer px-3 py-1 hover:bg-gray-50"
            onClick={() => handleWaitQuestion(record)}
          >
            {t("wait")}
          </button>
          <button 
            className="bg-[white] border-1 rounded-[3px] cursor-pointer px-3 py-1 hover:bg-gray-50"
            onClick={() => handleReplyQuestion(record)}
          >
            {t("reply")}
          </button>
          <Popconfirm
            title={t("deleteConfirm")}
            description={t("deleteConfirmDescription")}
            onConfirm={() => handleDeleteQuestion(record)}
            okText={t("yes")}
            cancelText={t("no")}
          >
            <button 
              className="bg-[white] border-1 rounded-[3px] cursor-pointer px-3 py-1 hover:bg-gray-50 text-red-600 hover:text-red-700"
            >
              {t("delete")}
            </button>
          </Popconfirm>
        </Space.Compact>
      ),
    },
  ];

  const onChange: TableProps<PartnerQna>["onChange"] = (
    pagination,
    filters,
    sorter,
    extra
  ) => {
    if (pagination.current) {
      setCurrentPage(pagination.current);
    }
    if (pagination.pageSize) {
      setPageSize(pagination.pageSize);
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedQuestion(null);
    form.resetFields();
    
    // Clean up the editor instance
    if (quillInstanceRef.current) {
      quillInstanceRef.current.setText('');
      quillInstanceRef.current = null;
    }
    
    // Reset sample QNA select
    form.setFieldValue('sampleQna', undefined);
  };

  const handleViewModalClose = () => {
    setViewModalOpen(false);
    setSelectedQuestion(null);
  };

  const handleViewQuestion = (record: PartnerQna) => {
    setSelectedQuestion(record);
    setViewModalOpen(true);
  };

  const handleReplyQuestion = (record: PartnerQna) => {
    setSelectedQuestion(record);
    setModalOpen(true);
  };

  const handleWaitQuestion = async (record: PartnerQna) => {
    try {
      await partnerQnaAPI.updateQnaStatus(record.id, { status: "P" });
      notiAPI.success({
        message: t("success"),
        description: t("Status updated successfully"),
      });
      fetchQnas();
    } catch (error: any) {
      console.error('Error setting question to wait:', error);
      notiAPI.error({
        message: t("error"),
        description: error?.response?.data?.message || error?.message,
      });
    }
  };

  const handleDeleteQuestion = async (record: PartnerQna) => {
    try {
      await partnerQnaAPI.deleteQna(record.id);
      notiAPI.success({
        message: t("success"),
        description: t("QNA deleted successfully"),
      });
      fetchQnas();
    } catch (error: any) {
      console.error('Error deleting question:', error);
      notiAPI.error({
        message: t("error"),
        description: error?.response?.data?.message || error?.message,
      });
    }
  };

  const handleReplySubmit = async (values: any) => {
    if (!selectedQuestion) return;
    
    try {
      await partnerQnaAPI.replyQna(selectedQuestion.id, {
        answer: values.answer
      });
      notiAPI.success({
        message: t("success"),
        description: t("Reply submitted successfully"),
      });
      handleModalClose();
      fetchQnas();
    } catch (error: any) {
      console.error('Error submitting reply:', error);
      notiAPI.error({
        message: t("error"),
        description: error?.response?.data?.message || error?.message,
      });
    }
  };

  return (
    <Layout>
      {contextHolder}
      <Content className="overflow-auto h-[calc(100vh-100px)] dark:bg-black">
        <Card
          title={t("admin/menu/customServiceCenter")}
          classNames={{
            body: "px-4",
          }}
        >
          <Space className="p-2 !w-full" direction="vertical">
            <Space wrap>
              <Radio.Group
                size="small"
                optionType="button"
                buttonStyle="solid"
                options={[
                  {
                    label: t("all"),
                    value: "",
                  },
                  {
                    label: t("generalInquiry"),
                    value: "GI",
                  },
                  {
                    label: t("accountInquiry"),
                    value: "AI",
                  },
                ]}
                value={typeFilter}
                onChange={(e) => onQnaTypeChange(e.target.value)}
              />
              <Radio.Group
                size="small"
                optionType="button"
                buttonStyle="solid"
                options={[
                  {
                    label: t("all"),
                    value: "",
                  },
                  {
                    label: t("pending"),
                    value: "P",
                  },
                  {
                    label: t("answered"),
                    value: "A",
                  },
                  {
                    label: t("checked"),
                    value: "C",
                  },
                ]}
                value={statusFilter}
                onChange={(e) => onQnaStatusChange(e.target.value)}
              />
            </Space>
          </Space>

          <Table<PartnerQna>
            columns={columns}
            loading={loading}
            dataSource={qnas}
            className="w-full"
            size="small"
            scroll={{ x: "max-content" }}
            onChange={onChange}
            pagination={{
              current: currentPage,
              pageSize: pageSize,
              showTotal(total, range) {
                return t("paginationLabel", {
                  from: range[0],
                  to: range[1],
                  total,
                });
              },
              total: total,
              showSizeChanger: true,
              defaultPageSize: 25,
              pageSizeOptions: [25, 50, 100, 250, 500, 1000],
            }}
          />

          {/* View Question Modal */}
          <Modal
            title={t("viewQuestion")}
            open={viewModalOpen}
            onCancel={handleViewModalClose}
            footer={[
              <Button key="close" onClick={handleViewModalClose}>
                {t("close")}
              </Button>
            ]}
            width={800}
          >
            {selectedQuestion && (
              <div className="space-y-4">
                <div>
                  <div className="font-semibold mb-2 text-lg">{t("title")}:</div>
                  <div className="bg-gray-50 p-4 rounded border">
                    {selectedQuestion.questionTitle}
                  </div>
                </div>
                <div>
                  <div className="font-semibold mb-2 text-lg">{t("content")}:</div>
                  <div 
                    className="bg-gray-50 p-4 rounded border min-h-[200px]"
                    dangerouslySetInnerHTML={{ __html: selectedQuestion.question || '' }}
                  />
                </div>
                {selectedQuestion.answer && (
                  <div>
                    <div className="font-semibold mb-2 text-lg">{t("currentAnswer")}:</div>
                    <div 
                      className="bg-blue-50 p-4 rounded border"
                      dangerouslySetInnerHTML={{ __html: selectedQuestion.answer }}
                    />
                  </div>
                )}
              </div>
            )}
          </Modal>

          {/* Reply Question Modal */}
          <Modal
            title={t("replyToQuestion")}
            open={modalOpen}
            onCancel={handleModalClose}
            footer={null}
            width={800}
          >
            {selectedQuestion && (
              <div className="mb-6">
                <div className="mb-4">
                  <div className="font-semibold mb-2">{t("question")}:</div>
                  <div className="bg-gray-50 p-4 rounded border">
                    <div className="font-medium mb-2">{selectedQuestion.questionTitle}</div>
                    <div dangerouslySetInnerHTML={{ __html: selectedQuestion.question || '' }} />
                  </div>
                </div>
                {selectedQuestion.answer && (
                  <div className="mb-4">
                    <div className="font-semibold mb-2">{t("currentAnswer")}:</div>
                    <div 
                      className="bg-blue-50 p-4 rounded border"
                      dangerouslySetInnerHTML={{ __html: selectedQuestion.answer }}
                    />
                  </div>
                )}
              </div>
            )}
            <Form
              form={form}
              layout="vertical"
              onFinish={handleReplySubmit}
            >
              <Form.Item
                name="sampleQna"
                label={t("sampleAnswer")}
              >
                <Select
                  placeholder={t("selectSampleAnswer")}
                  allowClear
                  loading={loadingSampleQnas}
                  onChange={handleSampleQnaChange}
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                  }
                  options={sampleQnas.map((item: any) => ({
                    value: item.id.toString(),
                    label: item.answerTitle || `Sample ${item.id}`,
                  }))}
                />
              </Form.Item>
              <Form.Item
                name="answer"
                label={t("answerContent")}
                rules={[{ required: true, message: t("required") }]}
              >
                <div 
                  ref={quillRef}
                  style={{ minHeight: '200px', border: '1px solid #d9d9d9', borderRadius: '6px' }}
                ></div>
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
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

export default SupportCenterPage;
