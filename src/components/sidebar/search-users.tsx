import React, { useState, useCallback } from 'react';
import debounce from 'lodash/debounce';
import { Search } from 'lucide-react';
import { UserType } from '@/types/feed.types';
import { customFetch } from '@/lib/custom-fetch';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import Link from 'next/link';

const UserSearch = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<UserType[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null); // Added error state

    const fetchUsers = useCallback(async (searchTerm: string) => {
        setError(null); // Clear previous errors
        setLoading(true);
        try {
            const response = await customFetch(
                `/user/get-suggestions?query=${searchTerm}`,
                { method: 'GET' }
            );
            if (!response.ok) {
                // Handle non-2xx responses
                const errorData = await response.json(); // Attempt to parse error response
                const errorMessage =
                    errorData.data ||
                    errorData?.message ||
                    `HTTP error! status: ${response.status}`;
                throw new Error(errorMessage);
            }
            const data = await response.json();
            setResults(data.data.data);
        } catch (error) {
            if (error instanceof Error) setError(error.message);
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    const debouncedFetch = useCallback(
        debounce((value: string) => {
            fetchUsers(value.trim());
        }, 500),
        [fetchUsers]
    );

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const value = e.target.value;
        setQuery(value);
        debouncedFetch(value);
    };

    const InputRef = React.useRef<HTMLInputElement>(null);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold text-start mb-6">
                👀 Find your people, or at least someone interesting!
            </h1>
            <div
                className="text-lg bg-secondary p-3 rounded-lg flex items-center gap-3 cursor-pointer hover:bg-secondary/80"
                onClick={() => {
                    if (InputRef) {
                        InputRef.current?.focus();
                    }
                }}
            >
                {loading ? (
                    <div
                        className="animate-spin inline-block size-5 border-[3px] border-current border-t-transparent dark:text-white rounded-full text-black"
                        role="status"
                        aria-label="loading"
                    >
                        <span className="sr-only">Loading...</span>
                    </div>
                ) : (
                    <Search className="h-6 w-6 text-gray-500 dark:text-neutral-400" />
                )}

                <input
                    type="text"
                    id="user-search-input"
                    className="peer p-0 w-full bg-transparent dark:bg-transparent dark:border-none dark:text-neutral-400 placeholder:text-neutral-400 focus:ring-0 focus:outline-none"
                    placeholder="Type a username..."
                    value={query}
                    ref={InputRef}
                    onChange={handleInputChange}
                />
            </div>

            {error && (
                <div className="mt-4 text-center text-red-500">
                    <p>Error: {error}</p>
                </div>
            )}
            {results.length > 0 && (
                <ul className="mt-4 border-t border-gray-200">
                    {results.map((user) => (
                        <Link
                            key={user._id}
                            href={`/profile/${user.username}`}
                            className="flex items-center gap-4 p-4 m-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800"
                        >
                            <Avatar>
                                <AvatarImage
                                    src={
                                        user?.avatar ||
                                        `/placeholder.svg?height=40&width=40`
                                    }
                                    className="object-cover"
                                    alt={user.username}
                                />
                                <AvatarFallback>
                                    {user?.username
                                        ?.slice(0, 2)
                                        .toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                                <div className="text-lg font-medium">
                                    @{user.username}
                                </div>
                            </div>
                        </Link>
                    ))}
                </ul>
            )}
            {!loading && !error && results.length === 0 && (
                <p className="mt-4 text-gray-500 text-center">
                    {query.trim()
                        ? 'No results found.'
                        : 'Start typing to find your tribe...'}
                </p>
            )}
        </div>
    );
};

export default UserSearch;
