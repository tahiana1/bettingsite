// "use server";

import axios from "axios";

export const getData = () => {
  console.log(process.env.NEXT_PUBLIC_API_URL);
  return fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/profile`).then((res) => {
    return res.json();
  });
};

export const parseError = (err: any) => {
  if (axios.isAxiosError(err)) {
    return err.response?.data;
  } else {
    return {
      code: err?.code,
      message: err?.message,
      error: err?.message,
    };
  }
};

export const parseTableOptions: (
  pagination: any,
  filters: any,
  sorter: any,
  extra: any
) => any = (pagination, filters, sorter) => {
  const p = {
    limit: pagination?.pageSize ?? 10,
    offset: pagination.current
      ? (pagination.current - 1) * (pagination.pageSize ?? 10)
      : 0,
  };
  const f = Object.keys(filters)
    .filter((k) => filters[k])
    .map((k) => ({ field: k, value: filters[k], op: "like" }));
  const orders = Array.isArray(sorter)
    ? sorter.map((s) => ({
        field: s.field,
        direction: s.order?.toUpperCase() == "ASCEND" ? "ASC" : "DESC",
      }))
    : sorter.field
    ? [
        {
          field: sorter.field,
          direction: sorter.order?.toUpperCase() == "ASCEND" ? "ASC" : "DESC",
        },
      ]
    : undefined;

  return {
    filters: f,
    pagination: p,
    orders,
  };
};

export const buildTree = (data: any[]) => {
  const map = new Map<any, any>();
  const roots = [];

  // Initialize map
  for (const item of data) {
    map.set(item.key, { ...item, children: [] });
  }

  // Build tree
  for (const item of map.values()) {
    if (item.parentId != null) {
      const parent = map.get(item.parentId);
      if (parent) {
        parent.children!.push(item);
      } else {
        roots.push(item);
      }
    } else {
      roots.push(item);
    }
  }

  return roots;
};

export const isValidDate = (d: any): boolean => {
  return new Date(d).toString() !== "Invalid Date";
};
