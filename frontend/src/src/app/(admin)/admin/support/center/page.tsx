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
import { useQuery } from "@apollo/client";
import { FILTER_QNAS } from "@/actions/qna";
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
  const [selectedQuestion, setSelectedQuestion] = useState<any>(null);
  const [total, setTotal] = useState<number>(0);
  const [qnas, setQnas] = useState<any[]>([]);
  const { loading, data, refetch } = useQuery(FILTER_QNAS);

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
        return record.user?.root?.userid;
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
      render: (_, record) => record.user?.userid,
      filterDropdown: (props) => (
        <FilterDropdown {...props}>
          <Input className="w-full" />
        </FilterDropdown>
      ),
    },
    {
      title: t("nickname"),
      dataIndex: "user.profile.nickname",
      key: '"Profile"."nickname"',
      render: (_, record) => record.user?.profile?.nickname,
      filterDropdown: (props) => (
        <FilterDropdown {...props}>
          <Input className="w-full" />
        </FilterDropdown>
      ),
    },
    {
      title: t("type"),
      dataIndex: "type",
      key: "type",
    },
    {
      title: t("question"),
      dataIndex: "question",
      key: "question",
      render: (text, record) => {
        return text.length > 100 ? (
          <div className="line-clamp-2 cursor-pointer" onClick={() => handleQuestionClick(record)}>
            {text}
          </div>
        ) : (
          <div className="cursor-pointer" onClick={() => handleQuestionClick(record)}>
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
        return text === "P" ? <Tag color="blue">{t("pending")}</Tag> : text === "A" ? <Tag color="green">{t("answered")}</Tag> : <Tag color="red">{t("checked")}</Tag>;
      }
    },
    {
      title: t("repliedAt"),
      dataIndex: "repliedAt",
      key: "repliedAt",
      render: (v) => (isValidDate(v) ? f.dateTime(new Date(v)) : ""),
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
        <Space.Compact size="small">
          <Popconfirm
            title={t("confirmSure")}
            onConfirm={() => {}}
            description={
              record.status ? t("blockMessage") : t("approveMessage")
            }
          >
            {record.status ? (
              <Button
                title={t("block")}
                icon={<BiBlock />}
                variant="outlined"
                color="orange"
              />
            ) : (
              <Button
                title={t("approve")}
                variant="outlined"
                color="blue"
                icon={<BsCardChecklist />}
              />
            )}
          </Popconfirm>

          <Button
            title={t("delete")}
            variant="outlined"
            color="danger"
            icon={<BiTrash />}
          />
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
  };

  const handleReplySubmit = async (values: any) => {
    // TODO: Implement reply submission
    console.log('Reply submitted:', values);
    handleModalClose();
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
    refetch(tableOptions ?? undefined);
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

          <Modal
            title={t("question")}
            open={modalOpen}
            onCancel={handleModalClose}
            footer={null}
            width={800}
          >
            <div className="mb-6">
              {selectedQuestion?.answer && (
                <div className="mb-4">
                  <div className="font-semibold mb-2">{t("answer")}:</div>
                  <div className="bg-gray-50 p-4 rounded">{selectedQuestion?.answer}</div>
                </div>
              )}
            </div>
            <Form
              form={form}
              layout="vertical"
              onFinish={handleReplySubmit}
            >
              <Form.Item
                name="answer"
                label={t("selectSample")}
                rules={[{ required: true, message: t("required") }]}
              >
                <Select options={[]} />
              </Form.Item>
              <Form.Item
                name={t("answerContent")}
                label={t("answer")}
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
