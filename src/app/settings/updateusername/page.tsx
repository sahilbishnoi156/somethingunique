'use client';
import CreateUsername from '@/components/auth/register/verify-username';
import Loader from '@/components/loader';
import { parseJwt } from '@/lib/jwt';
import { redirect } from 'next/navigation';
import React from 'react';

export default function Page() {
    const token = localStorage.getItem('authToken');
    if (!token) {
        redirect('/login');
    }
    const user = parseJwt(token).user;
    const [isProcessing, setIsProcessing] = React.useState(false);
    if (isProcessing)
        return (
            <div className="w-screen h-screen flex items-center justify-center">
                <Loader />
            </div>
        );
    return (
        <div className="flex items-center justify-center w-screen h-screen">
            <CreateUsername
                type="update"
                oldUsername={user.username || ''}
                email={user.email || ''}
                setIsProcessing={setIsProcessing}
            />
        </div>
    );
}
