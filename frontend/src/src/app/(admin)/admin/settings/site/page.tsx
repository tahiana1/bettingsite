"use client";
import React, { useEffect, useState } from "react";

import {
  Layout,
  Card,
  Tag,
  Row,
  Col,
  Form,
  Input,
  Radio,
  Select,
  InputNumber,
  TimePicker,
  Button,
  Switch,
} from "antd";

import { useQuill } from "react-quilljs";
import { Content } from "antd/es/layout/layout";

import { useTranslations } from "next-intl";

const SiteSettingPage: React.FC = () => {
  const t = useTranslations();
  const opt = [
    {
      label: "WIN",
      value: "win",
    },
    {
      label: "SPORTS",
      value: "sports",
    },
    {
      label: "CUP",
      value: "cup",
    },
    {
      label: "OLEBET",
      value: "olebet",
    },
    {
      label: "SOUL",
      value: "soul",
    },
    {
      label: "DNINE",
      value: "dnine",
    },
    {
      label: "CHOCO",
      value: "choco",
    },
    {
      label: "COK",
      value: "cok",
    },
    {
      label: "OSAKA",
      value: "osaka",
    },
    {
      label: "BELLY",
      value: "belly",
    },
    {
      label: "HOUSE",
      value: "house",
    },
    {
      label: "BLUE",
      value: "blue",
    },
    {
      label: "vlvaldl",
      value: "vlvaldl",
    },
  ];
  const [checked, setChecked] = useState<any[]>([]);
  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    // "bullet",
    "indent",
    "link",
    "image",
  ];

  const { quill, quillRef } = useQuill({ modules, formats });
  const onFinish = (v: any) => {
    console.log({ v });
  };
  useEffect(() => {
    if (quill) {
      // quill.clipboard.dangerouslyPasteHTML("html");
      // quill.on("text-change", (delta, oldDelta, source) => {
      //   console.log("Text change!");
      //   console.log(quill.getText()); // Get text only
      //   console.log(quill.getContents()); // Get delta contents
      //   console.log(quill.root.innerHTML); // Get innerHTML using quill
      //   console.log(quillRef.current.firstChild.innerHTML); // Get innerHTML using quillRef
      // });
    }
  }, [quill]);
  return (
    <Layout>
      <Content className="overflow-auto h-[calc(100vh-100px)] dark:bg-black">
        <Card>
          <Row className="w-full gap-1 justify-between">
            <Col span={12}>
              <Card title={t("defaultSetting")} type="inner">
                <Form layout="vertical" onFinish={onFinish}>
                  <Form.Item>
                    <Radio.Group
                      value={true}
                      options={[
                        {
                          label: t("underMaintenance"),
                          value: false,
                        },
                        {
                          label: t("normal"),
                          value: true,
                        },
                      ]}
                    />
                  </Form.Item>
                  <Form.Item>
                    {opt.map((o) => (
                      <Tag.CheckableTag
                        checked={checked.indexOf(o.value) > -1}
                        key={o.value}
                        onChange={(e) => {
                          if (e) {
                            setChecked([
                              ...checked.filter((c) => c != o.value),
                              o.value,
                            ]);
                          } else {
                            setChecked([
                              ...checked.filter((c) => c != o.value),
                            ]);
                          }
                        }}
                      >
                        {o.label}
                      </Tag.CheckableTag>
                    ))}
                  </Form.Item>
                  <Form.Item label={t("title")}>
                    <Input />
                  </Form.Item>
                  <Form.Item label={t("desc")}>
                    <div ref={quillRef}></div>
                    {/* <Input.TextArea /> */}
                  </Form.Item>
                  <Form.Item label={t("headOffice")}>
                    <Select />
                  </Form.Item>
                  <Form.Item label={t("primaryDomain")}>
                    <InputNumber className="w-full" min={0} defaultValue={5} />
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" htmlType="submit">
                      {t("submit")}
                    </Button>
                  </Form.Item>
                </Form>
              </Card>
            </Col>
            <Col span={11}>
              <Card
                type="inner"
                title={t("totalExLimit")}
                extra={<Switch defaultChecked size="small" />}
              >
                <Form>
                  <Form.Item>
                    <TimePicker.RangePicker format={"HH:mm"} />
                  </Form.Item>
                  <Form.Item>
                    <Input.TextArea />
                  </Form.Item>
                  <Form.Item>
                    <Button color="danger" variant="outlined">
                      {t("delete")}
                    </Button>
                  </Form.Item>
                </Form>
              </Card>
              <Card
                type="inner"
                title={t("totalReLimit")}
                extra={<Switch defaultChecked size="small" />}
              >
                <Form>
                  <Form.Item>
                    <TimePicker.RangePicker format={"HH:mm"} />
                  </Form.Item>
                  <Form.Item>
                    <Input.TextArea />
                  </Form.Item>
                  <Form.Item>
                    <Button color="danger" variant="outlined">
                      {t("delete")}
                    </Button>
                  </Form.Item>
                </Form>
              </Card>
              <Card
                type="inner"
                title={t("userExLimit")}
                extra={<Switch defaultChecked size="small" />}
              >
                <Form>
                  <Form.Item>
                    <TimePicker.RangePicker format={"HH:mm"} />
                  </Form.Item>
                  <Form.Item>
                    <Input.TextArea />
                  </Form.Item>
                  <Form.Item>
                    <Button color="danger" variant="outlined">
                      {t("delete")}
                    </Button>
                  </Form.Item>
                </Form>
              </Card>
              <Card
                type="inner"
                title={t("userReLimit")}
                extra={<Switch defaultChecked size="small" />}
              >
                <Form>
                  <Form.Item>
                    <TimePicker.RangePicker format={"HH:mm"} />
                  </Form.Item>
                  <Form.Item>
                    <Input.TextArea />
                  </Form.Item>
                  <Form.Item>
                    <Button color="danger" variant="outlined">
                      {t("delete")}
                    </Button>
                  </Form.Item>
                </Form>
              </Card>
            </Col>
          </Row>
        </Card>
      </Content>
    </Layout>
  );
};

export default SiteSettingPage;
