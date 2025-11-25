"use client";

import { Button, Input, InputNumber, Select, Table, message } from "antd";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useMutation } from "@apollo/client";
import { UPDATE_USER } from "@/actions/user";

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
    
    // Losing-related fields
    live?: number;
    slot?: number;
    hold?: number;
    entireLosing?: number;
    liveLosingBeDang?: number;
    slotLosingBeDang?: number;
    holdLosingBeDang?: number;
    losingMethod?: string;
    
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
        referral: string;
        coupon: number;
        lastDeposit: string | null;
        lastWithdraw: string | null;
    };
    key: number;
    children?: User[];
}

const RollingCasinoPage = (props: any) => {
    console.log(props, "props");
    const t = useTranslations();
    const [loading, setLoading] = useState(false);
    const [treeUsers, setTreeUsers] = useState<User[]>([]);
    const [total, setTotal] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(25);
    const [expandedRowKeys, setExpandedRowKeys] = useState<React.Key[]>([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    
    // State for losing setting values - keyed by user ID
    const [formValues, setFormValues] = useState<{[key: string]: {
        live: number;
        slot: number;
        hold: number;
    }}>({});
    
    // GraphQL mutation
    const [updateUser, { loading: updateLoading }] = useMutation(UPDATE_USER);

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

    // Initialize state with user data (including children)
    useEffect(() => {
        if (treeUsers && treeUsers.length > 0) {
            const newFormValues: {[key: string]: {
                live: number;
                slot: number;
                hold: number;
            }} = {};

            const initializeUserValues = (user: User) => {
                newFormValues[user.id] = {
                    live: user.live || 0,
                    slot: user.slot || 0,
                    hold: user.hold || 0,
                };

                // Initialize children recursively
                if (user.children && user.children.length > 0) {
                    user.children.forEach(child => initializeUserValues(child));
                }
            };

            treeUsers.forEach(user => initializeUserValues(user));
            setFormValues(newFormValues);
        }
    }, [treeUsers]);

    // Update form values for a specific user
    const updateFormValue = (userId: number, field: string, value: number | string) => {
        setFormValues(prev => ({
            ...prev,
            [userId]: {
                ...prev[userId],
                [field]: value
            }
        }));
    };

    // Save handlers for each field
    const handleSave = async (userId: number, field: string) => {
        try {
            const userFormValues = formValues[userId];
            if (!userFormValues) {
                message.error('User form values not found');
                return;
            }

            const value = userFormValues[field as keyof typeof userFormValues];
            if (value === undefined) {
                message.error('Value not found');
                return;
            }

            const input: any = {};
            input[field] = value;

            await updateUser({
                variables: {
                    id: userId,
                    input: input
                }
            });

            message.success('Successfully updated!');
        } catch (error) {
            console.error('Error updating user:', error);
            message.error('Failed to update');
        }
    };



    const columns = [
        {
            title: "ID",
            dataIndex: "userid",
            key: "userid"
        },
        {
            title: t("live"),
            dataIndex: "live",
            key: "live",
            render: (text: string, record: User) => {
                return <div className="flex items-center gap-2">
                    <InputNumber 
                        style={{ width: 200 }} 
                        min={0} 
                        value={formValues[record.id]?.live || 0}
                        onChange={(value) => updateFormValue(record.id, 'live', value || 0)}
                    />
                    <Button 
                        type="primary" 
                        loading={updateLoading}
                        onClick={() => handleSave(record.id, 'live')}
                    >
                        {t("save")}
                    </Button>
                </div>
            }
        },
        {
            title: t("slot"),
            dataIndex: "slot",
            key: "slot",
            render: (text: string, record: User) => {
                return <div className="flex items-center gap-2">
                    <InputNumber 
                        style={{ width: 200 }} 
                        min={0} 
                        value={formValues[record.id]?.slot || 0}
                        onChange={(value) => updateFormValue(record.id, 'slot', value || 0)}
                    />
                    <Button 
                        type="primary" 
                        loading={updateLoading}
                        onClick={() => handleSave(record.id, 'slot')}
                    >
                        {t("save")}
                    </Button>
                </div>
            }
        },
        {
            title: t("hold'em"),
            dataIndex: "hold",
            key: "hold",
            render: (text: string, record: User) => {
                return <div className="flex items-center gap-2">
                    <InputNumber 
                        style={{ width: 200 }} 
                        min={0} 
                        value={formValues[record.id]?.hold || 0}
                        onChange={(value) => updateFormValue(record.id, 'hold', value || 0)}
                    />
                    <Button 
                        type="primary" 
                        loading={updateLoading}
                        onClick={() => handleSave(record.id, 'hold')}
                    >
                        {t("save")}
                    </Button>
                </div>
            }
        },

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

    return <div className="flex w-full flex-col gap-2"> 
        <Table<User>
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
    <div className="flex items-center gap-2 mt-4">
        <span className="text-red-500">*</span> {t("onlyDistributorMembers")}
    </div>
    </div>
};

export default RollingCasinoPage;