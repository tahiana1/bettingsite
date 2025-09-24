"use client";
import React, { useState, useEffect } from "react";

import {
  Layout,
  Card,
  Form,
  Input,
  Button,
  Row,
  Col,
  Typography,
  Space,
  Divider,
  message,
  Avatar,
  Tooltip
} from "antd";

import { Content } from "antd/es/layout/layout";
import { 
  PhoneOutlined, 
  MessageOutlined, 
  SaveOutlined,
  ReloadOutlined,
  InfoCircleOutlined
} from "@ant-design/icons";

import { useTranslations } from "next-intl";
import api from "@/api";

const { Title, Text } = Typography;

const ContactSettingPage: React.FC = () => {
  const t = useTranslations();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Fetch contact data on component mount
  useEffect(() => {
    const fetchContactData = async () => {
      try {
        const response = await api("admin/contact-info/get", {
          method: "GET",
        });
        
        if (response.success && response.data) {
          form.setFieldsValue({
            phoneNumber: response.data.phone || "",
            telegram: response.data.telegram || "",
            kakaoTalk: response.data.kakaoTalk || "",
          });
        }
      } catch (error) {
        console.error("Error fetching contact data:", error);
        message.error("Failed to load contact information");
      } finally {
        setInitialLoading(false);
      }
    };

    fetchContactData();
  }, [form]);
  
  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const response = await api("admin/contact-info/update", {
        method: "POST",
        data: {
          phone: values.phoneNumber,
          telegram: values.telegram,
          kakaoTalk: values.kakaoTalk,
        },
      });
      
      if (response.success) {
        message.success("Contact settings saved successfully!");
      } else {
        message.error("Failed to save contact settings");
      }
    } catch (error) {
      console.error("Error saving contact settings:", error);
      message.error("Failed to save contact settings");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    form.resetFields();
    message.info("Form reset to default values");
  };

  return (
    <Layout>
      <Content className="overflow-auto h-[calc(100vh-100px)] dark:bg-black">
        <div className="p-6  mx-auto">
          {/* Header Section */}
          <div className="mb-6">
            <Title level={2} className="!mb-2 dark:text-white">
              <MessageOutlined className="mr-3 text-blue-500" />
              {t("admin/menu/contactSetting")}
            </Title>
            <Text type="secondary" className="text-base">
              {t("configureContactInformationAndCommunicationChannelsForYourPlatform")}
            </Text>
          </div>

          {/* Main Form Card */}
          <Card 
            className="shadow-lg border-0"
            bodyStyle={{ padding: "32px" }}
            loading={initialLoading}
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              initialValues={{
                phoneNumber: "",
                telegram: "",
                kakaoTalk: ""
              }}
              className=""
            >
              <Row gutter={[24, 24]}>
                {/* Phone Number */}
                <Col xs={24} md={12}>
                  <Form.Item
                    label={
                      <Space>
                        <PhoneOutlined className="text-green-500" />
                        <span className="font-medium">{t("phoneNumber")}</span>
                        <Tooltip title="Primary contact phone number">
                          <InfoCircleOutlined className="text-gray-400" />
                        </Tooltip>
                      </Space>
                    }
                    name="phoneNumber"
                    rules={[
                      { required: true, message: "Please enter phone number" },
                      { pattern: /^[\+]?[1-9][\d]{0,15}$/, message: "Please enter a valid phone number" }
                    ]}
                  >
                    <Input
                      size="large"
                      placeholder="+1 (555) 123-4567"
                      className="rounded-lg"
                      prefix={<PhoneOutlined className="text-gray-400" />}
                    />
                  </Form.Item>
                </Col>

                {/* Telegram */}
                <Col xs={24} md={12}>
                  <Form.Item
                    label={
                      <Space>
                        <MessageOutlined className="text-blue-500" />
                        <span className="font-medium">{t("telegram")}</span>
                        <Tooltip title="Telegram username or channel">
                          <InfoCircleOutlined className="text-gray-400" />
                        </Tooltip>
                      </Space>
                    }
                    name="telegram"
                    rules={[
                      { pattern: /^@?[a-zA-Z0-9_]{5,32}$/, message: "Please enter a valid Telegram username" }
                    ]}
                  >
                    <Input
                      size="large"
                      placeholder="@username or channel"
                      className="rounded-lg"
                      prefix={<MessageOutlined className="text-gray-400" />}
                    />
                  </Form.Item>
                </Col>

                {/* KakaoTalk */}
                <Col xs={24} md={12}>
                  <Form.Item
                    label={
                      <Space>
                        <Avatar size="small" style={{ backgroundColor: '#FEE500', color: '#3C1E1E' }}>
                          K
                        </Avatar>
                        <span className="font-medium">{t("kakaoTalk")}</span>
                        <Tooltip title="KakaoTalk ID or channel">
                          <InfoCircleOutlined className="text-gray-400" />
                        </Tooltip>
                      </Space>
                    }
                    name="kakaoTalk"
                    rules={[
                      { pattern: /^[a-zA-Z0-9_]{3,20}$/, message: "Please enter a valid KakaoTalk ID" }
                    ]}
                  >
                    <Input
                      size="large"
                      placeholder="KakaoTalk ID"
                      className="rounded-lg"
                      prefix={
                        <Avatar size="small" style={{ backgroundColor: '#FEE500', color: '#3C1E1E' }}>
                          K
                        </Avatar>
                      }
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Divider className="my-8" />

              {/* Action Buttons */}
              <Row justify="end">
                <Space size="middle">
                  <Button
                    size="large"
                    icon={<ReloadOutlined />}
                    onClick={handleReset}
                    className="rounded-lg"
                  >
                    Reset
                  </Button>
                  <Button
                    type="primary"
                    size="large"
                    htmlType="submit"
                    loading={loading}
                    icon={<SaveOutlined />}
                    className="rounded-lg bg-blue-500 hover:bg-blue-600 border-blue-500 hover:border-blue-600"
                  >
                    Save Settings
                  </Button>
                </Space>
              </Row>
            </Form>
          </Card>

          {/* Additional Info Card */}
          <Card 
            className="mt-6 shadow-lg border-0 dark:bg-gray-800"
            bodyStyle={{ padding: "24px" }}
          >
            <Title level={4} className="!mb-4 dark:text-white">
              <InfoCircleOutlined className="mr-2 text-blue-500" />
              {t("contactInformationGuidelines")}
            </Title>
            <Row gutter={[16, 16]}>
              <Col xs={24} md={8}>
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <PhoneOutlined className="text-2xl text-blue-500 mb-2" />
                  <Title level={5} className="!mb-2">{t("phoneNumber")}</Title>
                  <Text type="secondary" className="text-sm">
                    {t("useInternationalFormatWithCountryCode")}
                  </Text>
                </div>
              </Col>
              <Col xs={24} md={8}>
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <MessageOutlined className="text-2xl text-green-500 mb-2" />
                  <Title level={5} className="!mb-2">{t("telegram")}</Title>
                  <Text type="secondary" className="text-sm">
                    {t("includeAtSymbolForUsernames")}
                  </Text>
                </div>
              </Col>
              <Col xs={24} md={8}>
                <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <Avatar size="large" style={{ backgroundColor: '#FEE500', color: '#3C1E1E' }} className="mb-2">
                    K
                  </Avatar>
                  <Title level={5} className="!mb-2">{t("kakaoTalk")}</Title>
                  <Text type="secondary" className="text-sm">
                    {t("enterYourKakaoTalkId")}
                  </Text>
                </div>
              </Col>
            </Row>
          </Card>
        </div>
      </Content>
    </Layout>
  );
};

export default ContactSettingPage;