'use client';
import { parseJwt } from '@/lib/jwt';
import { redirect, useRouter } from 'next/navigation';

export default function Page() {
    const authToken = localStorage.getItem('authToken');
    const router = useRouter();
    if (!authToken) {
        localStorage.removeItem('dummyAuthToken');
        localStorage.removeItem('authToken');
        router.refresh();
        return;
    } else {
        const payload = parseJwt(authToken);
        redirect('/profile/' + payload.user.username);
    }
}
