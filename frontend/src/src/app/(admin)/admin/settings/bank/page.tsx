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
import {
  CREATE_BANK,
  DELETE_BANK,
  FILTER_BANK,
  UPDATE_BANK,
} from "@/actions/bank";
import { ColumnType } from "antd/es/table";

type EditableColumnType<T> = ColumnType<T> & {
  editable?: boolean;
};

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: "number" | "text";
  record: Bank;
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

const BankPage: React.FC = () => {
  const t = useTranslations();
  const f = useFormatter();
  const [tableOptions, setTableOptions] = useState<any>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [, contextHolder] = Modal.useModal();
  const [total, setTotal] = useState<number>(0);
  const [banks, setBanks] = useState<any[]>([]);
  const { loading, data, refetch } = useQuery(FILTER_BANK);
  const [deleteBank] = useMutation(DELETE_BANK);
  const [updateBank] = useMutation(UPDATE_BANK);
  const [createBank, { loading: loadingCreate }] = useMutation(CREATE_BANK);
  const onDeleteBank = (r: Bank) => {
    deleteBank({
      variables: {
        id: r.id,
      },
    }).then(() => {
      refetch(tableOptions);
    });
  };

  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState("");

  const isEditing = (record: Bank) => record.key === editingKey;

  const edit = (record: Partial<Bank> & { key: React.Key }) => {
    form.setFieldsValue(record);
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey("");
  };

  const save = async (key: React.Key) => {
    try {
      const row = (await form.validateFields()) as Bank;
      updateBank({
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

  const columns: EditableColumnType<Bank>[] = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      fixed: "left",
    },
    {
      title: t("name"),
      dataIndex: "name",
      key: "name",
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
      title: t("status"),
      dataIndex: "status",
      key: "status",
      width: 50,
      render: (v: boolean, record: Bank) => (
        <Switch
          checked={v}
          onChange={(checked) => {
            updateBank({
              variables: {
                id: record.id,
                input: { status: checked },
              },
            }).then(() => {
              refetch(tableOptions);
            });
          }}
        />
      ),
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
      render: (_: any, record: Bank) => {
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
                onClick={() => onDeleteBank(record)}
              />
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  const mergedColumns: ColumnType<Bank>[] = columns.map((col) => {
    if (!col.editable) {
      return col as ColumnType<Bank>;
    }
    return {
      ...col,
      onCell: (record: Bank) => ({
        record,
        inputType: col.dataIndex === "orderNum" ? "number" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    } as ColumnType<Bank>;
  });

  const onChange: TableProps<Bank>["onChange"] = (
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

  const onCreate = (evt: Bank) => {
    const newBank = {
      name: evt.name,
      orderNum: evt.orderNum,
      status: evt.status,
    };

    createBank({ variables: { input: newBank } })
      .then(() => {
        refetch();
        setOpen(false);
      })
      .catch((err) => {
        console.log({ err });
      });
  };
  useEffect(() => {
    setBanks(
      data?.response?.banks?.map((u: any) => {
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
          title={t("admin/menu/bankSetting")}
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
            <Table<Bank>
              components={{
                body: { cell: EditableCell },
              }}
              columns={mergedColumns}
              loading={loading}
              dataSource={banks ?? []}
              className="w-full"
              size="small"
              scroll={{ x: "max-content" }}
              onChange={onChange}
              rowClassName="editable-row"
              pagination={{
                showTotal(total, range) {
                  return `${range[0]} to ${range[1]} in Total ${total} `;
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

export default BankPage;
