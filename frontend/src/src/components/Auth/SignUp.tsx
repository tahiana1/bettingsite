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
import Image from "next/image";
import modalImage from '@/assets/img/main/modal-head.png';

interface SignUpProps {
  onClose?: () => void;
}

const SignUp: React.FC<SignUpProps> = ({ onClose }) => {
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
        if (onClose) {
          onClose(); // Close modal if signup is successful
        }
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
    <Form
      form={form}
      className="pr-4"
      layout="vertical"
      labelWrap
      name="register"
      onFinish={onFinish}
      initialValues={{
        bank: "SB",
      }}
      scrollToFirstError
      style={{ maxWidth: 600, width: "100%" }}
    >
      {contextHolder}
      <Card
        title={
          <>
            <h2 className="text-[#edd497] text-[40px] justify-center flex pt-10 font-bold">{t("REGISTER")}</h2>
            <p className="text-white text-[16px] font-[400] justify-center pb-6 flex">{t("auth/register")}</p>
          </>
        }
        className="w-full login-card"
        classNames={{
          body: "px-2 py-2",
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
            paddingTop: '40px',
          }
        }}
      >
        <Space.Compact className="w-full gap-2">
          <Form.Item
            className="w-full"
            name="userId"
            label={t("userid")}
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
            <Input className="w-full custom-white-input" />
          </Form.Item>
          <Form.Item
            className="w-full"
            name="name"
            label={t("nickname")}
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
            name="password"
            label={t("password")}
            rules={[
              {
                required: true,
              },
            ]}
            hasFeedback
          >
            <Input.Password className="custom-white-input" />
          </Form.Item>
          <Form.Item
            className="w-full"
            name="confirm"
            label={t("password2")}
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
            <Input.Password className="custom-white-input" />
          </Form.Item>
        </Space.Compact>
        <Space.Compact className="w-full gap-2">
          <Form.Item
            className="w-full"
            name="account_number"
            label={t("savingBank")}
            rules={[{ required: true }]}
          >
            <Space.Compact>
              <Form.Item
                name="bank"
                noStyle
                className="w-full flex"
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
                  className="select-white-input"
                  options={[
                    { value: "SB", label: "SB" },
                    { value: "CK", label: "CK" },
                    { value: "CN", label: "CN" },
                  ]}
                />
              </Form.Item>
              <Input className="custom-white-input" />
            </Space.Compact>
          </Form.Item>
          <Form.Item
            className="w-full"
            name="holderName"
            label="Holder Name"
            rules={[{ required: true }]}
          >
            <Input className="custom-white-input" />
          </Form.Item>
        </Space.Compact>

        <Space.Compact className="w-full gap-2">
          <Form.Item
            className="w-full"
            name="phone"
            label={t("phone")}
            rules={[{ required: true }]}
          >
            <Input.Search enterButton={"SendSMS"} style={{ width: "100%" }} className="custom-white-input" />
          </Form.Item>
          <Form.Item
            className="w-full"
            name="birthday"
            label={t("birthday")}
            rules={[
              {
                required: true,
              },
            ]}
          >
            <DatePicker className="w-full custom-white-input" onChange={onDOBChange} />
          </Form.Item>
        </Space.Compact>
        <Space.Compact className="w-full gap-2">
          <Form.Item
            className="w-full"
            name="securityPassword"
            label={t("securityPwd")}
            rules={[
              {
                required: true,
                whitespace: true,
              },
            ]}
          >
            <Input.Password className="custom-white-input" />
          </Form.Item>

          <Form.Item
            className="w-full"
            name="referral"
            label={t("referral")}
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
            <Input placeholder="TRC20/ERC20/UNI" className="custom-white-input" />
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
        <div className="flex gap-2 pt-3 w-[80%] mx-auto">
          <Form.Item label={null} className="w-full">
            <button
              type="submit"
              className="w-full btn-modal-auth cursor-pointer"
            >
              {t("auth/register")}
            </button>
          </Form.Item>
        </div>
      </Card>
    </Form>
  );
};
export default SignUp;
