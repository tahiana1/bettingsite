// import { message } from "antd";
import axios, { AxiosError, AxiosRequestConfig } from "axios";

let host = process.env.NEXT_PUBLIC_API_ADDR;
let isSSL = "";
if (typeof window !== "undefined") {
  host = window?.location.hostname;
  if (location?.protocol === "https") {
    isSSL = "s";
  }
}
export const baseURL = `/api/v1/`; // `http://${host}:${process.env.NEXT_PUBLIC_API_PORT}/api/v1`;
export const wsURL = `ws${isSSL}://${host}:${process.env.NEXT_PUBLIC_API_PORT}/ws`;

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
      const response = err?.response?.data as any;
      console.log({ response });
      // message.error(
      //   response?.title ?? "ERROR",
      //   response?.message ?? err.message ?? "Unknown error occurred."
      // );
      throw JSON.stringify(response);
    });
}
