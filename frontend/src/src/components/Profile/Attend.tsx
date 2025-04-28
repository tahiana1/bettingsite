import React from "react";
import type { BadgeProps, CalendarProps } from "antd";
import { Badge, Calendar, Card } from "antd";
import type { Dayjs } from "dayjs";
import { useFormatter } from "next-intl";

const Attend: React.FC = () => {
  const f = useFormatter();
  const getListData = (value: Dayjs) => {
    const rand = Math.ceil(Math.round(Math.random() * 1000) / 100) % 4;
    return Array(rand)
      .fill(0)
      .map(() => ({
        type: "success",
        content: f.dateTime(
          new Date(value.millisecond() + Math.random() * 100000000),
          {
            hour: "numeric",
            minute: "numeric",
            hour12: false, // or false if you want 24-hour format
          }
        ),
      }));
  };

  const getMonthData = (value: Dayjs) => {
    if (value.month() === 8) {
      return 1394;
    }
  };

  const monthCellRender = (value: Dayjs) => {
    const num = getMonthData(value);
    return num ? (
      <div className="notes-month">
        <section>{num}</section>
        <span>Backlog number</span>
      </div>
    ) : null;
  };

  const dateCellRender = (value: Dayjs) => {
    const listData = getListData(value);
    return (
      <ul className="events">
        {listData.map((item, index) => (
          <li key={item.content + index}>
            <Badge
              status={item.type as BadgeProps["status"]}
              text={item.content}
            />
          </li>
        ))}
      </ul>
    );
  };

  const cellRender: CalendarProps<Dayjs>["cellRender"] = (current, info) => {
    if (info.type === "date") return dateCellRender(current);
    if (info.type === "month") return monthCellRender(current);
    return info.originNode;
  };

  return (
    <Card title="Attends">
      <Calendar cellRender={cellRender} />;
    </Card>
  );
};

export default Attend;
