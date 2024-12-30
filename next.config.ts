import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    /* config options here */
    images: {
        remotePatterns: [
            { protocol: 'https', hostname: 'cdn.pixabay.com' },
            { protocol: 'http', hostname: 'localhost' },
            {
                protocol: 'https',
                hostname: 'somethingunique-backend.onrender.com',
            }, // while using render backend
            { protocol: 'http', hostname: 'res.cloudinary.com' },
        ],
    },
};

export default nextConfig;
