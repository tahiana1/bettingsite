import { getUserLocale } from "@/services/locale";
import { getRequestConfig } from "next-intl/server";

export const backendURL = `http://${process.env.NEXT_PUBLIC_API_ADDR}:${process.env.NEXT_PUBLIC_API_PORT}/api/v1`;

export default getRequestConfig(async ({ locale }) => {
  // Provide a static locale, fetch a user setting,
  // read from `cookies()`, `headers()`, etc.
  const lang = locale ?? (await getUserLocale());
  // console.log(`${backendURL}/lang/${lang}.json`);
  const res = await fetch(`${backendURL}/lang/${lang}.json`);
  const data = await res.json();
  return {
    locale: lang,
    messages: data,
  };
});
