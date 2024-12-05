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

type StudentEmailVerificationProps = {
    email: string;
    setEmail: React.Dispatch<React.SetStateAction<string>>;
};
export default function StudentEmailVerification({
    email,
    setEmail,
}: StudentEmailVerificationProps) {
    // local states
    const [isEmailValid, setIsEmailValid] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState<string>('');
    const router = useRouter();

    const handleEmailSubmit = () => {
        if (validateEmail(email)) {
            const promise = () =>
                new Promise((resolve) =>
                    setTimeout(() => resolve(setOtpSent(true)), 2000)
                );

            toast.promise(promise, {
                loading: 'sending...',
                success: `Otp sent successfully`,
                error: (error) => {
                    return `Error: ${error.message}`;
                },
            });
        } else {
            setIsEmailValid(false);
        }
    };

    const handleOtpSubmit = () => {
        // Replace with OTP verification logic
        localStorage.setItem(
            'dummyAuthToken',
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwic2x1ZyI6InNhaGlsMjIxMi5iZTIyQGNoaXRrYXJhLmVkdS5pbiIsImlhdCI6MTUxNjIzOTAyMn0.mgHMpfdvS_zTG-_mS9K_guLUY3syftiCdhGJh2mt2bg'
        );
        toast.success('Email verified successfully');
        router.refresh();
    };

    return (
        <div className="w-1/2 mx-auto mt-10">
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
            ) : (
                <>
                    <h2 className="text-3xl font-bold text-center mb-1 ">
                        Plug in your Campus Email to Unlock the
                        Ultimate College Buzz! 😵‍💫
                    </h2>
                    <p className="text-center text-gray-500 mb-6">
                        We’ll send you a secret code (OTP). If it’s
                        not from your campus, sorry—no gate crashers
                        allowed!
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
                        className="w-full mb-4"
                    />
                    {!isEmailValid && email && (
                        <p className="text-red-500 text-sm mb-2">
                            That doesn’t look like a campus email. Are
                            you trying to trick us? 😏
                        </p>
                    )}
                    <div className="flex items-center justify-center gap-3">
                        <Button
                            variant={'default'}
                            disabled={!isEmailValid}
                            onClick={handleEmailSubmit}
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
                            onClick={handleOtpSubmit}
                        >
                            Verify & Let Me In! 🎉
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
