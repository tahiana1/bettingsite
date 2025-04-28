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
const { Option } = Select;

const SignUp = () => {
  const t = useTranslations();
  const [form] = Form.useForm();

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
        console.log({result})
        notiApi.info({
          message: "Welcome!",
          description: "Your information was registered successfully!",
          placement: "topRight",
        });
      })
      .catch((err) => {
        console.log(err)
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
        // {...formItemLayout}
        form={form}
        layout="vertical"
        labelWrap
        name="register"
        onFinish={onFinish}
        initialValues={{
          bank: "SB",
          phone_prefix: "86",
        }}
        scrollToFirstError
      >
        <Space.Compact className="w-full gap-2">
          <Form.Item
            className="w-full"
            name="email"
            label="E-mail"
            rules={[
              {
                type: "email",
                message: "The input is not valid E-mail!",
              },
              {
                required: true,
                message: "Please input your E-mail!",
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
                message: "Please input your name!",
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
                message: "Please input your password!",
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
                message: "Please confirm your password!",
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
            rules={[{ required: true, message: "Please input bank!" }]}
          >
            <Space.Compact>
              <Form.Item
                name="bank"
                noStyle
                rules={[
                  {
                    required: true,
                    message: "Please select your bank!",
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
            rules={[{ required: true, message: "Please input holder name!" }]}
          >
            <Input />
          </Form.Item>
        </Space.Compact>

        <Space.Compact className="w-full gap-2">
          <Form.Item
            className="w-full"
            name="phone"
            label="Phone Number"
            rules={[
              { required: true, message: "Please input your phone number!" },
            ]}
          >
            <Input.Search
              addonBefore={
                <Form.Item name="phone_prefix" noStyle initialValue={"86"}>
                  <Select style={{ width: 70 }}>
                    <Option value="86">+86</Option>
                    <Option value="87">+87</Option>
                  </Select>
                </Form.Item>
              }
              enterButton={"SendSMS"}
              style={{ width: "100%" }}
            />
          </Form.Item>
          <Form.Item
            className="w-full"
            name="birthday"
            label="Birthday"
            rules={[
              {
                required: true,
                message: "Please input your birthday!",
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
                message: "Please input your Security Password!",
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
                message: "Please input your referral!",
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
            rules={[{ required: true, message: "Please input favorites" }]}
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
                message: "Please input your USDT Address number!",
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
                    message: "Please input the captcha you got!",
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
