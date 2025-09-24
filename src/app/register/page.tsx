'use client';
import React from 'react';
import { parseJwt, isJwtExpired } from '@/lib/jwt';
import { redirect } from 'next/navigation';
import AskRegisterDetails from '@/components/auth/register/ask-register-details';
import StudentEmailVerification from '@/components/auth/verify-email';

export default function Register() {
    const [email, setEmail] = React.useState<string>('');

    // check if user is already authenticated
    React.useEffect(() => {
        const token = window?.localStorage.getItem('authToken');
        if (token) {
            redirect('/app');
        }
    }, []);

    const [dummyAuthToken, setDummyAuthToken] =
        React.useState<string>();
    React.useEffect(() => {
        const token = window?.localStorage.getItem('dummyAuthToken');
        if (token) {
            setDummyAuthToken(token);
        }
    }, []);

    if (dummyAuthToken) {
        console.log(dummyAuthToken)
        if (isJwtExpired(dummyAuthToken)) {
            console.log('JWT expired')
            window?.localStorage.removeItem('dummyAuthToken');
            // redirect('/app');
        } else {
            const payload = parseJwt(dummyAuthToken);
            console.log(payload)
            if (!payload?.user?.email) {
                window?.localStorage.removeItem('dummyAuthToken');
                // redirect('/app');
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
