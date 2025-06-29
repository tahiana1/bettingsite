import { Card, Table, Tabs } from "antd";
import { useTranslations } from "next-intl";

const UserBlackSearch = () => {
    const t = useTranslations();
    const columns = [
        {
            title: t("id"),
            dataIndex: "id",
        }
    ]
    const dataSource = [
        {
            id: "1",
            depositor: "1",
            accountNumber: "1",
        }
    ]
    return (
       <Card title={t("blacklist")}>
        <div className="flex flex-row gap-4">
            <Tabs items={[
                {
                    key: "1",
                    label: t("id"),
                    children: <div>1</div>
                },
                {
                    key: "2",
                    label: t("depositor"),
                    children: <div>1</div>
                }, 
                {
                    key: "3",
                    label: t("accountNumber"),
                    children: <div>1</div>
                },
                {
                    key: "4",
                    label: t("mobilePhone"),
                    children: <div>1</div>
                },
                {
                    key: "5",
                    label: t("ipAddress"),
                    children: <div>1</div>
                }
            ]} />
            <Table columns={columns} dataSource={dataSource} />
        </div>
       </Card>
    )
}

export default UserBlackSearch;