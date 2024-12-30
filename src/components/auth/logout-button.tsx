'use client';
import React from 'react';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

export default function LogoutButton({
    children,
    variant,
    className,
}: {
    variant?:
        | 'default'
        | 'destructive'
        | 'outline'
        | 'secondary'
        | 'ghost'
        | 'link'
        | null
        | undefined;
    children?: React.ReactNode;
    className?: string;
}) {
    const router = useRouter();
    return (
        <Button
            variant={variant || 'secondary'}
            onClick={() => {
                localStorage.removeItem('dummyAuthToken');
                localStorage.removeItem('authToken');
                router.refresh();
            }}
            className={className}
        >
            <LogOut />
            {children}
        </Button>
    );
}
