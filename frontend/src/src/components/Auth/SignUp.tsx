import React from "react";
import {
  Button,
  Card,
  Checkbox,
  DatePicker,
  DatePickerProps,
  Form,
  GetProp,
  Input,
  notification,
  Select,
  Space,
} from "antd";
import { useTranslations } from "next-intl";
import api from "@/api";
import { useRouter } from "next/navigation";

const SignUp = () => {
  const t = useTranslations();
  const [form] = Form.useForm();
  const router = useRouter();
  const [notiApi, contextHolder] = notification.useNotification();

  const onFinish = (values: any) => {
    console.log("Received values of form: ", values);
    const data = {
      ...values,
      phone: values.phone_prefix + values.phone,
      birthday: values.birthday.toJSON(),
      favorites: values.favorites.toString(),
    };
    api("auth/signup", {
      method: "POST",
      data,
    })
      .then((result) => {
        console.log({ result });
        notiApi.info({
          message: "Welcome!",
          description: (
            <div>
              Your information was registered successfully!
              <br />
              Please wait while you get access.
            </div>
          ),
          placement: "topRight",
        });
        // localStorage.setItem("token", result.token);
        router.push("/");
      })
      .catch((err) => {
        console.log(err);
        notiApi.error({
          message: "Error",
          description: `Some error occurred! ${err}`,
          placement: "topRight",
        });
      });
  };

  const options = [
    { label: "Live", value: 1 },
    { label: "Sports", value: 2 },
    { label: "Special", value: 3 },
    { label: "National", value: 4 },
    { label: "eSport", value: 5 },
    { label: "Casino", value: 6 },
  ];
  const handleChange = (value: string) => {
    console.log(`selected ${value}`);
  };

  const onDOBChange: DatePickerProps["onChange"] = (date, dateString) => {
    console.log(date, dateString);
  };

  const onChange: GetProp<typeof Checkbox.Group, "onChange"> = (
    checkedValues
  ) => {
    console.log("checked = ", checkedValues);
  };

  return (
    <Card title={t("auth/register")}>
      {contextHolder}
      <Form
        form={form}
        layout="vertical"
        labelWrap
        name="register"
        onFinish={onFinish}
        initialValues={{
          bank: "SB",
        }}
        scrollToFirstError
      >
        <Space.Compact className="w-full gap-2">
          <Form.Item
            className="w-full"
            name="userId"
            label="UserID"
            rules={[
              {
                required: true,
              },
              {
                min: 6,
                message: "UserID must be at least 6 characters.",
              },
            ]}
          >
            <Input className="w-full" />
          </Form.Item>
          <Form.Item
            className="w-full"
            name="name"
            label="Nickname"
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
            name="password"
            label="Password"
            rules={[
              {
                required: true,
              },
            ]}
            hasFeedback
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            className="w-full"
            name="confirm"
            label="Password2"
            dependencies={["password"]}
            hasFeedback
            rules={[
              {
                required: true,
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("The new password that you entered do not match!")
                  );
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
        </Space.Compact>
        <Space.Compact className="w-full gap-2">
          <Form.Item
            className="w-full"
            name="account_number"
            label="Saving Bank"
            rules={[{ required: true }]}
          >
            <Space.Compact>
              <Form.Item
                name="bank"
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
                  onChange={handleChange}
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
            className="w-full"
            name="holderName"
            label="Holder Name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
        </Space.Compact>

        <Space.Compact className="w-full gap-2">
          <Form.Item
            className="w-full"
            name="phone"
            label="Phone Number"
            rules={[{ required: true }]}
          >
            <Input.Search enterButton={"SendSMS"} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            className="w-full"
            name="birthday"
            label="Birthday"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <DatePicker className="w-full" onChange={onDOBChange} />
          </Form.Item>
        </Space.Compact>
        <Space.Compact className="w-full gap-2">
          <Form.Item
            className="w-full"
            name="securityPassword"
            label="Security Pwd"
            rules={[
              {
                required: true,
                whitespace: true,
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            className="w-full"
            name="referral"
            label="Referral"
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
            name="favorites"
            label="Favourite Items"
            rules={[{ required: true }]}
          >
            <Checkbox.Group
              options={options}
              defaultValue={[]}
              onChange={onChange}
            />
          </Form.Item>
          <Form.Item
            className="w-full"
            name="usdtAddres"
            label="USDT Address"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input placeholder="TRC20/ERC20/UNI" />
          </Form.Item>
        </Space.Compact>
        {/* <Form.Item
          label="Captcha"
          extra="We must make sure that your are a human."
        >
          <Row gutter={8}>
            <Col span={12}>
              <Form.Item
                name="captcha"
                noStyle
                rules={[
                  {
                    required: true, 
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Button>Get captcha</Button>
            </Col>
          </Row>
        </Form.Item>
 */}
        <Form.Item
          className="w-full"
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
          // {...tailFormItemLayout}
        >
          <Checkbox>
            I have read the <a href="">agreement</a>
          </Checkbox>
        </Form.Item>
        <Form.Item className="w-full text-center">
          <Button type="primary" htmlType="submit">
            Register
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};
export default SignUp;
