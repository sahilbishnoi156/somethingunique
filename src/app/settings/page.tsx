'use client';
import LogoutButton from '@/components/auth/logout-button';
import { ModeToggle } from '@/components/toggle-theme';
import { redirect } from 'next/navigation';
import React from 'react';

export default function page() {
    // check if user is already authenticated
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
        redirect('/login');
    }

    return (
        <div className="w-screen h-screen flex items-center justify-center gap-10">
            <div>
                Logout <LogoutButton />
            </div>
            <div>
                <ModeToggle />
            </div>
        </div>
    );
}
