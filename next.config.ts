import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    /* config options here */
    images: {
        domains: [
            'cdn.pixabay.com',
            'localhost',
            'res.cloudinary.com',
            'somethinguniquebackend.onrender.com',
            'somethingunique-backend.onrender.com'
        ],
    },
};

export default nextConfig;
