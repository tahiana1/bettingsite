"use client";
import { useState } from "react";
import { Button, Card } from "antd";
import { useTranslations } from "next-intl";

export default function LevelPage() {
    const t = useTranslations();

  return <Card title={t("admin/menu/levelSettingTitle")}>
    <div className="flex flex-wrap gap-2">
        <Button>{t("level1")}</Button>
        <Button>{t("level2")}</Button>
        <Button>{t("level3")}</Button>
        <Button>{t("level4")}</Button>
        <Button>{t("level5")}</Button>
        <Button>{t("level6")}</Button>
        <Button>{t("level7")}</Button>
        <Button>{t("level8")}</Button>
        <Button>{t("level9")}</Button>
        <Button>{t("level10")}</Button>
        <Button>{t("level11")}</Button>
        <Button>{t("level12")}</Button>
        <Button>{t("levelVIP1")}</Button>
        <Button>{t("levelVIP2")}</Button>
        <Button>{t("levelPremium")}</Button>
    </div>
    <div className="mt-3">
        <Card 
            title={t("level1Setting")}
            headStyle={{ backgroundColor: 'black', color: 'white' }}
        >
            <div>
                
            </div>
        </Card>
    </div>
  </Card>;
}