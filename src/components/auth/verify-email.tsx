'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { validateEmail } from '@/lib/validatate-email';
import { useRouter } from 'next/navigation';
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from '@/components/ui/input-otp';
import Link from 'next/link';
import Loader from '../loader';

type StudentEmailVerificationProps = {
    email: string;
    type: 'login' | 'register';
    setEmail: React.Dispatch<React.SetStateAction<string>>;
};
const BASE_API_URL = process.env.NEXT_PUBLIC_BASE_API_URL;
export default function StudentEmailVerification({
    email,
    setEmail,
    type,
}: StudentEmailVerificationProps) {
    // local states
    const [isEmailValid, setIsEmailValid] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState<string>('');
    const router = useRouter();
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSendOtp = () => {
        setIsProcessing(true);
        const promise = () =>
            new Promise(async (resolve, reject) => {
                // Make the API call
                try {
                    const response = await fetch(
                        BASE_API_URL +
                            '/auth/send-otp?email=' +
                            email +
                            `&type=${type}`
                    );
                    const data = await response.json();
                    if (!response.ok) {
                        throw new Error(data?.data || data?.message);
                    }
                    setOtpSent(true);
                    resolve('true');
                } catch (error) {
                    console.error('API error:', error);
                    reject(error);
                } finally {
                    setIsProcessing(false);
                }
            });

        toast.promise(promise, {
            loading: 'Sending OTP...',
            success: 'OTP sent successfully',
            error: (error) => `Error: ${error.message}`,
        });
    };

    const handleVerifyOtp = () => {
        setIsProcessing(true);
        const promise = () =>
            new Promise(async (resolve, reject) => {
                // Make the API call
                try {
                    const response = await fetch(
                        `http://localhost:5000/api/auth/verify-otp?type=${type}`,
                        {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                email,
                                otp,
                            }),
                        }
                    );
                    const data = await response.json();
                    if (!response.ok) {
                        throw new Error(data?.data || data?.message);
                    }
                    localStorage.setItem(
                        type === 'register'
                            ? 'dummyAuthToken'
                            : 'authToken',
                        data.data.authToken
                    );
                    resolve(data.data.authToken);
                    router.refresh();
                } catch (error) {
                    console.error('API error:', error);
                    reject(error);
                } finally {
                    setIsProcessing(false);
                }
            });

        toast.promise(promise, {
            loading: 'verifying otp...',
            success: 'OTP verified successfully',
            error: (error) => `Error: ${error.message}`,
        });
    };

    return (
        <div className="w-1/2 mx-auto mt-10">
            {isProcessing && (
                <div className="w-screen h-screen bg-background fixed inset-0 flex items-center justify-center">
                    <Loader />
                </div>
            )}
            {otpSent ? (
                <>
                    <h2 className="text-3xl font-bold text-center mb-1">
                        Ready to Prove You Belong? Enter Your OTP to
                        Unlock the College Fun! 🚀
                    </h2>
                    <p className="text-center text-gray-500 mb-6">
                        Check your inbox for the secret code. No
                        campus email? No party—rules are rules! 🤷‍♂️
                    </p>
                </>
            ) : type === 'register' ? (
                <>
                    <h2 className="text-3xl font-bold text-center mb-1">
                        Ready to Join the College Fun? Enter Your
                        Campus Email to Get Started! 🚀
                    </h2>
                    <p className="text-center text-gray-500 mb-6">
                        We’ll send you a secret code (OTP). If it’s
                        not from your campus, sorry—no gate crashers
                        allowed!
                    </p>
                </>
            ) : (
                <>
                    <h2 className="text-3xl font-bold text-center mb-1">
                        Lost Your Password Again? 😵‍💫 Time to Unleash
                        Your Campus Email Magic! 🧙‍♂️
                    </h2>
                    <p className="text-center text-gray-500 mb-6">
                        We&apos;ll send you a secret code (OTP). No
                        peeking, no cheating! 🕵️‍♂️
                    </p>
                </>
            )}

            {!otpSent ? (
                <div>
                    <Input
                        type="email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            if (validateEmail(e.target.value)) {
                                setIsEmailValid(true);
                            } else {
                                setIsEmailValid(false);
                            }
                        }}
                        placeholder="e.g., yourname@campus.edu"
                        className="w-full mb-1"
                    />
                    {!isEmailValid && email && (
                        <p className="text-red-500 text-sm mb-2">
                            That doesn’t look like a campus email. Are
                            you trying to trick us? 😏
                        </p>
                    )}
                    <div className="flex items-center justify-center gap-3 mt-4">
                        <Button
                            variant={'default'}
                            disabled={!isEmailValid}
                            onClick={handleSendOtp}
                        >
                            Send Me the Code 🚀
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="">
                    <div className="flex items-center justify-center mb-6">
                        <InputOTP
                            size={30}
                            maxLength={6}
                            value={otp}
                            onChange={(value) => {
                                setOtp(value);
                            }}
                        >
                            <InputOTPGroup>
                                <InputOTPSlot
                                    className="h-12 w-12"
                                    index={0}
                                />
                                <InputOTPSlot
                                    className="h-12 w-12"
                                    index={1}
                                />
                            </InputOTPGroup>
                            <InputOTPSeparator />
                            <InputOTPGroup>
                                <InputOTPSlot
                                    className="h-12 w-12"
                                    index={2}
                                />
                                <InputOTPSlot
                                    className="h-12 w-12"
                                    index={3}
                                />
                            </InputOTPGroup>
                            <InputOTPSeparator />
                            <InputOTPGroup>
                                <InputOTPSlot
                                    className="h-12 w-12"
                                    index={4}
                                />
                                <InputOTPSlot
                                    className="h-12 w-12"
                                    index={5}
                                />
                            </InputOTPGroup>
                        </InputOTP>
                    </div>
                    <div className="flex items-center justify-center gap-3">
                        <Button
                            variant={'default'}
                            disabled={otp?.length !== 6}
                            onClick={handleVerifyOtp}
                            className="py-4 px-10"
                        >
                            Let Me In! 🎉
                        </Button>
                    </div>
                </div>
            )}

            {type === 'login' ? (
                <p className="text-center text-gray-400 mt-6">
                    Noting up your sleeves brat? Start from{' '}
                    <Link
                        href="/register"
                        className="text-blue-400 hover:underline"
                    >
                        here
                    </Link>{' '}
                </p>
            ) : (
                <p className="text-center text-gray-400 mt-6">
                    Already a member of the secret society?{' '}
                    <Link
                        href="/login"
                        className="text-blue-400 hover:underline"
                    >
                        Log in{' '}
                    </Link>
                    before <br /> we replace you with a doppelgänger.
                </p>
            )}
        </div>
    );
}
