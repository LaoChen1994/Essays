import commonjs from "rollup-plugin-commonjs";
import { nodeResolve } from '@rollup/plugin-node-resolve'
import { babel } from '@rollup/plugin-babel'

export default {
  input: "./src/index.js",
  output: {
    file: "./dist/index.js",
    format: "cjs",
  },
  plugins: [
    commonjs(),
    nodeResolve(),
    babel({
      presets: [
        '@babel/preset-env',
      ]
    })
  ],
};
