import { customFetch } from '@/lib/custom-fetch';
import { PostCategory } from '@/types/post-category.types';
import React, { useEffect } from 'react';

export default function PostByCategory({
    category,
}: {
    category: PostCategory;
}) {
    const [posts, setPosts] = React.useState([]);
    React.useEffect(() => {
        const fetchData = async () => {
            const response = await customFetch(
                `/feed/get-by-category?category=${category}`,
                { method: 'GET' }
            );
            const { data: posts, message } = await response.json();
            if (!response.ok) {
                console.log(message);
            } else {
                setPosts(posts);
            }
        };
        if (posts.length === 0) {
            fetchData();
        }
    }, [category, posts.length]);

    return (
        <div>
            {posts.map((post) => (
                <div key={post.id}>{post.caption}</div>
            ))}
        </div>
    );
}
