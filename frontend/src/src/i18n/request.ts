import { backendURL } from "@/api";
import { getUserLocale } from "@/services/locale";
import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async ({ locale }) => {
  // Provide a static locale, fetch a user setting,
  // read from `cookies()`, `headers()`, etc.
  const lang = locale ?? (await getUserLocale());
  console.log({ backendURL }, `${backendURL}/lang/${lang}.json`);
  const res = await fetch(`${backendURL}/lang/${lang}.json`);
  const data = await res.json();
  console.log(data)
  return {
    locale: lang,
    messages: data,
  };
});
