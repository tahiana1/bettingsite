import React from "react";
import { Avatar, List } from "antd";
import { BsTelegram } from "react-icons/bs";
import { GiTalk } from "react-icons/gi";
import Link from "next/link";
import { BiPhoneCall } from "react-icons/bi";
const data = [
  {
    title: "Telegram",
    icon: <BsTelegram className="w-14" />,
    href: "https://t.me/",
    target: "_blank",
  },
  {
    title: "Talk",
    icon: <GiTalk />,
    href: "tel:+111111111111",
    target: "",
  },
  {
    title: "Call Us",
    icon: <BiPhoneCall />,
    href: "tel:+111111111111",
    target: "",
  },
];
const ContactCard = () => (
  <List
    itemLayout="horizontal"
    dataSource={data}
    renderItem={(item) => (
      <Link href={item.href} className="w-full" target={item.target}>
        <List.Item className="w-full !px-6 items-center align-middle">
          <List.Item.Meta
            className="!p-0"
            avatar={<Avatar src={item.icon} className="!text-7xl" />}
            // title={<Link href="">{item.title}</Link>}
            // description="Ant Design, a design language for background applications, is refined by Ant UED Team"
          />
          <div className="w-full">{item.title}</div>
        </List.Item>
      </Link>
    )}
  />
);
export default ContactCard;
