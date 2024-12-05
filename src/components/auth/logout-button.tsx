'use client';
import React from 'react';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

export default function LogoutButton() {
    const router = useRouter();
    return (
        <Button
            variant={'secondary'}
            size={'icon'}
            onClick={() => {
                localStorage.removeItem('dummyAuthToken');
                localStorage.removeItem('authToken');
                router.refresh();
            }}
        >
            <LogOut />
        </Button>
    );
}
