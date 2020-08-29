const { merge } = require("webpack-merge");
const common = require("./webpack.config.js");
const path = require("path");
const getFilePath = require("./dirConfig");
const clientPath = path.resolve(__dirname, "../src/client");

const fileList = getFilePath(clientPath);
console.log(fileList);

module.exports = merge(common, {
  mode: "development",
  entry: fileList,
  output: {
    path: path.resolve(__dirname, "../dist"),
    filename: "[name].[chunkhash].js",
  },
  devServer: {
    contentBase: path.resolve(__dirname, "../dist"),
  },
});
