"use client";

import { Button, Input, Table } from "antd";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";

// Define the User interface to match the actual data structure
interface User {
    __typename: string;
    id: number;
    name: string;
    userid: string;
    role: string;
    parentId: number | null;
    parent: any;
    root: any;
    type: string;
    blackMemo: boolean;
    usdtAddress: string;
    currentIP: string;
    IP: string;
    createdAt: string;
    updatedAt: string;
    status: string;
    profile: {
        __typename: string;
        id: number;
        userId: number;
        name: string;
        nickname: string;
        bankName: string;
        holderName: string;
        accountNumber: string;
        birthday: string;
        phone: string;
        mobile: string;
        balance: number;
        point: number;
        comp: number;
        level: number;
        favorites: string;
        referral: string;
        coupon: number;
        lastDeposit: string | null;
        lastWithdraw: string | null;
    };
    key: number;
    children?: User[];
}

const LosingSettingPage = (props: any) => {
    console.log(props, "props");
    const t = useTranslations();
    const [loading, setLoading] = useState(false);
    const [treeUsers, setTreeUsers] = useState<User[]>([]);
    const [total, setTotal] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(25);
    const [expandedRowKeys, setExpandedRowKeys] = useState<React.Key[]>([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

    // Update data when props change
    useEffect(() => {
        console.log("LosingSettingPage props:", props);
        console.log("Props data:", props.data);
        
        // Handle different data structures
        let dataToSet: User[] = [];
        
        if (Array.isArray(props.data)) {
            // If props.data is directly an array
            dataToSet = props.data;
            console.log("Data is direct array:", dataToSet);
        } else if (props.data?.currentUser?.children && Array.isArray(props.data.currentUser.children)) {
            // If props.data has currentUser.children array, use currentUser as root
            dataToSet = [props.data.currentUser];
            console.log("Using currentUser as root with children:", dataToSet);
        } else if (props.data?.children && Array.isArray(props.data.children)) {
            // If props.data has children array, use props.data as root
            dataToSet = [props.data];
            console.log("Using props.data as root with children:", dataToSet);
        } else if (props.data?.data && Array.isArray(props.data.data)) {
            // If props.data has data array
            dataToSet = props.data.data;
            console.log("Data has data array:", dataToSet);
        } else if (props.data?.currentUser && !Array.isArray(props.data.currentUser)) {
            // If props.data has currentUser object, use it as root
            dataToSet = [props.data.currentUser];
            console.log("Using currentUser as root:", dataToSet);
        } else if (props.data && typeof props.data === 'object' && !Array.isArray(props.data)) {
            // If props.data is an object with children, use it as root
            if (props.data.children && Array.isArray(props.data.children)) {
                dataToSet = [props.data];
                console.log("Using props.data as root with children:", dataToSet);
            } else {
                // Try to find any array property
                const keys = Object.keys(props.data);
                console.log("Available keys in props.data:", keys);
                
                for (const key of keys) {
                    if (Array.isArray(props.data[key])) {
                        dataToSet = props.data[key];
                        console.log(`Found array in key '${key}':`, dataToSet);
                        break;
                    }
                }
            }
        }
        
        console.log("Final data to set:", dataToSet);
        setTreeUsers(dataToSet);
        setTotal(dataToSet.length);
        
        if (props.data?.currentUser) {
            console.log("Current user data:", props.data.currentUser);
        }
    }, [props]);

    const columns = [
        {
            title: "ID",
            dataIndex: "userid",
            key: "userid"
        },
        {
            title: t("spot"),
            dataIndex: "spot",
            key: "spot",
            render: (text: string) => {
                return <div className="flex items-center gap-2">
                    <Input />
                    <Button type="primary">{t("save")}</Button>
                    <Button type="default">{t("blankChange")}</Button>
                </div>
            }
        },
        {
            title: t("Lotus (Be-Dang) Losing (%)"),
            dataIndex: "lotusLosing(Be-Dang)",
            key: "lotusLosing(Be-Dang)",
            render: (text: string) => {
                return <div className="flex items-center gap-2">
                    <Input />
                    <Button type="primary">{t("save")}</Button>
                    <Button type="default">{t("blankChange")}</Button>
                </div>
            }
        },
        {
            title: t("MGM (Be-Dang) Losing (%)"),
            dataIndex: "mgmLosing(Be-Dang)",
            key: "mgmLosing(Be-Dang)",
            render: (text: string) => {
                return <div className="flex items-center gap-2">
                    <Input />
                    <Button type="primary">{t("save")}</Button>
                    <Button type="default">{t("blankChange")}</Button>
                </div>
            }
        }
    ];

    const onExpand = (expanded: boolean, record: User) => { 
        console.log("Expand triggered:", expanded, record);
        if (expanded) {
            setExpandedRowKeys(prev => [...prev, record.id]);
        } else {
            setExpandedRowKeys(prev => prev.filter(key => key !== record.id));
        }
    };

    const onChange = (pagination: any, filters: any, sorter: any, extra: any) => {
        console.log(pagination, filters, sorter, extra);
    };

    // Debug: Log the current data structure
    console.log("Current treeUsers:", treeUsers);
    console.log("Expanded row keys:", expandedRowKeys);

    return <Table<User>
        columns={columns}
        loading={loading}
        dataSource={treeUsers ?? []}
        className="w-full"
        size="small"
        scroll={{ x: "max-content" }}
        rowKey="id"
        expandable={{
            onExpand,
            expandedRowKeys,
            childrenColumnName: "children"
        }}
        onChange={onChange}
        pagination={{   
        showTotal(total, range) {
            return t("paginationLabel", {
            from: range[0],
            to: range[1],
            total,
            });
        },
        total: total,
        showSizeChanger: true,
        defaultPageSize: 25,
        pageSizeOptions: [25, 50, 100, 250, 500, 1000],
        }}
    />
};

export default LosingSettingPage;