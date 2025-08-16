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
import Login from "@/components/Auth/Login";
import modalImage from '@/assets/img/main/modal-head.png';

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

const Qna: React.FC<{checkoutModal: (modal: string) => void}> = (props) => {
    const [form] = Form.useForm();
    const t = useTranslations();
    const [qnas, setQnas] = useState<QnaItem[]>([]);
    const [loadingCreate, setLoadingCreate] = useState(false);
    const [profile, setProfile] = useState<any>(null);
    const router = useRouter();
    useEffect(() => {
        api("user/me").then((res) => {
            setProfile(res.data.profile);
        }).catch((err) => {
            console.log(err);
        });
    }, []);
    // Check if user is logged in
 
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
              <button
                title={t("delete")}
                className="text-red-500 cursor-pointer hover:text-red-400 font-medium px-2 py-1 rounded transition-colors flex items-center gap-1"
                onClick={() => handleDelete(record.id)}
              >
                <BiTrash />
                {t("delete")}
              </button>
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
        <>
            <div className="flex justify-center items-center">
                <div style={{ maxWidth: 800, width: "100%" }}>
                    <Card
                        title={
                            <>
                                <h2 className="text-[#edd497] text-[40px] justify-center flex pt-10 font-bold">{t("QNA")}</h2>
                                <p className="text-white text-[16px] font-[400] justify-center pb-6 flex">{t("contactUs")}</p>
                            </>
                        }
                        className="w-full login-card"
                        classNames={{
                            body: "px-6 py-6",
                        }}
                        styles={{
                            header: {
                                backgroundImage: `url(${modalImage.src})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                backgroundRepeat: 'no-repeat',
                            },
                            body: {
                                backgroundColor: '#160d0c',
                                borderTop: 'none',
                                padding: "0px 30px"
                            }
                        }}
                    >
                        <div className="flex w-full mb-6 bg-gradient-to-r from-[#2a1810] to-[#3e2a1f] rounded-lg overflow-hidden border border-[#5d4a3a]">
                            <button
                                onClick={() => props.checkoutModal("profile")}
                                className="flex-1 flex items-center justify-center gap-2 cursor-pointer text-[15px] px-4 py-3 text-white hover:bg-[#2a1810] transition-colors"
                                >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor" viewBox="0 0 512 512" ><path d="M238.6 58.1C248.4 48.9 263.6 48.9 273.4 58.1L345.6 125.0L345.6 115.2C345.6 101.0 357.0 89.6 371.2 89.6L396.8 89.6C411.0 89.6 422.4 101.0 422.4 115.2L422.4 196.4L452.6 224.5C460.3 231.7 462.9 242.8 459.0 252.6C455.2 262.3 446.0 268.8 435.2 268.8L422.4 268.8L422.4 409.6C422.4 438.6 399.4 461.6 370.4 461.6L141.6 461.6C112.6 461.6 89.6 438.6 89.6 409.6L89.6 268.8L76.8 268.8C66.0 268.8 56.8 262.3 53.0 252.6C49.1 242.8 51.7 231.7 59.4 224.5L238.6 58.1zM300.8 256.0C300.8 231.3 280.7 211.2 256.0 211.2C231.3 211.2 211.2 231.3 211.2 256.0C211.2 280.7 231.3 300.8 256.0 300.8C280.7 300.8 300.8 280.7 300.8 256.0zM166.4 396.8C166.4 403.8 172.2 409.6 179.2 409.6L332.8 409.6C339.8 409.6 345.6 403.8 345.6 396.8C345.6 361.4 317.4 332.8 282.0 332.8L230.4 332.8C195.0 332.8 166.4 361.4 166.4 396.8z"/></svg>
                                {t("profile")}
                            </button>
                            <button
                                className="flex-1 flex items-center justify-center gap-2 cursor-pointer text-[15px] px-4 py-3 text-white hover:bg-[#2a1810] transition-colors"
                                onClick={() => props.checkoutModal("letter")}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 512 512"  fill="white"  ><path d="M128 76.8C99.8 76.8 76.8 99.8 76.8 128L76.8 384C76.8 412.2 99.8 435.2 128 435.2L384 435.2C412.2 435.2 435.2 412.2 435.2 384L435.2 128C435.2 99.8 412.2 76.8 384 76.8L128 76.8zM244.1 265.5L163.5 217.1C157.4 213.4 153.6 206.8 153.6 199.6C153.6 188.3 162.7 179.2 174.0 179.2L337.9 179.2C349.2 179.2 358.3 188.3 358.3 199.6C358.3 206.8 354.5 213.4 348.4 217.1L267.9 265.5C264.3 267.7 260.3 268.8 256 268.8C251.7 268.8 247.7 267.7 244.1 265.5zM358.4 241.0L358.4 307.2C358.4 321.4 346.9 332.8 332.8 332.8L179.2 332.8C165.0 332.8 153.6 321.4 153.6 307.2L153.6 241.0L230.9 287.4C238.5 292.0 247.2 294.4 256 294.4C264.8 294.4 273.5 292.0 281.1 287.4L358.4 241.0z"/></svg>
                                {t("letter")}
                            </button>
                            <button 
                                  className="flex-1 flex items-center justify-center gap-2 cursor-pointer text-[15px] px-4 py-3 bg-[#4a3224] text-[#edd497] font-bold border-r border-[#5d4a3a] hover:bg-[#5a3a2a] transition-colors"
                                onClick={() => props.checkoutModal("qna")}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 512 512" fill="white" ><path d="M256 32C114.6 32 0 125.1 0 240c0 49.6 21.4 95 57 130.7C44.5 421.1 2.7 466 2.2 466.5c-2.2 2.3-2.8 5.7-1.5 8.7S4.8 480 8 480c66.3 0 116-31.8 140.6-51.4 32.7 12.3 69 19.4 107.4 19.4 141.4 0 256-93.1 256-208S397.4 32 256 32zM128 272c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32zm128 0c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32zm128 0c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32z"/></svg>
                                {t("QNA")}
                            </button>
                        </div>
                        <Form
                            name="newForm"
                            layout="vertical"
                            form={form}
                            clearOnDestroy
                            onFinish={onCreate}
                        >
                            <Form.Item 
                                name="title" 
                                label={<span className="text-white font-medium">{t("title")}</span>}
                                rules={[{ required: true, message: t("required") }]}
                            >
                                <Input className="custom-white-input" />
                            </Form.Item>
                            <Form.Item 
                                name="description" 
                                label={<span className="text-white font-medium">{t("desc")}</span>}
                                rules={[{ required: true, message: t("required") }]}
                            >
                                <div ref={quillRef} className="quill-editor-dark"></div>
                            </Form.Item>
                            <div className="flex gap-2 pt-3 w-[80%] mx-auto">
                                <Form.Item label={null} className="w-full">
                                    <button
                                        type="submit"
                                        className="w-full btn-modal-auth cursor-pointer"
                                        disabled={loadingCreate}
                                    >
                                        {loadingCreate ? t("loading") : t("submit")}
                                    </button>
                                </Form.Item>
                            </div>
                        </Form>
                        
                        <div className="mt-8">
                            <h3 className="text-[#edd497] text-xl font-semibold mb-4">{t("myQuestions")}</h3>
                            <Table<QnaItem>
                                columns={columns}
                                dataSource={qnas}
                                className="custom-table"
                                size="small"
                                scroll={{ x: "max-content" }}
                                rowKey="id"
                                pagination={{
                                    pageSize: 5,
                                    showSizeChanger: false,
                                }}
                            />
                        </div>
                    </Card>
                </div>
            </div>
        </>
    )
}

export default Qna;