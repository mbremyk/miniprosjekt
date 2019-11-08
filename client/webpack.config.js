module.exports = {
    entry: './app/index.js',
    output: {path: './app', filename: 'bundle.js'},
    devServer: {inline: true, contentBase: './app', port: 8100},
    module: {loaders: [{test: /\.js$/, exclude: /node_modules/, loader: 'babel'}]}
};