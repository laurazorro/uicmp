import 'dotenv/config';

const basePath = process.env.BASE_PATH || '';

/** @type {import('next').NextConfig} */
const nextConfig = {
    // Base path configuration
    basePath: basePath,
    assetPrefix: `${basePath}/`,
    
    // Build optimizations
    compiler: {
        // Enable styled-components support
        styledComponents: true,
    },
    
    // Experimental features
    experimental: {
        forceSwcTransforms: true,
    },
    
    // ESLint configuration
    eslint: {
        ignoreDuringBuilds: true,
    },
    
    // Images configuration
    images: {
        unoptimized: true, // If you're using next/image
    },
};

export default nextConfig;
