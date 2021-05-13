'use strict';

process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';

const paths = require('../config/paths');
const fs = require('fs');
const chalk = require('chalk');
const webpack = require('webpack');
const { checkBrowsers } = require('../utils/browersHelper');
const { choosePort, prepareUrls, createCompiler, prepareProxy } = require('../utils/WebpackDevServerUtils');
const createDevServerConfig = require('../config/WebpackDevServerConfig');
const WebpackDevServer = require('webpack-dev-server');
const clearConsole = require('../utils/clearConsole');
const openBrowser = require('../utils/openBrowser');
const configFactory = require('../config/webpack.config');
const useYarn = fs.existsSync(paths.yarnLockFile);

process.on('unhandledRejection', err => {
    throw err;
});

require('../config/env');

//该项目现在是否有运行终端
const isInteractive = process.stdout.isTTY;

const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 3000;
const HOST = process.env.HOST || '0.0.0.0';

checkBrowsers(paths.appPath, isInteractive)
    .then(() => {
        return choosePort(HOST, DEFAULT_PORT)
    })
    .then(port => {
        if (port == null) {
            //无端口号
            return;
        }
        const config = configFactory('development'); 
        const protocol = process.env.HTTPS === 'true' ? 'https' : 'http';
        const appName = require(paths.appPackageJson).name;
 
        const tscCompileOnError = process.env.TSC_COMPILE_ON_ERROE === 'true';
        const urls = prepareUrls(
            protocol,
            HOST,
            port,
            paths.publicUrlOrPath.slice(0, -1)
        );
        const devSocket = {
            warnings: warnings =>
                devServer.sockWrite(devServer.sockets, 'warnings', warnings),
            errors: errors =>
                devServer.sockWrite(devServer.sockets, 'errors', errors),
        };

        const compiler = createCompiler({
            appName,
            config,
            devSocket,
            urls,
            useYarn, 
            tscCompileOnError,
            webpack
        });
        const proxySetting = require(paths.appPackageJson).proxy;
        const proxyConfig = prepareProxy(
            proxySetting,
            paths.appPublic,
            paths.publicUrlOrPath
        );
        //编译器在web服务器上生成webpack资产
        const serverConfig = createDevServerConfig(
            proxyConfig,
            urls.lanUrlForConfig
        );
        const devServer = new WebpackDevServer(compiler, serverConfig);
        devServer.listen(port, HOST, err => {
            if (err) {
                return console.log(err);
            }
            if (isInteractive) {
                ////clearConsole();
            }
            console.log(chalk.cyan('Starting the development server...\n'));
            openBrowser(urls.localUrlForBrowser);
        });
        //SIGINT 当input流接收到ctrl+c输入时 SIGTERM 当系统中断
        ['SIGINT', 'SIGTERM'].forEach(function (sig) {
            process.on(sig, function () {
                devServer.close();
                process.exit();
            })
        })

    })
    .catch(err => {
        if (err && err.message) {
            console.log(err.message);
        }
        process.exit(1);
    })




