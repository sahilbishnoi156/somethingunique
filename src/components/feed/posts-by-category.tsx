import { customFetch } from '@/lib/custom-fetch';
import { PostType } from '@/types/feed.types';
import { PostCategory } from '@/types/post-category.types';
import React, { useEffect, useState } from 'react';
import PostItem from './post-item';
import Loader from '../loader';
import { getRandomElement } from '@/lib/random-item';
import { NO_POST_MESSAGES } from '@/constants/sentences';
import Image from 'next/image';

export default function PostByCategory({
    category,
}: {
    category: PostCategory;
}) {
    const [posts, setPosts] = useState<PostType[]>([]);
    const [isLoading, setIsLoading] = useState(false); // Add loading state
    const [error, setError] = useState<null | {
        message: string;
        name: string;
    }>(null); // Add error state

    useEffect(() => {
        const controller = new AbortController(); //For AbortController
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await customFetch(
                    `/feed/get-by-category?category=${category}`,
                    { method: 'GET', signal: controller.signal } //Added signal
                );
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(
                        errorData.message || 'Failed to fetch posts'
                    );
                }
                const { data: fetchedPosts } = await response.json();
                setPosts(fetchedPosts);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (error: any) {
                if (error.name !== 'AbortError') {
                    //Ignore AbortError
                    setError(error);
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();

        return () => controller.abort(); // Clean up on unmount
    }, [category]);

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
                    <PostItem key={post._id} post={post} />
                ))
            )}
        </div>
    );
}
