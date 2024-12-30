'use client';
import { parseJwt } from '@/lib/jwt';
import { redirect, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Page() {
    const [authToken, setAuthToken] = useState<string | undefined>();
    const router = useRouter();

    useEffect(() => {
        if (typeof window !== 'undefined') {
            // Ensure window is available
            const token = window.localStorage.getItem('authToken');
            if (token) {
                setAuthToken(token);
            }
        }
    }, []);

    useEffect(() => {
        if (!authToken) {
            if (typeof window !== 'undefined') {
                // Check if window is available
                window.localStorage.removeItem('dummyAuthToken');
                window.localStorage.removeItem('authToken');
            }
            router.refresh(); // Refresh the page
            return;
        } else {
            const payload = parseJwt(authToken);
            redirect('/profile/' + payload.user.username);
        }
    }, [authToken, router]);

    return null; // No need to render anything, as the page is being redirected.
}
