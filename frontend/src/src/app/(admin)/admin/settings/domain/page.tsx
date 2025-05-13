"use client";
import React, { useEffect, useState } from "react";

import {
  Layout,
  Card,
  Form,
  Input,
  Radio,
  Select,
  Button,
  Switch,
  Divider,
  Flex,
} from "antd";

import { Content } from "antd/es/layout/layout";

import { useTranslations } from "next-intl";
import { GET_DOMAINS, UPDATE_DOMAIN } from "@/actions/domain";
import { useMutation, useQuery } from "@apollo/client";

const DomainSettingPage: React.FC = () => {
  const t = useTranslations();
  const { data } = useQuery(GET_DOMAINS);
  const [updateDomain] = useMutation(UPDATE_DOMAIN);
  const [domains, setDomains] = useState<any[]>([]);
  const opt = [
    {
      label: "WIN",
      value: "win",
    },
    {
      label: "SPORTS",
      value: "sports",
    },
    {
      label: "CUP",
      value: "cup",
    },
    {
      label: "OLEBET",
      value: "olebet",
    },
    {
      label: "SOUL",
      value: "soul",
    },
    {
      label: "DNINE",
      value: "dnine",
    },
    {
      label: "CHOCO",
      value: "choco",
    },
    {
      label: "COK",
      value: "cok",
    },
    {
      label: "OSAKA",
      value: "osaka",
    },
    {
      label: "BELLY",
      value: "belly",
    },
    {
      label: "HOUSE",
      value: "house",
    },
    {
      label: "BLUE",
      value: "blue",
    },
    {
      label: "vlvaldl",
      value: "vlvaldl",
    },
  ];

  const labelRenderer = (props: any) =>
    props.value.toString() == "100"
      ? "Premium"
      : (parseInt(props.value.toString()) > 100 ? "VIP " : "Level ") +
        props.value;

  const levelOption = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 101, 102, 100,
  ].map((i) => ({
    value: i,
    label: i == 100 ? "Premium" : (i > 100 ? "VIP " : "Level ") + i,
  })); 
  const onSubmitSetting = (v: any) => { 
    const { id, ...input } = v;
    updateDomain({
      variables: {
        id,
        input,
      },
    });
  };
  useEffect(() => {
    setDomains(data?.response?.domains ?? []);
  }, [data]);
  return (
    <Layout>
      <Content className="overflow-auto h-[calc(100vh-100px)] dark:bg-black">
        <Card title={t("admin/menu/domainSetting")}>
          <Radio.Group options={opt} optionType="button" buttonStyle="solid" />
          <Divider />
          <Flex wrap className="!w-full">
            {domains.map((d, index) => (
              <Card
                className="!w-1/2"
                title={`${index + 1} - ${d.name}`}
                type="inner"
                key={`${index + 1}-${d.name}`}
              >
                <Form
                  layout="horizontal"
                  labelCol={{ flex: "110px" }}
                  labelAlign="left"
                  labelWrap
                  wrapperCol={{ flex: 1 }}
                  className="w-full"
                  initialValues={d}
                  colon={false}
                  onFinish={onSubmitSetting}
                >
                  <Form.Item name="id" className="!p-0 !m-0" hidden>
                    <Input />
                  </Form.Item>
                  <div className="!w-full flex gap-2">
                    <Form.Item
                      label={t("memberLevelUponSignup")}
                      name="memberLevel"
                      className="w-1/2"
                    >
                      <Select
                        options={levelOption}
                        labelRender={labelRenderer}
                      />
                    </Form.Item>
                    <Form.Item
                      label={t("distributorLevelUponSignup")}
                      name="distributorLevel"
                      className="w-1/2"
                    >
                      <Select
                        options={levelOption}
                        labelRender={labelRenderer}
                      />
                    </Form.Item>
                  </div>
                  <Divider className="!p-0 !m-0" />
                  <table className="min-w-full table-auto border border-gray-200 mb-4">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-2 py-1 items-center text-left font-medium">
                          {t("name")}
                        </th>
                        <th className="px-2 py-1 items-center text-left font-medium">
                          {t("status")}
                        </th>
                        <th className="px-2 py-1 items-center text-left font-medium">
                          {t("currentName")}
                        </th>
                        <th className="px-2 py-1 items-center text-left font-medium">
                          {t("link")}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="hover:bg-gray-50">
                        <td className="px-2 py-1 items-center">
                          {t("telegram")}
                        </td>
                        <td className="px-2 py-1 items-center">
                          <Form.Item name="useTelegram" className="!p-0 !m-0">
                            <Switch />
                          </Form.Item>
                        </td>
                        <td className="px-2 py-1 items-center">
                          <Form.Item name="telegram" className="!p-0 !m-0">
                            <Input />
                          </Form.Item>
                        </td>
                        <td className="px-2 py-1 items-center">
                          <Form.Item name="telegramLink" className="!p-0 !m-0">
                            <Input />
                          </Form.Item>
                        </td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="px-2 py-1 items-center">
                          {t("kakaoTalk")}
                        </td>
                        <td className="px-2 py-1 items-center">
                          <Form.Item name="useKakaoTalk" className="!p-0 !m-0">
                            <Switch />
                          </Form.Item>
                        </td>
                        <td className="px-2 py-1 items-center">
                          <Form.Item name="kakaoTalk" className="!p-0 !m-0">
                            <Input />
                          </Form.Item>
                        </td>
                        <td className="px-2 py-1 items-center">
                          <Form.Item name="kakaoTalkLink" className="!p-0 !m-0">
                            <Input />
                          </Form.Item>
                        </td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="px-2 py-1 items-center">
                          {t("serviceCenter")}
                        </td>
                        <td className="px-2 py-1 items-center">
                          <Form.Item
                            name="useServiceCenter"
                            className="!p-0 !m-0"
                          >
                            <Switch />
                          </Form.Item>
                        </td>
                        <td className="px-2 py-1 items-center">
                          <Form.Item name="serviceCenter" className="!p-0 !m-0">
                            <Input />
                          </Form.Item>
                        </td>
                        <td className="px-2 py-1 items-center">
                          <Form.Item
                            name="serviceCenterLink"
                            className="!p-0 !m-0"
                          >
                            <Input />
                          </Form.Item>
                        </td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="px-2 py-1 items-center">
                          {t("liveDomain")}
                        </td>
                        <td className="px-2 py-1 items-center">
                          <Form.Item name="useLiveDomain" className="!p-0 !m-0">
                            <Switch />
                          </Form.Item>
                        </td>
                        <td className="px-2 py-1 items-center">
                          <Form.Item name="liveDomain" className="!p-0 !m-0">
                            <Input />
                          </Form.Item>
                        </td>
                        <td className="px-2 py-1 items-center">
                          <Form.Item
                            name="liveDomainLink"
                            className="!p-0 !m-0"
                          >
                            <Input />
                          </Form.Item>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <Form.Item>
                    <Button type="primary" htmlType="submit">
                      {t("submit")}
                    </Button>
                  </Form.Item>
                </Form>
              </Card>
            ))}
          </Flex>
        </Card>
      </Content>
    </Layout>
  );
};

export default DomainSettingPage;
