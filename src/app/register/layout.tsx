import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'College Point - Register',
    description: 'Generated by create next app',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <div>{children}</div>;
}
