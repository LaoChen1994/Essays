module.exports = {
  css: {
    loaderOptions: {
      postcss: {
        plugins: [
          require("postcss-pxtorem")({
            rootValue: 75,
            minPixelValue: 1,
            unitPrecision: 6,
            propList: ["*"],
          }),
        ],
      },
    },
  },
};
