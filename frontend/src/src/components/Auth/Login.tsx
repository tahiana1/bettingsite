import React from "react";
import { Button, Card, Checkbox, Form, Input, notification } from "antd";
import { useAtom } from "jotai";
import { userState } from "@/state/state";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import Link from "next/link";
import { ROUTES } from "@/routes";
import api from "@/api";
const UserSchema = z.object({
  email: z.string().optional(),
  password: z.string().optional(),
  remember: z.string().optional(),
});
type User = z.infer<typeof UserSchema>;
const Login: React.FC = () => {
  const [, setUser] = useAtom<any>(userState);

  const { register } = useForm<User>();

  const [notiApi, contextHolder] = notification.useNotification();

  const onSubmit: SubmitHandler<User> = (data) => {
    api("auth/login", { method: "POST", data })
      .then((result) => {
        setUser(result.data);
        localStorage.setItem("token", result.token);
      })
      .catch((err) => {
        console.log({ err });
        notiApi.error({
          message: "Error",
          description: `Some error occurred! ${err}`,
          placement: "topRight",
        });
      });
  };

  const onFinishFailed = () => {};
  return (
    <Form
      className="pr-4"
      name="login"
      layout={"vertical"}
      style={{ maxWidth: 600 }}
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
          label="Email"
          {...register("email")}
          rules={[
            {
              type: "email",
              required: true,
              message: "Please input your corret email!",
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

        <Form.Item<User>
          name="remember"
          valuePropName="checked"
          label={null}
          className="!px-2"
        >
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <Form.Item label={null} className="w-full ">
          <Button
            variant="solid"
            color="danger"
            htmlType="submit"
            className="w-full"
          >
            Login
          </Button>
        </Form.Item>
        <Form.Item label={null} className="w-full ">
          <Link href={ROUTES.signup}>
            <Button type="primary" htmlType="button" className="w-full">
              Sign Up
            </Button>
          </Link>
        </Form.Item>
      </Card>
    </Form>
  );
};

export default Login;
