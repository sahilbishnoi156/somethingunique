'use client';
import React from 'react';
import { parseJwt, isJwtExpired } from '@/lib/jwt';
import { redirect } from 'next/navigation';
import AskRegisterDetails from '@/components/auth/register/ask-register-details';
import StudentEmailVerification from '@/components/auth/verify-email';

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
            if (!payload?.user?.email) {
                localStorage.removeItem('dummyAuthToken');
                redirect('/app');
            } else {
                return (
                    <div className="h-screen w-screen">
                        <AskRegisterDetails
                            email={payload.user.email}
                        />
                    </div>
                );
            }
        }
    } else {
        return (
            <div className="flex items-center justify-center w-screen h-screen">
                <StudentEmailVerification
                    email={email}
                    setEmail={setEmail}
                    type="register"
                />
            </div>
        );
    }
}
