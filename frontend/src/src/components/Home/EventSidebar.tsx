"use client";

import { useFormatter, useTranslations } from "next-intl";
import api from "@/api";
import { Input, List, Tag } from "antd";
import React, { useEffect } from "react";
import { BiFootball } from "react-icons/bi";

import { useAtom } from "jotai";
import { leagueState, currentLeagueState } from "@/state/state";
import Link from "next/link";
import { ROUTES } from "@/routes";

const EventSidebar: React.FC = () => {
  const t = useTranslations();
  const f = useFormatter();
  const [leagues, setLeagues] = useAtom<any[]>(leagueState);

  const [currentLeague, setCurrentLeague] = useAtom<any | null>(
    currentLeagueState
  );

  useEffect(() => {
    api("common/leagues").then((result) => {
      setLeagues(result.data);
    });

    return () => {
      setLeagues([]);
    };
  }, []);

  const onSearch = () => {};

  const onSelectLeague = (item: any) => {
    setCurrentLeague(item);
  };
  return (
    <>
      <div className="w-full px-2 pt-2">
        <Input.Search
          placeholder="input search text"
          allowClear
          onSearch={onSearch}
        />
      </div>
      <List
        itemLayout="horizontal"
        dataSource={leagues ?? []}
        header={
          <div className="w-full text-green-500 px-4">
            {t("home/majorEvent")}
          </div>
        }
        className="w-full "
        renderItem={(item: any) => (
          <Link href={ROUTES.home}>
            <List.Item
              className={`cursor-pointer ${
                currentLeague?.id == item.id
                  ? `bg-green-300 dark:bg-green-900`
                  : ""
              }`}
              onClick={() => onSelectLeague(item)}
            >
              <div className="w-full flex justify-between items-center gap-2 select-none px-2">
                <BiFootball className="w-4 h-4" /> &gt;&gt;
                <div className="w-full overflow-hidden whitespace-nowrap text-ellipsis">
                  {t.has(item.name) ? t(item.name) : item.name}
                </div>
                <Tag className="rounded-none !m-0" color={"green"}>
                  {item.fixtures?.length ?? 0}
                </Tag>
              </div>
            </List.Item>
          </Link>
        )}
      />
      <List
        itemLayout="horizontal"
        dataSource={leagues ?? []}
        header={
          <div className="w-full text-green-500 px-4">
            {t("home/todaysMatch")} {f.dateTime(new Date(), {})}
          </div>
        }
        renderItem={(item: any) => (
          <List.Item>
            <div className="w-full flex justify-between items-center gap-2 select-none px-2">
              <BiFootball className="w-4 h-4" />
              <div className="w-full overflow-hidden whitespace-nowrap text-ellipsis">
                {t.has(item.name) ? t(item.name) : item.name}
              </div>
              <Tag className="rounded-none !m-0" color={"green"}>
                {item.fixtures?.length ?? 0}
              </Tag>
            </div>
          </List.Item>
        )}
      />
    </>
  );
};

export default EventSidebar;
