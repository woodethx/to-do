const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');

module.exports = merge(common, {
    mode: 'development',
    devtool: "eval-source-map",
    devServer: {
        static: { directory: path.resolve(__dirname, 'dist') },
        port: 8080,
        hot: true,
        liveReload: true,
        watchFiles: ['src/**/*.html', 'src/**/*.css']
    }
  });