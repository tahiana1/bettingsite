"use client"
import { Card, Table, Tabs } from "antd";
import { useTranslations } from "next-intl";
import { useState } from 'react';

const UserBlackSearch = () => {
    const t = useTranslations();
    const [dataSource, setDataSource] = useState<any>([]);
    const columns = [
        {
            title: t("blockId"),
            dataIndex: "blockId",
        },
        {
            title: t("blockName"),
            dataIndex: "blockName",
        },
        {
            title: t("blockBank"),
            dataIndex: "blockBank",
        },
        {
            title: t("blockAccountNumber"),
            dataIndex: "blockAccountNumber",
        },
        {
            title: t("blockCellNumber"),
            dataIndex: "blockCellNumber",
        },
        {
            title: t("blockIP"),
            dataIndex: "blockIP",
        },
        {
            title: t("registrationDate"),
            dataIndex: "registrationDate",
        }
    ]
    return (
       <Card title={t("blocklist")}>
        <div className="flex flex-col gap-4">
            <Tabs 
                className="px-4"
                items={[
                    {
                        key: "1",
                        label: `${t("id")} : 0`,
                    },
                    {
                        key: "2",
                        label: t("depositor") + " : 0",
                    }, 
                    {
                        key: "3",
                        label: t("accountNumber") + " : 0",
                    },
                    {
                        key: "4",
                        label: t("mobilePhone") + " : 0",
                    },
                    {
                        key: "5",
                        label: t("ipAddress") + " : 0",
                    }
            ]} />
            <Table columns={columns} dataSource={dataSource} />
        </div>
       </Card>
    )
}

export default UserBlackSearch;