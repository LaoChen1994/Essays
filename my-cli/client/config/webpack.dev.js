const { merge } = require('webpack-merge')
const commonConfig = require('./webpack.common')
process.env.NODE_ENV = 'development'

module.exports = merge(commonConfig, {
    mode: 'development',
    watch: true,
    watchOptions: {
        ignored: /node_modules/,
        poll: 500,
        aggregateTimeout: 500
    },
    cache: true,
    devtool: 'source-map'
})

