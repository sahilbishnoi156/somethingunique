'use client';
import React from 'react';
import { Button } from '../ui/button';
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
    return (
        <Button
            variant={variant || 'secondary'}
            onClick={() => {
                window?.localStorage.removeItem('dummyAuthToken');
                window?.localStorage.removeItem('authToken');
                setTimeout(() => {
                    window.location.href = '/login';
                }, 500);
            }}
            className={className}
        >
            <LogOut />
            {children}
        </Button>
    );
}
