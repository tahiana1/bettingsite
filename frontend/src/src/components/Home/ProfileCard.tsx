import React from "react";
import { Button, Card, List, Space } from "antd";
import { useAtom } from "jotai";
import { userState } from "@/state/state";
import Login from "../Auth/Login";
import { BiShield } from "react-icons/bi";
import { useTranslations } from "use-intl";
import { useFormatter } from "next-intl";
import Link from "next/link";
import { ROUTES } from "@/routes";
const ProfileCard: React.FC = () => {
  const [profile, setProfile] = useAtom<any>(userState);
  const t = useTranslations();
  const f = useFormatter();
  const onLogout = () => {
    // logout request
    setProfile({});
  };

  const items = [
    {
      key: "1",
      label: "profile/balance",
      value: f.number(profile.balance, {
        style: "currency",
        currency: "USD",
      }),
      action: (
        <Link href={ROUTES.deposit}>
          <Button type="link">Deposit Withdraw</Button>
        </Link>
      ),
    },
    {
      key: "2",
      label: "profile/xp",
      value: profile.balance,
      action: (
        <Link href={ROUTES.point}>
          <Button type="link">Point Conversion</Button>
        </Link>
      ),
    },
    {
      key: "3",
      label: "profile/comp",
      value: profile.balance,
      action: (
        <Link href={ROUTES.point}>
          <Button type="link">Comp Conversion</Button>
        </Link>
      ),
    },
  ];

  return profile?.id ? (
    <Card
      title={
        <Space.Compact className="w-full gap-2 items-center justify-between">
          <div className="flex gap-2 items-center">
            <BiShield />
            {profile.username}
          </div>
          <div></div>
          <div>{t("profile")}</div>
        </Space.Compact>
      }
      className="w-full px-0 "
      classNames={{
        body: "!px-2",
      }}
    >
      <Space direction="vertical" className=" w-full">
        <List
          className="!px-0"
          dataSource={items}
          renderItem={(item: any) => (
            <List.Item className="flex gap-2 !py-1">
              <div className="w-full flex-1">{t(item.label)} </div>
              <div className="w-full text-red-500 text-end flex-1">
                {item.value}
              </div>
              <div className="w-full text-end">{item.action}</div>
            </List.Item>
          )}
        />

        <Space.Compact className="w-full p-0 flex gap-0.5 justify-between">
          <Button
            variant="solid"
            color="green"
            className="w-full"
            onClick={onLogout}
          >
            Log out
          </Button>
          <Button className="w-full">Partner Page</Button>
        </Space.Compact>
      </Space>
    </Card>
  ) : (
    <Login />
  );
};

export default ProfileCard;
