// next.config.mjs
import 'dotenv/config';

const isGithubPages = process.env.GITHUB_PAGES === 'true';
const basePath = isGithubPages ? '/uicmp' : (process.env.BASE_PATH || '');

const nextConfig = {
  basePath,
  assetPrefix: `${basePath}/`,
  output: 'export', // esto habilita `next export`

  compiler: {
    styledComponents: true,
  },

  experimental: {
    forceSwcTransforms: true,
  },

  eslint: {
    ignoreDuringBuilds: true,
  },

  images: {
    unoptimized: true,
  },
};

export default nextConfig;
