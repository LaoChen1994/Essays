const { merge } = require("webpack-merge");
const common = require("./webpack.config.js");
const path = require("path");

module.exports = merge(common, {
  target: "node",
  entry: path.resolve(__dirname, "../src/server/index.ts"),
  output: {
    path: path.resolve(__dirname, "../local"),
    filename: "server.js",
  },
  node: {
    console: true,
    process: true,
    global: true,
    Buffer: true,
    __filename: true,
    __dirname: true,
  },
  mode: "development",
});
