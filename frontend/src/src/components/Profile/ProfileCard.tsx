import React, { useEffect, useState } from "react";
import { Button, Card, List, Modal, Space } from "antd";
import { useAtom } from "jotai";
import { userState } from "@/state/state";
import Login from "../Auth/Login";
import { BiShield } from "react-icons/bi";
import { useTranslations } from "use-intl";
import { useFormatter } from "next-intl";
import Link from "next/link";
import { ROUTES } from "@/routes";
import api from "@/api";

const ProfileCard: React.FC = () => {
  const [modal, contextHolder] = Modal.useModal();
  const [profile, setProfile] = useAtom<any>(userState);
  const [unreadNotesCount, setUnreadNotesCount] = useState<number>(0);
  const t = useTranslations();
  const f = useFormatter();
  useEffect(() => {
    api("user/me").then((res) => {
      setProfile(res.data.profile);
      fetchData(res.data.profile);
    }).catch((err) => {
      console.log(err);
    });
  }, []);
  const fetchData = async (profile: any) => {
    const response = await api("notes/get-unread-notes-count", {
      method: "POST",
      data: {
        user_id: profile.userId,
      }
    });
    setUnreadNotesCount(response?.count);
    setTimeout(() => {
      fetchData(profile);
    }, 10000);
  }
  const config = {
    title: "Would you like to logout?",
  };

  const onLogout = async () => {
    const confirmed = await modal.confirm(config);
    console.log("Confirmed: ", confirmed);
    // logout request
    if (confirmed) {
      setProfile({});
      
      api("auth/logout", { method: "POST" }).then((res) => {
        console.log({res})
        localStorage.removeItem("token");
      });
    }
  };

  const items = [
    {
      key: "1",
      label: "profile/balance",
      value: f.number(profile?.balance ?? 0, {
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
      value: profile?.xp ?? 0,
      action: (
        <Link href={ROUTES.point}>
          <Button type="link">Point Conversion</Button>
        </Link>
      ),
    },
    {
      key: "3",
      label: "profile/comp",
      value: profile?.comp ?? 0,
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
            {profile.name}
          </div>
          <div></div>
          <Link href={ROUTES.profile}>{t("profile")}</Link>
        </Space.Compact>
      }
      className="w-full px-0 "
      classNames={{
        body: "!px-2",
      }}
    >
      {contextHolder}
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
        ></List>

        <Space.Compact className="w-full p-0 flex gap-0.5 justify-between">
          <Button variant="outlined" color="green" className="w-full">
            <Link href={ROUTES.inbox}>{t("profile/inbox")} {unreadNotesCount > 0 && <span className="text-red-500">{unreadNotesCount}</span>}</Link>
          </Button>
          <Button variant="outlined" color="green" className="w-full">
            <Link href={ROUTES.attends}>{t("profile/attends")}</Link>
          </Button>
          <Button variant="outlined" color="green" className="w-full">
            <Link href={ROUTES.roulette}>{t("profile/roulette")}</Link>
          </Button>
        </Space.Compact>
        <Space.Compact className="w-full p-0 flex gap-0.5 justify-between">
          <Button variant="outlined" color="green" className="w-full">
            <Link href={ROUTES.deposit}>{t("billing/depositRequest")}</Link>
          </Button>
          <Link href={ROUTES.withdraw}>
            <Button variant="outlined" color="green" className="w-full">
              {t("billing/withdrawRequest")}
            </Button>
          </Link>
        </Space.Compact>
        <Space.Compact className="w-full p-0 flex gap-0.5 justify-between">
          <Button
            variant="solid"
            color="green"
            className="w-full"
            onClick={onLogout}
          >
            {t("auth/logout")}
          </Button>
          <Button variant="outlined" color="blue" className="w-full">
            Go Partner
          </Button>
        </Space.Compact>
      </Space>
    </Card>
  ) : (
    <Login />
  );
};

export default ProfileCard;
