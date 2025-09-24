'use client';
import React from 'react';
import { CreateClubDialog } from '../create-club';
import { ClubType, CollegeType } from '@/types/feed.types';
import { customFetch } from '@/lib/custom-fetch';
import Loader from '../loader';
import { Button } from '../ui/button';
import Link from 'next/link';
import LogoutButton from '../auth/logout-button';

export default function RegisterClub() {
    const [college, setCollege] = React.useState<CollegeType>();
    const [club, setClub] = React.useState<ClubType>();
    const [isFetching, setIsFetching] = React.useState(false);
    const [refetch, setRefetch] = React.useState(false);
    React.useEffect(() => {
        const fetchCollege = async () => {
            setIsFetching(true);
            try {
                const response = await customFetch(
                    '/auth/get-college-club',
                    {
                        method: 'GET',
                    }
                );
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data?.message || data?.data?.message);
                }
                setCollege(data.data.data?.college);
                setClub(data.data.data?.club);
            } catch (error) {
                console.error(error);
            } finally {
                setIsFetching(false);
            }
        };
        fetchCollege();
    }, [refetch]);

    if (isFetching) {
        return (
            <div className="flex justify-center items-center h-full w-full sm:bg-secondary dark:sm:bg-secondary/30 rounded-xl">
                <Loader />
            </div>
        );
    }
    if (!college)
        return (
            <div className="flex justify-center flex-col gap-2 items-center h-full w-full sm:bg-secondary dark:sm:bg-secondary/30 rounded-xl text-red-500">
                Something is wrong please logout and login again
                <LogoutButton variant={'destructive'}>
                    Logout
                </LogoutButton>
            </div>
        );
    return (
        <div className="col-span-8 overflow-hidden rounded-xl sm:bg-secondary dark:sm:bg-secondary/30 sm:px-8 sm:shadow py-6">
            <h1 className="text-2xl font-semibold">Creativity!</h1>
            <hr className="mt-4 mb-8" />
            {/* Email Section */}
            <p className="text-xl font-semibold mb-4">
                Create Your Own Club
            </p>
            {club ? (
                club.status === 'review' ? (
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-1 gap-5">
                        <p className="text-sm text-gray-600 mb-4">
                            Your club is under review. We will get
                            back to you soon.
                        </p>
                        <Button disabled>Under Review</Button>
                    </div>
                ) : (
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-1 gap-5">
                        <p className="text-sm text-gray-600 mb-4">
                            Your club is already registered.
                        </p>
                        <Link
                            href="/clubs/[id]"
                            as={`/clubs/${club._id}`}
                        >
                            <Button>DashBoard</Button>
                        </Link>
                    </div>
                )
            ) : (
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-1 gap-5">
                    <p className="text-sm text-gray-600 mb-4">
                        You are a creator! Whoaa, Register you club
                        and spread your creativity.
                    </p>
                    <CreateClubDialog
                        college={college}
                        setRefetch={setRefetch}
                    />
                </div>
            )}
        </div>
    );
}
