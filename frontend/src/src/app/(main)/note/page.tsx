"use client"

import { Button, Card, Form, Input, Layout, Select, Table, TableProps } from "antd";
import { Content } from "antd/es/layout/layout";
import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { ColumnsType } from "antd/es/table";
import api from "@/api";
import dayjs from "dayjs";

const Notice = () => {
    const t = useTranslations();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        pageSize: 10,
        current: 1,
    });
    const [columns, setColumns] = useState<ColumnsType<any>>([
        {
            title: t("number"),
            dataIndex: "number",
            key: "number",
            render: (text, record: any, index) => index + 1,
        },
        {
            title: t("title"),
            dataIndex: "name",
            key: "name",
            render: (_, record: any) => record.name,
        },
        {
            title: t("dateOfWriting"),   
            dataIndex: "createdAt",
            key: "createdAt",
            render: (_, record: any) => {
                return dayjs(record.createdAt).format('DD/MM/YYYY HH:mm');
            }
        },
        {
            title: t("status"),
            dataIndex: "openedAt",
            key: "openedAt",
            render: (_, record: any) => {
                const openedTime = new Date(record.openedAt).getTime();
                const year2024 = new Date('2024-01-01').getTime();
                return openedTime < year2024 ? 'Not Read' : 'Read';
            },
        },
        {
            title: t("action"),
            dataIndex: "action",
            key: "action",
            render: (_, record: any) => (
                <button className="text-red-500 cursor-pointer" onClick={() => handleDelete(record.userId)}>
                    {t("delete")}
                </button>
            ),  
        }
    ]);

    const expandedRowRender = (record: any) => {
        return (
            <div className="p-4 bg-black">
                <h3 className="font-bold mb-2">{record.name}</h3>
                <p className="text-gray-600">{record.description || 'No description available'}</p>
            </div>
        );
    };

    const handleExpand = async (expanded: boolean, record: any) => {
        if (expanded) {
            try {
                await api("notes/update-read-status", {
                    method: "POST",
                    data: {
                        id: record.id
                    }
                });
                // Refresh the data after updating
                api("user/me").then((res) => {
                    fetchBets(res.data.profile);
                }).catch((err) => {
                    console.log(err);
                });
            } catch (error) {
                console.error("Error updating note status:", error);
            }
        }
    };

    const onChange: TableProps<any>["onChange"] = (
        pagination,
        filters,
        sorter,
        extra
      ) => {
        console.log('params', pagination, filters, sorter, extra);
        
      };

    const handleDelete = (userId: string) => {
        api("notes/delete", {
            method: "POST",
            data: {
                user_id: userId
            }
        }).then((res) => {
            setData(res.data);
        }).catch((err) => {
            console.log(err);
        });
    }

    useEffect(() => {
        api("user/me").then((res) => {
          fetchBets(res.data.profile);
        }).catch((err) => {
          console.log(err);
        });
      }, []);
    
    const fetchBets = async (profile: any) => {
        const userid = Number(profile.userId);
        const response = await api("notes/get-notes", {
            method: "POST",
            data: {
                user_id: userid,
            }
        });
        console.log(response, "response");
        console.log(response.data, "response.data");
        setData(response.data); 
    };

   
                
    return (
        <Layout>
            <Content id="note-page" className="p-3">
                <Card
                    title={t("notePage")}
                    >
                        <Table
                            columns={columns}
                            dataSource={data}
                            loading={loading}
                            pagination={pagination}
                            onChange={onChange}
                            expandable={{
                                expandedRowRender,
                                rowExpandable: (record) => true,
                                onExpand: handleExpand
                            }}
                        />
                </Card>
            </Content>
        </Layout>
    )
}

export default Notice;