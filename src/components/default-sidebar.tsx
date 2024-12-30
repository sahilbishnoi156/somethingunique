'use client';
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { redirect } from 'next/navigation';
import { parseJwt } from '@/lib/jwt';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { showSearch } from '@/app/store/view-slice';
import { ClubType } from '@/types/feed.types';
import { customFetch } from '@/lib/custom-fetch';
import { CLUB_COLORS } from '@/constants/clubs';
import { getRandomElement } from '@/lib/random-item';
import { Badge } from './ui/badge';
import { JwtPayload } from '@/types/auth.types';
import { Search } from 'lucide-react';

export default function DefaultSidebar() {
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
    const [clubs, setClubs] = React.useState<ClubType[]>([]);

    React.useEffect(() => {
        const fetchClubs = async () => {
            try {
                const response = await customFetch(
                    '/club/get-clubs',
                    { method: 'GET' }
                );
                const data = await response.json();
                if (response?.ok) setClubs(data.data);
                else throw new Error(data?.data || data?.message);
            } catch (error) {
                console.error(error);
            }
        };
        if (!clubs.length) fetchClubs();
    }, [clubs.length]);

    const dispatch = useDispatch();
    return (
        <div className="p-6">
            <div className="space-y-3 flex flex-col mt-5 ">
                <div
                    className="text-xl bg-secondary p-3 rounded-lg flex items-center gap-2 cursor-pointer hover:bg-secondary/80"
                    onClick={() => dispatch(showSearch())}
                >
                    <Search className="h-5 w-5" />
                    Search
                </div>
            </div>
            <h2 className="font-semibold text-xl mt-10">Profile</h2>
            <div className="flex items-center gap-2 mt-4">
                <Avatar>
                    <AvatarImage
                        src={
                            payload?.user?.username ||
                            `/placeholder.svg?height=40&width=40`
                        }
                        alt={payload?.user.username}
                    />
                    <AvatarFallback>
                        {payload?.user?.username
                            ?.slice(0, 2)
                            .toUpperCase()}
                    </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <Link
                        href={'/profile'}
                        className="hover:underline cursor-pointer"
                    >
                        <div className="text-lg font-medium">
                            @{payload?.user.username}
                        </div>
                    </Link>
                </div>
            </div>
            {clubs.length !== 0 && (
                <h2 className="font-semibold text-xl mt-10">Clubs</h2>
            )}
            <div className="flex flex-wrap gap-4 mt-4">
                {clubs.map((club) => {
                    const randomColor = getRandomElement(CLUB_COLORS);
                    return (
                        <Link
                            href={'/clubs/' + club._id}
                            key={club._id}
                        >
                            <Badge
                                key={club._id}
                                style={{
                                    backgroundColor: randomColor,
                                }}
                                className="text-sm font-medium py-1"
                            >
                                {club.name}
                            </Badge>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
