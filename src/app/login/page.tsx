'use client';
import React from 'react';
import { redirect } from 'next/navigation';
import StudentEmailVerification from '@/components/auth/verify-email';

export default function Register() {
    const [email, setEmail] = React.useState<string>('');

    // check if user is already authenticated
    const authToken = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
    if (authToken) {
        redirect('/app');
    }

    return (
        <div className="flex items-center justify-center w-screen h-screen">
            <StudentEmailVerification
                email={email}
                setEmail={setEmail}
                type="login"
            />
        </div>
    );
}
