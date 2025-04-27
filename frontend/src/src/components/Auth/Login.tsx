import React, { useState } from "react";
import { Button, Card, Checkbox, Form, Input } from "antd";
import { useAtom } from "jotai";
import { userState } from "@/state/state";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
const UserSchema = z.object({
  username: z.string().optional(),
  password: z.string().optional(),
  remember: z.string().optional(),
});
type User = z.infer<typeof UserSchema>;
const Login: React.FC = () => {
  const [, setUser] = useAtom<any>(userState);

  const [isLoginForm, setIsLoginForm] = useState<boolean>(true);
  const { register } = useForm<User>();
  const onSubmit: SubmitHandler<User> = (data) => {
    console.log({ data });
    setUser({ id: 1, ...data });
  };

  const onSignUp = (value: User) => {
    // setUser({ id: 1, ...value });
    console.log(value);
    // setIsLoginForm(true);
  };
  const onFinishFailed = () => {};
  console.log({ isLoginForm });
  return isLoginForm ? (
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
      <Card
        title={"Login"}
        className="w-full"
        classNames={{
          body: "!p-0 !py-0",
        }}
      >
        <Form.Item<User>
          label="Username"
          {...register("username")}
          rules={[{ required: true, message: "Please input your username!" }]}
          className="!px-2"
        >
          <Input />
        </Form.Item>

        <Form.Item<User>
          label="Password"
          rules={[{ required: true, message: "Please input your password!" }]}
          {...register("password")}
          className="!px-2"
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
          <Button
            type="primary"
            htmlType="button"
            className="w-full"
            onClick={() => {
              setIsLoginForm(!isLoginForm);
              console.log(!isLoginForm);
            }}
          >
            Sign Up
          </Button>
        </Form.Item>
      </Card>
    </Form>
  ) : (
    <Form
      className="pr-4"
      name="signup"
      layout={"vertical"}
      style={{ maxWidth: 600 }}
      initialValues={{ remember: true }}
      onFinish={onSignUp}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Card
        title={"Sign up"}
        className="w-full"
        classNames={{
          body: "!p-0 !py-0",
        }}
      >
        <Form.Item<User>
          label="Username"
          {...register("username")}
          rules={[{ required: true, message: "Please input your username!" }]}
          className="!px-2"
        >
          <Input />
        </Form.Item>

        <Form.Item<User>
          label="Password"
          {...register("password")}
          rules={[{ required: true, message: "Please input your password!" }]}
          className="!px-2"
        >
          <Input.Password />
        </Form.Item>

        <Form.Item<User>
          label="Password 2"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
          className="!px-2"
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
            Sign Up
          </Button>
        </Form.Item>
        <Form.Item label={null} className="w-full ">
          <Button
            type="primary"
            htmlType="button"
            className="w-full"
            onClick={() => setIsLoginForm(true)}
          >
            Login
          </Button>
        </Form.Item>
      </Card>
    </Form>
  );
};

export default Login;
