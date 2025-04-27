export type Locale = string; //(typeof locales)[number];

export const locales = ["en", "cn"] as const;
export const defaultLocale: Locale = "en";
