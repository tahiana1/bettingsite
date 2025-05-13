"use client";
import React, { useEffect, useState } from "react";

import {
  Layout,
  Space,
  Card,
  Table,
  Button,
  Popconfirm,
  Input,
  Switch,
  Modal,
  Form,
  InputNumber,
  notification,
  Select,
} from "antd";
import { FilterDropdown } from "@refinedev/antd";
import type { TableProps } from "antd";

import { Content } from "antd/es/layout/layout";

import { useFormatter, useTranslations } from "next-intl";
import { useMutation, useQuery } from "@apollo/client";
import { BiEdit, BiTrash } from "react-icons/bi";

import { parseTableOptions } from "@/lib";
import {
  CREATE_MENU,
  DELETE_MENU,
  GET_MENUS,
  UPDATE_MENU,
} from "@/actions/menu";

const MenuPage: React.FC = () => {
  const t = useTranslations();
  const f = useFormatter();
  const [tableOptions, setTableOptions] = useState<any>(null);

  const [total, setTotal] = useState<number>(0);
  const [menus, setMenus] = useState<any[]>([]);
  const [pMenus, setPMenus] = useState<any[]>([]);

  const {
    loading: loadingParent,
    data: pData,
    refetch: refetchParent,
  } = useQuery(GET_MENUS);

  const { loading, data, refetch } = useQuery(GET_MENUS);

  const [notiAPI, context] = notification.useNotification();

  const [updateMenu, { loading: loadingUpdate }] = useMutation(UPDATE_MENU);
  const [createMenu, { loading: loadingCreate }] = useMutation(CREATE_MENU);
  const [deleteMenu, { loading: loadingDelete }] = useMutation(DELETE_MENU);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const [currentMenu, setCurrentMenu] = useState<Menu | null>(null);

  const onStatusChange = (ann: Menu, checked: boolean) => {
    updateMenu({
      variables: {
        id: ann.id,
        input: {
          status: checked,
        },
      },
    }).then((result) => {
      console.log({ result });
    });
  };

  const onCreate = (m: Menu) => {
    const newMenu = {
      key: m.key,
      label: m.label,
      description: m.description,
      status: m.status,
      orderNum: m.orderNum,
    };
    createMenu({ variables: { input: newMenu } })
      .then((res) => {
        if (res.data?.success) {
        }
        refetch();
        setOpen(false);
      })
      .catch((err) => {
        console.log({ err });
        notiAPI.error({
          message: err.message,
        });
      });
  };

  const onUpdate = (m: Menu) => {
    const update = {
      key: m.key,
      label: m.label,
      description: m.description,
      orderNum: m.orderNum,
      status: m.status,
    };
    updateMenu({
      variables: {
        id: currentMenu!.id,
        input: update,
      },
    }).then(() => {
      setEditOpen(false);
      refetch(tableOptions);
    });
  };

  const onEdit = (ibx: Menu) => {
    console.log("Received values of form: ", ibx);
    setCurrentMenu(ibx);
    setEditOpen(true);
  };

  const onCancelEdit = () => {
    setCurrentMenu(null);
    setEditOpen(false);
  };

  const onCancelNew = () => {
    setOpen(false);
  };

  const onDeleteMenu = (noti: Menu) => {
    deleteMenu({ variables: { id: noti.id } })
      .then((res) => {
        if (res.data?.success) {
        }
        refetch(tableOptions);
      })
      .catch((err) => {
        console.log({ err });
      });
  };

  const onChange: TableProps<Menu>["onChange"] = (
    pagination,
    filters,
    sorter,
    extra
  ) => {
    setTableOptions(parseTableOptions(pagination, filters, sorter, extra));
  };

  const onSearchParent = (value: string) => {
    if (value) {
      refetchParent({
        filters: [
          {
            field: "userid",
            value: value,
            op: "like",
          },
        ],
      });
    }
  };
  const columns: TableProps<Menu>["columns"] = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: t("label"),
      dataIndex: "label",
      key: "label",
      filterDropdown: (props) => (
        <FilterDropdown {...props}>
          <Input className="w-full" />
        </FilterDropdown>
      ),
    },
    {
      title: t("desc"),
      dataIndex: "description",
      key: "description",
      filterDropdown: (props) => (
        <FilterDropdown {...props}>
          <Input className="w-full" />
        </FilterDropdown>
      ),
    },
    {
      title: t("icon"),
      dataIndex: "icon",
      key: "icon",
      render: (text) => <span className={"icon-" + text}></span>,
    },
    {
      title: t("createdAt"),
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => (text ? f.dateTime(new Date(text) ?? null) : ""),
    },
    {
      title: t("status"),
      dataIndex: "status",
      key: "status",
      render: (text, record) => (
        <Switch
          size="small"
          defaultChecked={text}
          onChange={(checked) => onStatusChange(record, checked)}
        ></Switch>
      ),
    },
    {
      title: t("orderNum"),
      dataIndex: "orderNum",
      key: "orderNum",
    },
    {
      title: t("action"),
      key: "action",
      fixed: "right",
      render: (_, record) => (
        <Space.Compact size="small" className="gap-2">
          <Button
            title={t("edit")}
            variant="outlined"
            color="green"
            icon={<BiEdit />}
            onClick={() => onEdit(record)}
          />
          <Popconfirm
            title={t("confirmSure")}
            onConfirm={() => onDeleteMenu(record)}
            description={t("deleteMessage")}
          >
            <Button
              title={t("delete")}
              loading={loadingDelete}
              variant="outlined"
              color="danger"
              icon={<BiTrash />}
            />
          </Popconfirm>
        </Space.Compact>
      ),
    },
  ];

  useEffect(() => {
    setMenus(
      data?.response?.menus?.map((u: any) => {
        return { ...u, key: u.id };
      }) ?? []
    );
    setTotal(data?.response?.total);
  }, [data]);

  useEffect(() => {
    if (pData) {
      console.log({ pData });
      setPMenus(
        pData?.response?.menus?.map((m: Menu) => ({
          label: m.label,
          value: m.id,
        }))
      );
    }
  }, [pData]);

  useEffect(() => {
    console.log({ tableOptions });
    refetch(tableOptions ?? undefined);
  }, [tableOptions]);

  return (
    <Layout>
      {context}
      <Content className="overflow-auto h-[calc(100vh-100px)] dark:bg-black">
        <Card
          title={t("admin/menu/menuSetting")}
          classNames={{
            body: "!p-0",
          }}
          /* extra={
            <Button
              type="primary"
              size="small"
              onClick={showModal}
              icon={<PiPlus />}
              key={"new"}
            >
              {t("new")}
            </Button>
          } */
        >
          <Table<Menu>
            columns={columns}
            loading={loading}
            dataSource={menus ?? []}
            className="w-full"
            size="small"
            scroll={{ x: "max-content" }}
            onChange={onChange}
            pagination={{
              showTotal(total, range) {
                return t(`paginationLabel`, {
                  from: range[0],
                  to: range[1],
                  total: total,
                });
              },
              total: total,
              showSizeChanger: true,
              pageSizeOptions: [10, 20, 50],
            }}
          />
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
              <Form.Item name="userId" label={t("recipient")}>
                <Select
                  showSearch
                  // style={{ width: 200 }}
                  // placeholder="Search Recipient"
                  optionFilterProp="label"
                  onSearch={onSearchParent}
                  loading={loadingParent}
                  options={pMenus}
                />
              </Form.Item>
              <Form.Item name="title" label={t("title")}>
                <Input />
              </Form.Item>
              <Form.Item name="description" label={t("desc")}>
                <Input.TextArea />
              </Form.Item>
              <Form.Item name="status" label={t("status")}>
                <Switch />
              </Form.Item>
              <Form.Item name="orderNum" label={t("orderNum")}>
                <InputNumber />
              </Form.Item>
              <Form.Item>
                <Button htmlType="submit" loading={loadingCreate}>
                  {t("submit")}
                </Button>
              </Form.Item>
            </Form>
          </Modal>

          <Modal
            title={t("edit")}
            open={editOpen}
            footer={false}
            onCancel={onCancelEdit}
            destroyOnClose
          >
            <Form
              name="editForm"
              layout="vertical"
              initialValues={currentMenu ?? {}}
              onFinish={onUpdate}
            >
              <Form.Item name="parentId" label={t("parentMenu")}>
                <Select
                  showSearch
                  style={{ width: 200 }}
                  placeholder={t("search")}
                  optionFilterProp="label"
                  onSearch={onSearchParent}
                  loading={loadingParent}
                  options={pMenus}
                />
              </Form.Item>
              <Form.Item name="label" label={t("label")}>
                <Input />
              </Form.Item>
              <Form.Item name="description" label={t("desc")}>
                <Input.TextArea />
              </Form.Item>
              <Form.Item name="status" label={t("status")}>
                <Switch />
              </Form.Item>
              <Form.Item name="orderNum" label={t("orderNum")}>
                <InputNumber />
              </Form.Item>
              <Form.Item>
                <Button htmlType="submit" loading={loadingUpdate}>
                  {t("submit")}
                </Button>
              </Form.Item>
            </Form>
          </Modal>
        </Card>
      </Content>
    </Layout>
  );
};

export default MenuPage;
