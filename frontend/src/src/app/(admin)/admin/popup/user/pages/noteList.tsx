"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from 'next/navigation';
import {
  Layout,
  Card,
  Table,
} from "antd";
import type { TableProps } from "antd";

import { Content } from "antd/es/layout/layout";

import { useTranslations } from "next-intl";
import api from "@/api";
import dayjs from "dayjs";

const UserNoteList: React.FC = () => {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const userId = searchParams.get('id');

  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchNotes = async () => {
    if (!userId) return;
    
    setLoading(true);
    try {
      const response = await api("notes/get-notes", {
        method: "POST",
        data: {
          user_id: Number(userId),
        }
      });
      console.log(response, "response");
      console.log(response.data, "response.data");
      setData(response.data);
    } catch (error) {
      console.error("Error fetching notes:", error);
    } finally {
      setLoading(false);
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
  const columns: TableProps<any>["columns"] = [
    {
      title: t("number"),
      dataIndex: "number",
      key: "number",
      render: (text, record: any, index) => index + 1,
    },
    {
      title: t("title"),
      dataIndex: "title",
      key: "title",
      render: (_, record: any) => record.title,
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
  ];

  useEffect(() => {
    if (userId) {
      fetchNotes();
    }
  }, [userId]);

  return (
    <Layout>
      <Content className="overflow-auto h-[calc(100vh-100px)] dark:bg-black">
        <Card
          title={t("admin/menu/inbox")}
          classNames={{
            body: "!p-0",
          }}
        >
          <Table
            columns={columns}
            loading={loading}
            dataSource={data ?? []}
            className="w-full"
            size="small"
            scroll={{ x: "max-content" }}
            onChange={onChange}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              pageSizeOptions: [10, 20, 50],
            }}
            rowKey={(record) => record.id || record.key}
          />
        </Card>
      </Content>
    </Layout>
  );
};

export default UserNoteList;