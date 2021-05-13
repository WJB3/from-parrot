const CracoLessPlugin = require('craco-less');

module.exports = {
  webpack: {
    alias: {},
    plugins: [],
    configure: {
      /* Any webpack configuration options: https://webpack.js.org/configuration */
    },
    configure: (webpackConfig, { env, paths }) => {
      webpackConfig.output.filename = '[name].[hash].js';
      webpackConfig.output.chunkFilename = '[name].[hash].chunk.js';
      webpackConfig.output.publicPath = process.env.NODE_ENV === 'production' ? './' : '';
      webpackConfig.plugins[5].options.filename = '[name].[hash].css';
      webpackConfig.plugins[5].options.chunkFilename = '[name].[hash].chunk.css';
      webpackConfig.externals = {
        react: 'React',
        'react-dom': 'ReactDOM',
      };
      return webpackConfig;
    },
  },
  devServer: {
    // proxy: {
    //   '/foundation': 'http://192.168.1.192:88',
    //   '/oauth': 'http://192.168.1.192:88',
    // },
    port:80
  },
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
              '@primary-color': '#5781F2',
              '@background-color-light': '#F1F3FA',
            },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};
