/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      loader: 'custom',
      loaderFile: './lib/imageLoader.js', // or './utils/imageLoader.js' depending on where you placed it
    },
    webpack: config => {
      config.externals.push('pino-pretty', 'lokijs', 'encoding');
      return config;
    },
  };

export default nextConfig;
