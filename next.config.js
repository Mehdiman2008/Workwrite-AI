/** @type {import('next').NextConfig} */
const nextConfig = {
  // These libraries read files/use Node APIs and should not be bundled
  // into the serverless function by webpack.
  experimental: {
    serverComponentsExternalPackages: ['pdf-parse', 'mammoth'],
  },
};

module.exports = nextConfig;
