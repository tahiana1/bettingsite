import React from "react";
import { Button, Card, Form, Input, Select, Space } from "antd";
import { useTranslations } from "next-intl";
import { useAtom } from "jotai";
import { userState } from "@/state/state";
import { useMutation, useQuery } from "@apollo/client";
import { GET_PROFILE, UPDATE_PROFILE } from "@/actions/profile";

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
const ProfileForm = () => {
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
  return (
    <Card title={t("profile")}>
      {user.id && data?.profile?.id ? (
        <Form
          // {...formItemLayout}
          form={form}
          layout="vertical"
          name="register"
          onFinish={onFinish}
          initialValues={{
            ...user,
            ...data?.profile,
          }}
          scrollToFirstError
        >
          <Space.Compact className="w-full gap-2">
            <Form.Item
              name="userid"
              className="w-full"
              label={t("ID")}
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="nickname"
              className="w-full"
              label={t("nickname")}
              rules={[
                {
                  required: true,
                  whitespace: true,
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Space.Compact>
          <Space.Compact className="w-full gap-2">
            <Form.Item
              className="w-full"
              name="accountNumber"
              label={t("bank")}
              rules={[{ required: true }]}
            >
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
                <Input />
              </Space.Compact>
            </Form.Item>
            <Form.Item
              name="holderName"
              className="w-full"
              label={t("holderName")}
              // rules={[{ required: true }]}
            >
              <Input disabled />
            </Form.Item>
          </Space.Compact>

          <Space.Compact className="w-full gap-2">
            <Form.Item
              name="accountNumber"
              className="w-full"
              label={t("accountNumber")}
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="phone"
              className="w-full"
              label={t("phone")}
              rules={[{ required: true }]}
            >
              <Input style={{ width: "100%" }} />
            </Form.Item>
          </Space.Compact>
          <Space.Compact className="w-full gap-2">
            <Form.Item
              name="currentPassword"
              className="w-full"
              label={t("currentPassword")}
              rules={[
                {
                  required: true,
                },
              ]}
              hasFeedback
            >
              <Input.Password />
            </Form.Item>
          </Space.Compact>
          <Space.Compact className="w-full gap-2">
            <Form.Item
              name="newPassword"
              className="w-full"
              label={t("newPassword")}
              rules={[
                {
                  // required: true,
                },
              ]}
              hasFeedback
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
              name="confirmPassword"
              className="w-full"
              label={t("password2")}
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
              <Input.Password />
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
          <Form.Item {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit">
              {t("submit")}
            </Button>{" "}
            <Button
              type="default"
              color="red"
              variant="outlined"
              htmlType="reset"
            >
              {t("reset")}
            </Button>
          </Form.Item>
        </Form>
      ) : (
        ""
      )}
    </Card>
  );
};
export default ProfileForm;
