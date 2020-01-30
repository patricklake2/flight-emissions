module.exports = {
  publicPath:
    process.env.NODE_ENV === "production"
      ? "/projects/flight-emissions/daily/"
      : "/",
  chainWebpack: config => {
    config.plugins.delete("prefetch");
  }
};
