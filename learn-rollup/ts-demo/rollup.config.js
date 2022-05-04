import { babel } from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import { terser } from "rollup-plugin-terser";
import typescript from "@rollup/plugin-typescript";

const DEFAULT_EXTENSION = [".tsx", ".ts", ".jsx", ".js"];

export default {
  input: "./src/index.ts",
  output: {
    file: "./dist/index.js",
    format: "cjs",
    sourcemap: true,
  },
  plugins: [
    resolve(),
    typescript({
      jsx: "react",
    }),
    babel({
      exclude: "node_modules/**",
      runtimeHelpers: true
    }),
    commonjs(),
    terser(),
  ],
  external: ["react", "react-dom", "lodash"],
};
