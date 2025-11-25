import React from "react";
import { Button, Card, Form, Input, notification } from "antd";
import { useAtom } from "jotai";
import { userState } from "@/state/state";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import api from "@/api";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/routes";
import { parseError } from "@/lib";
import { getDeviceInfo } from "@/lib/deviceInfo";
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

  const { register } = useForm<User>();

  const [notiApi, contextHolder] = notification.useNotification();

  const onSubmit: SubmitHandler<User> = async (data) => {
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
      });
  };

  const onFinishFailed = () => {};
  return (
    <Form
      className="w-full"
      name="login"
      layout={"vertical"}
      style={{ maxWidth: 400 }}
      initialValues={{ remember: true }}
      onFinish={onSubmit}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      {contextHolder}

      <Card title={"Partner Login"} className="w-full">
        <Form.Item<User>
          label="UserID"
          {...register("userid")}
          rules={[
            {
              required: true,
              message: "Please input your corret userid!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item<User>
          label="Password"
          rules={[{ required: true, message: "Please input your password!" }]}
          {...register("password")}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item label={null} className="w-full flex justify-center">
          <Button
            variant="solid"
            color="danger"
            htmlType="submit"
            className="w-full"
          >
            {t("auth/login")}
          </Button>
          {/* <Link href={ROUTES.signup}>
            <Button type="primary" htmlType="button" className="w-full">
              {t("auth/register")}
            </Button>
          </Link> */}
        </Form.Item>
      </Card>
    </Form>
  );
};

export default Login;
