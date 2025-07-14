"use client"

import { Button, Card, Form, Input, Layout, message, Space, Switch, Table, Tag } from "antd";
import React, { useEffect, useState } from "react";
import { useFormatter, useTranslations } from "next-intl";
import { useQuill } from "react-quilljs";
import { Content } from "antd/es/layout/layout";
import 'quill/dist/quill.snow.css';
import type { TableProps } from "antd";
import { BiTrash } from "react-icons/bi";
import { FILTER_QNAS } from "@/actions/qna";
import { useQuery } from "@apollo/client";
import "./index.css";
import api from "@/api";
import { useRouter } from "next/navigation";
import { useAtom } from "jotai";
import { userState } from "@/state/state";

interface QnaItem {
    id: string;
    title: string;
    description: string;
    createdAt: string;
    status: string;
    user?: {
        root?: {
            userid: string;
        };
        parent?: {
            userid: string;
        };
    };
}

const Qna = () => {
    const [form] = Form.useForm();
    const t = useTranslations();
    const [qnas, setQnas] = useState<QnaItem[]>([]);
    const [loadingCreate, setLoadingCreate] = useState(false);
    const [profile] = useAtom(userState);
    const router = useRouter();
  
    // Check if user is logged in
    if (!profile?.userId) {
      message.warning(t("partner/menu/pleaseLogin"));
      router.push("/auth/signIn");
      return;
    }
    
    const modules = {
        toolbar: [
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

      const columns: TableProps<QnaItem>["columns"] = [
        {
          title: t("number"),
          dataIndex: "id",
          key: "id",
          fixed: "left",
          render: (_, __, index) => index + 1,
        },
        {
          title: t("title"),
          dataIndex: "title",
          key: "title",
        },
        {
          title: t("situation"),
          dataIndex: "status",
          key: "status",
          render: (_, record) => (
            <Tag color={record.status === "pending" || record.status === "P" ? "blue" : "green"}>
              {record.status === "pending" || record.status === "P" ? t("pending") : t("answered")}
            </Tag>
          ),
        },
        {
          title: t("applicationDate"),
          dataIndex: "createdAt",
          key: "createdAt",
        },
        {
          title: t("action"),
          key: "action",
          fixed: "right",
          render: (_, record) => (
            <Space.Compact size="small" className="gap-2">
              <Button
                title={t("delete")}
                variant="outlined"
                color="danger"
                icon={<BiTrash />}
                onClick={() => handleDelete(record.id)}
              />
            </Space.Compact>
          ),
        },
      ];
    const formats = [
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
    const { quill, quillRef } = useQuill({ modules, formats });

    useEffect(() => {
        if (quill) {
            const handleTextChange = () => handleQuillChange(quill, 'description');
            quill.on('text-change', handleTextChange);

            // Check for captured image in localStorage
            const capturedImage = localStorage.getItem('capturedBetImage');
            if (capturedImage) {
                // Insert the image into the editor
                const range = quill.getSelection(true);
                quill.insertEmbed(range.index, 'image', capturedImage);
                // Clear the stored image
                localStorage.removeItem('capturedBetImage');
            }

            return () => {
                quill.off('text-change', handleTextChange);
            };
        }
    }, [quill]);

    useEffect(() => {
        api("user/me").then((res) => {
            const user = res.data.profile;
            fetchQnas(user);
        }).catch((err) => {
            console.error('Error fetching user:', err);
        });
        // Fetch QnAs when component mounts
        
    }, []);

    const fetchQnas = async (user: any) => {
        api("qna/get-qna", {
            method: 'POST',
            data: {
                user_id: user?.id
            }
        }).then((res) => {
            if (res.status) {
                setQnas(res.data.map((qna: any) => ({
                    id: qna.id.toString(),
                    title: qna.questionTitle,
                    description: qna.question,
                    createdAt: qna.createdAt,
                    status: qna.status
                })));
            }
        }).catch((err) => {
            console.error('Error fetching QnAs:', err);
        });
    }

    const handleQuillChange = (editor: any, fieldName: string) => {
        if (editor) {
            const content = editor.root.innerHTML;
            form.setFieldValue(fieldName, content);
        }
    };    

    const handleDelete = async (id: string) => {
        try {
            const response = await api("qna/delete", {
                method: 'POST',
                data: { id: Number(id) }
            });
            
            if (response.status) {
                setQnas(prevQnas => prevQnas.filter(qna => qna.id !== id));
            }
        } catch (error) {
            console.error('Error deleting QnA:', error);
        }
    };
          
    const onCreate = async (values: any) => {
        setLoadingCreate(true);
        try {
            const response = await api("qna/create", {
                method: 'POST',
                data: {
                    questionTitle: values.title,
                    question: values.description,
                    domainId: 2
                }
            });

            if (response.status) {
                window.location.reload();
                // Add to the list
                setQnas(prevQnas => [{
                    id: response.data.id.toString(),
                    title: response.data.questionTitle,
                    description: response.data.question,
                    createdAt: response.data.createdAt,
                    status: response.data.status
                }, ...prevQnas]);
                
                // Reset form
                form.resetFields();
                if (quill) {
                    quill.setText('');
                }
            } else {
                throw new Error(response.message || 'Failed to create QnA');
            }
        } catch (error) {
            console.error('Error creating QnA:', error);
        } finally {
            setLoadingCreate(false);
        }
    }

    return (
        <Layout>
            <Content id="qna-content" className="p-3">
                <Card
                    title={t("contactUs")}
                    >
                        <Form
                            name="newForm"
                            layout="vertical"
                            form={form}
                            clearOnDestroy
                            onFinish={onCreate}
                        >
                        <Form.Item name="title" label={t("title")}
                        rules={[{ required: true, message: t("required") }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item 
                            name="description" 
                            label={t("desc")}
                            rules={[{ required: true, message: t("required") }]}
                        >
                            <div ref={quillRef}></div>
                        </Form.Item>
                        <Form.Item>
                            <Button htmlType="submit" loading={loadingCreate}>
                            {t("submit")}
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
                <Table<QnaItem>
                    columns={columns}
                    dataSource={qnas}
                    className="w-full pt-3"
                    size="small"
                    scroll={{ x: "max-content" }}
                    rowKey="id"
                />
            </Content>
        </Layout>
    )
}

export default Qna;