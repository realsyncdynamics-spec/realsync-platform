import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/app/**/*.{js,ts,jsx,tsx}", "./src/components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        cyan: {
          400: "#00d4ff",
          500: "#00b8d4",
          600: "#0097a7",
        },
      },
    },
  },
  plugins: [],
};
export default config;
