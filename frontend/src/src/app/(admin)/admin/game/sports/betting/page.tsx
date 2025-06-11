"use client";
import React, { useState } from "react";

import { 
  Layout, 
  Input, 
  Space, 
  Card, 
  Button,
  Switch,
  Row,
  Col,
  Typography,
} from "antd";

import { Content } from "antd/es/layout/layout";

import { useTranslations } from "next-intl";

import { RxLetterCaseToggle } from "react-icons/rx";
import { BiBlock, BiTrash } from "react-icons/bi";
import { useQuery } from "@apollo/client";

interface CategorySettingsDataType {
  name: string;
  showYn: Boolean;
  whetherToCheck: Boolean;
  instantMsg: string;
  orderNum: number;
}

const SportsBettingInformationSettings: React.FC = () => {
  const t = useTranslations();

  return (
    <Layout>
      <Content className="overflow-auto h-[calc(100vh-100px)] dark:bg-black">
        <Card
          title={t("sportsBettingInformationSettings")}
        >
          <Space className="w-full justify-around">
            <Space className="gap-2">
            </Space>
          </Space>
          <Row>
            <Col span={6} className="px-1">
              <Card size="small"
                title={`${t("domestic")}/${t("overseas")} (${t("level")} 1 ${t("setting")})`}
                className="w-full">
                <Row className="py-1">
                  <Col span={16} className="text-right px-1">
                    <Typography.Text>{t("singlePolerollingApplication")}</Typography.Text>
                  </Col>
                  <Col span={8} className="px-1">
                    <Switch
                      size="small"
                      // checked={val}
                      // onChange={(checked) => onStatusChange(record, checked)}
                    ></Switch>
                  </Col>
                </Row>
                <Row className="py-1">
                  <Col span={16} className="text-right px-1">
                    <Typography.Text>{t("singleBettingAllowed")}</Typography.Text>
                  </Col>
                  <Col span={8} className="px-1">
                    <Switch
                      size="small"
                      // checked={val}
                      // onChange={(checked) => onStatusChange(record, checked)}
                    ></Switch>
                  </Col>
                </Row>
                <Row className="py-1">
                  <Col span={16} className="text-right px-1">
                    <Typography.Text>{t("allowsTwoWayBetting")}</Typography.Text>
                  </Col>
                  <Col span={8} className="px-1">
                    <Switch
                      size="small"
                      // checked={val}
                      // onChange={(checked) => onStatusChange(record, checked)}
                    ></Switch>
                  </Col>
                </Row>
                <Row className="py-1">
                  <Col span={16} className="text-right px-1">
                    <Typography.Text>{t("minimumBettingFolder")}</Typography.Text>
                  </Col>
                  <Col span={8} className="px-1">
                    <Input placeholder="" addonAfter={t("folder")} />
                  </Col>
                </Row>
                <Row className="py-1">
                  <Col span={16} className="text-right px-1">
                    <Typography.Text>{t("maxFoldersAvailableForBetting")}</Typography.Text>
                  </Col>
                  <Col span={8} className="px-1">
                    <Input placeholder="" addonAfter={t("folder")} />
                  </Col>
                </Row>
                <Row className="py-1">
                  <Col span={16} className="text-right px-1">
                    <Typography.Text>{t("singlePoleBettingAdjust")}</Typography.Text>
                  </Col>
                  <Col span={8} className="px-1">
                    <Input placeholder="" addonAfter={t("time")} />
                  </Col>
                </Row>
                <Row className="py-1">
                  <Col span={16} className="text-right px-1">
                    <Typography.Text>{t("singlePoleBettingMinOdds")}</Typography.Text>
                  </Col>
                  <Col span={8} className="px-1">
                    <Input placeholder="" addonAfter={t("time")} />
                  </Col>
                </Row>
                <Row className="py-1">
                  <Col span={16} className="text-right px-1">
                    <Typography.Text>{t("singleMinBettingAmount")}</Typography.Text>
                  </Col>
                  <Col span={8} className="px-1">
                    <Input placeholder="" addonAfter={t("one")} />
                  </Col>
                </Row>
                <Row className="py-1">
                  <Col span={16} className="text-right px-1">
                    <Typography.Text>{t("singlePoleMaxBettingAmount")}</Typography.Text>
                  </Col>
                  <Col span={8} className="px-1">
                    <Input placeholder="" addonAfter={t("one")} />
                  </Col>
                </Row>
                <Row className="py-1">
                  <Col span={16} className="text-right px-1">
                    <Typography.Text>{t("singlePoleMaxWinningAmount")}</Typography.Text>
                  </Col>
                  <Col span={8} className="px-1">
                    <Input placeholder="" addonAfter={t("one")} />
                  </Col>
                </Row>
                <Row className="py-1">
                  <Col span={16} className="text-right px-1">
                    <Typography.Text>{t("singlePoleMaxExpectedDividend")}</Typography.Text>
                  </Col>
                  <Col span={8} className="px-1">
                    <Input placeholder="" addonAfter={t("time")} />
                  </Col>
                </Row>
                <Row className="py-1">
                  <Col span={16} className="text-right px-1">
                    <Typography.Text>{t("daffolBettingAdjust")}</Typography.Text>
                  </Col>
                  <Col span={8} className="px-1">
                    <Input placeholder="" addonAfter={t("time")} />
                  </Col>
                </Row>
                <Row className="py-1">
                  <Col span={16} className="text-right px-1">
                    <Typography.Text>{t("daffolBettingMinOdds")}</Typography.Text>
                  </Col>
                  <Col span={8} className="px-1">
                    <Input placeholder="" addonAfter={t("time")} />
                  </Col>
                </Row>
                <Row className="py-1">
                  <Col span={16} className="text-right px-1">
                    <Typography.Text>{t("dapolMinBettingAmount")}</Typography.Text>
                  </Col>
                  <Col span={8} className="px-1">
                    <Input placeholder="" addonAfter={t("one")} />
                  </Col>
                </Row>
                <Row className="py-1">
                  <Col span={16} className="text-right px-1">
                    <Typography.Text>{t("dapolMaxBettingAmount")}</Typography.Text>
                  </Col>
                  <Col span={8} className="px-1">
                    <Input placeholder="" addonAfter={t("one")} />
                  </Col>
                </Row>
                <Row className="py-1">
                  <Col span={16} className="text-right px-1">
                    <Typography.Text>{t("dapolMaxWinningAmount")}</Typography.Text>
                  </Col>
                  <Col span={8} className="px-1">
                    <Input placeholder="" addonAfter={t("one")} />
                  </Col>
                </Row>
                <Row className="py-1">
                  <Col span={16} className="text-right px-1">
                    <Typography.Text>{t("dapolMaxExpectedDividend")}</Typography.Text>
                  </Col>
                  <Col span={8} className="px-1">
                    <Input placeholder="" addonAfter={t("time")} />
                  </Col>
                </Row>
                <Row className="py-1">
                  <Col span={16} className="text-right px-1">
                    <Typography.Text>{t("daffolMinExpectedDividend")}</Typography.Text>
                  </Col>
                  <Col span={8} className="px-1">
                    <Input placeholder="" addonAfter={t("time")} />
                  </Col>
                </Row>
                <Row className="py-1">
                  <Col span={16} className="text-right px-1">
                    <Typography.Text>{t("allowsSoccerBetting")}</Typography.Text>
                  </Col>
                  <Col span={8} className="px-1">
                    <Switch
                      size="small"
                      // checked={val}
                      // onChange={(checked) => onStatusChange(record, checked)}
                    ></Switch>
                  </Col>
                </Row>
                <Row className="py-1">
                  <Col span={16} className="text-right px-1">
                    <Typography.Text>{t("accumulatorBettingStage")}</Typography.Text>
                  </Col>
                  <Col span={8} className="px-1">
                    <Input placeholder="" addonAfter={t("step")} />
                  </Col>
                </Row>
                <Row className="py-1">
                  <Col span={16} className="text-right px-1">
                    <Typography.Text>{t("soccerBettingLimit")}</Typography.Text>
                  </Col>
                  <Col span={8} className="px-1">
                    <Input placeholder="" addonAfter={t("one")} />
                  </Col>
                </Row>
                <Row className="py-1">
                  <Col span={16} className="text-right px-1">
                    <Typography.Text>{t("soccerBettingWinningsLimit")}</Typography.Text>
                  </Col>
                  <Col span={8} className="px-1">
                    <Input placeholder="" addonAfter={t("one")} />
                  </Col>
                </Row>
                <Row className="py-1">
                  <Col span={16} className="text-right px-1">
                    <Typography.Text>{t("threeFolderBonus")}</Typography.Text>
                  </Col>
                  <Col span={8} className="px-1">
                    <Input placeholder="" addonAfter={t("time")} />
                  </Col>
                </Row>
                <Row className="py-1">
                  <Col span={16} className="text-right px-1">
                    <Typography.Text>{t("fourFolderBonus")}</Typography.Text>
                  </Col>
                  <Col span={8} className="px-1">
                    <Input placeholder="" addonAfter={t("time")} />
                  </Col>
                </Row>
                <Row className="py-1">
                  <Col span={16} className="text-right px-1">
                    <Typography.Text>{t("fiveFolderBonus")}</Typography.Text>
                  </Col>
                  <Col span={8} className="px-1">
                    <Input placeholder="" addonAfter={t("time")} />
                  </Col>
                </Row>
                <Row className="py-1">
                  <Col span={16} className="text-right px-1">
                    <Typography.Text>{t("sixFolderBonus")}</Typography.Text>
                  </Col>
                  <Col span={8} className="px-1">
                    <Input placeholder="" addonAfter={t("time")} />
                  </Col>
                </Row>
                <Row className="py-1">
                  <Col span={16} className="text-right px-1">
                    <Typography.Text>{t("sevenFolderBonus")}</Typography.Text>
                  </Col>
                  <Col span={8} className="px-1">
                    <Input placeholder="" addonAfter={t("time")} />
                  </Col>
                </Row>
                <Row className="py-1">
                  <Col span={16} className="text-right px-1">
                    <Typography.Text>{t("nineFolderBonus")}</Typography.Text>
                  </Col>
                  <Col span={8} className="px-1">
                    <Input placeholder="" addonAfter={t("time")} />
                  </Col>
                </Row>
                <Row className="py-1">
                  <Col span={16} className="text-right px-1">
                    <Typography.Text>{t("cancelTimeBeforeGame")}</Typography.Text>
                  </Col>
                  <Col span={8} className="px-1">
                    <Input placeholder="" addonAfter={t("min")} />
                  </Col>
                </Row>
                <Row className="py-1">
                  <Col span={16} className="text-right px-1">
                    <Typography.Text>{t("bettingDeadline")}</Typography.Text>
                  </Col>
                  <Col span={8} className="px-1">
                    <Input placeholder="" addonAfter={t("second")} />
                  </Col>
                </Row>
                <Row className="py-1">
                  <Col span={16} className="text-right px-1">
                    <Typography.Text>{t("bettingCancelTime")}</Typography.Text>
                  </Col>
                  <Col span={8} className="px-1">
                    <Input placeholder="" addonAfter={t("min")} />
                  </Col>
                </Row>
                <Row className="py-1">
                  <Col span={16} className="text-right px-1">
                    <Typography.Text>{t("bonusOptionAvailable")}</Typography.Text>
                  </Col>
                  <Col span={8} className="px-1">
                    <Input placeholder="" addonAfter={t("time")} />
                  </Col>
                </Row>
                <Row className="py-1">
                  <Col span={16} className="text-right px-1">
                    <Typography.Text>{t("matchesStartWithinSetTime")}</Typography.Text>
                  </Col>
                  <Col span={8} className="px-1">
                    <Input placeholder="" addonAfter={t("hour")} />
                  </Col>
                </Row>
                <Row className="py-1">
                  <Col span={16} className="text-right px-1">
                    <Typography.Text>{t("dailyBetCancellations")}</Typography.Text>
                  </Col>
                  <Col span={8} className="px-1">
                    <Input placeholder="" addonAfter={t("time")} />
                  </Col>
                </Row>
                <Row className="py-1">
                  <Col span={16} className="text-right px-1">
                    <Typography.Text>{t("minDividendWithWinningPoints")}</Typography.Text>
                  </Col>
                  <Col span={8} className="px-1">
                    <Input placeholder="" addonAfter={t("time")} />
                  </Col>
                </Row>
                <Row className="py-1">
                <Space>
                  <Button type="primary">{`${t("changeLevelButton")}1`}</Button>
                  <Button type="primary">{`${t("applyToAllLevels")}`}</Button>
                </Space>
                </Row>
              </Card>
            </Col>
            <Col span={6} className="px-1">
              <Card size="small"
                title={`${t("live")} (${t("level")} 1 ${t("setting")})`}
                className="w-full">
                <Row className="py-1">
                  <Col span={16} className="text-right px-1">
                    <Typography.Text>{t("singlePolerollingApplication")}</Typography.Text>
                  </Col>
                  <Col span={8} className="px-1">
                    <Switch
                      size="small"
                      // checked={val}
                      // onChange={(checked) => onStatusChange(record, checked)}
                    ></Switch>
                  </Col>
                </Row>
                <Row className="py-1">
                  <Col span={16} className="text-right px-1">
                    <Typography.Text>{t("singleBettingAllowed")}</Typography.Text>
                  </Col>
                  <Col span={8} className="px-1">
                    <Switch
                      size="small"
                      // checked={val}
                      // onChange={(checked) => onStatusChange(record, checked)}
                    ></Switch>
                  </Col>
                </Row>
                <Row className="py-1">
                  <Col span={16} className="text-right px-1">
                    <Typography.Text>{t("allowsTwoWayBetting")}</Typography.Text>
                  </Col>
                  <Col span={8} className="px-1">
                    <Switch
                      size="small"
                      // checked={val}
                      // onChange={(checked) => onStatusChange(record, checked)}
                    ></Switch>
                  </Col>
                </Row>
                <Row className="py-1">
                  <Col span={16} className="text-right px-1">
                    <Typography.Text>{t("minimumBettingFolder")}</Typography.Text>
                  </Col>
                  <Col span={8} className="px-1">
                    <Input placeholder="" addonAfter={t("folder")} />
                  </Col>
                </Row>
                <Row className="py-1">
                  <Col span={16} className="text-right px-1">
                    <Typography.Text>{t("maxFoldersAvailableForBetting")}</Typography.Text>
                  </Col>
                  <Col span={8} className="px-1">
                    <Input placeholder="" addonAfter={t("folder")} />
                  </Col>
                </Row>
                <Row className="py-1">
                  <Col span={16} className="text-right px-1">
                    <Typography.Text>{t("singlePoleBettingAdjust")}</Typography.Text>
                  </Col>
                  <Col span={8} className="px-1">
                    <Input placeholder="" addonAfter={t("time")} />
                  </Col>
                </Row>
                <Row className="py-1">
                  <Col span={16} className="text-right px-1">
                    <Typography.Text>{t("singlePoleBettingMinOdds")}</Typography.Text>
                  </Col>
                  <Col span={8} className="px-1">
                    <Input placeholder="" addonAfter={t("time")} />
                  </Col>
                </Row>
                <Row className="py-1">
                  <Col span={16} className="text-right px-1">
                    <Typography.Text>{t("singleMinBettingAmount")}</Typography.Text>
                  </Col>
                  <Col span={8} className="px-1">
                    <Input placeholder="" addonAfter={t("one")} />
                  </Col>
                </Row>
                <Row className="py-1">
                  <Col span={16} className="text-right px-1">
                    <Typography.Text>{t("singlePoleMaxBettingAmount")}</Typography.Text>
                  </Col>
                  <Col span={8} className="px-1">
                    <Input placeholder="" addonAfter={t("one")} />
                  </Col>
                </Row>
                <Row className="py-1">
                  <Col span={16} className="text-right px-1">
                    <Typography.Text>{t("singlePoleMaxWinningAmount")}</Typography.Text>
                  </Col>
                  <Col span={8} className="px-1">
                    <Input placeholder="" addonAfter={t("one")} />
                  </Col>
                </Row>
                <Row className="py-1">
                  <Col span={16} className="text-right px-1">
                    <Typography.Text>{t("singlePoleMaxExpectedDividend")}</Typography.Text>
                  </Col>
                  <Col span={8} className="px-1">
                    <Input placeholder="" addonAfter={t("time")} />
                  </Col>
                </Row>
                <Row className="py-1">
                  <Col span={16} className="text-right px-1">
                    <Typography.Text>{t("daffolBettingAdjust")}</Typography.Text>
                  </Col>
                  <Col span={8} className="px-1">
                    <Input placeholder="" addonAfter={t("time")} />
                  </Col>
                </Row>
                <Row className="py-1">
                  <Col span={16} className="text-right px-1">
                    <Typography.Text>{t("daffolBettingMinOdds")}</Typography.Text>
                  </Col>
                  <Col span={8} className="px-1">
                    <Input placeholder="" addonAfter={t("time")} />
                  </Col>
                </Row>
                <Row className="py-1">
                  <Col span={16} className="text-right px-1">
                    <Typography.Text>{t("dapolMinBettingAmount")}</Typography.Text>
                  </Col>
                  <Col span={8} className="px-1">
                    <Input placeholder="" addonAfter={t("one")} />
                  </Col>
                </Row>
                <Row className="py-1">
                  <Col span={16} className="text-right px-1">
                    <Typography.Text>{t("dapolMaxBettingAmount")}</Typography.Text>
                  </Col>
                  <Col span={8} className="px-1">
                    <Input placeholder="" addonAfter={t("one")} />
                  </Col>
                </Row>
                <Row className="py-1">
                  <Col span={16} className="text-right px-1">
                    <Typography.Text>{t("dapolMaxWinningAmount")}</Typography.Text>
                  </Col>
                  <Col span={8} className="px-1">
                    <Input placeholder="" addonAfter={t("one")} />
                  </Col>
                </Row>
                <Row className="py-1">
                  <Col span={16} className="text-right px-1">
                    <Typography.Text>{t("dapolMaxExpectedDividend")}</Typography.Text>
                  </Col>
                  <Col span={8} className="px-1">
                    <Input placeholder="" addonAfter={t("time")} />
                  </Col>
                </Row>
                <Row className="py-1">
                  <Col span={16} className="text-right px-1">
                    <Typography.Text>{t("daffolMinExpectedDividend")}</Typography.Text>
                  </Col>
                  <Col span={8} className="px-1">
                    <Input placeholder="" addonAfter={t("time")} />
                  </Col>
                </Row>
                <Row className="py-1">
                  <Col span={16} className="text-right px-1">
                    <Typography.Text>{t("allowsSoccerBetting")}</Typography.Text>
                  </Col>
                  <Col span={8} className="px-1">
                    <Switch
                      size="small"
                      // checked={val}
                      // onChange={(checked) => onStatusChange(record, checked)}
                    ></Switch>
                  </Col>
                </Row>
                <Row className="py-1">
                  <Col span={16} className="text-right px-1">
                    <Typography.Text>{t("accumulatorBettingStage")}</Typography.Text>
                  </Col>
                  <Col span={8} className="px-1">
                    <Input placeholder="" addonAfter={t("step")} />
                  </Col>
                </Row>
                <Row className="py-1">
                  <Col span={16} className="text-right px-1">
                    <Typography.Text>{t("soccerBettingLimit")}</Typography.Text>
                  </Col>
                  <Col span={8} className="px-1">
                    <Input placeholder="" addonAfter={t("one")} />
                  </Col>
                </Row>
                <Row className="py-1">
                  <Col span={16} className="text-right px-1">
                    <Typography.Text>{t("soccerBettingWinningsLimit")}</Typography.Text>
                  </Col>
                  <Col span={8} className="px-1">
                    <Input placeholder="" addonAfter={t("one")} />
                  </Col>
                </Row>
                <Row className="py-1">
                  <Col span={16} className="text-right px-1">
                    <Typography.Text>{t("minDividendWithWinningPoints")}</Typography.Text>
                  </Col>
                  <Col span={8} className="px-1">
                    <Input placeholder="" addonAfter={t("time")} />
                  </Col>
                </Row>
                <Row className="py-1">
                  <Col span={16} className="text-right px-1">
                    <Typography.Text>{t("matchesStartWithinSetTimeInSchedule")}</Typography.Text>
                  </Col>
                  <Col span={8} className="px-1">
                    <Input placeholder="" addonAfter={t("hour")} />
                  </Col>
                </Row>
                <Row className="py-1">
                <Space>
                  <Button type="primary">{`${t("changeLevelButton")}1`}</Button>
                  <Button type="primary">{`${t("applyToAllLevels")}`}</Button>
                </Space>
                </Row>
              </Card>
            </Col>
            <Col span={6} className="px-1">
              <Card size="small"
                title={`${t("realtime")} (${t("level")} 1 ${t("setting")})`}
                className="w-full">
                <Row className="py-1">
                  <Col span={16} className="text-right px-1">
                    <Typography.Text>{t("singlePolerollingApplication")}</Typography.Text>
                  </Col>
                  <Col span={8} className="px-1">
                    <Switch
                      size="small"
                      // checked={val}
                      // onChange={(checked) => onStatusChange(record, checked)}
                    ></Switch>
                  </Col>
                </Row>
                <Row className="py-1">
                  <Col span={16} className="text-right px-1">
                    <Typography.Text>{t("singleBettingAllowed")}</Typography.Text>
                  </Col>
                  <Col span={8} className="px-1">
                    <Switch
                      size="small"
                      // checked={val}
                      // onChange={(checked) => onStatusChange(record, checked)}
                    ></Switch>
                  </Col>
                </Row>
                <Row className="py-1">
                  <Col span={16} className="text-right px-1">
                    <Typography.Text>{t("allowsTwoWayBetting")}</Typography.Text>
                  </Col>
                  <Col span={8} className="px-1">
                    <Switch
                      size="small"
                      // checked={val}
                      // onChange={(checked) => onStatusChange(record, checked)}
                    ></Switch>
                  </Col>
                </Row>
                <Row className="py-1">
                  <Col span={16} className="text-right px-1">
                    <Typography.Text>{t("minimumBettingFolder")}</Typography.Text>
                  </Col>
                  <Col span={8} className="px-1">
                    <Input placeholder="" addonAfter={t("folder")} />
                  </Col>
                </Row>
                <Row className="py-1">
                  <Col span={16} className="text-right px-1">
                    <Typography.Text>{t("maxFoldersAvailableForBetting")}</Typography.Text>
                  </Col>
                  <Col span={8} className="px-1">
                    <Input placeholder="" addonAfter={t("folder")} />
                  </Col>
                </Row>
                <Row className="py-1">
                  <Col span={16} className="text-right px-1">
                    <Typography.Text>{t("singlePoleBettingAdjust")}</Typography.Text>
                  </Col>
                  <Col span={8} className="px-1">
                    <Input placeholder="" addonAfter={t("time")} />
                  </Col>
                </Row>
                <Row className="py-1">
                  <Col span={16} className="text-right px-1">
                    <Typography.Text>{t("singlePoleBettingMinOdds")}</Typography.Text>
                  </Col>
                  <Col span={8} className="px-1">
                    <Input placeholder="" addonAfter={t("time")} />
                  </Col>
                </Row>
                <Row className="py-1">
                  <Col span={16} className="text-right px-1">
                    <Typography.Text>{t("singleMinBettingAmount")}</Typography.Text>
                  </Col>
                  <Col span={8} className="px-1">
                    <Input placeholder="" addonAfter={t("one")} />
                  </Col>
                </Row>
                <Row className="py-1">
                  <Col span={16} className="text-right px-1">
                    <Typography.Text>{t("singlePoleMaxBettingAmount")}</Typography.Text>
                  </Col>
                  <Col span={8} className="px-1">
                    <Input placeholder="" addonAfter={t("one")} />
                  </Col>
                </Row>
                <Row className="py-1">
                  <Col span={16} className="text-right px-1">
                    <Typography.Text>{t("singlePoleMaxWinningAmount")}</Typography.Text>
                  </Col>
                  <Col span={8} className="px-1">
                    <Input placeholder="" addonAfter={t("one")} />
                  </Col>
                </Row>
                <Row className="py-1">
                  <Col span={16} className="text-right px-1">
                    <Typography.Text>{t("singlePoleMaxExpectedDividend")}</Typography.Text>
                  </Col>
                  <Col span={8} className="px-1">
                    <Input placeholder="" addonAfter={t("time")} />
                  </Col>
                </Row>
                <Row className="py-1">
                  <Col span={16} className="text-right px-1">
                    <Typography.Text>{t("daffolBettingAdjust")}</Typography.Text>
                  </Col>
                  <Col span={8} className="px-1">
                    <Input placeholder="" addonAfter={t("time")} />
                  </Col>
                </Row>
                <Row className="py-1">
                  <Col span={16} className="text-right px-1">
                    <Typography.Text>{t("daffolBettingMinOdds")}</Typography.Text>
                  </Col>
                  <Col span={8} className="px-1">
                    <Input placeholder="" addonAfter={t("time")} />
                  </Col>
                </Row>
                <Row className="py-1">
                  <Col span={16} className="text-right px-1">
                    <Typography.Text>{t("dapolMinBettingAmount")}</Typography.Text>
                  </Col>
                  <Col span={8} className="px-1">
                    <Input placeholder="" addonAfter={t("one")} />
                  </Col>
                </Row>
                <Row className="py-1">
                  <Col span={16} className="text-right px-1">
                    <Typography.Text>{t("dapolMaxBettingAmount")}</Typography.Text>
                  </Col>
                  <Col span={8} className="px-1">
                    <Input placeholder="" addonAfter={t("one")} />
                  </Col>
                </Row>
                <Row className="py-1">
                  <Col span={16} className="text-right px-1">
                    <Typography.Text>{t("dapolMaxWinningAmount")}</Typography.Text>
                  </Col>
                  <Col span={8} className="px-1">
                    <Input placeholder="" addonAfter={t("one")} />
                  </Col>
                </Row>
                <Row className="py-1">
                  <Col span={16} className="text-right px-1">
                    <Typography.Text>{t("dapolMaxExpectedDividend")}</Typography.Text>
                  </Col>
                  <Col span={8} className="px-1">
                    <Input placeholder="" addonAfter={t("time")} />
                  </Col>
                </Row>
                <Row className="py-1">
                  <Col span={16} className="text-right px-1">
                    <Typography.Text>{t("daffolMinExpectedDividend")}</Typography.Text>
                  </Col>
                  <Col span={8} className="px-1">
                    <Input placeholder="" addonAfter={t("time")} />
                  </Col>
                </Row>
                <Row className="py-1">
                  <Col span={16} className="text-right px-1">
                    <Typography.Text>{t("allowsSoccerBetting")}</Typography.Text>
                  </Col>
                  <Col span={8} className="px-1">
                    <Switch
                      size="small"
                      // checked={val}
                      // onChange={(checked) => onStatusChange(record, checked)}
                    ></Switch>
                  </Col>
                </Row>
                <Row className="py-1">
                  <Col span={16} className="text-right px-1">
                    <Typography.Text>{t("accumulatorBettingStage")}</Typography.Text>
                  </Col>
                  <Col span={8} className="px-1">
                    <Input placeholder="" addonAfter={t("step")} />
                  </Col>
                </Row>
                <Row className="py-1">
                  <Col span={16} className="text-right px-1">
                    <Typography.Text>{t("soccerBettingLimit")}</Typography.Text>
                  </Col>
                  <Col span={8} className="px-1">
                    <Input placeholder="" addonAfter={t("one")} />
                  </Col>
                </Row>
                <Row className="py-1">
                  <Col span={16} className="text-right px-1">
                    <Typography.Text>{t("soccerBettingWinningsLimit")}</Typography.Text>
                  </Col>
                  <Col span={8} className="px-1">
                    <Input placeholder="" addonAfter={t("one")} />
                  </Col>
                </Row>
                <Row className="py-1">
                  <Col span={16} className="text-right px-1">
                    <Typography.Text>{t("threeFolderBonus")}</Typography.Text>
                  </Col>
                  <Col span={8} className="px-1">
                    <Input placeholder="" addonAfter={t("time")} />
                  </Col>
                </Row>
                <Row className="py-1">
                  <Col span={16} className="text-right px-1">
                    <Typography.Text>{t("fourFolderBonus")}</Typography.Text>
                  </Col>
                  <Col span={8} className="px-1">
                    <Input placeholder="" addonAfter={t("time")} />
                  </Col>
                </Row>
                <Row className="py-1">
                  <Col span={16} className="text-right px-1">
                    <Typography.Text>{t("fiveFolderBonus")}</Typography.Text>
                  </Col>
                  <Col span={8} className="px-1">
                    <Input placeholder="" addonAfter={t("time")} />
                  </Col>
                </Row>
                <Row className="py-1">
                  <Col span={16} className="text-right px-1">
                    <Typography.Text>{t("sixFolderBonus")}</Typography.Text>
                  </Col>
                  <Col span={8} className="px-1">
                    <Input placeholder="" addonAfter={t("time")} />
                  </Col>
                </Row>
                <Row className="py-1">
                  <Col span={16} className="text-right px-1">
                    <Typography.Text>{t("sevenFolderBonus")}</Typography.Text>
                  </Col>
                  <Col span={8} className="px-1">
                    <Input placeholder="" addonAfter={t("time")} />
                  </Col>
                </Row>
                <Row className="py-1">
                  <Col span={16} className="text-right px-1">
                    <Typography.Text>{t("nineFolderBonus")}</Typography.Text>
                  </Col>
                  <Col span={8} className="px-1">
                    <Input placeholder="" addonAfter={t("time")} />
                  </Col>
                </Row>
                <Row className="py-1">
                  <Col span={16} className="text-right px-1">
                    <Typography.Text>{t("cancelTimeBeforeGame")}</Typography.Text>
                  </Col>
                  <Col span={8} className="px-1">
                    <Input placeholder="" addonAfter={t("min")} />
                  </Col>
                </Row>
                <Row className="py-1">
                  <Col span={16} className="text-right px-1">
                    <Typography.Text>{t("bettingDeadline")}</Typography.Text>
                  </Col>
                  <Col span={8} className="px-1">
                    <Input placeholder="" addonAfter={t("second")} />
                  </Col>
                </Row>
                <Row className="py-1">
                  <Col span={16} className="text-right px-1">
                    <Typography.Text>{t("bettingCancelTime")}</Typography.Text>
                  </Col>
                  <Col span={8} className="px-1">
                    <Input placeholder="" addonAfter={t("min")} />
                  </Col>
                </Row>
                <Row className="py-1">
                  <Col span={16} className="text-right px-1">
                    <Typography.Text>{t("bonusOptionAvailable")}</Typography.Text>
                  </Col>
                  <Col span={8} className="px-1">
                    <Input placeholder="" addonAfter={t("time")} />
                  </Col>
                </Row>
                <Row className="py-1">
                  <Col span={16} className="text-right px-1">
                    <Typography.Text>{t("matchesStartWithinSetTime")}</Typography.Text>
                  </Col>
                  <Col span={8} className="px-1">
                    <Input placeholder="" addonAfter={t("hour")} />
                  </Col>
                </Row>
                <Row className="py-1">
                  <Col span={16} className="text-right px-1">
                    <Typography.Text>{t("dailyBetCancellations")}</Typography.Text>
                  </Col>
                  <Col span={8} className="px-1">
                    <Input placeholder="" addonAfter={t("time")} />
                  </Col>
                </Row>
                <Row className="py-1">
                  <Col span={16} className="text-right px-1">
                    <Typography.Text>{t("minDividendWithWinningPoints")}</Typography.Text>
                  </Col>
                  <Col span={8} className="px-1">
                    <Input placeholder="" addonAfter={t("time")} />
                  </Col>
                </Row>
                <Row className="py-1">
                <Space>
                  <Button type="primary">{`${t("changeLevelButton")}1`}</Button>
                  <Button type="primary">{`${t("applyToAllLevels")}`}</Button>
                </Space>
                </Row>
              </Card>
            </Col>
            <Col span={6} className="px-1">
              <Card size="small"
                title={`${t("special")} (${t("level")} 1 ${t("setting")})`}
                className="w-full">
                <Row className="py-1">
                  <Col span={16} className="text-right px-1">
                    <Typography.Text>{t("singlePolerollingApplication")}</Typography.Text>
                  </Col>
                  <Col span={8} className="px-1">
                    <Switch
                      size="small"
                      // checked={val}
                      // onChange={(checked) => onStatusChange(record, checked)}
                    ></Switch>
                  </Col>
                </Row>
                <Row className="py-1">
                  <Col span={16} className="text-right px-1">
                    <Typography.Text>{t("singleBettingAllowed")}</Typography.Text>
                  </Col>
                  <Col span={8} className="px-1">
                    <Switch
                      size="small"
                      // checked={val}
                      // onChange={(checked) => onStatusChange(record, checked)}
                    ></Switch>
                  </Col>
                </Row>
                <Row className="py-1">
                  <Col span={16} className="text-right px-1">
                    <Typography.Text>{t("allowsTwoWayBetting")}</Typography.Text>
                  </Col>
                  <Col span={8} className="px-1">
                    <Switch
                      size="small"
                      // checked={val}
                      // onChange={(checked) => onStatusChange(record, checked)}
                    ></Switch>
                  </Col>
                </Row>
                <Row className="py-1">
                  <Col span={16} className="text-right px-1">
                    <Typography.Text>{t("minimumBettingFolder")}</Typography.Text>
                  </Col>
                  <Col span={8} className="px-1">
                    <Input placeholder="" addonAfter={t("folder")} />
                  </Col>
                </Row>
                <Row className="py-1">
                  <Col span={16} className="text-right px-1">
                    <Typography.Text>{t("maxFoldersAvailableForBetting")}</Typography.Text>
                  </Col>
                  <Col span={8} className="px-1">
                    <Input placeholder="" addonAfter={t("folder")} />
                  </Col>
                </Row>
                <Row className="py-1">
                  <Col span={16} className="text-right px-1">
                    <Typography.Text>{t("singlePoleBettingAdjust")}</Typography.Text>
                  </Col>
                  <Col span={8} className="px-1">
                    <Input placeholder="" addonAfter={t("time")} />
                  </Col>
                </Row>
                <Row className="py-1">
                  <Col span={16} className="text-right px-1">
                    <Typography.Text>{t("singlePoleBettingMinOdds")}</Typography.Text>
                  </Col>
                  <Col span={8} className="px-1">
                    <Input placeholder="" addonAfter={t("time")} />
                  </Col>
                </Row>
                <Row className="py-1">
                  <Col span={16} className="text-right px-1">
                    <Typography.Text>{t("singleMinBettingAmount")}</Typography.Text>
                  </Col>
                  <Col span={8} className="px-1">
                    <Input placeholder="" addonAfter={t("one")} />
                  </Col>
                </Row>
                <Row className="py-1">
                  <Col span={16} className="text-right px-1">
                    <Typography.Text>{t("singlePoleMaxBettingAmount")}</Typography.Text>
                  </Col>
                  <Col span={8} className="px-1">
                    <Input placeholder="" addonAfter={t("one")} />
                  </Col>
                </Row>
                <Row className="py-1">
                  <Col span={16} className="text-right px-1">
                    <Typography.Text>{t("singlePoleMaxWinningAmount")}</Typography.Text>
                  </Col>
                  <Col span={8} className="px-1">
                    <Input placeholder="" addonAfter={t("one")} />
                  </Col>
                </Row>
                <Row className="py-1">
                  <Col span={16} className="text-right px-1">
                    <Typography.Text>{t("singlePoleMaxExpectedDividend")}</Typography.Text>
                  </Col>
                  <Col span={8} className="px-1">
                    <Input placeholder="" addonAfter={t("time")} />
                  </Col>
                </Row>
                <Row className="py-1">
                  <Col span={16} className="text-right px-1">
                    <Typography.Text>{t("daffolBettingAdjust")}</Typography.Text>
                  </Col>
                  <Col span={8} className="px-1">
                    <Input placeholder="" addonAfter={t("time")} />
                  </Col>
                </Row>
                <Row className="py-1">
                  <Col span={16} className="text-right px-1">
                    <Typography.Text>{t("daffolBettingMinOdds")}</Typography.Text>
                  </Col>
                  <Col span={8} className="px-1">
                    <Input placeholder="" addonAfter={t("time")} />
                  </Col>
                </Row>
                <Row className="py-1">
                  <Col span={16} className="text-right px-1">
                    <Typography.Text>{t("dapolMinBettingAmount")}</Typography.Text>
                  </Col>
                  <Col span={8} className="px-1">
                    <Input placeholder="" addonAfter={t("one")} />
                  </Col>
                </Row>
                <Row className="py-1">
                  <Col span={16} className="text-right px-1">
                    <Typography.Text>{t("dapolMaxBettingAmount")}</Typography.Text>
                  </Col>
                  <Col span={8} className="px-1">
                    <Input placeholder="" addonAfter={t("one")} />
                  </Col>
                </Row>
                <Row className="py-1">
                  <Col span={16} className="text-right px-1">
                    <Typography.Text>{t("dapolMaxWinningAmount")}</Typography.Text>
                  </Col>
                  <Col span={8} className="px-1">
                    <Input placeholder="" addonAfter={t("one")} />
                  </Col>
                </Row>
                <Row className="py-1">
                  <Col span={16} className="text-right px-1">
                    <Typography.Text>{t("dapolMaxExpectedDividend")}</Typography.Text>
                  </Col>
                  <Col span={8} className="px-1">
                    <Input placeholder="" addonAfter={t("time")} />
                  </Col>
                </Row>
                <Row className="py-1">
                  <Col span={16} className="text-right px-1">
                    <Typography.Text>{t("daffolMinExpectedDividend")}</Typography.Text>
                  </Col>
                  <Col span={8} className="px-1">
                    <Input placeholder="" addonAfter={t("time")} />
                  </Col>
                </Row>
                <Row className="py-1">
                  <Col span={16} className="text-right px-1">
                    <Typography.Text>{t("allowsSoccerBetting")}</Typography.Text>
                  </Col>
                  <Col span={8} className="px-1">
                    <Switch
                      size="small"
                      // checked={val}
                      // onChange={(checked) => onStatusChange(record, checked)}
                    ></Switch>
                  </Col>
                </Row>
                <Row className="py-1">
                  <Col span={16} className="text-right px-1">
                    <Typography.Text>{t("accumulatorBettingStage")}</Typography.Text>
                  </Col>
                  <Col span={8} className="px-1">
                    <Input placeholder="" addonAfter={t("step")} />
                  </Col>
                </Row>
                <Row className="py-1">
                  <Col span={16} className="text-right px-1">
                    <Typography.Text>{t("soccerBettingLimit")}</Typography.Text>
                  </Col>
                  <Col span={8} className="px-1">
                    <Input placeholder="" addonAfter={t("one")} />
                  </Col>
                </Row>
                <Row className="py-1">
                  <Col span={16} className="text-right px-1">
                    <Typography.Text>{t("soccerBettingWinningsLimit")}</Typography.Text>
                  </Col>
                  <Col span={8} className="px-1">
                    <Input placeholder="" addonAfter={t("one")} />
                  </Col>
                </Row>
                <Row className="py-1">
                  <Col span={16} className="text-right px-1">
                    <Typography.Text>{t("threeFolderBonus")}</Typography.Text>
                  </Col>
                  <Col span={8} className="px-1">
                    <Input placeholder="" addonAfter={t("time")} />
                  </Col>
                </Row>
                <Row className="py-1">
                  <Col span={16} className="text-right px-1">
                    <Typography.Text>{t("fourFolderBonus")}</Typography.Text>
                  </Col>
                  <Col span={8} className="px-1">
                    <Input placeholder="" addonAfter={t("time")} />
                  </Col>
                </Row>
                <Row className="py-1">
                  <Col span={16} className="text-right px-1">
                    <Typography.Text>{t("fiveFolderBonus")}</Typography.Text>
                  </Col>
                  <Col span={8} className="px-1">
                    <Input placeholder="" addonAfter={t("time")} />
                  </Col>
                </Row>
                <Row className="py-1">
                  <Col span={16} className="text-right px-1">
                    <Typography.Text>{t("sixFolderBonus")}</Typography.Text>
                  </Col>
                  <Col span={8} className="px-1">
                    <Input placeholder="" addonAfter={t("time")} />
                  </Col>
                </Row>
                <Row className="py-1">
                  <Col span={16} className="text-right px-1">
                    <Typography.Text>{t("sevenFolderBonus")}</Typography.Text>
                  </Col>
                  <Col span={8} className="px-1">
                    <Input placeholder="" addonAfter={t("time")} />
                  </Col>
                </Row>
                <Row className="py-1">
                  <Col span={16} className="text-right px-1">
                    <Typography.Text>{t("nineFolderBonus")}</Typography.Text>
                  </Col>
                  <Col span={8} className="px-1">
                    <Input placeholder="" addonAfter={t("time")} />
                  </Col>
                </Row>
                <Row className="py-1">
                  <Col span={16} className="text-right px-1">
                    <Typography.Text>{t("cancelTimeBeforeGame")}</Typography.Text>
                  </Col>
                  <Col span={8} className="px-1">
                    <Input placeholder="" addonAfter={t("min")} />
                  </Col>
                </Row>
                <Row className="py-1">
                  <Col span={16} className="text-right px-1">
                    <Typography.Text>{t("bettingDeadline")}</Typography.Text>
                  </Col>
                  <Col span={8} className="px-1">
                    <Input placeholder="" addonAfter={t("second")} />
                  </Col>
                </Row>
                <Row className="py-1">
                  <Col span={16} className="text-right px-1">
                    <Typography.Text>{t("bettingCancelTime")}</Typography.Text>
                  </Col>
                  <Col span={8} className="px-1">
                    <Input placeholder="" addonAfter={t("min")} />
                  </Col>
                </Row>
                <Row className="py-1">
                  <Col span={16} className="text-right px-1">
                    <Typography.Text>{t("bonusOptionAvailable")}</Typography.Text>
                  </Col>
                  <Col span={8} className="px-1">
                    <Input placeholder="" addonAfter={t("time")} />
                  </Col>
                </Row>
                <Row className="py-1">
                  <Col span={16} className="text-right px-1">
                    <Typography.Text>{t("matchesStartWithinSetTime")}</Typography.Text>
                  </Col>
                  <Col span={8} className="px-1">
                    <Input placeholder="" addonAfter={t("hour")} />
                  </Col>
                </Row>
                <Row className="py-1">
                  <Col span={16} className="text-right px-1">
                    <Typography.Text>{t("dailyBetCancellations")}</Typography.Text>
                  </Col>
                  <Col span={8} className="px-1">
                    <Input placeholder="" addonAfter={t("time")} />
                  </Col>
                </Row>
                <Row className="py-1">
                  <Col span={16} className="text-right px-1">
                    <Typography.Text>{t("minDividendWithWinningPoints")}</Typography.Text>
                  </Col>
                  <Col span={8} className="px-1">
                    <Input placeholder="" addonAfter={t("time")} />
                  </Col>
                </Row>
                <Row className="py-1">
                <Space>
                  <Button type="primary">{`${t("changeLevelButton")}1`}</Button>
                  <Button type="primary">{`${t("applyToAllLevels")}`}</Button>
                </Space>
                </Row>
              </Card>
            </Col>
          </Row>
        </Card>
      </Content>
    </Layout>
  );
};

export default SportsBettingInformationSettings;
