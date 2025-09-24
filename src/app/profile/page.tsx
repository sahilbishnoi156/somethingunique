'use client';
import { parseJwt } from '@/lib/jwt';
import { redirect, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Page() {
    const router = useRouter();

    useEffect(() => {
        if (typeof window !== 'undefined') {
            // Ensure window is available
            const token = window.localStorage.getItem('authToken');
            if (token) {
                const payload = parseJwt(token);
                redirect('/profile/' + payload?.user.username);
            } else {
                window.localStorage.removeItem('dummyAuthToken');
                window.localStorage.removeItem('authToken');
                router.refresh();
            }
        }
    }, [router]);

    return null; // No need to render anything, as the page is being redirected.
}
