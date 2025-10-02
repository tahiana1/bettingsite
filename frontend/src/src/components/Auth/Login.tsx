import React, { useEffect, useState } from "react";
import { Button, Card, Form, Input, notification, Spin } from "antd";
import { useAtom } from "jotai";
import { userState } from "@/state/state";
import Link from "next/link";
import { ROUTES } from "@/routes";
import api from "@/api";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import Image from "next/image";
import modalImage from '@/assets/img/main/modal-head.png'

interface User {
  userid: string;
  password: string;
}

interface LoginProps {
  onClose?: () => void;
}

const Login: React.FC<LoginProps> = ({ onClose }) => {
  const t = useTranslations();
  const router = useRouter();
  const [, setUser] = useAtom<any>(userState);
  const [form] = Form.useForm();
  const [notiApi, contextHolder] = notification.useNotification();
  const [loading, setLoading] = useState(false);
  const onSubmit = (data: User) => {
    setLoading(true);
    api("auth/login", { method: "POST", data })
      .then((result) => {
        setUser(result.data);
        localStorage.setItem("token", result.token);
        if (onClose) {
          onClose(); // Close modal if login is successful
          window.location.reload();
        }
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
      })
      .finally(() => {
        setLoading(false);
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
      form={form}
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
        title={
          <>
            <h2 className="text-[#edd497] text-[40px] justify-center flex pt-10 font-bold">{t("LOGIN")}</h2>
            <p className="text-white text-[16px] font-[400] justify-center pb-6 flex">{t("login")}</p>
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
            borderTop: 'none', // Since header already has the top border
            paddingTop: '40px',
          }
        }}
      >
        <Form.Item<User>
          name="userid"
          label={null}
          rules={[
            {
              required: true,
              message: "Please input your correct userid!",
            },
          ]}
        >
          <Input 
            placeholder={t("userid")} 
            className="custom-white-input"
          />
        </Form.Item>

        <Form.Item<User>
          name="password"
          label={null}
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password 
            placeholder={t("password")}
            className="custom-white-input"
          />
        </Form.Item>
        <div className="flex gap-2 pt-3 w-[80%] mx-auto">
          <Form.Item label={null} className="w-full ">
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-modal-auth cursor-pointer"
            >
              {loading ? (
                <Spin size="small" />
              ) : (
                t("auth/login")
              )}
            </button>
          </Form.Item>
          <Form.Item label={null} className="w-full">
            <Link href={ROUTES.signup}>
              <button type="button" className="w-full btn-modal-auth cursor-pointer">
                {t("auth/register")}
              </button>
            </Link>
          </Form.Item>
        </div>        
      </Card>
    </Form>
  );
};

export default Login;
