'use client';
import { redirect, usePathname } from 'next/navigation';
import { parseJwt } from '@/lib/jwt';

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const pathname = usePathname();
    const authToken = localStorage?.getItem('authToken');
    if (!authToken) {
        redirect('/register');
    }
    const payload = parseJwt(authToken);
    if (payload.user?.role === 'student') {
        redirect('/app');
    } else if (
        payload.user?.role === 'college_admin' &&
        pathname !== '/admin/college'
    ) {
        redirect('/admin/college');
    } else if (
        payload.user?.role === 'super_admin' &&
        pathname !== '/admin'
    ) {
        redirect('/admin');
    }
    return <div>{children}</div>;
}
