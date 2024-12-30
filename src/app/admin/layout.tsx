'use client';
import { redirect, usePathname } from 'next/navigation';
import { parseJwt } from '@/lib/jwt';
import React, { Suspense } from 'react';
import { JwtPayload } from '@/types/auth.types';

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const pathname = usePathname();
    const [payload, setPayload] = React.useState<JwtPayload | null>(
        null
    );
    React.useEffect(() => {
        const token = window?.localStorage.getItem('authToken');
        if (!token) {
            redirect('/register');
        } else {
            const data = parseJwt(token);
            setPayload(data);
        }
    }, []);

    if (payload?.user?.role === 'student') {
        redirect('/app');
    } else if (
        payload?.user?.role === 'college_admin' &&
        pathname !== '/admin/college'
    ) {
        redirect('/admin/college');
    } else if (
        payload?.user?.role === 'super_admin' &&
        pathname !== '/admin'
    ) {
        redirect('/admin');
    }
    return <Suspense>{children}</Suspense>;
}
