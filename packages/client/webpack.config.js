const path = require('path');
module.exports = {
    mode: 'development',
    entry: path.resolve(__dirname, 'src/index.js'),
    devtool: 'eval-source-map',
    output: {
        path: path.resolve(__dirname, 'lib'),
        filename: 'turkleton.js',
        publicPath: '/lib/',
    },
    module: {
        rules: [
            {
                test: /.jsx?$/,
                loader: 'babel-loader',
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)$/,
                use: 'url-loader'
            }
        ]
    }
};
