import path from 'path'
import webpack from 'webpack'
import glob from 'glob'
import fs from 'fs-extra'
import CopyWebpackPlugin from 'copy-webpack-plugin'
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

export function generateConfigSettings(baseDir: string, entryObject:any, copyCfgList: any[]) {
    const entryPathList = glob.sync(path.join(baseDir, '../src/dicts/**/index.ts'))
    //词库插件打包
    for (const entryItem of entryPathList) {
        const nameList = entryItem.split('/')
        nameList.pop()
        const pluginName = nameList.pop()
        const parentName = nameList.pop()
        if (parentName === 'base') {
            continue
        }
        entryObject[`${pluginName}/index`] = entryItem

        const cfgFilePath = path.join(baseDir, `../src/dicts/${pluginName}/*.json`)
        const cfgFileList = glob.sync(cfgFilePath)

        if (cfgFileList.length > 0) {
            copyCfgList.push({
                from: cfgFilePath,
                to: path.resolve(baseDir, `../dist/${pluginName}/[name].[ext]`),
            })
        }

        const dictJsPath = path.join(baseDir, `../src/dicts/${pluginName}/dict.js`)
        if (fs.existsSync(dictJsPath)) {
            copyCfgList.push({
                from: dictJsPath,
                to: path.resolve(baseDir, `../dist/${pluginName}/[name].[ext]`),
            })
        } else {
            //可能dict.js在base里
            if (!pluginName.startsWith('trans_') && pluginName.includes('_')) {
                const baseFolder = pluginName.split('_')[0]
                const baseDictJs = path.join(baseDir, `../src/dicts/base/${baseFolder}/dict.js`)
                if (fs.existsSync(baseDictJs)) {
                    copyCfgList.push({
                        from: baseDictJs,
                        to: path.resolve(baseDir, `../dist/${pluginName}/[name].[ext]`),
                    })
                }
            }
        }
    }
}

export function mainConfig(baseDir: string, publicDir: string, entryObject:any, copyCfgList: string[], isAnalyze: boolean): webpack.Configuration  {
    const config: webpack.Configuration = {
        mode: process.env.NODE_ENV === 'development' ? 'development' : 'production',
        entry: entryObject,
        devtool: process.env.NODE_ENV === 'development' ? 'source-map' : false,
        plugins: [
            new webpack.ProgressPlugin(),
            new webpack.LoaderOptionsPlugin({
                minimize: 'development' ? false : true,
            }),
            new CopyWebpackPlugin({
                patterns: copyCfgList,
            }),
            new MiniCssExtractPlugin(),
        ],
        output: {
            filename: '[name].js',
            libraryTarget: 'window',
            path: path.resolve(baseDir, '../dist'),
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: {
                        loader: 'ts-loader',
                    },
                },
                {
                    test: /\.js$/,
                    exclude: [
                        /node_modules/,
                        path.resolve(publicDir, '../src/assets/')
                    ],
                    use: {
                        loader: 'babel-loader',
                    },
                },
                {
                    test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                    use: {
                        loader: 'url-loader',
                    },
                },
                {
                    test: /\.s[ac]ss$/i,
                    use: [
                        MiniCssExtractPlugin.loader,
                        {
                            loader: "css-loader",
                        },
                        'sass-loader',
                        {
                            loader: 'sass-resources-loader',
                            options: {
                                sourceMap: false,
                                resources: [
                                    path.join(publicDir, '../src/_sass_shared/_theme.scss')
                                ]
                            }
                        }
                    ],
                },
            ],
        },
        resolve: {
            extensions: ['.ts', '.js', '.tsx', '.css', '.scss'],
        },
        optimization: {
            noEmitOnErrors: true,
            minimize: process.env.NODE_ENV === 'development' ? false : true,
        }
    }
    if (isAnalyze) {
        config.plugins.push(new BundleAnalyzerPlugin())
    }
    return config
}
