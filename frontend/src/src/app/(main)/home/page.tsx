"use client";

import LayoutContext from "@/contexts/LayoutContextProvider";
import { Layout, List, Space, theme } from "antd";
import { Content } from "antd/es/layout/layout";
import React, { useContext } from "react";
import FixtureCard from "@/components/Home/FixtureCard";

import { useAtom } from "jotai";
import { currentLeagueState } from "@/state/state";
import HomeHeader from "@/components/Home/Header";
import BettingSidebar from "@/components/Home/BettingSidebar";

const { Header } = Layout;

const Index: React.FC = () => {
  const { token } = theme.useToken();

  const { isDarkTheme } = useContext(LayoutContext);

  const [currentLeague] = useAtom<any | null>(currentLeagueState);

  return (
    <Layout>
      <Header
        className="mx-4 mt-1 !px-1 !h-20 items-center flex overflow-x-auto text-start overflow-y-hidden"
        style={{
          backgroundColor: isDarkTheme ? "black" : token.colorBgContainer,
        }}
      >
        <HomeHeader />
      </Header>

      <Content className="p-4 overflow-y-auto h-[calc(100vh-124px)]">
        <Space direction="vertical" className="w-full">
          <List
            className="w-full"
            pagination={{ position: "bottom", align: "center" }}
            dataSource={currentLeague?.fixtures?.filter(
              (f: any) => f.rates.length > 0
            )}
            renderItem={(d: any) => (
              <List.Item className="w-full">
                <FixtureCard
                  key={d.id}
                  data={d}
                  title={
                    <div className="flex w-full items-center gap-2 p-0">
                      <img
                        src={currentLeague?.sport.icon}
                        alt=""
                        width={16}
                        height={16}
                        className="w-4 h-4"
                      />
                      <span className="text-sm text-[#71cb4a]">{currentLeague?.nation.name}</span> 
                      <span className="text-sm text-[red]">&gt;&gt;{" "}</span>
                      <span className="text-sm text-[#71cb4a]">{currentLeague?.name}</span>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        </Space>
      </Content>
    </Layout>
  );
};

export default Index;
