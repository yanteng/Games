const merge = require('webpack-merge')
const baseConfig = require('./base.config.js')

module.exports = merge(baseConfig, {
    devtool: 'cheap-module-source-map',
    devServer: {
        contentBase: "../dist",
    },
})