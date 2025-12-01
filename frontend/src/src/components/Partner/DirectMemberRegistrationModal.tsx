import React, { useState } from "react";
import {
  Modal,
  Form,
  Input,
  DatePicker,
  DatePickerProps,
  Select,
  Space,
  Spin,
  Checkbox,
  message,
} from "antd";
import { useTranslations } from "next-intl";
import api from "@/api";
import { getDeviceInfo } from "@/lib/deviceInfo";

interface DirectMemberRegistrationModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const DirectMemberRegistrationModal: React.FC<DirectMemberRegistrationModalProps> = ({
  open,
  onClose,
  onSuccess,
}) => {
  const t = useTranslations();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    console.log("Received values of form: ", values);
    setLoading(true);

    // Get device information
    let deviceInfo = null;
    try {
      deviceInfo = await getDeviceInfo();
    } catch (error) {
      console.error("Error getting device info:", error);
    }

    const data = {
      ...values,
      phone: values.phone,
      birthday: values.birthday.toJSON(),
      domain: window.location.hostname,
      passwordSpell: values.password, // Set passwordSpell to same as password
      ...(deviceInfo && {
        os: deviceInfo.os,
        device: deviceInfo.device,
        fingerPrint: deviceInfo.fingerPrint,
      }),
    };

    try {
      const result = await api("partner/member-management/direct-members/register", {
        method: "POST",
        data,
      });

      console.log({ result });
      setLoading(false);
      message.success(t("directMemberRegistrationSuccess") || "Direct member registered successfully!");
      form.resetFields();
      if (onSuccess) {
        onSuccess();
      }
      onClose();
    } catch (err: any) {
      console.log(err);
      setLoading(false);
      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.Error ||
        err.message ||
        "Some error occurred!";
      message.error(errorMessage);
    }
  };

  const handleChange = (value: string) => {
    console.log(`selected ${value}`);
  };

  const onDOBChange: DatePickerProps["onChange"] = (date, dateString) => {
    console.log(date, dateString);
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title={t("directMemberRegistration") || "Direct Member Registration"}
      open={open}
      onCancel={handleCancel}
      footer={null}
      width={800}
      destroyOnClose
    >
      <Form
        form={form}
        className="pr-4"
        layout="vertical"
        labelWrap
        name="directMemberRegister"
        onFinish={onFinish}
        initialValues={{
          bank: "SB",
        }}
        scrollToFirstError
        style={{ maxWidth: "100%", width: "100%" }}
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
            <Input className="w-full" />
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
            <Input />
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
            <Input.Password className="w-full" />
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
            <Input.Password className="w-full" />
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
                  style={{ width: 120 }}
                  onChange={handleChange}
                  options={[
                    { value: "SB", label: "SB" },
                    { value: "CK", label: "CK" },
                    { value: "CN", label: "CN" },
                  ]}
                />
              </Form.Item>
              <Input className="w-full" />
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
            label={t("phone")}
            rules={[{ required: true }]}
          >
            <Input />
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
            <DatePicker className="w-full" onChange={onDOBChange} />
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
            <Input.Password />
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
            <Input />
          </Form.Item>
        </Space.Compact>

        <Space.Compact className="w-full gap-2">
          <Form.Item
            className="w-full"
            name="usdtAddress"
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
        >
          <Checkbox>
            I have read the <a href="">agreement</a>
          </Checkbox>
        </Form.Item>
        <div className="flex gap-2 pt-3 w-full justify-end">
          <Form.Item label={null} className="mb-0">
            <Space>
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 border rounded hover:bg-gray-100"
                disabled={loading}
              >
                {t("cancel") || "Cancel"}
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
              >
                {loading ? (
                  <Spin size="small" />
                ) : (
                  t("directMemberRegistration") || "Register"
                )}
              </button>
            </Space>
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export default DirectMemberRegistrationModal;

