import React, { useEffect } from "react";
import { Button, Card, Form, Input, notification } from "antd";
import { useAtom } from "jotai";
import { userState } from "@/state/state";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import Link from "next/link";
import { ROUTES } from "@/routes";
import api from "@/api";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
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
        router.push("/");
      })
      .catch((err) => {
        console.log({err})
        if (err.status == "403") {
          notiApi.error({
            message: t("auth/noallow"),
            description: t("auth/noallow"),
            placement: "topRight",
          });
        } else {
          notiApi.error({
            message: "Error",
            description: `Some error occurred! ${err}`,
            placement: "topRight",
          });
        }
      });

  };

  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   if (token) {
  //     router.replace("/");
  //   }
  // }, []);

  const onFinishFailed = () => {};
  return (
    <Form
      className="pr-4"
      name="login"
      layout={"vertical"}
      style={{ maxWidth: 600, width: "100%" }}
      initialValues={{ remember: true }}
      onFinish={onSubmit}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      {contextHolder}      
      <Card
        title={"Login"}
        className="w-full"
        classNames={{
          body: "!px-2 !py-0",
        }}
      >
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

        <Form.Item label={null} className="w-full ">
          <Button
            variant="solid"
            color="danger"
            htmlType="submit"
            className="w-full"
          >
            {t("auth/login")}
          </Button>
        </Form.Item>
        <Form.Item label={null} className="w-full ">
          <Link href={ROUTES.signup}>
            <Button type="primary" htmlType="button" className="w-full">
              {t("auth/register")}
            </Button>
          </Link>
        </Form.Item>
      </Card>
    </Form>
  );
};

export default Login;
