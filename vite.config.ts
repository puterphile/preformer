import { defineConfig } from "vite";
import { resolve } from "path";

/** Plugins */
import SWCReactPlugin from "@vitejs/plugin-react-swc";

/** Build */
const lib = {
  name: "preformer",
  fileName: "index",
  entry: resolve(__dirname, "src", "index.ts"),
};

/** Rollup arguments */
const external: string[] = ["vite", "react", "react-dom", "yup"];
const output = {
  globals: {
    react: "react",
    "react-dom": "react-dom",
    yup: "yup",
  },
};

/** Unit testing */
const test = {
  globals: true,
  environment: "jsdom",
  include: ["*/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
};

export default defineConfig({
  build: {
    lib,
    rollupOptions: { external, output },
    emptyOutDir:
      false /** enabling this would cause vite to delete type definition */,
  },
  test,
  plugins: [SWCReactPlugin()],
} as any);
