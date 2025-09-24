'use client';

import BackButton from '@/components/back-button';
import PostItem from '@/components/feed/post-item';
import Loader from '@/components/loader';
import { Button } from '@/components/ui/button';
import { IDENTITIES } from '@/constants/sentences';
import { customFetch } from '@/lib/custom-fetch';
import { parseJwt } from '@/lib/jwt';
import { getRandomElement } from '@/lib/random-item';
import { PostType, UserType } from '@/types/feed.types';
import { Check, ClipboardCheck, Pencil, Send, X } from 'lucide-react';
import Image from 'next/image';
import { redirect, useParams } from 'next/navigation';
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store/store';
import SideBar from '@/components/sidebar/sidebar';
import { toast } from 'sonner';
import Link from 'next/link';
import { JwtPayload } from '@/types/auth.types';

export default function ProfilePage() {
    const [profile, setProfile] = React.useState<{
        user: UserType;
        posts: PostType[];
        title: string;
    }>();
    const [isFetching, setIsFetching] = React.useState(true);
    const [urlCopied, setUrlCopied] = React.useState(false);
    const [editBio, setEditBio] = React.useState(false);
    const { username } = useParams();
    const [payload, setPayload] = React.useState<JwtPayload>();
    const [isEditingBio, setIsEditingBio] = React.useState(false);
    React.useEffect(() => {
        const token = window?.localStorage.getItem('authToken');
        if (!token) {
            redirect('/register');
        } else {
            const data = parseJwt(token);
            setPayload(data);
        }
    }, []);
    const isMyProfile = payload?.user.username === username;

    const [userNotFound, setUserNotFound] = React.useState(false);
    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await customFetch(
                    '/user/get-profile?username=' + username,
                    {
                        method: 'GET',
                    }
                );
                const data = await response.json();
                if (!response.ok) {
                    if (
                        data?.message === 'User not found' &&
                        !data?.data
                    ) {
                        setUserNotFound(true);
                        return;
                    }
                    throw new Error(
                        data?.data ||
                            data?.message ||
                            'Error fetching data'
                    );
                }
                setProfile({
                    user: data.data.user,
                    posts: data.data.posts,
                    title: getRandomElement(IDENTITIES),
                });
                setIsFetching(false);
            } catch (error) {
                console.error(error);
                if (error instanceof Error)
                    toast.error(error.message);
                setIsFetching(false);
            } finally {
                setIsFetching(false);
            }
        };
        fetchData();
    }, [username]);

    const { viewType } = useSelector(
        (state: RootState) => state.view
    );

    const handleUpdateBio = async () => {
        if (editBio) {
            setIsEditingBio(true);
            try {
                const bio = document.querySelector('textarea')?.value;
                const response = await customFetch(
                    '/user/update-bio',
                    {
                        method: 'PATCH',
                        body: JSON.stringify({ bio }),
                    }
                );
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(
                        data?.data ||
                            data?.message ||
                            'Error updating bio'
                    );
                }
                setProfile(
                    (prev) =>
                        prev && {
                            ...prev,
                            user: { ...prev.user, bio },
                        }
                );
                setEditBio(false);
            } catch (error) {
                console.error(error);
            } finally {
                setIsEditingBio(false);
            }
        } else {
            setEditBio(true);
        }
    };

    if (isFetching) {
        return (
            <div className="h-screen w-screen flex items-center justify-center">
                <Loader />
            </div>
        );
    }

    if (userNotFound) {
        return (
            <div className="h-screen w-screen flex items-center flex-col justify-center p-5">
                <p className="text-2xl text-center font-semibold">
                    Oops! Looks like this user doesn&apos;t exist
                </p>
                <BackButton className="text-lg mt-10" />
            </div>
        );
    }

    return (
        <div className="flex h-screen overflow-hidden divide-x">
            <div
                className={`flex-grow ${
                    viewType === 'showComments' ? 'w-3/5' : 'w-full'
                } overflow-y-auto scrollbar-hide`}
            >
                <div className="rounded-lg pb-8">
                    <div className="absolute top-4 left-4 text-lg z-50 flex items-center gap-4">
                        <BackButton className="" />
                        <Link href={'/app'}>
                            <Button>
                                <span>Home</span>
                            </Button>
                        </Link>
                    </div>
                    <div className="w-full h-[250px] relative">
                        <Image
                            alt="Profile Background"
                            src={'/darkBackground.jpg'}
                            className="w-full h-full -z-10"
                            layout="fill"
                            objectFit="cover"
                        />
                        <Image
                            alt="Profile Background"
                            src={'/lightBackground.jpg'}
                            className="w-full dark:hidden h-full -z-10"
                            layout="fill"
                            objectFit="cover"
                        />
                    </div>
                    <div className="flex flex-col items-center -mt-20">
                        <div className="relative w-40 aspect-square bg-black rounded-full">
                            <Image
                                src={
                                    profile?.user.avatar ??
                                    'https://cdn.pixabay.com/photo/2020/11/22/22/17/male-5768177_1280.png'
                                }
                                className="border-4 border-white rounded-full"
                                alt="Profile Picture"
                                layout="fill"
                                objectFit="cover"
                            />
                        </div>
                        <div className="flex items-center space-x-2 mt-2">
                            <p className="text-2xl">
                                @{profile?.user.username}
                            </p>
                            <span
                                className="bg-blue-500 rounded-full p-1"
                                title="Verified"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="text-gray-100 h-2.5 w-2.5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={4}
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            </span>
                        </div>
                        <div className="text-primary-300 sm:w-1/2 p-2 w-full text-center whitespace-pre-line">
                            {editBio ? (
                                <textarea
                                    className="w-full p-2 rounded-lg border border-primary-300 text-primary"
                                    defaultValue={
                                        profile?.user.bio || ''
                                    }
                                ></textarea>
                            ) : (
                                profile?.user.bio || ''
                            )}
                        </div>
                        <p className="text-sm text-gray-500">
                            {profile?.title || ''}
                        </p>
                    </div>
                    <div className="flex-1 flex flex-col items-center md:items-end justify-end px-8 mt-2">
                        <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-4 ">
                            <Button
                                className="flex items-center"
                                onClick={() => {
                                    navigator.clipboard.writeText(
                                        window.location.href
                                    );
                                    setUrlCopied(true);
                                }}
                            >
                                {urlCopied ? (
                                    <>
                                        <ClipboardCheck size={15} />
                                        <span>Copied</span>
                                    </>
                                ) : (
                                    <>
                                        <Send size={15} />
                                        <span>Share Profile</span>
                                    </>
                                )}
                            </Button>
                            {isMyProfile && (
                                <>
                                    <Link
                                        href={'/settings?tab=profile'}
                                    >
                                        <Button className="flex items-center">
                                            <Pencil size={15} />
                                            <span>Edit Profile</span>
                                        </Button>
                                    </Link>
                                    <Button
                                        className="flex items-center"
                                        onClick={handleUpdateBio}
                                    >
                                        {editBio ? (
                                            <>
                                                {isEditingBio ? (
                                                    <>
                                                        <div
                                                            className="animate-spin inline-block size-5 border-[3px] border-current border-t-transparent dark:text-black rounded-full text-white"
                                                            role="status"
                                                            aria-label="loading"
                                                        >
                                                            <span className="sr-only">
                                                                Loading...
                                                            </span>
                                                        </div>
                                                        <span>
                                                            Updating..
                                                        </span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Check
                                                            size={15}
                                                        />
                                                        <span>
                                                            Save Bio
                                                        </span>
                                                    </>
                                                )}
                                            </>
                                        ) : (
                                            <>
                                                <Pencil size={15} />
                                                <span>Edit Bio</span>
                                            </>
                                        )}
                                    </Button>
                                    {editBio && (
                                        <Button
                                            className="flex items-center"
                                            variant={'destructive'}
                                            onClick={() => {
                                                setEditBio(false);
                                            }}
                                        >
                                            <X />
                                            Cancel
                                        </Button>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
                {profile?.posts?.length === 0 ? (
                    <p className="text-2xl font-semibold my-4 text-center">
                        No posts found
                    </p>
                ) : (
                    <div className="flex items-center justify-center flex-col pb-12 sm:py-10 p-2 border-t">
                        <h1 className="text-2xl font-bold">Posts</h1>
                        <div
                            className={`divide-y ${
                                viewType === 'showComments'
                                    ? 'w-full p-6'
                                    : 'md:w-3/4 w-full'
                            }`}
                        >
                            {profile?.posts?.map((post) => (
                                <PostItem
                                    key={post._id}
                                    post={post}
                                    userId={payload?.user.id || ''}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
            {viewType === 'showComments' && (
                <div className="w-2/5 h-screen overflow-y-auto">
                    <div className="sticky top-0 h-screen overflow-y-auto">
                        <SideBar />
                    </div>
                </div>
            )}
        </div>
    );
}
