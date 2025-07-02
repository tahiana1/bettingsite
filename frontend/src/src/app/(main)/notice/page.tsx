"use client"

import { Button, Card, Form, Input, Layout, Select, Table, TableProps } from "antd";
import { Content } from "antd/es/layout/layout";
import {
    CREATE_ANNOUNCEMENT,
    DELETE_ANNOUNCEMENT,
    GET_ANNOUNCEMENTS,
    UPDATE_ANNOUNCEMENT,
  } from "@/actions/announcement"; 
import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { ColumnsType } from "antd/es/table";
import api from "@/api";
import dayjs from "dayjs";
import { useMutation, useQuery } from "@apollo/client";

const Notice = () => {
    const t = useTranslations();
    const { loading, data, refetch } = useQuery(GET_ANNOUNCEMENTS);
    const [announcements, setAnnouncements] = useState<any[]>([]);
    const [pagination, setPagination] = useState({
        pageSize: 10,
        current: 1,
    });
    const [columns, setColumns] = useState<ColumnsType<any>>([
        {
            title: t("number"),
            dataIndex: "number",
            key: "number",
            render: (text,  record: any, index) => index + 1,
        },
        {
            title: t("title"),
            dataIndex: "title",
            key: "title",
            width: 700,
            render: (_, record: any) => record.title,
        },
        {
            title: t("dateOfWriting"),   
            dataIndex: "createdAt",
            key: "createdAt",
            render: (_, record: any) => {
                return dayjs(record.createdAt).format('DD/MM/YYYY HH:mm');
            }
        }
    ]);

    const expandedRowRender = (record: any) => {
        return (
            <div className="p-4 bg-black">
                <h3 className="font-bold mb-2">{record.title}</h3>
                <p className="text-gray-600">{record.description && <div dangerouslySetInnerHTML={{ __html: record.description }} />}</p>
            </div>
        );
    };

    const onChange: TableProps<any>["onChange"] = (
        pagination,
        filters,
        sorter,
        extra
      ) => {
        console.log('params', pagination, filters, sorter, extra);
        
      };
                
    return (
        <Layout>
            <Content id="note-page" className="p-3">
                <Card
                    title={t("noticePage")}
                    >
                        <Table
                            columns={columns}
                            dataSource={data?.response?.announcements}
                            loading={loading}
                            pagination={pagination}
                            onChange={onChange}
                            expandable={{
                                expandedRowRender,
                                rowExpandable: (record) => true,
                            }}
                        />
                </Card>
            </Content>
        </Layout>
    )
}

export default Notice;