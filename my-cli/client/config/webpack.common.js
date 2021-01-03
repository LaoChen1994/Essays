const path = require("path");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: path.resolve(__dirname, "../pages/test/app.tsx"),
  output: {
    filename: "[id].js",
    path: path.resolve(__dirname, "../../local"),
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"],
            },
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env", "@babel/preset-typescript", "@babel/preset-react"],
            },
          },
        ],
        exclude: /node_modules/,
      },
      {
          test: /\.css/,
          use: [
          'style-loader', 
          "css-modules-typescript-loader",
          {
            loader: 'css-loader',
            options: {
              modules: true,
            }
          }],
          exclude: /node_modules/
      }
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].css"
    })
  ],
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  }
};
