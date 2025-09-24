'use client';
import { redirect, usePathname } from 'next/navigation';
import { parseJwt } from '@/lib/jwt';
import React, { Suspense } from 'react';
import { toast } from 'sonner';

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const pathname = usePathname();
    React.useEffect(() => {
        const token = window?.localStorage.getItem('authToken');
        if (!token) {
            redirect('/register');
        } else {
            const payload = parseJwt(token);
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
            } else if (!payload?.user.role) {
                window.localStorage.removeItem('authToken');
                window.localStorage.removeItem('dummyAuthToken');
                toast.error('Unauthorized! please login again');
                redirect('/register');
            }
        }
    }, [pathname]);

    return <Suspense>{children}</Suspense>;
}
