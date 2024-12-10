import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from 'sonner';
import StoreProvider from './store/store-provider';

export const metadata: Metadata = {
    title: 'Create Next App',
    description: 'Generated by create next app',
};
import { Source_Sans_3 } from 'next/font/google';

const font = Source_Sans_3({
    weight: '400',
    subsets: ['latin'],
});

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <StoreProvider>
                <body className={` ${font.className} antialiased`}>
                    <Toaster richColors />
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="system"
                        enableSystem
                        disableTransitionOnChange
                    >
                        {children}
                    </ThemeProvider>
                </body>
            </StoreProvider>
        </html>
    );
}
