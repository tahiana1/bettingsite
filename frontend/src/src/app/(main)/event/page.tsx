"use client";

import { Button, Card, Table } from "antd";
import Image from "next/image";
import { Content } from "antd/es/layout/layout";
import { useTranslations } from "next-intl";
import { Tabs } from "antd/lib";
import { useEffect } from "react";
import api from "@/api";
import { useState } from "react";
import "./event.css";
import dayjs from "dayjs";

const Event: React.FC = () => {
    const [eventData, setEventData] = useState<any[]>([]);
    const t = useTranslations();
    useEffect(() => {
        api("event/get-event", { 
            method: "GET"
        }).then((res) => {
            setEventData(res);
        });
    }, [])

    const columns = [
        {
            title: t("number"),
            dataIndex: "number",
            key: "number",
            render: (_: any, __: any, index: number) => index + 1,
            width: 80,
        },
        {
            title: t("title"),
            dataIndex: "title",
            width: 800,
            key: "title",
        },
        {
            title: t("createdDate"),
            dataIndex: "createdAt",
            key: "date",
            render: (date: string) => dayjs(date).format("DD/MM/YYYY")
        },
    ];

    
    const bodyElement = () => {
        return (
            <div>
                <Table
                    columns={columns}
                    dataSource={eventData.map((event, idx) => ({
                        ...event,
                        number: idx + 1,
                        key: event.id || idx,
                    }))}
                    pagination={false}
                    className="mb-6"
                />
            </div>
        )                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          
    }
    
    const items = eventData.map((event) => {
        return {
            key: event.id,
            selected: false,
            label:  <button className="cursor-pointer border-[1px] ml-0 border-gray-300 py-1 px-4 text-white px-4 py-1">{event.title}</button>,
            children: <div>{bodyElement()}</div>
        }
    })

    
    return (
    <Content className="p-3 overflow-y-auto h-[calc(100vh-40px)]" id="eventPage">
        <Card
            title={t("event")}
        >
            {/* <Tabs items={items} /> */}
            <Table
                    columns={columns}
                    dataSource={eventData.map((event, idx) => ({
                        ...event,
                        number: idx + 1,
                        key: event.id || idx,
                    }))}
                    pagination={false}
                    className="mb-6"
                />
        </Card>
    </Content>
  );
};

export default Event;