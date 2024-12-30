'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { UniversityType } from '@/types/universities.types';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { customFetch } from '@/lib/custom-fetch';
import { getRandomElement } from '@/lib/random-item';
import {
    USERNAME_AVAILABLE_MSG,
    USERNAME_NOT_AVAILABLE_MSG,
} from '@/constants/sentences';

type CreateUsernameProps = {
    university?: UniversityType;
    email: string;
    setIsProcessing: React.Dispatch<React.SetStateAction<boolean>>;
    type: 'register' | 'update';
    oldUsername?: string;
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
    setIsProcessing,
    type = 'register',
    oldUsername,
}: CreateUsernameProps) {
    const [username, setUsername] = useState(oldUsername || '');
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
        if (
            username &&
            username.length >= 3 &&
            username !== oldUsername
        ) {
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
    }, [oldUsername, username]);

    const handleCreateUser = async () => {
        if (
            !username ||
            status !== 'available' ||
            type !== 'register'
        )
            return;
        try {
            setIsProcessing(true);
            const response = await customFetch('/auth/create-user', {
                method: 'POST',
                body: JSON.stringify({
                    email: email,
                    username,
                    college_id: university?._id,
                    avatar:
                        BASE_API_URL?.replace(/\/api\/?$/, '') +
                        '/static/images/default-avatar.png',
                }),
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data?.data ||
                        data?.message ||
                        'Houston, we have a problem!'
                );
            }
            window?.localStorage.setItem(
                'authToken',
                data?.data?.authToken
            );
            window?.localStorage.removeItem('dummyAuthToken');

            toast.success(
                "Boom! You're in! Time to rock this digital world! 🚀"
            );
            router.push('/app');
        } catch (error) {
            if (error instanceof Error)
                toast.error(
                    error?.message ||
                        'Yikes! A wild error appeared. Try again!'
                );
        } finally {
            setIsProcessing(false);
        }
    };

    const updateUsername = async () => {
        if (!username || status !== 'available' || type !== 'update')
            return;
        try {
            setIsProcessing(true);
            const response = await customFetch(
                '/user/update-username',
                {
                    method: 'PATCH',
                    body: JSON.stringify({
                        username,
                    }),
                }
            );
            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data?.data ||
                        data?.message ||
                        'Houston, we have a problem!'
                );
            }
            toast.success(
                'Username updated successfully! Time to show off!'
            );
            window?.localStorage.setItem(
                'authToken',
                data?.data?.authToken
            );
            setTimeout(() => {
                router.push('/profile');
                setIsProcessing(false);
            }, 1000);
        } catch (error) {
            if (error instanceof Error)
                toast.error(
                    error?.message ||
                        'Yikes! A wild error appeared. Try again!'
                );
            setIsProcessing(false);
        }
    };

    const checkUsernameAvailability = async (
        username: string
    ): Promise<boolean> => {
        try {
            const response = await customFetch(
                `/auth/check-username-availability?username=${username}`,
                { method: 'GET' }
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
        available: getRandomElement(USERNAME_AVAILABLE_MSG),
        'not-available': getRandomElement(USERNAME_NOT_AVAILABLE_MSG),
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
                        disabled={
                            status !== 'available' &&
                            username === oldUsername
                        }
                        onClick={
                            type === 'register'
                                ? handleCreateUser
                                : updateUsername
                        }
                        className="px-10"
                    >
                        {status === 'available'
                            ? type === 'register'
                                ? "Let's Roll! 🎲"
                                : 'Update Item'
                            : 'Hold on!'}
                    </Button>
                </div>
            </div>
        </div>
    );
}
