import React, { useState } from "react";
import { Button, Card, Form, Input, notification, Spin } from "antd";
import { useAtom } from "jotai";
import { userState } from "@/state/state";
import { z } from "zod";
import api from "@/api";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/routes";
import { parseError } from "@/lib";
import { getDeviceInfo } from "@/lib/deviceInfo";
import { UserOutlined, LockOutlined, EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";

const UserSchema = z.object({
  userid: z.string().optional(),
  password: z.string().optional(),
  domain: z.string().optional(),
  os: z.string().optional(),
  device: z.string().optional(),
  fingerPrint: z.string().optional(),
});
type User = z.infer<typeof UserSchema>;

const Login: React.FC = () => {
  const t = useTranslations();
  const router = useRouter();
  const [, setUser] = useAtom<any>(userState);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [notiApi, contextHolder] = notification.useNotification();

  const onSubmit = async (data: User) => {
    setLoading(true);
    // Get device information
    try {
      const deviceInfo = await getDeviceInfo();
      data.os = deviceInfo.os;
      data.device = deviceInfo.device;
      data.fingerPrint = deviceInfo.fingerPrint;
    } catch (error) {
      console.error("Error getting device info:", error);
    }
    
    // Add domain from current URL
    const loginData = {
      ...data,
      domain: window.location.hostname, // Get domain from current URL
    };
    
    api("admin/auth/login", { method: "POST", data: loginData })
      .then((result) => {
        console.log({ result });
        notiApi.success({
          message: result.message,
          description: result.desc,
          placement: "topRight",
          duration: 3,
          showProgress: true,
          onClose() {
            setUser(result.data);
            localStorage.setItem("token", result.token);
            if(result.data.role == "A"){
              router.push(ROUTES.admin.home);
              console.log("admin");
            } else if(result.data.role == "P"){
              router.push(ROUTES.partner.home);
              console.log("partner");
            }
          },
        });
      })
      .catch((err) => {
        const errData = parseError(err);
        const errorMessage = errData.error || errData.Error || errData.message || "An error occurred";
        notiApi.error({
          message: errData.message || "Error",
          description: errorMessage,
          placement: "topRight",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onFinishFailed = () => {};
  
  return (
    <div className="w-full flex items-center justify-center h-[calc(100vh-10px)] overflow-hidden">
      {contextHolder}
      <Card
        className="w-full max-w-md login-card-modern backdrop-blur-sm border-0 shadow-2xl"
        styles={{
          body: {
            padding: '3rem 2.5rem',
            background: 'linear-gradient(135deg, rgba(22, 13, 12, 0.95) 0%, rgba(26, 18, 15, 0.98) 100%)',
            border: '1px solid rgba(237, 212, 151, 0.1)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(237, 212, 151, 0.1) inset',
          }
        }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#edd497] to-[#c9a972] mb-4 shadow-lg shadow-[#edd497]/20">
            <UserOutlined className="text-2xl text-[#160d0c]" />
          </div>
          <h1 className="text-3xl font-bold text-[#edd497] mb-2 tracking-tight">
            {t("admin/login") || "Admin Login"}
          </h1>
          <p className="text-gray-400 text-sm">
            {t("admin/login/description") || "Enter your credentials to access the admin panel"}
          </p>
        </div>

        <Form
          form={form}
          className="w-full"
          name="login"
          layout={"vertical"}
          initialValues={{ remember: true }}
          onFinish={onSubmit}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item<User>
            name="userid"
            rules={[
              {
                required: true,
                message: "Please input your correct userid!",
              },
            ]}
          >
            <Input
              size="large"
              prefix={<UserOutlined className="text-[#c9a972] text-base" />}
              placeholder="User ID"
              className="h-12 bg-white border-[#c9a972]/30 hover:border-[#c9a972]/50 focus:border-[#edd497] transition-all duration-300 rounded-lg"
              styles={{
                input: {
                  fontSize: '15px',
                  color: '#1a120f',
                }
              }}
            />
          </Form.Item>

          <Form.Item<User>
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password
              size="large"
              prefix={<LockOutlined className="text-[#c9a972] text-base" />}
              placeholder="Password"
              className="h-12 bg-white border-[#c9a972]/30 hover:border-[#c9a972]/50 focus:border-[#edd497] transition-all duration-300 rounded-lg"
              iconRender={(visible) => (visible ? <EyeOutlined className="text-[#c9a972]" /> : <EyeInvisibleOutlined className="text-[#c9a972]" />)}
              styles={{
                input: {
                  fontSize: '15px',
                  color: '#1a120f',
                }
              }}
            />
          </Form.Item>

          <Form.Item className="mb-0 mt-6">
            <Button
              htmlType="submit"
              size="large"
              disabled={loading}
              className="w-full h-12 text-base font-semibold rounded-lg border-0 shadow-lg shadow-[#edd497]/30 hover:shadow-xl hover:shadow-[#edd497]/40 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] login-button-custom"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Spin size="small" />
                  <span>Signing in...</span>
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <span>{t("auth/login") || "Login"}</span>
                </span>
              )}
            </Button>
          </Form.Item>
        </Form>

        {/* Decorative elements */}
        <div className="mt-6 flex items-center justify-center gap-2">
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#c9a972]/30"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-[#edd497]/40"></div>
          <div className="h-px flex-1 bg-gradient-to-r from-[#c9a972]/30 to-transparent"></div>
        </div>
      </Card>
    </div>
  );
};

export default Login;
