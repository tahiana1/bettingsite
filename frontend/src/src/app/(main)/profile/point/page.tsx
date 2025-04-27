"use client";

import { Layout, Splitter } from "antd";
import { Content } from "antd/es/layout/layout";
import React from "react";

import EventSidebar from "@/components/Home/EventSidebar";
import ProfileCard from "@/components/Home/ProfileCard";

const Point: React.FC = () => {
  return (
    <Layout hasSider>
      <Splitter className="shadow">
        <Splitter.Panel
          defaultSize="20%"
          min="20%"
          max="40%"
          style={{
            scrollbarWidth: "inherit",
          }}
          className="!pr-4 h-[calc(100vh-40px)]"
          collapsible
        >
          <EventSidebar />
        </Splitter.Panel>
        <Splitter.Panel
          defaultSize="60%"
          style={{
            scrollbarWidth: "inherit",
          }}
        >
          <Layout>
            <Content className="p-4 overflow-y-auto h-[calc(100vh-124px)]">
              Point
            </Content>
          </Layout>
        </Splitter.Panel>
        <Splitter.Panel
          style={{
            scrollbarWidth: "inherit",
          }}
          defaultSize="20%"
          min="20%"
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

export default Point;
