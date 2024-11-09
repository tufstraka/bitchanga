// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
      // Configure webpack for dfinity
      config.plugins.push(
        new webpack.ProvidePlugin({
          Buffer: ['buffer', 'Buffer'],
        })
      );
  
      if (!isServer) {
        config.resolve.fallback = {
          ...config.resolve.fallback,
          buffer: require.resolve('buffer/'),
          crypto: require.resolve('crypto-browserify'),
          stream: require.resolve('stream-browserify'),
        };
      }
  
      return config;
    },
  };
  
  export default nextConfig;
