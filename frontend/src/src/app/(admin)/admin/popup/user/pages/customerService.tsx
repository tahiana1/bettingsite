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

const UserCustomerService: React.FC = () => {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const userId = searchParams.get('id');

  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCustomerService = async () => {
    if (!userId) return;
    
    setLoading(true);
    try {
      const response = await api("qna/get-qna", {
        method: "POST",
        data: {
          user_id: Number(userId),
        }
      });
      console.log(response, "response");
      if (response.status) {
        setData(response.data.map((qna: any) => ({
          id: qna.id.toString(),
          title: qna.questionTitle,
          description: qna.question,
          createdAt: qna.createdAt,
          status: qna.status,
          answerTitle: qna.answerTitle,
          answer: qna.answer,
          repliedAt: qna.repliedAt
        })));
      }
    } catch (error) {
      console.error("Error fetching customer service data:", error);
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
      dataIndex: "status",
      key: "status",
      render: (_, record: any) => {
        return record.status === "P" ? t("pending") : t("answered");
      },
    },
  ];

  useEffect(() => {
    if (userId) {
      fetchCustomerService();
    }
  }, [userId]);

  return (
    <Layout>
      <Content className="overflow-auto h-[calc(100vh-100px)] dark:bg-black">
        <Card
          title={t("QNA")}
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
            expandable={{
              expandedRowRender: (record) => {
                return (
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border">
                    <div className="mb-4">
                      <h4 className="font-semibold text-lg mb-2 text-gray-800 dark:text-gray-200">
                        {t("question")}:
                      </h4>
                      <div 
                        className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4 p-3 bg-white dark:bg-gray-700 rounded border"
                        dangerouslySetInnerHTML={{ __html: record.description }}
                      />
                    </div>
                    {record.status === 'P' || !record.answer ? (
                      <div className="p-3 bg-yellow-50 dark:bg-yellow-900 rounded border border-yellow-200 dark:border-yellow-700">
                        <p className="text-yellow-700 dark:text-yellow-300 italic">{t("noReplyYet")}</p>
                      </div>
                    ) : (
                      <div>
                        <h4 className="font-semibold text-lg mb-2 text-gray-800 dark:text-gray-200">
                          {record.answerTitle || t("reply")}:
                        </h4>
                        <div 
                          className="text-gray-700 dark:text-gray-300 leading-relaxed p-3 bg-white dark:bg-gray-700 rounded border"
                          dangerouslySetInnerHTML={{ __html: record.answer }}
                        />
                        {record.repliedAt && (
                          <div className="text-gray-500 dark:text-gray-400 text-sm mt-3 pt-2 border-t border-gray-200 dark:border-gray-600">
                            {t("repliedAt")}: {dayjs(record.repliedAt).format("YYYY-MM-DD HH:mm:ss")}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              },
              rowExpandable: () => true,
            }}
          />
        </Card>
      </Content>
    </Layout>
  );
};

export default UserCustomerService;