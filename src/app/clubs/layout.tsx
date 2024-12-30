'use client';
import { redirect } from 'next/navigation';

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const authToken = localStorage?.getItem('authToken');
    if (!authToken) {
        redirect('/register');
    }
    return <div>{children}</div>;
}
