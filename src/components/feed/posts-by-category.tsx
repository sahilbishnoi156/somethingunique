import { customFetch } from '@/lib/custom-fetch';
import { PostCategory } from '@/types/post-category.types';
import React, { useEffect, useState } from 'react';
import PostItem from './post-item';
import Loader from '../loader';
import { getRandomElement } from '@/lib/random-item';
import { NO_POST_MESSAGES } from '@/constants/sentences';
import Image from 'next/image';
import { parseJwt } from '@/lib/jwt';
import { redirect } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/app/store/store';
import { setPosts } from '@/app/store/view-slice';
import { toast } from 'sonner';

export default function PostByCategory({
    category,
}: {
    category: PostCategory;
}) {
    const { posts } = useSelector((state: RootState) => state.view);
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<null | {
        message: string;
        name: string;
    }>(null);
    const token = localStorage.getItem('authToken');
    if (!token) {
        redirect('/login');
    }
    const user = parseJwt(token).user;

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await customFetch(
                    `/feed/get-by-category?category=${category}`,
                    { method: 'GET' }
                );
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(
                        errorData.data ||
                            errorData.message ||
                            'Failed to fetch posts'
                    );
                }
                const { data: fetchedPosts } = await response.json();
                const newPosts = fetchedPosts.reverse();
                dispatch(setPosts(newPosts));
            } catch (error) {
                if (error instanceof Error) {
                    if (error.name !== 'AbortError') {
                        //Ignore AbortError
                        setError(error);
                    }
                    toast.error(error.message);
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [category, dispatch]);

    if (isLoading) {
        return (
            <div className="absolute inset-0 h-screen w-screen flex items-center justify-center">
                <Loader />
            </div>
        );
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }
    const NO_POST_MESSAGE = getRandomElement(NO_POST_MESSAGES);
    return (
        <div className="divide-y">
            {posts.length === 0 ? (
                <div className="text-center p-8 ">
                    <p className="text-2xl font-semibold mb-4 ">
                        {NO_POST_MESSAGE}
                    </p>
                    <Image
                        alt="No posts found"
                        src={getRandomElement([
                            '/sad-anya.png',
                            '/sad-luffy.png',
                        ])}
                        height={300}
                        width={300}
                        className=" mx-auto"
                    />
                </div>
            ) : (
                posts.map((post) => (
                    <PostItem
                        key={post._id}
                        post={post}
                        userId={user?.id || ''}
                    />
                ))
            )}
        </div>
    );
}
