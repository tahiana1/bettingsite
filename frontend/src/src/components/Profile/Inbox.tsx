import React, { useState } from "react";
import {
  Avatar,
  Button,
  Card,
  List,
  message,
  Popconfirm,
  PopconfirmProps,
} from "antd";
import { useTranslations } from "next-intl";

const Inbox: React.FC = () => {
  const t = useTranslations();
  const [msgs, setMsgs] = useState([
    {
      id: 1,
      title: "Inbox Title 1",
    },
    {
      id: 2,
      title: "Inbox Title 2",
    },
    {
      id: 3,
      title: "Inbox Title 3",
    },
    {
      id: 4,
      title: "Inbox Title 4",
    },
  ]);
  const [messageApi, contextHolder] = message.useMessage();

  const confirm = (item: any) => {
    messageApi.success("The item removed.");
    setMsgs([...msgs.filter((m) => m.id != item.id)]);
  };

  const cancel: PopconfirmProps["onCancel"] = (e) => {
    console.log(e);
    // messageApi.error("Click on No");
  };
  return (
    <Card title={<span className="text-green-600">{t("profile/inbox")}</span>}>
      {contextHolder}
      <List
        pagination={{ position: "bottom", align: "center" }}
        dataSource={msgs}
        renderItem={(item) => (
          <List.Item
          key={item.id}
            actions={[
              <Popconfirm key={1}
                title="Delete the item"
                description="Are you sure to delete this item?"
                onConfirm={() => confirm(item)}
                onCancel={cancel}
                okText="Yes"
                cancelText="No"
              >
                <Button danger> {t("delete")}</Button>
              </Popconfirm>,
            ]}
          >
            <List.Item.Meta
              avatar={<Avatar>A</Avatar>}
              title={
                <Button type="link" size="small">
                  {item.title}
                </Button>
              }
              description="Hello, this is support team. Hello, this is support team. Hello, this is support team."
            />
          </List.Item>
        )}
      />
    </Card>
  );
};

export default Inbox;
