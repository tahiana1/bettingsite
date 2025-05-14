"use client";
import React, { useEffect, useState } from "react";

import {
  Layout,
  Space,
  Card,
  Table,
  Button,
  Popconfirm,
  Modal,
  InputNumber,
  Input,
  Form,
  Switch,
} from "antd";
import type { TableProps } from "antd";

import { Content } from "antd/es/layout/layout";
import { useFormatter, useTranslations } from "next-intl";
import { useMutation, useQuery } from "@apollo/client";
import { BiPencil, BiSave, BiTrash, BiX } from "react-icons/bi";
import { parseTableOptions } from "@/lib";
import { ColumnType } from "antd/es/table";
import {
  CREATE_SMS_API,
  DELETE_SMS_API,
  FILTER_SMS_API,
  UPDATE_SMS_API,
} from "@/actions/sms_api";

type EditableColumnType<T> = ColumnType<T> & {
  editable?: boolean;
};

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: "number" | "text";
  record: SmsApi;
  index: number;
}

const EditableCell: React.FC<React.PropsWithChildren<EditableCellProps>> = ({
  editing,
  dataIndex,
  title,
  inputType,
  children,
  ...restProps
}) => {
  const inputNode = inputType === "number" ? <InputNumber /> : <Input />;

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const SMSSettingPage: React.FC = () => {
  const t = useTranslations();
  const f = useFormatter();
  const [tableOptions, setTableOptions] = useState<any>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [, contextHolder] = Modal.useModal();
  const [total, setTotal] = useState<number>(0);
  const [smsApis, setSmsApis] = useState<any[]>([]);
  const { loading, data, refetch } = useQuery(FILTER_SMS_API);
  const [deleteSmsApi] = useMutation(DELETE_SMS_API);
  const [updateSmsApi] = useMutation(UPDATE_SMS_API);
  const [createSmsApi, { loading: loadingCreate }] =
    useMutation(CREATE_SMS_API);
  const onDeleteSmsApi = (r: SmsApi) => {
    deleteSmsApi({
      variables: {
        id: r.id,
      },
    }).then(() => {
      refetch(tableOptions);
    });
  };

  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState("");

  const isEditing = (record: SmsApi) => record.key === editingKey;

  const edit = (record: Partial<SmsApi> & { key: React.Key }) => {
    form.setFieldsValue(record);
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey("");
  };

  const save = async (key: React.Key) => {
    try {
      const row = (await form.validateFields()) as SmsApi;
      updateSmsApi({
        variables: {
          id: key,
          input: row,
        },
      }).then(() => {
        refetch(tableOptions);
        setEditingKey("");
      });
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const columns: EditableColumnType<SmsApi>[] = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      fixed: "left",
    },
    {
      title: t("company"),
      dataIndex: "name",
      key: "name",
      render(v: string) {
        return v;
      },
      editable: true,
    },
    {
      title: t("url"),
      dataIndex: "url",
      key: "url",
      render(v: string) {
        return v;
      },
      editable: true,
    },
    {
      title: t("agent"),
      dataIndex: "agent",
      key: "agent",
      render(v: string) {
        return v;
      },
      editable: true,
    },
    {
      title: t("password"),
      dataIndex: "password",
      key: "password",
      render(v: string) {
        return v;
      },
      editable: true,
    },
    {
      title: t("token"),
      dataIndex: "token",
      key: "token",
      render(v: string) {
        return v;
      },
      editable: true,
    },
    {
      title: t("orderNum"),
      dataIndex: "orderNum",
      key: "orderNum",
      editable: true,
      width: 50,
      render: (v: number) => v,
    },
    {
      title: t("createdAt"),
      dataIndex: "createdAt",
      key: "createdAt",
      width: 100,
      render: (text: string) =>
        text ? f.dateTime(new Date(text) ?? null) : "",
    },
    {
      title: t("action"),
      key: "action",
      fixed: "right",
      width: 80,
      render: (_: any, record: SmsApi) => {
        const editable = isEditing(record);
        return editable ? (
          <Space>
            <Button
              type="primary"
              icon={<BiSave />}
              onClick={() => save(record.key)}
            />

            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <Button icon={<BiX />} variant="filled" color="gold" />
            </Popconfirm>
          </Space>
        ) : (
          <Space>
            <Button
              icon={<BiPencil />}
              color="green"
              variant="outlined"
              disabled={editingKey !== ""}
              onClick={() => edit(record)}
            />

            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <Button
                color="danger"
                variant="outlined"
                icon={<BiTrash />}
                onClick={() => onDeleteSmsApi(record)}
              />
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  const mergedColumns: ColumnType<SmsApi>[] = columns.map((col) => {
    if (!col.editable) {
      return col as ColumnType<SmsApi>;
    }
    return {
      ...col,
      onCell: (record: SmsApi) => ({
        record,
        inputType: col.dataIndex === "orderNum" ? "number" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    } as ColumnType<SmsApi>;
  });

  const onChange: TableProps<SmsApi>["onChange"] = (
    pagination,
    filters,
    sorter,
    extra
  ) => {
    setTableOptions(parseTableOptions(pagination, filters, sorter, extra));
  };

  const onCancelNew = () => {
    setOpen(false);
  };

  const onCreate = (evt: SmsApi) => {
    const newSmsApi = {
      name: evt.name,
      orderNum: evt.orderNum,
      status: evt.status,
    };

    createSmsApi({ variables: { input: newSmsApi } })
      .then(() => {
        refetch();
        setOpen(false);
      })
      .catch((err) => {
        console.log({ err });
      });
  };
  useEffect(() => {
    console.log({ data });
    setSmsApis(
      data?.response?.smsApis?.map((u: any) => {
        return { ...u, key: u.id };
      }) ?? []
    );
    setTotal(data?.response?.total);
  }, [data]);

  useEffect(() => {
    refetch(tableOptions ?? undefined);
  }, [tableOptions]);
  return (
    <Layout>
      {contextHolder}
      <Content className="overflow-auto h-[calc(100vh-100px)] dark:bg-black">
        <Card
          title={t("admin/menu/smsAPISetting")}
          classNames={{
            body: "!p-0",
          }}
          extra={
            <Button type="primary" onClick={() => setOpen(true)}>
              {t("new")}
            </Button>
          }
        >
          <Form form={form} component={false}>
            <Table<SmsApi>
              components={{
                body: { cell: EditableCell },
              }}
              columns={mergedColumns}
              loading={loading}
              dataSource={smsApis ?? []}
              className="w-full"
              size="small"
              scroll={{ x: "max-content" }}
              onChange={onChange}
              rowClassName="editable-row"
              pagination={{
                showTotal(total, range) {
                  return t("paginationLabel", {
                    from: range[0],
                    to: range[1],
                    total,
                  });
                },
                total: total,
                showSizeChanger: true,
                defaultPageSize: 25,
                pageSizeOptions: [25, 50, 100, 250, 500, 1000],
              }}
            />
          </Form>
        </Card>

        <Modal
          open={open}
          title={t("new")}
          footer={false}
          onCancel={onCancelNew}
        >
          <Form
            name="newForm"
            layout="vertical"
            clearOnDestroy
            onFinish={onCreate}
          >
            <Form.Item name="name" label={t("title")}>
              <Input />
            </Form.Item>
            <Form.Item name="url" label={t("url")}>
              <Input />
            </Form.Item>
            <Form.Item name="agent" label={t("agent")}>
              <Input />
            </Form.Item>
            <Form.Item name="password" label={t("password")}>
              <Input />
            </Form.Item>
            <Form.Item name="token" label={t("token")}>
              <Input />
            </Form.Item>
            <Form.Item name="status" label={t("status")}>
              <Switch />
            </Form.Item>
            <Form.Item name="orderNum" label={t("orderNum")}>
              <InputNumber />
            </Form.Item>
            <Form.Item>
              <Button htmlType="submit" type="primary" loading={loadingCreate}>
                {t("submit")}
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </Content>
    </Layout>
  );
};

export default SMSSettingPage;
