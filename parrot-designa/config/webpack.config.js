'use strict';

const paths = require('./paths');
const modules = require('./modules');
const fs = require('fs');

const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

const imageInlineSizeLimit = parseInt(
    process.env.IMAGE_INLINE_SIZE_LIMIT || '10000'
);


const hasJsxRuntime = (() => {
    if (process.env.DISABLE_NEW_JSX_TRANSFORM === 'true') {
      return false;
    }
  
    try {
      require.resolve('react/jsx-runtime');
      return true;
    } catch (e) {
      return false;
    }
})();

//如果不显示的将GENERATE_SOURCEMAP设置为false
const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false';
const shouldUseReactRefresh = process.env.FAST_REFRESH !== 'false';
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
const sassRegex = /\.(scss|sass)$/;
const sassModuleRegex = /\.module\.(scss|sass)$/;


const webpackDevClientEntry = require.resolve(
    '../utils/webpackHotDevClient'
);
const reactRefreshOverlayEntry = require.resolve(
    '../utils/refreshOverlayInterop'
);

module.exports = function (webpackEnv) {

    const isEnvDevelopment = webpackEnv === 'development';
    const isEnvProduction = webpackEnv === 'production';

    //获取样式加载器的常用函数
    const getStyleLoaders = (cssOptions, preProcessor) => {
        const loaders = [
            isEnvDevelopment && require.resolve('style-loader'),
            isEnvProduction && {
                loader: MiniCssExtractPlugin.loader,
                options: paths.publicUrlOrPath.startsWith(".")
                    ? { publicPath: "../../" }
                    : {}
            },
            {
                loader: require.resolve('css-loader'),
                options: cssOptions
            },
            preProcessor && {
                loader:require.resolve(preProcessor)
            }

        ].filter(Boolean);

        return loaders;
    }

    return {
        cache:false,
        mode: isEnvProduction ? 'production' : isEnvDevelopment && 'development',
        devtool: isEnvProduction
            ? shouldUseSourceMap
                ? 'cheap-module-source-map'
                : false
            : isEnvDevelopment && 'eval-cheap-module-source-map',
        entry:
            isEnvDevelopment && !shouldUseReactRefresh ?
                [
                    paths.appIndexJs
                ]
                : paths.appIndexJs,
        output: {
            path: isEnvProduction ? paths.appBuild : undefined,
            pathinfo: isEnvDevelopment,
            filename: isEnvProduction
                ? 'static/js/[name].[contenthash:8].js'
                : isEnvDevelopment && 'static/js/[name].chunk.bundle.js',
            chunkFilename: isEnvProduction
                ? 'static/js/[name].[contenthash:8].chunk.js'
                : isEnvDevelopment && 'static/js/[name].chunk.js',
            publicPath: paths.publicUrlOrPathFunc(),
            globalObject: 'this',
        },
        resolve: {
            modules: ['node_modules', paths.appNodeModules].concat(
                modules.additionalModulePaths || []
            ),
            extensions: paths.moduleFileExtensions
                .map(ext => `.${ext}`),
            alias: {
                ...(module.webpackAliases || {}),
            }
        },
        module: {
            //将缺失的导出提示成错误而不是警告
            strictExportPresence: true,
            rules: [
                // 禁用 require.ensure
                { parser: { requireEnsure: false } },
                {
                    //one of将遍历以下所有加载器，直到其中一个加载器匹配要求
                    oneOf: [
                        {
                            test: [/\.avif$/],
                            type: 'asset',
                            parser: {
                                dataUrlCondition: {
                                    maxSize: imageInlineSizeLimit // 10kb
                                }
                            },
                            generator: {
                                filename: 'static/[hash][ext][query].[ext]'
                            }
                        },
                        {
                            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
                            type: "asset",
                            parser: {
                                dataUrlCondition: {
                                    maxSize: imageInlineSizeLimit
                                }
                            },
                            generator: {
                                filename: 'static/[hash][ext][query].[ext]'
                            }
                        },
                        {
                            test: /\.(js|mjs|jsx|tsx|ts)$/,
                            include: paths.appSrc,
                          //  exclude: /node_modules/,
                            use: [
                                {
                                    loader: 'babel-loader',
                                    options: {
                                        plugins: [
                                            isEnvDevelopment && require.resolve('react-refresh/babel'),
                                        ].filter(Boolean),
                                    },
                                },
                            ]
                        },
                        {
                            test: cssRegex,
                            exclude: cssModuleRegex,
                            use: getStyleLoaders({
                                //表示当css-loader处理index.scss文件读取到@import语句的时候， 
                                //因为将importLoaders设置为1，那么a.scss和b.scss会被postcss-loader给处理
                                importLoaders: 0,
                                sourceMap: isEnvProduction
                                    ? shouldUseSourceMap
                                    : isEnvDevelopment
                            }),
                            sideEffects: true,
                        },
                        {
                            test: cssModuleRegex,
                            use: getStyleLoaders({
                                importLoaders: 1,
                                sourceMap: isEnvProduction
                                    ? shouldUseSourceMap
                                    : isEnvDevelopment,
                                modules: true
                            }),
                        },
                        {
                            test: sassRegex,
                            use: getStyleLoaders({
                                importLoaders: 2,
                                sourceMap: isEnvProduction
                                    ? shouldUseSourceMap
                                    : isEnvDevelopment,
                            }, 'sass-loader'),
                            sideEffects: true,
                        },
                        {
                            test: sassModuleRegex,
                            use: getStyleLoaders({
                                importLoaders: 2,
                                sourceMap: isEnvProduction
                                    ? shouldUseSourceMap
                                    : isEnvDevelopment,
                                modules: true
                            }, 'sass-loader')
                        }

                    ]
                }
            ]
        },
        plugins: [
            new HtmlWebpackPlugin(
                Object.assign(
                    {},
                    {
                        inject: true,
                        template: paths.appHtml,
                        title:'Parrot-UI --baseonreact',
                        favicon:paths.appFavicon
                    },
                    isEnvProduction
                        ? {
                            minify: {
                                removeComments: true,
                                collapseWhitespace: true,
                                removeRedundantAttributes: true,
                                useShortDoctype: true,
                                removeEmptyAttributes: true,
                                removeStyleLinkTypeAttributes: true,
                                keepClosingSlash: true,
                                minifyJS: true,
                                minifyCSS: true,
                                minifyURLs: true
                            }
                        }
                        : undefined
                )
            ),
           
            isEnvProduction &&
            new MiniCssExtractPlugin({
                // Options similar to the same options in webpackOptions.output
                // both options are optional
                filename: 'static/css/[name].[contenthash:8].css',
                chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
            }),
            new webpack.DefinePlugin( 
                {'process':{},'process.env':{WDS_SOCKET_HOST:undefined}}
            ),
            isEnvDevelopment && new webpack.HotModuleReplacementPlugin(),
            isEnvDevelopment &&
            shouldUseReactRefresh &&
            new ReactRefreshWebpackPlugin({
                overlay: {
                    entry: webpackDevClientEntry,
                    // The expected exports are slightly different from what the overlay exports,
                    // so an interop is included here to enable feedback on module-level errors.
                    module: reactRefreshOverlayEntry,
                    // Since we ship a custom dev client and overlay integration,
                    // the bundled socket handling logic can be eliminated.
                    sockIntegration: false,
                },
            }),
            // new ESLintPlugin({
            //     // Plugin options
            //     extensions: ['js', 'mjs', 'jsx', 'ts', 'tsx'], 
            //     formatter: require.resolve('../utils/eslintFormatter'),
            //     eslintPath: require.resolve('eslint'),
            //     context: paths.appSrc,
            //     cache: true, 
            //     resolvePluginsRelativeTo: __dirname, 
            //     emitError:false,
            //     emitWarning:true, 
            //     fix:true,
            //     baseConfig: {
            //         extends: [require.resolve('eslint-config-standard')],
            //         parser: require.resolve('babel-eslint'),
            //         rules: {
            //             'no-debugger':'off',
            //             'no-unused-vars':'off',
            //             'semi':'off',
            //             'indent':[2,4],
            //             'padded-blocks': 0,
            //             'no-multiple-empty-lines': [1, {'max': 2}],
            //             'no-extra-semi':0,
            //             'comma-dangle':0
            //         },
                   
            //     }
            //   }),
        ].filter(Boolean),
        node: {
            global: false,
            __filename: false,
            __dirname: false,
        },
        performance: false,
        target:isEnvDevelopment && 'web'
    }
}