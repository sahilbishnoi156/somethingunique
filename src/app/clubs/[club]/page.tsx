'use client';
import { RootState } from '@/app/store/store';
import CreatePost from '@/components/feed/create-post';
import PostItem from '@/components/feed/post-item';
import Loader from '@/components/loader';
import BottomNavigation from '@/components/navigation/bottom-navigation';
import { customFetch } from '@/lib/custom-fetch';
import { parseJwt } from '@/lib/jwt';
import { JwtPayload } from '@/types/auth.types';
import { ClubType, PostType } from '@/types/feed.types';
import Image from 'next/image';
import { redirect, useParams } from 'next/navigation';
import React from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';

export default function Club() {
    const { club } = useParams();
    const [currClub, setCurrClub] = React.useState<ClubType>();
    const [posts, setPosts] = React.useState<PostType[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    const { isEventPost } = useSelector(
        (state: RootState) => state.view
    );

    const [payload, setPayload] = React.useState<JwtPayload>();
    React.useEffect(() => {
        const token = window?.localStorage.getItem('authToken');
        if (!token) {
            redirect('/register');
        } else {
            const data = parseJwt(token);
            setPayload(data);
        }
    }, []);
    const isClubAdmin = payload?.user?.id === currClub?.admin;

    const [invalidClub, setInvalidClub] = React.useState(false);

    React.useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const response = await customFetch(
                    `/club/get-club-posts?clubId=${club}`,
                    { method: 'GET' }
                );
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(
                        errorData?.data ||
                            errorData?.message ||
                            'Failed to fetch posts'
                    );
                }
                const { data } = await response.json();
                setCurrClub(data?.club);
                const newPosts = data?.posts.reverse();
                setPosts(newPosts);
            } catch (error) {
                if (error instanceof Error) {
                    if (error.message === 'Club not found') {
                        setInvalidClub(true);
                    }
                    toast.error(error.message);
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [club]);

    if (isLoading) {
        return (
            <div className="absolute inset-0 h-screen w-screen flex items-center justify-center">
                <Loader />
            </div>
        );
    }
    if (invalidClub) {
        return (
            <div className="text-center p-8 ">
                <p className="text-2xl font-semibold mb-4 ">
                    Oops! Looks like this club doesn&apos;t exist
                </p>
                <Image
                    alt="Club not found"
                    src="/sad-anya.png"
                    height={300}
                    width={300}
                    className=" mx-auto"
                />
            </div>
        );
    }

    return (
        <div className="p-1 sm:p-3 h-screen w-screen flex items-center justify-center gap-10 bg-background divide-x">
            <div
                className={`h-full ${
                    isClubAdmin ? 'md:w-3/5 w-full' : 'w-full'
                }  flex flex-col gap-5 transition-all duration-500 ease-in-out`}
            >
                <div
                    className={`sm:h-[92%] w-full h-full rounded-xl overflow-scroll pb-5 scrollbar-hide relative`}
                >
                    <div className="divide-y w-full py-1">
                        <div>
                            <h1 className="text-2xl ">
                                Club: {currClub?.name}
                            </h1>
                            <p className="text-gray-400 text-sm">
                                {currClub?.description}
                            </p>
                        </div>
                        {posts.length === 0 ? (
                            <div className="flex items-center justify-center text-center h-full ">
                                <p className="text-2xl font-semibold my-4 ">
                                    There are no posts in this club
                                    currently.
                                </p>
                            </div>
                        ) : (
                            <>
                                {posts.map((post) => (
                                    <PostItem
                                        key={post._id}
                                        post={post}
                                        userId={
                                            payload?.user?.id || ''
                                        }
                                    />
                                ))}
                            </>
                        )}
                    </div>
                </div>
                <div
                    className={`h-[8%] absolute sm:relative left-4 bottom-4 right-4 z-50 rounded-xl w-fit`}
                >
                    <BottomNavigation payload={payload} />
                </div>
            </div>

            <div
                className={`hidden md:block md:hover:bg-secondary/20 bg-background duration-150 flex-1 h-full md:rounded-xl overflow-scroll scrollbar-hide`}
            >
                <CreatePost o_category="event" />
            </div>

            {isClubAdmin && isEventPost && (
                <div
                    className={`absolute top-0 left-0 inset-0 md:relative md:hover:bg-secondary/20 bg-background duration-150 flex-1 h-full md:rounded-xl overflow-scroll scrollbar-hide`}
                >
                    <CreatePost o_category="event" />
                </div>
            )}
        </div>
    );
}
