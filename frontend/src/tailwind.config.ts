import type { Config } from "tailwindcss";
const config: Config = {
  // important: true,
  // darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    markdownBase: {
      wrapperClass: "content",
    },
    extend: {
      fontSize: {
        base: ["16px", { lineHeight: "1.5" }],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      typography: () => ({
        DEFAULT: {
          css: {
            pre: {
              padding: "0 !important",
              margin: "0 !important",
            },
            maxWidth: "105ch",
          },
        },
      }),
    },
    screens: {
      xs: "0px", // Not used by AntD directly, but keeps Tailwind happy
      sm: "576px",
      md: "768px",
      lg: "992px",
      xl: "1200px",
      xxl: "1600px",
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
export default config;
