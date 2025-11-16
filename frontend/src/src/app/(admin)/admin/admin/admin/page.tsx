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
  Radio,
  Select,
  Modal,
  Form,
  Switch,
} from "antd";
import { FilterDropdown } from "@refinedev/antd";
import type { TableProps } from "antd";

import { Content } from "antd/es/layout/layout";
import { useFormatter, useTranslations } from "next-intl";
import { useMutation, useQuery } from "@apollo/client";

import { parseTableOptions } from "@/lib";
import { BiUser } from "react-icons/bi";
import {
  GET_ADMIN_PERMISSIONS,
  UPDATE_ADMIN_PERMISSION,
} from "@/actions/admin_permission";
import dayjs from "dayjs";

const PartnerPage: React.FC = () => {
  const t = useTranslations();
  const f = useFormatter();
  const [tableOptions, setTableOptions] = useState<any>({});

  const [, contextHolder] = Modal.useModal();
  const [total, setTotal] = useState<number>(0);
  const [adminPermissions, setAdminPermissions] = useState<AdminPermission[]>(
    []
  );

  const { loading, data, refetch } = useQuery(GET_ADMIN_PERMISSIONS);
  const [updatePermission] = useMutation(UPDATE_ADMIN_PERMISSION);
  const [colorModal, setColorModal] = useState<boolean>(false);

  const onChange: TableProps<AdminPermission>["onChange"] = (
    pagination,
    filters,
    sorter,
    extra
  ) => {
    setTableOptions(parseTableOptions(pagination, filters, sorter, extra));
  };

  const onChangeSetting = (record: AdminPermission, f: string, v: boolean) => {
    updatePermission({
      variables: {
        id: record.id,
        input: {
          [f]: v,
        },
      },
    });
  };
  const [colorOption, setColorOptoin] = useState<any>("new");
  const onChangeColors = async () => {
    setColorModal(false);
  };

  const columns: TableProps<AdminPermission>["columns"] = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: t("userid"),
      dataIndex: "user.userid",
      key: '"User"."userid"',
      render: (_, { user }) => user.userid,
      filterDropdown: (props) => (
        <FilterDropdown {...props}>
          <Input className="w-full" />
        </FilterDropdown>
      ),
    },
    {
      title: t("membership"),
      key: "membership",
      dataIndex: "membership",
      render(value, record) {
        return (
          <Switch
            size="small"
            defaultChecked={value}
            onChange={(e) => onChangeSetting(record, "membership", e)}
          />
        );
      },
    },
    {
      title: t("settlement"),
      key: "settlement",
      dataIndex: "settlement",
      render(value, record) {
        return (
          <Switch
            size="small"
            defaultChecked={value}
            onChange={(e) => onChangeSetting(record, "settlement", e)}
          />
        );
      },
    },
    {
      title: t("qna"),
      key: "qna",
      dataIndex: "qna",
      render(value, record) {
        return (
          <Switch
            size="small"
            defaultChecked={value}
            onChange={(e) => onChangeSetting(record, "qna", e)}
          />
        );
      },
    },
    {
      title: t("game"),
      key: "game",
      dataIndex: "game",
      render(value, record) {
        return (
          <Switch
            size="small"
            defaultChecked={value}
            onChange={(e) => onChangeSetting(record, "game", e)}
          />
        );
      },
    },
    {
      title: t("sale"),
      key: "sale",
      dataIndex: "sale",
      render(value, record) {
        return (
          <Switch
            size="small"
            defaultChecked={value}
            onChange={(e) => onChangeSetting(record, "sale", e)}
          />
        );
      },
    },
    {
      title: "IP",
      key: "ip",
      dataIndex: "ip",
      render(value, record) {
        return (
          <Switch
            size="small"
            defaultChecked={value}
            onChange={(e) => onChangeSetting(record, "ip", e)}
          />
        );
      },
    },
    {
      title: t("dwdelete"),
      key: "dwdelete",
      dataIndex: "dwdelete",
      render(value, record) {
        return (
          <Switch
            size="small"
            defaultChecked={value}
            onChange={(e) => onChangeSetting(record, "dwdelete", e)}
          />
        );
      },
    },
    {
      title: t("status"),
      key: "status",
      dataIndex: "status",
      render(value, record) {
        return (
          <Switch
            size="small"
            defaultChecked={value}
            onChange={(e) => onChangeSetting(record, "status", e)}
          />
        );
      },
    },
    {
      title: t("createdAt"),
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => (text ? dayjs(text).format("M/D/YYYY HH:mm:ss") : ""),
    },
    {
      title: t("action"),
      key: "action",
      fixed: "right",
      render: () => (
        <Space.Compact size="small" className="gap-2">
          <Popconfirm
            title={t("confirmSure")}
            // onConfirm={}
            description={t("approveMessage")}
          >
            <Button
              title={t("approve")}
              variant="outlined"
              color="blue"
              icon={<BiUser />}
            />
          </Popconfirm>
        </Space.Compact>
      ),
    },
  ];
  useEffect(() => {
    setAdminPermissions(
      data?.response?.adminPermissions?.map((u: any) => {
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
          title={t("admin/menu/admin")}
          classNames={{
            body: "!p-0",
          }}
        >
          <Table<AdminPermission>
            columns={columns}
            loading={loading}
            dataSource={adminPermissions ?? []}
            className="w-full"
            size="small"
            scroll={{ x: "max-content" }}
            onChange={onChange}
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
          <Modal
            open={colorModal}
            onCancel={() => setColorModal(false)}
            onOk={onChangeColors}
          >
            <Space direction="vertical" className="gap-2">
              <Radio.Group
                onChange={(e) => setColorOptoin(e.target.value)}
                className="!flex !flex-col gap-2"
                defaultValue={"new"}
              >
                <Radio value={"new"}>New Search Criteria</Radio>
                {colorOption == "new" ? (
                  <Form.Item>
                    <Input />
                  </Form.Item>
                ) : null}
                <Radio value={"list"}>
                  Apply the member list search conditions as is:
                </Radio>
                {colorOption == "list" ? (
                  <Form.Item>
                    <Select />
                  </Form.Item>
                ) : null}
              </Radio.Group>
              <Form.Item label="Change Color">
                <Select />
              </Form.Item>
            </Space>
          </Modal>
        </Card>
      </Content>
    </Layout>
  );
};

export default PartnerPage;
