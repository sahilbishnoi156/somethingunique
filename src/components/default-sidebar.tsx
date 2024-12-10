import React from 'react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { redirect } from 'next/navigation';
import { parseJwt } from '@/lib/jwt';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { showSearch } from '@/app/store/view-slice';

export default function DefaultSidebar() {
    const token = localStorage.getItem('authToken');
    if (!token) {
        redirect('/login');
    }
    const user = parseJwt(token).user;
    const dispatch = useDispatch();
    return (
        <div className="p-6">
            <h2 className="font-semibold text-xl">Filters</h2>

            <div className="space-y-3 flex flex-col mt-5 ">
                <Button
                    variant={'secondary'}
                    size={'lg'}
                    className="text-lg"
                >
                    Get Trending Posts
                </Button>
                <Button
                    variant={'secondary'}
                    size={'lg'}
                    className="text-lg"
                    onClick={() => dispatch(showSearch())}
                >
                    Search
                </Button>
            </div>

            <h2 className="font-semibold text-xl mt-10">Profile</h2>
            <div className="flex items-center gap-2 mt-4">
                <Avatar>
                    <AvatarImage
                        src={
                            user?.username ||
                            `/placeholder.svg?height=40&width=40`
                        }
                        alt={user.username}
                    />
                    <AvatarFallback>
                        {user?.username?.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <Link
                        href={'/profile'}
                        className="hover:underline cursor-pointer"
                    >
                        <div className="text-lg font-medium">
                            @{user.username}
                        </div>
                    </Link>
                </div>
            </div>
            {/* <div className="flex flex-wrap gap-4 mt-4">
                {CLUBS.map((club) => {
                    const randomColor = getRandomElement(CLUB_COLORS);
                    return (
                        <Badge
                            key={club}
                            style={{ backgroundColor: randomColor }}
                            className="text-sm font-medium py-1"
                        >
                            {club}
                        </Badge>
                    );
                })}
            </div> */}
        </div>
    );
}
