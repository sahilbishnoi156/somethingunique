'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { UniversityType } from '@/types/universities.types';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

type CreateUsernameProps = {
    university: UniversityType;
    email: string;
};

type UsernameStatus =
    | 'idle'
    | 'searching'
    | 'available'
    | 'not-available';

const BASE_API_URL = process.env.NEXT_PUBLIC_BASE_API_URL;
export default function CreateUsername({
    university,
    email,
}: CreateUsernameProps) {
    const [username, setUsername] = useState('');
    const [status, setStatus] = useState<UsernameStatus>('idle');
    const debounceRef = useRef<NodeJS.Timeout | null>(null);
    const router = useRouter();

    const handleUsernameChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const input = e.target.value
            .replace(/[^a-z0-9_.]/g, '')
            .toLowerCase();
        setUsername(input);
        setStatus('idle');
    };

    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        if (username && username.length >= 3) {
            setStatus('searching');
            debounceRef.current = setTimeout(async () => {
                try {
                    const available = await checkUsernameAvailability(
                        username
                    );
                    setStatus(
                        available ? 'available' : 'not-available'
                    );
                } catch {
                    toast.error(
                        'Oops! Our hamsters stopped running. Try again!'
                    );
                    setStatus('idle');
                }
            }, 500);
        } else {
            setStatus('idle');
        }
        return () => {
            if (debounceRef.current)
                clearTimeout(debounceRef.current);
        };
    }, [username]);

    const handleCreateUser = async () => {
        if (!username || status !== 'available') return;
        try {
            const response = await fetch(
                BASE_API_URL + '/auth/create-user',
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: email,
                        username,
                        college_id: university._id,
                        avatar:
                            BASE_API_URL?.replace(/\/api\/?$/, '') +
                            '/static/images/default-avatar.png',
                    }),
                }
            );
            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data?.data || 'Houston, we have a problem!'
                );
            }
            localStorage.setItem('authToken', data?.data?.authToken);
            localStorage.removeItem('dummyAuthToken');

            toast.success(
                "Boom! You're in! Time to rock this digital world! 🚀"
            );
            router.push('/app');
        } catch {
            toast.error('Yikes! A wild error appeared. Try again!');
        }
    };

    const checkUsernameAvailability = async (
        username: string
    ): Promise<boolean> => {
        try {
            const response = await fetch(
                BASE_API_URL +
                    `/auth/check-username-availability?username=${username}`
            );
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data?.data || data?.message);
            }
            return data.data;
        } catch (error) {
            console.error('API error:', error);
            return false;
        }
    };

    const statusMessages = {
        idle: 'Waiting for your creative genius...',
        searching: 'Hunting for your digital identity...',
        available: 'Jackpot! This username is all yours!',
        'not-available':
            "Bummer! This name's taken. Time for Plan B!",
    };

    return (
        <div className="sm:w-3/4 md:w-1/2 w-11/12">
            <h2 className="text-3xl font-bold text-center mb-2">
                Craft Your Digital Alter Ego 🦸‍♂️
            </h2>
            <p className="text-center text-gray-500 mb-6">
                Time to get creative! Lowercase letters, underscores,
                and periods are your building blocks.
            </p>

            <div className="space-y-4">
                <Input
                    type="text"
                    value={username}
                    onChange={handleUsernameChange}
                    placeholder="your_epic_username"
                />
                <div className="flex items-center space-x-2 h-5">
                    {status === 'searching' && (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    )}
                    <p
                        className={`text-sm ${
                            status === 'available'
                                ? 'text-green-500'
                                : status === 'not-available'
                                ? 'text-red-500'
                                : 'text-gray-500'
                        }`}
                    >
                        {statusMessages[status]}
                    </p>
                </div>

                <div className="w-full flex items-center justify-center">
                    <Button
                        variant="default"
                        disabled={status !== 'available'}
                        onClick={handleCreateUser}
                        className="px-10"
                    >
                        {status === 'available'
                            ? "Let's Roll! 🎲"
                            : 'Hold on!'}
                    </Button>
                </div>
            </div>
        </div>
    );
}
