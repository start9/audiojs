module.exports = {

    resolveLoader: {
        root: __dirname + '/node_modules/'
    },

    resolve: {
        extensions: [ '', '.js' ],
        root: __dirname,
        alias: {
            'audiojs': __dirname + '/sources/'
        }
    },

    entry: {
        'main': [
            'audiojs/index'
        ]
    },

    output: {
        path: __dirname + '/build/',
        library: 'Audiojs',
        libraryTarget: 'umd2',
        filename: '[name].js',
        chunkFilename: '[id].js'
    },

    module: {
        loaders: [ {
            test: /\.js$/,
            loader: 'babel-loader',
            include: __dirname + '/sources'
        } ]
    }

};
