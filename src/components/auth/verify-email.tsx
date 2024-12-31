'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { validateEmail } from '@/lib/validatate-email';
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from '@/components/ui/input-otp';
import Link from 'next/link';
import Loader from '../loader';
import { customFetch } from '@/lib/custom-fetch';
import { usePathname } from 'next/navigation';

type StudentEmailVerificationProps = {
    email: string;
    type: 'login' | 'register';
    setEmail: React.Dispatch<React.SetStateAction<string>>;
};
export default function StudentEmailVerification({
    email,
    setEmail,
    type,
}: StudentEmailVerificationProps) {
    // local states
    const [isEmailValid, setIsEmailValid] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState<string>('');
    const pathname = usePathname();
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSendOtp = () => {
        setIsProcessing(true);
        const promise = () =>
            new Promise(async (resolve, reject) => {
                // Make the API call
                try {
                    const response = await customFetch(
                        '/auth/send-otp?email=' +
                            email +
                            `&type=${type}`,
                        {
                            method: 'GET',
                        }
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
                    const response = await customFetch(
                        `/auth/verify-otp?type=${type}`,
                        {
                            method: 'POST',
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
                    window?.localStorage.setItem(
                        type === 'register'
                            ? 'dummyAuthToken'
                            : 'authToken',
                        data.data.authToken
                    );
                    resolve(data.data.authToken);
                    setTimeout(() => {
                        window.location.href = '/app';
                    }, 500);
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
        <div className="lg:w-1/2 sm:w-3/4 w-full p-5 mx-auto mt-10">
            {isProcessing && (
                <div className="w-screen h-screen bg-background fixed inset-0 flex items-center justify-center">
                    <Loader />
                </div>
            )}
            {otpSent ? (
                <>
                    <h2 className="sm:text-3xl text-xl font-bold text-center mb-1">
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
                    <h2 className="sm:text-3xl text-xl  font-bold text-center mb-1">
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
                    <h2 className="sm:text-3xl text-xl font-bold text-center mb-1">
                        Email us, or go back to binge-watching
                        lectures you’ll never remember 🖥️💤.
                    </h2>
                    <p className="text-center text-gray-500 mb-6">
                        We&apos;ll send you a secret code (OTP). No
                        peeking, no cheating! 🕵️‍♂️
                    </p>
                </>
            )}
            <div className="absolute top-5 left-5 text-xl z-50 flex items-center justify-center gap-4">
                <Link href="/">Something Unique</Link>
                <span className="bg-secondary w-[2px] h-8 rounded-full"></span>
                <span className="capitalize text-neutral-500">
                    {pathname.split('/')[1]}
                </span>
            </div>

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
                            className="w-full md:w-fit"
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
                            maxLength={6}
                            value={otp}
                            onChange={(value) => {
                                setOtp(value);
                            }}
                        >
                            <InputOTPGroup>
                                <InputOTPSlot index={0} />
                                <InputOTPSlot index={1} />
                                <InputOTPSlot index={2} />
                            </InputOTPGroup>
                            <InputOTPSeparator />
                            <InputOTPGroup>
                                <InputOTPSlot index={3} />
                                <InputOTPSlot index={4} />
                                <InputOTPSlot index={5} />
                            </InputOTPGroup>
                        </InputOTP>
                    </div>
                    <div className="flex items-center justify-center gap-3">
                        <Button
                            variant={'default'}
                            disabled={otp?.length !== 6}
                            onClick={handleVerifyOtp}
                            className="py-4 px-10 w-full sm:w-fit"
                        >
                            Let Me In! 🎉
                        </Button>
                    </div>
                </div>
            )}

            {type === 'login' ? (
                <p className="text-center text-primary/80 mt-6">
                    Noting up your sleeves brat? Start from{' '}
                    <Link
                        href="/register"
                        className="text-blue-600 hover:underline"
                    >
                        here
                    </Link>{' '}
                </p>
            ) : (
                <p className="text-center text-primary/80 mt-6">
                    Already a member of the secret society?{' '}
                    <Link
                        href="/login"
                        className="text-blue-600 hover:underline"
                    >
                        Log in{' '}
                    </Link>
                    before <br /> we replace you with a doppelgänger.
                </p>
            )}
        </div>
    );
}
