'use client';
import React from 'react';
import StudentEmailVerification from './verify-email';
import { parseJwt, isJwtExpired } from '@/lib/jwt';
import { redirect } from 'next/navigation';
import AskRegisterDetails from './ask-register-details';

export default function Register() {
    const [email, setEmail] = React.useState<string>('');

    // check if user is already authenticated
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
        redirect('/app');
    }

    const dummyAuthToken = localStorage.getItem('dummyAuthToken');

    if (dummyAuthToken) {
        if (isJwtExpired(dummyAuthToken)) {
            localStorage.removeItem('dummyAuthToken');
            redirect('/app');
        } else {
            const payload = parseJwt(dummyAuthToken);
            return <AskRegisterDetails email={payload.slug} />;
        }
    } else {
        return (
            <div className="flex items-center justify-center w-full h-full">
                <StudentEmailVerification
                    email={email}
                    setEmail={setEmail}
                />
            </div>
        );
    }
}
