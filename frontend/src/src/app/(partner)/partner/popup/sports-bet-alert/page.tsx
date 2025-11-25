"use client";
import PopupHeader from "@/components/partner/popupHeader";
import SettlementRequest from "@/app/(admin)/partner/settlements/losingdetail/page";
import { DatePicker, Input, Layout, Radio, Space, Table, TableProps } from "antd";
import { useTranslations } from "next-intl";
import { Button } from "antd";
import { isValidDate, parseTableOptions } from "@/lib";
import { useFormatter } from "next-intl";
import { useState } from "react";
import { RxLetterCaseToggle } from "react-icons/rx";
import { Dayjs } from "dayjs";

const SportsBetAlert = () => {
    const t = useTranslations();
    const f = useFormatter();
    const [loading, setLoading] = useState(false);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(25);
    const [tableOptions, setTableOptions] = useState<any>({
        filters: [
          {
            field: "transactions.type",
            value: "T",
            op: "eq",
          },
        ],
      });
    const onRangerChange = (
        dates: (Dayjs | null)[] | null,
        dateStrings: string[]
      ) => {
        let filters: { field: string; value: string; op: string }[] =
          tableOptions?.filters ?? [];
        const f = filters.filter((f) => f.field !== "transactions.created_at");
        if (dates?.at(0)) {
          filters = [
            ...f,
            {
              field: "transactions.created_at",
              value: dateStrings[0],
              op: "gt",
            },
            {
              field: "transactions.created_at",
              value: dateStrings[1],
              op: "lt",
            },
          ];
        }
        console.log({ filters });
        setTableOptions({ ...tableOptions, filters });
      };
    
    const columns: TableProps<Transaction>["columns"] = [
        {
          title: t("number"),
          dataIndex: "user.id",
          fixed: "left",
          key: "id",
          render: (_, record) => record.user?.id,
        },
        {
          title: t("rootDistributor"),
          dataIndex: "user.root.userid",
          key: "root.userid",
          render: (_, record) => record.user?.root?.userid,
        },  
        {
          title: t("topDistributor"),
          dataIndex: "profile.comp",
          key: "member_count",
          render: (_, record) => record.user?.profile?.comp,
        },
        {
          title: t("ID"),
          dataIndex: "site",
          key: "site",
          render: (text) => text ?? "site",
        },
        {
          title: t("nickname"),
          dataIndex: "status",
          key: "status",
        },
        {
          title: t("bettingType"),
          dataIndex: "user.profile.holderName",
          key: "holderName",
          render: (_, record) => record.user?.profile?.holderName,
        },
        {
          title: t("gameName"),
          dataIndex: "user.profile.nickname",
          key: "nickname",
          render: (_, record) => record.user?.profile?.nickname,
        },
        {
          title: t("bettingAmount"),
          dataIndex: "user.profile.point",
          key: "point",
          render: (_, record) => record.user?.profile?.point,
        },
        {
          title: t("prizeAmount"),
          dataIndex: "deposit",
          key: "deposit",
          render: () => "-",
        },
        {
          title: t("notificationMinimumBet"),
          dataIndex: "withdraw",
          key: "withdraw",
          render: () => "-",
        },
        {
          title: t("notifiationMinimumWinner"),
          key: "entry_exit",
          render: (_, record) => [
            <Button key="deposit" size="small">{t("deposit/withdraw")}</Button>,
            <Button key="point" size="small">{t("points") + "+"}</Button>,
          ],
        },
        {
          title: t("bettingTime"),
          dataIndex: "bet",
          key: "bet",
          render: () => "-",
        },
        {
          title: t("shortcut"),
          dataIndex: "winner",
          key: "winner",
          render: () => <Button size="small" className="bg-blue-500 text-white">{t("shortcut")}</Button>,
        }
      ];
    return <div className="!w-full h-[100vh] bg-white">
        <div className="!w-full bg-black p-1" >
            <PopupHeader title="sportsBetAlert" />
        </div>
        <Layout className="!w-full bg-white">
            <Space className="p-2 !w-full" direction="vertical">
                <Radio.Group
                size="small"
                optionType="button"
                buttonStyle="solid"
                options={[
                    {
                    label: t("all"),
                    value: "",
                    },
                    {
                    label: t("site"),
                    value: "site",
                    },
                ]}
                defaultValue={""}
                />

                <Space className="!w-full justify-between">
                <Space>
                    <DatePicker.RangePicker
                    size="small"
                    onChange={onRangerChange}
                    />
                    <Input.Search
                    size="small"
                    placeholder="ID,Nickname,Account Holder,Phone Number"
                    suffix={
                        <Button
                        size="small"
                        type="text"
                        icon={<RxLetterCaseToggle />}
                        />
                    }
                    enterButton={t("search")}
                    />
                </Space>
                </Space>
            </Space>
            <Table<Transaction>
                columns={columns}
                loading={loading}
                dataSource={transactions ?? []}
                className="w-full"
                size="small"
                scroll={{ x: "max-content" }}
                // onChange={onChange}
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
          </Layout>
    </div>
};

export default SportsBetAlert;