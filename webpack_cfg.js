const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const webpackMerge = require('webpack-merge');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CssSplitWebpackPlugin = require('css-split-webpack-plugin').default;
const dev = require('./webpack.dev');
const prod = require('./webpack.prod');
const theme = require('./theme');
const readdir = fs.readdirSync('./tpl');

const alias = require('./alias')

const NODE_ENV = process.env.NODE_ENV;
//是否是生产环境构建
const ENV_PROD = NODE_ENV === 'production';

const config = ENV_PROD ? prod : dev;

const baseExtractText = new  MiniCssExtractPlugin({
    filename: 'static/style/[name].[contenthash:20].base.css',
    // allChunks:true
});
const pageExtractText = new  MiniCssExtractPlugin({
    filename: 'static/style/[name].[chunkhash:20].css',
    // allChunks:true
});

//由于IE9-下面对单个css文件有选择器数量限制（4095个），以及大小限制（280kb），因此需要将css拆分
const cssSplit = new CssSplitWebpackPlugin({
    size: 2000,
    filename: 'static/style/[name].[part].css'
})

let plugins = [
    baseExtractText,
    pageExtractText,
    cssSplit,
    // new webpack.optimize.CommonsChunkPlugin({
    //     name: 'common',
    //     minChunks: function(module) {
    //         return (
    //             module.resource &&
    //             /\.js$/.test(module.resource) &&
    //             module.resource.indexOf(
    //                 path.join(__dirname, './node_modules')
    //             ) === 0
    //         )
    //     }
    // }),
    new CopyWebpackPlugin([{
        from: __dirname + '/static',
        to: __dirname + '/dist/static'
    }, {
        from: __dirname + '/html/',
        to: __dirname + '/dist/'
    }])
]

let entrys = {};

readdir.forEach(function(val) {
    if (/\.ejs$/.test(val)) {
        let name = val.replace(/\.ejs$/, '');
        if (config.entry === '*' || config.entry === name || config.entry.includes(name)) {
            let filename = `./${name}.html`
            let template = `./tpl/${val}`
            entrys[name] = [
                'raf/polyfill',
                '@babel/polyfill',
                `./src/${name + (name === 'platform' ? '/index.ts' : '')}`
            ]

            plugins.push(
                new HTMLWebpackPlugin({
                    filename: filename,
                    template: template,
                    chunks: [name, 'common'],
                    minify: {
                        //移除空白
                        collapseWhitespace: true,
                        //压缩css
                        minifyCSS: true,
                        //压缩js
                        minifyJS: true
                    }
                })
            )
        }
    }
})

module.exports = webpackMerge(config, {
    entry: entrys,
    plugins: plugins,
    resolve: {
        extensions: [
            '.ts',
            '.tsx',
            '.js',
            '.jsx',
            '.json',
            '.less',
            '.css'
        ]
    },
    optimization: {
        splitChunks: {
            chunks: 'all',                              //'all'|'async'|'initial'(全部|按需加载|初始加载)的chunks
            cacheGroups: {
                // 抽离第三方插件
                vendor: {
                    test: /node_modules/,            //指定是node_modules下的第三方包
                    chunks: 'all',
                    name: 'vendor',                  //打包后的文件名，任意命名
                    priority: 10,                    //设置优先级，防止和自定义公共代码提取时被覆盖，不进行打包
                    },
            }
        },
        //提取webpack运行时的代码
        runtimeChunk: {                              
            name: 'manifest'
        }
    },
    
    module: {
        rules: [{
            test: /\.(t|j)sx?$/,
            exclude: /node_modules/,
            use: [{
                loader: 'babel-loader'
            }]
        },
        {
            test: /\.js$/,
            use: [{
                loader: 'nui-loader',
                options: {
                    paths: {
                        'public': 'src/public',
                        'platform': 'src/platform'
                    },
                    alias: alias
                }
            }]
        },
        {
            test: /\.less$/,
            include: /node_modules|public/,
            use: [
                MiniCssExtractPlugin.loader,

                {
                  loader:'css-loader',
                  options:{
                    minimize:ENV_PROD
                  }
                }, {
                  loader:'less-loader',
                  options:{
                    javascriptEnabled:true,
                    modifyVars:theme
                  }
                }]
        },
        {
            test: /\.less$/,
            exclude: /node_modules|public/,
            use: [
                {
                  loader:'css-loader',
                  options:{
                    minimize:ENV_PROD
                  }
                }, {
                  loader:'less-loader',
                  options:{
                    javascriptEnabled:true,
                    modifyVars:theme
                  }
                }]
        },
        {
            test: /\.(svg|ttf|woff|eot)(\?.*)?$/,
            use: [{
                loader: 'file-loader',
                options: {
                    name: '[name].[hash:7].[ext]',
                    publicPath: '/static/font/',
                    outputPath: 'static/font/'
                }
            }]
        },
        {
            test: /\.(png|jpe?g|gif)(\?.*)?$/,
            use: [{
                loader: 'file-loader',
                options: {
                    name: '[name].[hash:7].[ext]',
                    publicPath: '/static/images/',
                    outputPath: 'static/images/'
                }
            }]
        },
        {
            test: /\.html?$/,
            use: [{
                loader: 'html-loader'
            }]
        }]
    },
    //由于发布是不停机发布，目前所有菜单模块都是按需加载的，如果用户在点击某个菜单前，刚好发布完，那可能点击这个菜单模块的js服务器已经不存在了，所以可能会出现点击菜单报错问题
    //因此文件名不能以name.chunkHash.js形式，改用版本号可以解决这个问题
    output: {
        filename: 'static/script/[name].js?_=[chunkHash:7]',
        publicPath: '/',
        path: path.resolve(__dirname, './dist')
    }
})
