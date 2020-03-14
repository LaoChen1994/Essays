const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const path = require("path");

module.exports = {
  mode: "development",
  entry: {
    index: path.resolve(__dirname, "./src/index.js")
  },
  devtool: "cheap-module-eval-source-map",
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "[name].[hash].js"
  },
  module: {
    rules: [
      {
        test: /\.jsx?/,
        use: "babel-loader"
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: "index.html"
    }),
    new CleanWebpackPlugin()
  ]
};
