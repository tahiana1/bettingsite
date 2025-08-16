"use client";
import React, { ChangeEvent } from "react";
import { Button, Card, Form, Input, Space } from "antd";
import { useTranslations } from "next-intl";
import { useAtom } from "jotai";
import { userState } from "@/state/state";
import { useMutation, useQuery } from "@apollo/client";
import { GET_PROFILE, UPDATE_PROFILE } from "@/actions/profile";
import Image from "next/image";
import modalImage from '@/assets/img/main/modal-head.png';
import { SiDepositphotos } from "react-icons/si";

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

const ProfilePage: React.FC<{checkoutModal: (modal: string) => void}> = (props) => {
    const t = useTranslations();
    const [form] = Form.useForm();
    const [user] = useAtom<any>(userState);
    const { loading, error, data } = useQuery(GET_PROFILE);
    const [updateProfile, updateResult] = useMutation(UPDATE_PROFILE);
    console.log({ loading, error }, updateResult);
    const onFinish = async (values: any) => {
      // console.log("Received values of form: ", values);
      const u = {
        userId: user.id,
        ...values,
      };
      delete values["agreement"];
      delete values["holderName"];
      updateProfile({
        variables: {
          input: values,
        },
      }).then((res) => {
        console.log({ res });
      });
      console.log({ u });
    };
    // console.log({ loading, error }, data?.profile);

    const onNewPasswordChange = (v: ChangeEvent<HTMLInputElement>) => {
      console.log({ v });
    };
  return (
    <div className="flex justify-center items-center">
      <Form
        form={form}
        className="pr-4"
        name="profile"
        layout="vertical"
        style={{ maxWidth: 800, width: "100%" }}
        onFinish={onFinish}
        initialValues={{
          ...user,
          ...data?.profile,
        }}
        scrollToFirstError
      >
        <Card
          title={
            <>
              <h2 className="text-[#edd497] text-[40px] justify-center flex pt-10 font-bold">{t("PROFILE")}</h2>
              <p className="text-white text-[16px] font-[400] justify-center pb-6 flex">{t("profile")}</p>
            </>
          }
          className="w-full login-card"
          classNames={{
            body: "px-6 py-6",
          }}
          styles={{
            header: {
              backgroundImage: `url(${modalImage.src})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            },
            body: {
              backgroundColor: '#160d0c',
              borderTop: 'none',
              padding: "0px 30px"
            }
          }}
        >
          <div className="flex w-full mb-6 bg-gradient-to-r from-[#2a1810] to-[#3e2a1f] rounded-lg overflow-hidden border border-[#5d4a3a]">
          <button
            onClick={() => props.checkoutModal("profile")}
            className="flex-1 flex items-center justify-center gap-2 cursor-pointer text-[15px] px-4 py-3 bg-[#4a3224] text-[#edd497] font-bold border-r border-[#5d4a3a] hover:bg-[#5a3a2a] transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor" viewBox="0 0 512 512" ><path d="M238.6 58.1C248.4 48.9 263.6 48.9 273.4 58.1L345.6 125.0L345.6 115.2C345.6 101.0 357.0 89.6 371.2 89.6L396.8 89.6C411.0 89.6 422.4 101.0 422.4 115.2L422.4 196.4L452.6 224.5C460.3 231.7 462.9 242.8 459.0 252.6C455.2 262.3 446.0 268.8 435.2 268.8L422.4 268.8L422.4 409.6C422.4 438.6 399.4 461.6 370.4 461.6L141.6 461.6C112.6 461.6 89.6 438.6 89.6 409.6L89.6 268.8L76.8 268.8C66.0 268.8 56.8 262.3 53.0 252.6C49.1 242.8 51.7 231.7 59.4 224.5L238.6 58.1zM300.8 256.0C300.8 231.3 280.7 211.2 256.0 211.2C231.3 211.2 211.2 231.3 211.2 256.0C211.2 280.7 231.3 300.8 256.0 300.8C280.7 300.8 300.8 280.7 300.8 256.0zM166.4 396.8C166.4 403.8 172.2 409.6 179.2 409.6L332.8 409.6C339.8 409.6 345.6 403.8 345.6 396.8C345.6 361.4 317.4 332.8 282.0 332.8L230.4 332.8C195.0 332.8 166.4 361.4 166.4 396.8z"/></svg>
            {t("profile")}
          </button>
          <button
            className="flex-1 flex items-center justify-center gap-2 cursor-pointer text-[15px] px-4 py-3 text-white hover:bg-[#2a1810] transition-colors"
            onClick={() => props.checkoutModal("letter")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 512 512"  fill="white"  ><path d="M128 76.8C99.8 76.8 76.8 99.8 76.8 128L76.8 384C76.8 412.2 99.8 435.2 128 435.2L384 435.2C412.2 435.2 435.2 412.2 435.2 384L435.2 128C435.2 99.8 412.2 76.8 384 76.8L128 76.8zM244.1 265.5L163.5 217.1C157.4 213.4 153.6 206.8 153.6 199.6C153.6 188.3 162.7 179.2 174.0 179.2L337.9 179.2C349.2 179.2 358.3 188.3 358.3 199.6C358.3 206.8 354.5 213.4 348.4 217.1L267.9 265.5C264.3 267.7 260.3 268.8 256 268.8C251.7 268.8 247.7 267.7 244.1 265.5zM358.4 241.0L358.4 307.2C358.4 321.4 346.9 332.8 332.8 332.8L179.2 332.8C165.0 332.8 153.6 321.4 153.6 307.2L153.6 241.0L230.9 287.4C238.5 292.0 247.2 294.4 256 294.4C264.8 294.4 273.5 292.0 281.1 287.4L358.4 241.0z"/></svg>
            {t("letter")}
          </button>
          <button 
            className="flex-1 flex items-center justify-center gap-2 cursor-pointer text-[15px] px-4 py-3 text-white hover:bg-[#2a1810] transition-colors border-r border-[#5d4a3a]"
            onClick={() => props.checkoutModal("qna")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 512 512" fill="white" ><path d="M256 32C114.6 32 0 125.1 0 240c0 49.6 21.4 95 57 130.7C44.5 421.1 2.7 466 2.2 466.5c-2.2 2.3-2.8 5.7-1.5 8.7S4.8 480 8 480c66.3 0 116-31.8 140.6-51.4 32.7 12.3 69 19.4 107.4 19.4 141.4 0 256-93.1 256-208S397.4 32 256 32zM128 272c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32zm128 0c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32zm128 0c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32z"/></svg>
            {t("QNA")}
          </button>
        </div>
          {user.id && data?.profile?.id ? (
            <>
              <Space.Compact className="w-full gap-2">
            <Form.Item
              name="userid"
              className="w-full"
              label={<span className="text-white font-medium">{t("ID")}</span>}
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input className="custom-white-input" />
            </Form.Item>
            <Form.Item
              name="nickname"
              className="w-full"
              label={<span className="text-white font-medium">{t("nickname")}</span>}
              rules={[
                {
                  required: true,
                  whitespace: true,
                },
              ]}
            >
              <Input className="custom-white-input" />
            </Form.Item>
          </Space.Compact>
          <Space.Compact className="w-full gap-2">
            <Form.Item
              className="w-full"
              name="bankName"
              label={<span className="text-white font-medium">{t("bank")}</span>}
              rules={[{ required: true }]}
            >
              {/* 
              <Space.Compact>
                <Form.Item
                  name="bankName"
                  noStyle
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Select
                    // defaultValue="SB"
                    style={{ width: 120 }}
                    // onChange={handleChange}
                    options={[
                      { value: "SB", label: "SB" },
                      { value: "CK", label: "CK" },
                      { value: "CN", label: "CN" },
                    ]}
                  />
                </Form.Item>
              </Space.Compact> */}
              <Input className="custom-white-input" />
            </Form.Item>
            <Form.Item
              name="holderName"
              className="w-full"
              label={<span className="text-white font-medium">{t("holderName")}</span>}
              // rules={[{ required: true }]}
            >
              <Input disabled className="custom-white-input" />
            </Form.Item>
          </Space.Compact>

          <Space.Compact className="w-full gap-2">
            <Form.Item
              name="accountNumber"
              className="w-full"
              label={<span className="text-white font-medium">{t("accountNumber")}</span>}
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input className="custom-white-input" />
            </Form.Item>
            <Form.Item
              name="phone"
              className="w-full"
              label={<span className="text-white font-medium">{t("phone")}</span>}
              rules={[{ required: true }]}
            >
              <Input style={{ width: "100%" }} className="custom-white-input" />
            </Form.Item>
          </Space.Compact>
          <Space.Compact className="w-full gap-2">
            <Form.Item
              name="currentPassword"
              className="w-full"
              label={<span className="text-white font-medium">{t("currentPassword")}</span>}
              rules={[
                {
                  required: true,
                },
              ]}
              hasFeedback
            >
              <Input.Password className="custom-white-input" />
            </Form.Item>
          </Space.Compact>
          <Space.Compact className="w-full gap-2">
            <Form.Item
              name="newPassword"
              className="w-full"
              label={<span className="text-white font-medium">{t("newPassword")}</span>}
              rules={[
                {
                  // required: true,
                },
              ]}
              hasFeedback
            >
              <Input.Password onChange={onNewPasswordChange} className="custom-white-input" />
            </Form.Item>
            <Form.Item
              name="confirmPassword"
              className="w-full"
              label={<span className="text-white font-medium">{t("password2")}</span>}
              dependencies={["password"]}
              hasFeedback
              rules={[
                {
                  // required: true,
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("newPassword") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error(
                        "The new password that you entered do not match!"
                      )
                    );
                  },
                }),
              ]}
            >
              <Input.Password className="custom-white-input" />
            </Form.Item>
          </Space.Compact>

          {/*  <Form.Item
            name="agreement"
            valuePropName="checked"
            rules={[
              {
                validator: (_, value) =>
                  value
                    ? Promise.resolve()
                    : Promise.reject(new Error("Should accept agreement")),
              },
            ]}
            {...tailFormItemLayout}
          >
            <Checkbox>{t("tos")}</Checkbox>
          </Form.Item> */}
          <div className="flex gap-2 pt-3 w-[80%] mx-auto">
            <Form.Item label={null} className="w-full">
              <button
                type="submit"
                className="w-full btn-modal-auth cursor-pointer"
              >
                {t("submit")}
              </button>
            </Form.Item>
            <Form.Item label={null} className="w-full">
              <button
                type="reset"
                className="w-full btn-modal-auth cursor-pointer"
              >
                {t("reset")}
              </button>
            </Form.Item>
              </div>
            </>
          ) : (
            <div className="text-white text-center py-8">
              {loading ? t("loading") : t("noData")}
            </div>
          )}
        </Card>
      </Form>
    </div>
  );
};

export default ProfilePage;
