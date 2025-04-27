"use client";

import {
  Alert,
  Card,
  Carousel,
  Layout,
  List,
  Space,
  Splitter,
} from "antd";
import { Content } from "antd/es/layout/layout";
import React from "react";

import EventSidebar from "@/components/Home/EventSidebar";
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
import { useFormatter } from "next-intl";
import ProfileCard from "@/components/Home/ProfileCard";

const contentStyle: React.CSSProperties = {
  margin: 0,
  height: "260px",
  color: "#fff",
  textAlign: "center",
  background: "#364d79",
};

const gridStyle: React.CSSProperties = {
  width: "16.666%",
  textAlign: "center",
  padding: 0,
};

const Index: React.FC = () => {
  const f = useFormatter();
  return (
    <Layout hasSider>
      <Splitter className="shadow">
        <Splitter.Panel
          defaultSize="15%"
          min="15%"
          max="25%"
          style={{
            scrollbarWidth: "inherit",
          }}
          className="h-[calc(100vh-40px)]"
          collapsible
        >
          <EventSidebar />
        </Splitter.Panel>
        <Splitter.Panel
          defaultSize="60%"
          style={{
            scrollbarWidth: "inherit",
            paddingInline: 5,
          }}
        >
          <Layout>
            <Alert
              banner
              type="info"
              message={
                <Marquee pauseOnHover gradient={false}>
                  New events! New events!New events!New events!New events!New events!
                </Marquee>
              }
            />
            <Content className="p-4 overflow-y-auto h-[calc(100vh-80px)] w-full">
              <Carousel autoplay>
                <div>
                  <Image
                    className="w-full"
                    style={contentStyle}
                    alt=""
                    src={stream1}
                  />
                </div>
                <div>
                  <Image
                    className="w-full"
                    style={contentStyle}
                    alt=""
                    src={stream2}
                  />
                </div>
                <div>
                  <Image
                    className="w-full"
                    style={contentStyle}
                    alt=""
                    src={stream3}
                  />
                </div>
                <div>
                  <Image
                    className="w-full"
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
                  <Card.Grid style={gridStyle}>
                    <Image src={gtype1} style={{ width: "100%" }} alt="" />
                  </Card.Grid>
                  <Card.Grid style={gridStyle}>
                    <Image src={gtype2} style={{ width: "100%" }} alt="" />
                  </Card.Grid>
                  <Card.Grid style={gridStyle}>
                    <Image src={gtype3} style={{ width: "100%" }} alt="" />
                  </Card.Grid>
                  <Card.Grid style={gridStyle}>
                    <Image src={gtype4} style={{ width: "100%" }} alt="" />
                  </Card.Grid>
                  <Card.Grid style={gridStyle}>
                    <Image src={gtype5} style={{ width: "100%" }} alt="" />
                  </Card.Grid>
                  <Card.Grid style={gridStyle}>
                    <Image src={gtype6} style={{ width: "100%" }} alt="" />
                  </Card.Grid>
                </Card>
                <Space.Compact className="w-full gap-1">
                  <Card className="w-full" title="Announcements">
                    This is an APEX solution Sample site
                  </Card>
                  <Card
                    className="w-full !p-0"
                    classNames={{
                      body: "!p-0",
                    }}
                    title="Real-time deposit/withdraw status"
                  >
                    <List size="small" className="w-full">
                      <List.Item>
                        1. Deposit 235234 {f.dateTime(new Date())}
                      </List.Item>
                      <List.Item>
                        2. Deposit 235234 {f.dateTime(new Date())}
                      </List.Item>
                      <List.Item>
                        3. Deposit 235234 {f.dateTime(new Date())}
                      </List.Item>
                    </List>
                  </Card>
                  <Card
                    className="w-full"
                    title="Events"
                    classNames={{
                      body: "!p-0",
                    }}
                  >
                    <List size="small" className="w-full">
                      <List.Item>Affillate Events</List.Item>
                      <List.Item>Birthday Event</List.Item>
                      <List.Item>
                        <span className="text-red-600 text-xs">Event</span>{" "}
                        Multi-folder event
                      </List.Item>
                    </List>
                  </Card>
                </Space.Compact>
              </Space.Compact>
            </Content>
          </Layout>
        </Splitter.Panel>
        <Splitter.Panel
          style={{
            scrollbarWidth: "inherit",
          }}
          defaultSize="15%"
          min="15%"
          max="40%"
          className="!p- h-[calc(100vh-40px)]"
          collapsible={true}
        >
          <ProfileCard />
        </Splitter.Panel>
      </Splitter>
    </Layout>
  );
};

export default Index;
