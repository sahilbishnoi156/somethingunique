import LogoutButton from '@/components/auth/logout-button';
import { ModeToggle } from '@/components/toggle-theme';
import React from 'react';

export default function page() {
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
