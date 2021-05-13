'use strict';

process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';


process.on('unhandledRejection', err => {
    throw err;
});

require('../config/env');

const isInteractive = process.stdout.isTTY;

const path = require('path');
const chalk = require('chalk');
const webpack = require('webpack');
const configFactory = require('../config/webpack.config'); 
const config = configFactory('production');
const paths = require('../config/paths');
const fs = require('fs-extra');
const FileSizeReporter = require('../utils/FileSizeReporter');


const measureFileSizesBeforeBuild = FileSizeReporter.measureFileSizesBeforeBuild;
const printFileSizesAfterBuild = FileSizeReporter.printFileSizesAfterBuild;

// These sizes are pretty large. We'll warn for bundles exceeding them.
const WARN_AFTER_BUNDLE_GZIP_SIZE = 512 * 1024;
const WARN_AFTER_CHUNK_GZIP_SIZE = 1024 * 1024;




const { checkBrowsers } = require('../utils/browersHelper');
checkBrowsers(paths.appPath, isInteractive)
    .then(() => {
        return measureFileSizesBeforeBuild(paths.appBuild);
    })
    .then(previousFileSizes => {

        fs.emptyDirSync(paths.appBuild);
        // Merge with the public folder
        copyPublicFolder();
        // Start the webpack build
        return build(previousFileSizes);
    })
    .then(
        ({ stats, previousFileSizes, warnings }) => {
            if (warnings.length) {

            } else {
                console.log(chalk.green('Compiled successfully.\n'));
            }
            console.log('File sizes after gzip:\n');
            printFileSizesAfterBuild(
                stats,
                previousFileSizes,
                paths.appBuild,
                WARN_AFTER_BUNDLE_GZIP_SIZE,
                WARN_AFTER_CHUNK_GZIP_SIZE
            );
            console.log();
        }


    )
    .catch(err => {
        console.log(err)
     
        process.exit(1);
    })

function build(previousFileSizes) {
    console.log('Creating an optimized production build...'); 

    const compiler = webpack(config);

    return new Promise((resolve, reject) => {
        compiler.run((err, stats) => {
            let statusData = stats.toJson({ all: false, warnings: true, errors: true });
          
            if (statusData.errors.length) {
                if (statusData.errors.length > 1) {
                    statusData.errors.length = 1;
                } 
                return reject(statusData.errors[0]);
            }

            const resolveArgs = {
                stats,
                previousFileSizes,
                warnings: statusData.warnings,
            };

            return resolve(resolveArgs);

        })
    })
}

function copyPublicFolder() {
    fs.copySync(paths.appPublic, paths.appBuild, {
        dereference: true,
        filter: file => file !== paths.appHtml,
    });
}