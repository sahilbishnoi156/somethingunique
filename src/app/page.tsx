'use client';
import Loader from '@/components/loader';
import { Button } from '@/components/ui/button';
import {
    LANDING_PAGE_DESCRIPTION,
    LANDING_PAGE_HEADING,
} from '@/constants/sentences';
import { getRandomElement } from '@/lib/random-item';
import Link from 'next/link';
import React from 'react';

const LandingPage = () => {
    const HEADING = getRandomElement(LANDING_PAGE_HEADING);
    const DESCRIPTION = getRandomElement(LANDING_PAGE_DESCRIPTION);
    const [authToken, setAuthToken] = React.useState<null | string>(
        null
    );
    React.useEffect(() => {
        const token = window?.localStorage.getItem('authToken');
        setAuthToken(token);
    }, []);

    return (
        <div className="h-screen w-screen flex flex-col justify-between items-center p-6">
            <div className="w-full">
                <Loader />
            </div>
            <div className="h-full w-1/2 flex-col flex justify-center items-center">
                <h1 className="text-3xl font-bold text-center mb-1">
                    {HEADING}
                </h1>
                <p className="text-center text-gray-300">
                    {DESCRIPTION}
                </p>
                <div className="mt-10 flex gap-5 w-1/2">
                    {authToken ? (
                        <Link href={'/app'} className="w-full">
                            <Button
                                className="w-full text-lg"
                                variant="default"
                            >
                                Continue the bullying
                            </Button>
                        </Link>
                    ) : (
                        <>
                            <Link href={'/login'}>
                                <Button
                                    className="w-full text-lg"
                                    variant="default"
                                    size={'lg'}
                                >
                                    Login
                                </Button>
                            </Link>
                            <Link href={'/register'}>
                                <Button
                                    className="w-full text-lg"
                                    variant="default"
                                    size={'lg'}
                                >
                                    Register (It&apos;s Free! 🎉)
                                </Button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
