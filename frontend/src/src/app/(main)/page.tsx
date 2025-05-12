"use client";

import {
  Alert,
  Card,
  Carousel,
  Checkbox,
  Layout,
  List,
  Space,
  notification,
} from "antd";

import { Content } from "antd/es/layout/layout";
import React, { useEffect } from "react";

import Marquee from "react-fast-marquee";

import stream1 from "@/assets/img/slide/stream1.png";
import stream2 from "@/assets/img/slide/stream2.png";
import stream3 from "@/assets/img/slide/stream3.png";
import stream4 from "@/assets/img/slide/stream4.png";

import gtype1 from "@/assets/img/slide/gtype1.png";
import gtype2 from "@/assets/img/slide/gtype2.png";
import gtype3 from "@/assets/img/slide/gtype3.png";
import gtype4 from "@/assets/img/slide/gtype4.png";
import gtype5 from "@/assets/img/slide/gtype5.png";
import gtype6 from "@/assets/img/slide/gtype6.png";

import Image from "next/image";
import { useFormatter, useTranslations } from "next-intl";
import { useAtom } from "jotai";
import { notificationState, notiState } from "@/state/state";
import api from "@/api";
import dayjs from "dayjs";
import { useQuery } from "@apollo/client";
import { GET_LATEST_ANNOUNCEMENTS } from "@/actions/announcement";
import { GET_TOP_EVENT } from "@/actions/event";

const contentStyle: React.CSSProperties = {
  margin: 0,
  height: "260px",
  color: "#fff",
  textAlign: "center",
  background: "#364d79",
};

const Index: React.FC = () => {
  const t = useTranslations();
  const f = useFormatter();
  const tk = dayjs().format("YYYYMMDD");

  const { data, loading } = useQuery(GET_LATEST_ANNOUNCEMENTS);
  const { data: eventData, } = useQuery(GET_TOP_EVENT);

  const [notiApi, contextHolder] = notification.useNotification();

  const [noti, setNoti] = useAtom<any>(notiState);
  const [notifications, setNotififications] = useAtom<any[]>(notificationState);

  const onChange = (n: any) => {
    const nn = noti[tk] ?? [];
    nn.push(n.id);
    setNoti({ ...noti, [tk]: nn });
  };

  useEffect(() => {
    notifications.map((n) => {
      if ((noti[dayjs().format("YYYYMMDD")] ?? []).indexOf(n.id) == -1) {
        notiApi.info({
          message: n.title,
          description: n.description,
          placement: "topLeft",
          actions: [
            <Checkbox onChange={() => onChange(n)} key={n.id}>
              {t("home/hideToday")}
            </Checkbox>,
          ],
          duration: null,
        });
      }
    });
    // return () => {
    // setNotififications([]);
    // };
  }, [notifications]);

  useEffect(() => {
    if (data) {
      data.announcements?.map((a: Announcement) => a);
    }
  }, [data]);

  useEffect(() => {
    api("common/notifications").then((result) => {
      setNotififications(result.data);
    });
    return () => {
      setNotififications([]);
    };
  }, []);
  return (
    <Layout>
      {contextHolder}
      <Alert
        banner
        type="info"
        message={
          <Marquee pauseOnHover gradient={false}>
            New events! New events!New events!New events!New events!New events!
          </Marquee>
        }
      />
      <Content className="p-4 overflow-y-auto h-screen md:h-[calc(100vh-70px)] w-full">
        <Carousel autoplay>
          <div>
            <Image
              // className="w-full"
              style={contentStyle}
              alt=""
              src={stream1}
            />
          </div>
          <div>
            <Image
              // className="w-full"
              style={contentStyle}
              alt=""
              src={stream2}
            />
          </div>
          <div>
            <Image
              // className="w-full"
              style={contentStyle}
              alt=""
              src={stream3}
            />
          </div>
          <div>
            <Image
              // className="w-full"
              style={contentStyle}
              alt=""
              src={stream4}
            />
          </div>
        </Carousel>
        <Space.Compact direction="vertical" className="w-full gap-2">
          <Card
            className="w-full p-0 !mt-2"
            classNames={{
              body: "!px-0",
            }}
          >
            <Card.Grid className="!w-1/2 md:!w-1/6 !p-0">
              <Image src={gtype1} style={{ width: "100%" }} alt="" />
            </Card.Grid>
            <Card.Grid className="!w-1/2 md:!w-1/6 !p-0">
              <Image src={gtype2} style={{ width: "100%" }} alt="" />
            </Card.Grid>
            <Card.Grid className="!w-1/2 md:!w-1/6 !p-0">
              <Image src={gtype3} style={{ width: "100%" }} alt="" />
            </Card.Grid>
            <Card.Grid className="!w-1/2 md:!w-1/6 !p-0">
              <Image src={gtype4} style={{ width: "100%" }} alt="" />
            </Card.Grid>
            <Card.Grid className="!w-1/2 md:!w-1/6 !p-0">
              <Image src={gtype5} style={{ width: "100%" }} alt="" />
            </Card.Grid>
            <Card.Grid className="!w-1/2 md:!w-1/6 !p-0">
              <Image src={gtype6} style={{ width: "100%" }} alt="" />
            </Card.Grid>
          </Card>
          <Space.Compact className="w-full gap-2 flex flex-col md:flex-row">
            <Card
              title={t("announcements")}
              loading={loading}
              className="w-full"
              classNames={{
                body: "!p-0",
              }}
            >
              <List
                size="small"
                className="w-full"
                dataSource={data?.announcements ?? []}
                renderItem={(i: Announcement) => (
                  <List.Item>{i.description}</List.Item>
                )}
              />
            </Card>
            <Card
              className="w-full !p-0"
              classNames={{
                body: "!p-0",
              }}
              title={t("Real-time deposit/withdraw status")}
            >
              <List size="small" className="!w-full">
                <List.Item className="w-full">
                  1. Deposit 235234 {f.dateTime(new Date())}
                </List.Item>
                <List.Item>
                  2. Deposit 235234 {f.dateTime(new Date())}
                </List.Item>
                <List.Item>
                  3. Deposit 235234 {f.dateTime(new Date())}
                </List.Item>
                <List.Item>
                  4. Deposit 235234 {f.dateTime(new Date())}
                </List.Item>
                <List.Item>
                  5. Deposit 235234 {f.dateTime(new Date())}
                </List.Item>
                <List.Item>
                  6. Deposit 235234 {f.dateTime(new Date())}
                </List.Item>
              </List>
            </Card>
            <Card
              title={t("events")}
              className="w-full"
              classNames={{
                body: "!p-0",
              }}
            >
              <List
                size="small"
                className="w-full"
                dataSource={eventData?.response ?? []}
                renderItem={(e: Event) => (
                  <List.Item>
                    {e.title} - {e.description}
                  </List.Item>
                )}
              />
            </Card>
          </Space.Compact>
        </Space.Compact>
      </Content>
    </Layout>
  );
};

export default Index;
