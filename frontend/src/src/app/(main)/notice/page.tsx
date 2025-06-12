"use client"

import { Button, Card, Form, Input, Layout, Select, Space, Switch, Table } from "antd";
import React, { useEffect, useState } from "react";
import { useFormatter, useTranslations } from "next-intl";
import { useQuill } from "react-quilljs";
import { Content } from "antd/es/layout/layout";
import 'quill/dist/quill.snow.css';
import { FILTER_QNAS } from "@/actions/qna";
import { useQuery } from "@apollo/client";
import "./index.css";

interface QnaItem {
    id: string;
    title: string;
    description: string;
    createdAt: string;
    user?: {
        root?: {
            userid: string;
        };
        parent?: {
            userid: string;
        };
    };
}

const Notice = () => {
    const [form] = Form.useForm();
    const t = useTranslations();
    const [qnas, setQnas] = useState<QnaItem[]>([]);
    const { loading, data, refetch } = useQuery(FILTER_QNAS, {
        variables: {
            options: {
                sort: {
                    createdAt: -1,
                },
                filter: {
                    type: "contact",
                    userid: 10,
                }
            }
        }
    });
    const [loadingCreate, setLoadingCreate] = useState(false);
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
        if (data?.filterQnas) {
            setQnas(data.filterQnas);
        }
    }, [data]);

    const handleQuillChange = (editor: any, fieldName: string) => {
        if (editor) {
            const content = editor.root.innerHTML;
            form.setFieldValue(fieldName, content);
        }
    };    

    const handleDelete = (id: string) => {
        setQnas(prevQnas => prevQnas.filter(qna => qna.id !== id));
    };
          
    const onCreate = async (values: any) => {
        // setLoadingCreate(true);
        // try {
        //     // Create a new QnA item
        //     const newQna: QnaItem = {
        //         id: Date.now().toString(), // Temporary ID
        //         title: values.title,
        //         description: values.description,
        //         createdAt: new Date().toISOString(),
        //         user: {
        //             root: { userid: "10" },
        //             parent: { userid: "10" }
        //         }
        //     };
            
        //     // Add to the list
        //     setQnas(prevQnas => [newQna, ...prevQnas]);
            
        //     // Reset form
        //     form.resetFields();
        //     if (quill) {
        //         quill.setText('');
        //     }
        // } catch (error) {
        //     console.error('Error creating QnA:', error);
        // } finally {
        //     setLoadingCreate(false);
        // }
    }

    return (
        <Layout>
            <Content id="qna-content" className="p-3">
                <Card
                    title={t("noticePage")}
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
                            name="type" 
                            label={t("type")}
                            rules={[{ required: true, message: t("required") }]}
                        >
                           <Select options={[]} />
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
            </Content>
        </Layout>
    )
}

export default Notice;