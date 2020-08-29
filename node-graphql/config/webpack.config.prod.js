const { merge } = require("webpack-merge");
const common = require("./webpack.config");
const path = require("path");
const getFilePath = require("./dirConfig");

const clientPath = path.resolve(__dirname, "../src/client");
const fileList = getFilePath(clientPath);

module.exports = merge(common, {
  entry: fileList,
  output: {
    path: path.resolve(__dirname, "../dist"),
    filename: "[name].[hash].js",
  },
  mode: "production",
  optimization: {
    splitChunks: {
      chunks: "all",
    },
  },
});
