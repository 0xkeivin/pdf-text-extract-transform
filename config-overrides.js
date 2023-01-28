module.exports = function override(config, env) {
  console.log("React app rewired works!");
  config.resolve.fallback = {
    "http": require.resolve("stream-http"),
    "fs": false,
    "path": false,
    "https": require.resolve("https-browserify"),
    // "crypto": require.resolve("crypto-browserify"),
    // "path": require.resolve("path-browserify"),
    // "zlib": require.resolve("browserify-zlib"),
    // fs: false,
    // url: false,
    // http: false,
    // https: false,
    // zlib: false,
  };
  return config;
};
