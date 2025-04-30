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
const UserSchema = z.object({
  userid: z.string().optional(),
  password: z.string().optional(),
});
type User = z.infer<typeof UserSchema>;
const Login: React.FC = () => {
  const t = useTranslations();
  const router = useRouter();
  const [, setUser] = useAtom<any>(userState);

  const { register } = useForm<User>();

  const [notiApi, contextHolder] = notification.useNotification();

  const onSubmit: SubmitHandler<User> = (data) => {
    api("auth/login", { method: "POST", data })
      .then((result) => {
        setUser(result.data);
        localStorage.setItem("token", result.token);
        notiApi.success({
          message: "Welcome",
          description: <div>You logged in as `Admin`!</div>,
          placement: "topRight",
        });
        router.push(ROUTES.admin.home);
      })
      .catch((err) => {
        notiApi.error({
          message: "Error",
          description: (
            <div>
              <div>Some error occurred!</div> {err}
            </div>
          ),
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

      <Card title={"Admin Login"} className="w-full">
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
