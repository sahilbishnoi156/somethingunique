import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    /* config options here */
    images: {
        remotePatterns: [
            { protocol: 'https', hostname: 'cdn.pixabay.com' },
            { protocol: 'http', hostname: 'localhost' },
            { protocol: 'http', hostname: '3.108.53.40' },
            { protocol: 'https', hostname: 'res.cloudinary.com' },
        ],
    },
};

export default nextConfig;
