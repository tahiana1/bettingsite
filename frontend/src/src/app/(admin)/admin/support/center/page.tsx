"use client";
import React, { useEffect, useRef, useState } from "react";
import { Form } from "antd";

import {
  Layout,
  Space,
  Card,
  Table,
  Button,
  Popconfirm,
  Input,
  DatePicker,
  Radio,
  Select,
  Tag,
  Modal,
} from "antd";
import { FilterDropdown } from "@refinedev/antd";
import type { TableProps } from "antd";

import { Content } from "antd/es/layout/layout";
import { useFormatter, useTranslations } from "next-intl";
import { useQuery, useMutation } from "@apollo/client";
import { FILTER_QNAS, REPLY_QNA, COMPLETE_QNA } from "@/actions/qna";
import { BiBlock, BiTrash } from "react-icons/bi";
import { RxLetterCaseToggle } from "react-icons/rx";
import { Dayjs } from "dayjs";
import { isValidDate, parseTableOptions } from "@/lib";
import { BsCardChecklist } from "react-icons/bs";
import Quill from "quill";
import { useQuill } from "react-quilljs";

const SupportCenterPage: React.FC = () => {
  const [form] = Form.useForm();
  const t = useTranslations();
  const f = useFormatter();
  const [tableOptions, setTableOptions] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<any>(null);
  const [total, setTotal] = useState<number>(0);
  const [qnas, setQnas] = useState<any[]>([]);
  const { loading, data, refetch } = useQuery(FILTER_QNAS, {
    variables: {
      orders: [
        {
          field: "createdAt",
          direction: "DESC"
        }
      ]
    }
  });

  const [replyQna] = useMutation(REPLY_QNA);
  const [completeQna] = useMutation(COMPLETE_QNA);

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
  useEffect(() => {
    if (quill) {
      const handleTextChange = () => handleQuillChange(quill, 'answer');
      quill.on('text-change', handleTextChange);
      return () => {
        quill.off('text-change', handleTextChange);
      };
    }
  }, [quill]);

  const popupWindow = (id: number) => {
    window.open(`/admin/popup/user?id=${id}`, '_blank', 'width=1200,height=800,toolbar=no,menubar=no,scrollbars=yes,resizable=yes,location=no,status=no');
  }

  const handleQuillChange = (editor: any, fieldName: string) => {
    if (editor) {
      const content = editor.root.innerHTML;
      form.setFieldValue(fieldName, content);
    }
  };

  const onQnaStatusChange = (v: string = "") => {
    updateFilter("status", v, "eq");
  };
  const onQnaTypeChange = (v: string = "") => {
    updateFilter("type", v, "eq");
  };
  
  const columns: TableProps<Qna>["columns"] = [
    {
      title: t("number"),
      dataIndex: "userid",
      key: "userid",
      fixed: "left",
      render: (_, record, index) => {
        return index + 1;
      }
    },
    {
      title: t("site"),
      dataIndex: "site",
      key: "site",
      render: (text) => text ?? "site",
    },
    {
      title: t("root_dist"),
      dataIndex: "root.qnaid",
      key: "root.qnaid",
      render(_, record) {
        return record.user?.root?.userid
      },
    },
    {
      title: t("domain"),
      dataIndex: "domain",
      key: "domain",
      render: (text) => text ?? "domain",
    },
    {
      title: t("top_dist"),
      dataIndex: "top_dist",
      key: "top_dist",
      render(_, record) {
        return record.user?.parent?.userid;
      },
    },
    {
      title: t("userid"),
      dataIndex: "user.userid",
      key: '"User"."userid"',
      render: (_, record) => <div className="flex items-center cursor-pointer" onClick={() => popupWindow(record.user?.id)}>
        <p className="w-[15px] h-[15px] flex items-center justify-center rounded-full bg-[#1677ff] text-white text-xs">{record.user?.profile?.level}</p>
        <p className="text-xs text-[white] bg-[#000] px-1 py-0.5 rounded">{record.user?.userid}</p>
      </div>
    },
    {
      title: t("nickname"),
      dataIndex: "user.profile.nickname",
      key: '"Profile"."nickname"',
      render: (_, record) => record.user?.profile?.nickname,
    },
    {
      title: t("title"),
      dataIndex: "questionTitle",                                                                                                                                                                   
      key: "questionTitle",
      render: (text, record) => {                                                                             
        return <div className="line-clamp-2 cursor-pointer">
          {text}
        </div>
      }
    },
    {
      title: t("repliedAt"),
      dataIndex: "repliedAt",
      key: "repliedAt",
      render: (v) => (isValidDate(v) ? f.dateTime(new Date(v)) : ""),
    },
    {
      title: t("status"),
      dataIndex: "status",
      key: "status",
      render: (text) => {
        return text === "P" ? <Tag color="blue">{t("pending")}</Tag> : text === "F" ? <Tag color="green">{t("answered")}</Tag> : <Tag color="red">{t("checked")}</Tag>;
      }
    },
    {
      title: t("createdAt"),
      dataIndex: "createdAt",
      key: "createdAt",
      render: (v) => (isValidDate(v) ? f.dateTime(new Date(v)) : ""),
    },
    {
      title: t("updatedAt"),
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (v) => (isValidDate(v) ? f.dateTime(new Date(v)) : ""),
    },
    {
      title: t("action"),
      key: "action",
      fixed: "right",
      render: (_, record) => (
        <Space.Compact size="small" className="gap-1">
          <button 
            className="bg-[white] border-1 rounded-[3px] cursor-pointer px-3 py-1 hover:bg-gray-50"
            onClick={() => handleViewQuestion(record)}
          >
            {t("view")}
          </button>
          <button 
            className="bg-[white] border-1 rounded-[3px] cursor-pointer px-3 py-1 hover:bg-gray-50"
            onClick={() => handleReplyQuestion(record)}
          >
            {t("reply")}
          </button>
          {
            record.status !== 'F' && (<button 
              className={`bg-[white] border-1 rounded-[3px] cursor-pointer px-3 py-1 hover:bg-gray-50 ${
                record.status === 'C' ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              onClick={() => {
                if (record.status !== 'C') {
                  handleCompleteQuestion(record);
                }
              }}
            >
              {record.status === 'F' ? t("completed") : t("complete")}
            </button>)
          }
          
        </Space.Compact>
      ),
    },
  ];

  const onChange: TableProps<Qna>["onChange"] = (
    pagination,
    filters,
    sorter,
    extra
  ) => {
    setTableOptions(parseTableOptions(pagination, filters, sorter, extra));
  };

  const updateFilter = (field: string, v: string, op: string = "eq") => {
    let filters: { field: string; value: string; op: string }[] =
      tableOptions?.filters ?? [];
    filters = filters.filter((f) => f.field !== field);
    if (v) {
      filters = [
        ...filters,
        {
          field: field,
          value: v,
          op: op,
        },
      ];
    }
    setTableOptions({ ...tableOptions, filters });
  };

  const onRangerChange = (
    dates: (Dayjs | null)[] | null,
    dateStrings: string[]
  ) => {
    let filters: { field: string; value: string; op: string }[] =
      tableOptions?.filters ?? [];
    const f = filters.filter((f) => f.field !== "qnas.created_at");
    if (dates?.at(0)) {
      filters = [
        ...f,
        {
          field: "qnas.created_at",
          value: dateStrings[0],
          op: "gt",
        },
        {
          field: "qnas.created_at",
          value: dateStrings[1],
          op: "lt",
        },
      ];
    }
    console.log({ filters });
    setTableOptions({ ...tableOptions, filters });
  };

  const handleQuestionClick = (record: any) => {
    setSelectedQuestion(record);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedQuestion(null);
    form.resetFields();
    if (quill) {
      quill.root.innerHTML = '';
    }
  };

  const handleViewModalClose = () => {
    setViewModalOpen(false);
    setSelectedQuestion(null);
  };

  const handleViewQuestion = (record: any) => {
    setSelectedQuestion(record);
    setViewModalOpen(true);
  };

  const handleReplyQuestion = (record: any) => {
    setSelectedQuestion(record);
    setModalOpen(true);
    // Pre-populate the editor if there's existing answer
    if (record.answer && quill) {
      quill.root.innerHTML = record.answer;
      form.setFieldValue('answer', record.answer);
    }
  };

  const handleCompleteQuestion = async (record: any) => {
    try {
      await completeQna({
        variables: {
          id: record.id.toString()
        }
      });
      // Refetch data to update the table
      refetch();
    } catch (error) {
      console.error('Error completing question:', error);
    }
  };

  const handleReplySubmit = async (values: any) => {
    try {
      await replyQna({
        variables: {
          id: selectedQuestion.id.toString(),
          input: {
            answer: values.answer
          }
        }
      });
      handleModalClose();
      // Refetch data to update the table
      refetch();
    } catch (error) {
      console.error('Error submitting reply:', error);
    }
  };

  useEffect(() => {
    setQnas(
      data?.response?.qnas?.map((u: any) => {
        return { ...u, key: u.id };
      }) ?? []
    );
    setTotal(data?.response?.total);
  }, [data]);

  useEffect(() => {
    const variables = {
      ...tableOptions,
      orders: [
        {
          field: "createdAt",
          direction: "DESC"
        }
      ]
    };
    refetch(variables);
  }, [tableOptions]);
  return (
    <Layout>
      <Content className="overflow-auto h-[calc(100vh-100px)] dark:bg-black">
        <Card
          title={t("admin/menu/customServiceCenter")}
          classNames={{
            body: "!p-0",
          }}
        >
          <Space className="p-2 !w-full" direction="vertical">
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
                  label: t("site"),
                  value: "site",
                },
              ]}
              defaultValue={""}
            />
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
                defaultValue={""}
                onChange={(e) => onQnaTypeChange(e.target.value)}
              />{" "}
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
                defaultValue={""}
                onChange={(e) => onQnaStatusChange(e.target.value)}
              />
            </Space>
            <Space className="!w-full justify-between">
              <Space>
                <Select
                  size="small"
                  placeholder={t("select_dist")}
                  className="min-w-28"
                  allowClear
                />
                <DatePicker.RangePicker
                  size="small"
                  onChange={onRangerChange}
                />
                <Input.Search
                  size="small"
                  placeholder="ID,Nickname,Account Holder,Phone Number"
                  suffix={
                    <Button
                      size="small"
                      type="text"
                      icon={<RxLetterCaseToggle />}
                    />
                  }
                  enterButton={t("search")}
                />
              </Space>
            </Space>
          </Space>

          <Table<Qna>
            columns={columns}
            loading={loading}
            dataSource={qnas ?? []}
            className="w-full"
            size="small"
            scroll={{ x: "max-content" }}
            onChange={onChange}
            pagination={{
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
                name="answer"
                label={t("answerContent")}
                rules={[{ required: true, message: t("required") }]}
              >
                <div ref={quillRef}></div>
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
