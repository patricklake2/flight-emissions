module.exports = {
  lintOnSave: false,
  publicPath: process.env.NODE_ENV === 'production'
    ? '/projects/flight-emissions/daily/'
    : '/',
  outputDir: 'docs',
  chainWebpack: config => {
    config.plugins.delete('prefetch');
  },
  pluginOptions: {
    webpackBundleAnalyzer: {
      openAnalyzer: true,
    },
  },
};
