"use client";

import { Card, Table, Layout, TableProps } from "antd";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import api from "@/api";
import { useState } from "react";
import "./event.css";
import dayjs from "dayjs";
import modalImage from '@/assets/img/main/modal-head.png';
import { SiDepositphotos } from "react-icons/si";

const Event: React.FC<{checkoutModal?: (modal: string) => void}> = (props) => {
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
            width: 400,
            key: "title",
        },
        {
            title: t("createdDate"),
            dataIndex: "createdAt",
            key: "date",
            render: (date: string) => dayjs(date).format("YYYY-MM-DD HH:mm:ss")
        },
    ];

    const expandedRowRender = (record: any) => {
        return (
            <div className="p-4 bg-[#160d0c]">
                <h3 className="font-bold mb-2 text-[#edd497]">{record.title}</h3>
                <div className="text-white">{record.description && <div dangerouslySetInnerHTML={{ __html: record.description }} />}</div>
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
        <Layout.Content className="w-full border-1 bg-[#160d0c] border-[#3e2e23] event-section">
            <Card
                title={
                    <div className="relative">
                        <h2 className="text-[#edd497] text-[40px] justify-center flex pt-10 font-bold">{t("event")}</h2>
                        <p className="text-white text-[14px] font-[400] justify-center pb-6 flex">{t("event")}</p>
                        <div className="absolute bottom-2 right-0 flex gap-2">
                            <button className="text-white text-[14px] font-[400] btn-modal-effect justify-center py-2 flex ">{t("myPage")}</button>
                            <button className="text-white text-[14px] font-[400] btn-modal-effect justify-center py-2 flex ">{t("betHistory")}</button>
                        </div>
                    </div>
                }
                styles={{
                    header: {
                        backgroundImage: `url(${modalImage.src})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        borderBottom: '1px solid #3e2e23',
                    },
                    body: {
                        backgroundColor: '#160d0c',
                        borderTop: '1px solid #3e2e23',
                        padding: '0px'
                    }
                }}
                classNames={{
                    actions: "!p-1",
                    body: "!px-2",
                }}
                className="w-full bg-[#160d0c] border-none"
            >
                <div className="flex w-full mb-6 bg-gradient-to-r from-[#2a1810] to-[#3e2a1f] rounded-lg overflow-hidden border border-[#5d4a3a]">
                    <button
                        onClick={() => props.checkoutModal && props.checkoutModal("deposit")}
                        className="flex-1 flex items-center justify-center gap-2 cursor-pointer text-[15px] px-4 py-3 text-white hover:bg-[#2a1810] transition-colors border-r border-[#5d4a3a]">
                        <SiDepositphotos className="text-lg" />
                        {t("deposit")}
                    </button>
                    <button
                        className="flex-1 flex items-center justify-center gap-2 cursor-pointer text-[15px] px-4 py-3 text-white hover:bg-[#2a1810] transition-colors border-r border-[#5d4a3a]"
                        onClick={() => props.checkoutModal && props.checkoutModal("withdraw")}
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                        </svg>
                        {t("withdraw")}
                    </button>
                    <button 
                        className="flex-1 flex items-center justify-center gap-2 cursor-pointer text-[15px] px-4 py-3 text-white hover:bg-[#2a1810] transition-colors border-r border-[#5d4a3a]"
                        onClick={() => props.checkoutModal && props.checkoutModal("notice")}
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
                        </svg>
                        {t("notice")}
                    </button>
                    <button 
                        className="flex-1 flex items-center justify-center gap-2 cursor-pointer text-[15px] px-4 py-3 bg-[#4a3224] text-[#edd497] font-bold border-r border-[#5d4a3a] hover:bg-[#5a3a2a] transition-colors"
                        onClick={() => props.checkoutModal && props.checkoutModal("event")}
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z"/>
                        </svg>
                        {t("event")}
                    </button>
                </div>
            </Card>
            <Table
                columns={columns}
                dataSource={eventData.map((event, idx) => ({
                    ...event,
                    number: idx + 1,
                    key: event.id || idx,
                }))}
                className="w-full mt-4 bg-[#160d0c]"
                size="small"
                scroll={{ x: "max-content" }}
                onChange={onChange}
                expandable={{
                    expandedRowRender,
                    rowExpandable: (record) => true,
                }}
                pagination={{
                    showTotal(total, range) {
                        return t(`paginationLabel`, {
                            from: range[0],
                            to: range[1],
                            total: total,
                        });
                    },
                    total: eventData.length,
                    showSizeChanger: true,
                    pageSizeOptions: [10, 20, 50],
                }}
            />
        </Layout.Content>
    );
};

export default Event;