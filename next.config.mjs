/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true, // Required for static export
  },
  // If deploying to https://username.github.io/repo-name/, uncomment and set basePath:
  // basePath: '/WInloss',
  // assetPrefix: '/WInloss',
};

export default nextConfig;
