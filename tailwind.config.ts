import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/drophp/**/*.{html,js, jsx,ts,tsx}",
  ],
  theme: {
    // colors: {
    //   Primary: "var(--color-Primary)",
    //   secondary: "var(--color-secondary)",
    //   success: "var(--color-success)",
    //   warning: "var(--color-warning)",
    //   danger: "var(--color-danger)",
    //   black: "var(--color-black)",
    //   "black-light": "var(--color-black-light)",
    //   blue: "var(--color-blue)",
    //   "blue-light": "var(--color-blue-light)",
    //   "blue-prime": "var(--color-blue-prime)",
    //   "blue-dark": "var(--color-blue-dark)",
    //   purple: "var(--color-purple)",
    //   tableGray: "var(--color-tableGray)",
    //   disable: "var(--color-disable)",
    //   loaderBg: "var(--color-loaderBg)",
    //   loader: "var(--color-loader)",
    //   amber: "var(--color-amber)",
    //   white: "var(--color-white)",
    //   gray: "var(--color-gray)",
    //   "gray-dark": "var(--color-gray-dark)",
    //   "grey-light": "var(--color-grey-light)",
    //   red: "var(--color-red)",
    //   texts: "var(--color-texts)",
    //   loading: "var(--color-loading)",
    // },
    // screens: {
    //   xxs: "400px",
    //   sm: "640px",
    //   md: "768px",
    //   lg: "1024px",
    //   xl: "1280px",
    // },
    extend: {},
  },
  plugins: [],
};
export default config;
