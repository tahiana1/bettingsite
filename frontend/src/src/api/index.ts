import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { message } from "antd";
let host = process.env.NEXT_PUBLIC_API_ADDR;
let isSSL = "";
if (typeof window !== "undefined") {
  host = window?.location.hostname;
  if (location?.protocol === "https") {
    isSSL = "s";
  }
}
export const baseURL = `/api/v1/`; // `http://${host}:${process.env.NEXT_PUBLIC_PROXY_PORT}/api/v1`;
export const wsURL = `ws${isSSL}://${host}:${process.env.NEXT_PUBLIC_PROXY_PORT}/api/v1/ws`;
export const apolloWSURL = `ws${isSSL}://${host}:${process.env.NEXT_PUBLIC_PROXY_PORT}/api/v1`;

export default function api(url: string, config?: AxiosRequestConfig) {
  const requestURL = url.startsWith("http") ? url : `${baseURL}${url}`;
  return axios(requestURL, {
    ...config,
    headers: {
      Authorization: localStorage.getItem("token"),
      "Content-Type": "application/json",
      ...config?.headers,
    },
  })
    .then((res) => {
      if (res.config.method?.toLowerCase() != "get") {
        // const response = res.data;
        // if (response.title || response.message) {
        //   message.success(response.title ?? "SUCCESS", response.message);
        // }
      }
      return res.data;
    })
    .catch((err: AxiosError) => {
      // message.error(err.message);
      throw err;
    });
}
