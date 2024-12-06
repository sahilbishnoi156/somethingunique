'use client';
import PostByCategory from '@/components/feed/posts-by-category';
import { POST_CATEGORIES } from '@/constants/post-categories';
import { PostCategory } from '@/types/post-category.types';
import { redirect, useSearchParams } from 'next/navigation';
import React from 'react';

export default function Page() {
    const params = useSearchParams();
    const feedType = params.get('type');
    if (!POST_CATEGORIES.includes(feedType as PostCategory)) {
        redirect('/app/feed?type=forum');
    } else {
        return (
            <div>
                <PostByCategory category={feedType as PostCategory} />
            </div>
        );
    }
}
